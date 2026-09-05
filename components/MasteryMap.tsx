import React, { useMemo, useState } from 'react';
import type { MasteryNode } from '../types';
import type { CompetencyDefinition, LearnerState, ModuleDefinition } from '../learning/contracts';
import { competencies, modules } from '../learning/curriculum';
import {
  competencyStatus,
  masteredCompetencyIds,
  moduleEligibility,
  recommendNextModules,
  unmetRequirements,
} from '../learning/engine';

interface MasteryMapProps {
  learnerState: LearnerState;
  onLaunchModule?: (module: ModuleDefinition) => void;
}

const DOMAIN_LABELS: Record<string, string> = {
  math: 'Matemáticas',
  physics: 'Física',
  chemistry: 'Química',
  electronics: 'Electrónica',
  control: 'Control',
  biology: 'Biología',
  space: 'Espacio',
  geography: 'Geografía',
  cognition: 'Cognición',
};

const NODE_PRESENTATION: Record<string, Pick<MasteryNode, 'icon' | 'coordinates'>> = {
  'ethics-knowledge': { icon: '⚖️', coordinates: { x: 175, y: 45 } },
  'project-verifiable-evidence': { icon: '📎', coordinates: { x: 280, y: 105 } },
  'ai-working-with-models': { icon: '🤖', coordinates: { x: 280, y: 200 } },
  'math-number-sense': { icon: '🔢', coordinates: { x: 70, y: 105 } },
  'math-algebra-foundations': { icon: '📐', coordinates: { x: 125, y: 200 } },
  'physics-mechanics': { icon: '🌍', coordinates: { x: 80, y: 300 } },
  'electronics-circuit-foundations': { icon: '⚡', coordinates: { x: 230, y: 300 } },
  'control-feedback-foundations': { icon: '🎛️', coordinates: { x: 175, y: 365 } },
};

const fallbackCoordinates = (index: number): { x: number; y: number } => ({
  x: 60 + (index % 4) * 75,
  y: 70 + Math.floor(index / 4) * 110,
});

const definitionById = new Map(competencies.map((definition) => [definition.id, definition]));

const buildNodes = (learnerState: LearnerState): MasteryNode[] =>
  competencies.map((competency, index) => {
    const progress = learnerState.competencies[competency.id];
    const presentation = NODE_PRESENTATION[competency.id] ?? {
      icon: '◆',
      coordinates: fallbackCoordinates(index),
    };

    return {
      id: competency.id,
      label: competency.name.toUpperCase(),
      category: DOMAIN_LABELS[competency.domainId] ?? competency.domainId,
      level: Math.round((progress?.mastery ?? 0) * 100),
      status: competencyStatus(learnerState, competency),
      icon: presentation.icon,
      coordinates: presentation.coordinates,
    };
  });

const moduleForCompetency = (
  competencyId: string,
  candidateModules: ModuleDefinition[],
): ModuleDefinition | undefined =>
  candidateModules.find((module) => module.competencyIds.includes(competencyId));

