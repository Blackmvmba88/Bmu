
# 🐍 BlackMamba University (BMU) - Ecosistema Académico v7.0
> **Plataforma Académica de Alto Rendimiento para mentes de 14-18 años.**

## 🏛️ ¿Qué es BMU?
BMU ha evolucionado de una aplicación de estudio a un **Ecosistema Cognitivo**. Es una arquitectura de software diseñada para la maestría técnica en ciencias exactas (Matemáticas, Física, Química, Ingeniería) y el desarrollo de habilidades cognitivas superiores.

### 🧠 Fundamento Pedagógico
BMU fusiona **Flow State** (Csikszentmihalyi) + **Zona de Desarrollo Próximo** (Vygotsky) + **Práctica Deliberada** (Ericsson) mediante telemetría cognitiva en tiempo real. El sistema adapta la dificultad automáticamente para mantener el equilibrio perfecto entre desafío y habilidad, eliminando la frustración y el aburrimiento. No es solo "aprender más rápido", es **aprender en el estado mental óptimo**.

## 🎯 El Sistema en 10 Segundos
```
1. Alumno abre BMU → Selecciona módulo (Fracciones, Física, Circuitos, etc.)
2. Sistema presenta problema adaptativo basado en nivel de maestría
3. Alumno interactúa con visualizaciones dinámicas y slider controls
4. Cognitive Tracker registra: tiempo de respuesta, patrones de error, engagement
5. IA (Gemini) ajusta siguiente problema en tiempo real
6. Mentor recibe dashboard con insights pedagógicos
7. Loop continúa → Estudiante entra en Flow State → Maestría incremental
```

## 📚 Módulos Operativos
### Disponibles (v7.0)
- **🔢 Fracciones Visuales**: Representación geométrica de operaciones fraccionarias
- **📐 Matemáticas Avanzadas**: Cálculo, álgebra lineal, funciones complejas
- **⚛️ Física BMU**: Mecánica, cinemática, dinámica con simulaciones interactivas
- **🧪 Química BMU**: Tabla periódica, reacciones, estequiometría
- **⚡ Circuitos Mecatrónicos**: Diseño de circuitos DC, componentes Arduino
- **🎮 Ingeniería de Control**: Feedback loops, sensores, actuadores
- **🧠 Cognición**: Análisis de patrones de aprendizaje y sesgo cognitivo
- **🤖 Tutor IA**: BlackMamba AI para resolución de problemas en lenguaje natural
- **🗺️ Mapa de Maestría**: Árbol de habilidades tipo videojuego con progresión no-lineal
- **📊 Telemetría**: Dashboard de métricas cognitivas para el Mentor

### En Desarrollo (FASE 6-7)
- Laboratorio de Electrónica DC
- Integración de API de Música (Frecuencias y Ondas)
- Misiones Multi-Módulo (ej: "Construye un cohete: Química + Física")

## 👥 Roles Institucionales
1. **Alumno (Diego.sys)**: El ejecutor. Enfocado en la resolución de problemas visuales y el estado de "Flow".
2. **Mentor (Pao.mgmt)**: La estratega. Utiliza telemetría cognitiva para guiar el aprendizaje sin fricción.
3. **Maestro/Creador (Neocyber1)**: El arquitecto. Controla los parámetros fundamentales de la realidad y el currículo.

## 🛠️ Stack de Ingeniería
### Frontend
- **React 19** + **TypeScript 5.8**: Type-safe component architecture
- **Vite 6**: Fast development server with HMR (Hot Module Replacement)
- **Recharts 3.6**: Data visualization library for telemetry dashboards

### Motor Visual
- **Sunset Engine v4**: Sistema propietario de CSS animado (60s rotation cycles)
  - Utiliza CSS Custom Properties para transiciones fluidas
  - Implementa glassmorphism con `backdrop-filter: blur(20px)`
  - Auto-rotación de paletas de color cada 120s (configurable por usuario)

### IA Core
- **Google Gemini 3 Flash Pro**: Inferencia pedagógica y generación de contenido adaptativo
  - API: `@google/genai` (npm package v1.35.0)
  - Uso: Respuestas estructuradas con JSON Schema para garantizar formato consistente
  - Modelos utilizados:
    - `gemini-3-flash-preview`: Tutor de texto y explicaciones conceptuales
    - `gemini-2.5-flash-image`: Generación de esquemáticos técnicos (circuitos, diagramas)

### Persistencia
- **BMU_LocalSync**: Sistema de guardado automático basado en `localStorage`
  - Guarda: progreso de usuario, configuración de colores, preferencias de rotación
  - Estructura: `bmu_profile_{email}` para multi-usuario local
  - No requiere servidor backend (diseño offline-first)

### Telemetría
- **BMU_Cognitive_Tracker**: Monitoreo de interacciones neuronales
  - Registra: clics, tiempo de permanencia, patrones de navegación, errores, idle time
  - Estructura de datos: `BMU_Telemetry_Point` con timestamps y metadata contextual
  - Almacenamiento: localStorage con límite de 1000 eventos (rolling window)
  - **Señales medidas**:
    - **Engagement**: tiempo activo vs. idle, frecuencia de interacción
    - **Precisión**: tasa de error en problemas, intentos antes de corrección
    - **Velocidad cognitiva**: tiempo de respuesta por tipo de problema
    - **Patrones de navegación**: módulos visitados, secuencia de aprendizaje
    - **Flow indicators**: tiempo sostenido en una tarea sin cambio de contexto

## 🗺️ Roadmap Visible
### ✅ FASE 5: EXPANSIÓN COGNITIVA (Completada)
- Telemetría Cognitiva básica
- Sistema de Roles jerárquico (Alumno/Mentor/Maestro/Creador)
- Persistencia de configuración de colores y preferencias

### 🚧 FASE 6: INGENIERÍA DE CONTROL (En Progreso)
- Módulo de Retroalimentación (Feedback Loops)
- Simulador de Ruido y Error en sensores
- Laboratorio de Electrónica DC

### 🔮 FASE 7: MAESTRÍA TOTAL (Planeada)
- Integración de API de Música (Frecuencias y Ondas)
- Despliegue de Misiones Multi-Módulo (ej: "Construye un cohete: Química + Física")
- Certificación Institucional BMU

**Ver detalles completos en [ROADMAP.md](./ROADMAP.md)**

## 🔗 Referencias Técnicas
- **Documentación Técnica**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Especificaciones de capas de datos, IA y UI/UX
- **Alineación Pedagógica**: [BMU-ALIGNMENT.md](./BMU-ALIGNMENT.md) - Estrategia de roles y diseño cognitivo
- **React 19 Docs**: https://react.dev
- **Google Gemini API**: https://ai.google.dev/gemini-api/docs
- **Vite Build Tool**: https://vitejs.dev
- **Recharts Visualization**: https://recharts.org

---
*Founding Architect: neocyber1 👑*
