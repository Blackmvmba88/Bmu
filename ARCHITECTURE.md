
# 🏛️ Arquitectura Técnica BMU v7.0

## 1. Capa de Datos (Persistence Layer)
Utilizamos una estructura de **Sincronización de Estado Persistente** via `localStorage`.
- `BMU_Module`: Define la unidad académica.
- `BMU_Telemetry_Point`: Registra cada micro-interacción para análisis posterior.
- `Global_CSS_Vars`: Inyectadas dinámicamente para permitir personalización total ("Reality Editing").

## 2. Motor de Inferencia (AI Layer)
El servicio `askBlackMamba` opera sobre `gemini-3-flash-preview` con esquemas JSON estrictos que garantizan:
- Respuestas visualizables (PieCharts, BarCharts, Vectors).
- Adaptación de tono según el rol (Alumno vs Mentor).

## 3. UI/UX (Aesthetics Layer)
- **Sunset Engine**: Un sistema de degradados dinámicos que utiliza variables de `accent-highlight` y `bg-atmosphere` para simular el paso del tiempo.
- **Glassmorphism**: Todos los componentes utilizan un índice de refracción de 20px para mantener la jerarquía visual sobre el fondo animado.

## 4. Estructuras de Datos
```typescript
interface BMU_Module {
  id: string;
  category: 'Matemáticas' | 'Física' | 'Química' | 'Ingeniería';
  skills: BMU_Skill[];
}
```