export const MasteryMap: React.FC<MasteryMapProps> = ({ learnerState, onLaunchModule }) => {
  const nodes = useMemo(() => buildNodes(learnerState), [learnerState]);
  const [selectedId, setSelectedId] = useState(nodes[0]?.id ?? '');
  const selectedNode = nodes.find((node) => node.id === selectedId) ?? nodes[0] ?? null;
  const selectedDefinition = selectedNode ? definitionById.get(selectedNode.id) : undefined;

  const nextModules = useMemo(
    () => recommendNextModules(learnerState, modules),
    [learnerState],
  );

  const selectedModule = selectedNode
    ? moduleForCompetency(selectedNode.id, nextModules)
    : undefined;

  const masteredCount = useMemo(
    () => masteredCompetencyIds(learnerState, competencies).length,
    [learnerState],
  );

  const averageMastery = nodes.length
    ? Math.round(nodes.reduce((sum, node) => sum + node.level, 0) / nodes.length)
    : 0;

  const evidenceCount = Object.values(learnerState.competencies).reduce(
    (sum, progress) => sum + progress.evidenceIds.length,
    0,
  );

  const unmet = selectedDefinition
    ? unmetRequirements(learnerState, selectedDefinition.prerequisites)
    : [];

  const feedback = (() => {
    if (!selectedNode || !selectedDefinition) return 'Selecciona una competencia.';
    if (selectedNode.status === 'mastered') {
      return `Dominio certificado por evidencia. Umbral requerido: ${Math.round(selectedDefinition.masteryThreshold * 100)}%.`;
    }
    if (selectedNode.status === 'locked') {
      const labels = unmet
        .map((requirement) => definitionById.get(requirement.competencyId)?.name ?? requirement.competencyId)
        .join(', ');
      return `Nodo bloqueado por prerequisitos verificables: ${labels || 'requisitos pendientes'}.`;
    }
    return selectedNode.level > 0
      ? `Evidencia registrada: ${selectedNode.level}% de dominio proyectado. Continúa reuniendo evidencia hasta ${Math.round(selectedDefinition.masteryThreshold * 100)}%.`
      : `Competencia disponible. Aún no existe evidencia suficiente para afirmar dominio.`;
  })();

  const renderHex = (node: MasteryNode) => {
    const isMaster = node.status === 'mastered';
    const isLocked = node.status === 'locked';
    const color = isLocked
      ? '#1e293b'
      : isMaster
        ? 'var(--accent-highlight)'
        : 'var(--accent-primary)';

    return (
      <g
        key={node.id}
        className="cursor-pointer group transition-all duration-500"
        onClick={() => setSelectedId(node.id)}
        style={{ transform: `translate(${node.coordinates.x}px, ${node.coordinates.y}px)` }}
      >
        <path
          d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z"
          fill={color}
          fillOpacity={selectedNode?.id === node.id ? 0.3 : 0.1}
          className="group-hover:fill-opacity-40 transition-all"
        />
        <path
          d="M0,-30 L26,-15 L26,15 L0,30 L-26,15 L-26,-15 Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={isLocked ? '4 2' : '0'}
          className={!isLocked && node.level > 0 ? 'animate-pulse' : ''}
        />
        <text y="-5" textAnchor="middle" className="text-xl select-none">{node.icon}</text>
        {!isLocked && (
          <text y="15" textAnchor="middle" className="text-[7px] font-black fill-white opacity-60 uppercase tracking-widest">
            {node.level}%
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="p-10 glass rounded-[3.5rem] border border-white/10 space-y-12 animate-in fade-in duration-1000 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
        <div className="space-y-2">
          <h3 className="text-5xl font-black font-display text-white italic tracking-tighter uppercase">
            MAPA DE <span className="mamba-text">MAESTRÍA</span>
          </h3>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">
            Grafo curricular derivado de evidencia • schema learner v1
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-center">
            <span className="text-[8px] font-black text-slate-500 uppercase mb-1">Dominio medio</span>
            <span className="text-xl font-black text-white">{averageMastery}%</span>
          </div>
          <div className="accent-bg px-6 py-3 rounded-2xl flex flex-col items-center shadow-[0_0_20px_var(--accent-glow)]">
            <span className="text-[8px] font-black text-black/60 uppercase mb-1">Siguiente ruta</span>
            <span className="text-xl font-black text-black">{nextModules.length} ABIERTA{nextModules.length === 1 ? '' : 'S'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <div className="lg:col-span-2 relative aspect-[4/3] bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden flex items-center justify-center group shadow-inner">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
              {Array.from({ length: 36 }).map((_, i) => <div key={i} className="border border-white/20" />)}
            </div>
          </div>

          <svg viewBox="0 0 350 410" className="w-full h-full p-8 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <g opacity="0.28">
              {competencies.flatMap((competency) =>
                competency.prerequisites.map((requirement) => {
                  const source = nodes.find((node) => node.id === requirement.competencyId);
                  const target = nodes.find((node) => node.id === competency.id);
                  if (!source || !target) return null;
                  const satisfied = (learnerState.competencies[requirement.competencyId]?.mastery ?? 0) >= requirement.minimumMastery;
                  return (
                    <line
                      key={`${requirement.competencyId}-${competency.id}`}
                      x1={source.coordinates.x}
                      y1={source.coordinates.y}
                      x2={target.coordinates.x}
                      y2={target.coordinates.y}
                      stroke={satisfied ? 'var(--accent-primary)' : '#475569'}
                      strokeWidth={satisfied ? '2' : '1'}
                      strokeDasharray={satisfied ? '0' : '5 5'}
                    />
                  );
                }),
              )}
            </g>

            {nodes.map((node) => renderHex(node))}
          </svg>

          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
            <span className="text-[8px] font-black text-white/40 tracking-[0.5em] uppercase">
              LEARNER_STATE: VERIFIED
            </span>
          </div>
        </div>

        <div className="space-y-8 h-full">
          {selectedNode && selectedDefinition ? (
            <div className="glass p-10 rounded-[2.5rem] border-white/10 h-full flex flex-col justify-between animate-in slide-in-from-right duration-500">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl p-4 bg-white/5 rounded-2xl border border-white/10">{selectedNode.icon}</div>
                  <div>
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{selectedNode.label}</h4>
                    <p className="text-xs font-bold accent-text uppercase tracking-widest">{selectedNode.category}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{selectedDefinition.description}</p>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dominio respaldado</span>
                    <span className="text-2xl font-black text-white">{selectedNode.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full accent-bg transition-all duration-1000" style={{ width: `${selectedNode.level}%` }} />
                  </div>
                </div>

                <div className="bg-black/30 p-6 rounded-2xl border border-white/5 space-y-4">
                  <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Proyección explicable</h5>
                  <p className="text-xs text-slate-300 italic leading-relaxed">{feedback}</p>
                </div>

                {selectedModule && (
                  <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-2">Módulo recomendado</span>
                    <span className="text-sm font-black text-white">{selectedModule.title}</span>
                  </div>
                )}
              </div>

              <button
                disabled={selectedNode.status === 'locked' || !selectedModule || !onLaunchModule}
                onClick={() => selectedModule && onLaunchModule?.(selectedModule)}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-8 transition-all ${selectedNode.status !== 'locked' && selectedModule && onLaunchModule ? 'accent-bg text-black hover:scale-105' : 'bg-white/5 text-slate-600 border border-white/5'}`}
              >
                {selectedNode.status === 'locked'
                  ? 'PREREQUISITOS PENDIENTES'
                  : selectedModule
                    ? 'LANZAR MÓDULO'
                    : 'SIN MÓDULO PENDIENTE'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600 italic text-sm">
              No hay competencias registradas
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Evidencias', val: String(evidenceCount), icon: '🧾' },
          { label: 'Módulos completos', val: String(learnerState.completedModules.length), icon: '🧪' },
          { label: 'Nodos Master', val: `${masteredCount}/${nodes.length}`, icon: '💎' },
          { label: 'Artefactos', val: String(learnerState.artifacts.length), icon: '📦' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 flex items-center gap-4 group hover:border-accent-primary/20 transition-all">
            <span className="text-2xl living-symbol">{stat.icon}</span>
            <div>
              <span className="text-[8px] font-black text-slate-500 uppercase block tracking-widest">{stat.label}</span>
              <span className="text-lg font-black text-white">{stat.val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
