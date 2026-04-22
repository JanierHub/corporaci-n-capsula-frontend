# SCRIPT AUDIO - ARQUITECTURA FRONTEND

## PARTE 1: STACK Y ORGANIZACIÓN (1 minuto)

"Hola, soy Janier y les voy a explicar la arquitectura de nuestro frontend del Sistema de Gestión de Artefactos.

**Stack Tecnológico:**
- Usamos **React** como framework principal con **TypeScript** para mayor seguridad en el código
- **Vite** como herramienta de construcción para desarrollo rápido
- **TailwindCSS** para los estilos, lo que nos permitió crear esta interfaz futurista con gradientes y efectos visuales
- **React Router** para la navegación entre páginas
- **Axios** para las comunicaciones con el backend

**Organización de Componentes:**
Estructuramos el proyecto en módulos claros:
- **Módulo de Autenticación**: Maneja todo el login, roles y permisos
- **Módulo de Artefactos**: Contiene toda la lógica de gestión de artefactos
- **Context API**: Usamos React Context para manejar el estado global de los artefactos
- **Services**: Capa de servicio para comunicaciones con la API
- **Utils**: Funciones auxiliares como manejo de imágenes y validaciones

**Manejo de Estado:**
La característica más importante que desarrollamos es la persistencia de estados de activación/desactivación. Usamos una combinación de localStorage para persistencia inmediata y sincronización con el backend para mantener los datos consistentes.

**Gestión del Repositorio:**
Trabajamos con Git usando ramas feature para cada funcionalidad principal. Tenemos un flujo de trabajo claro con pull requests y code review para mantener la calidad del código."

---

## PARTE 2: GESTIÓN DE EQUIPO (1 minuto)

**Cómo nos organizamos Juan David y yo:**

**Reparto de Tareas:**
Nos dividimos las responsabilidades de manera estratégica:
- **Yo (Janier)** me enfoqué más en la lógica de estado, la persistencia de datos y la integración con el backend
- **Juan David** se concentró en los componentes de UI, los estilos visuales y la experiencia de usuario
- Ambos trabajamos juntos en la arquitectura general y la toma de decisiones técnicas

**Comunicación:**
Usamos Discord para comunicación diaria y GitHub para el seguimiento de tareas. Teníamos reuniones cortas cada 2 días para sincronizar el progreso y resolver bloqueos.

**Metodología de Trabajo:**
Trabajamos en sprints cortos de 2-3 días. Cada sprint enfocado en una funcionalidad específica:
1. Sprint 1: Autenticación y roles
2. Sprint 2: CRUD básico de artefactos  
3. Sprint 3: Sistema de activación/desactivación
4. Sprint 4: Persistencia y optimización

**Resolución de Conflictos:**
Cuando tuvimos diferencias técnicas, las resolvíamos con pruebas rápidas. Por ejemplo, para el manejo de estado, probamos varias soluciones antes de decidirnos por la combinación de localStorage + backend.

**Resultados:**
Esta organización nos permitió entregar un MVP funcional en tiempo récord, con código limpio, bien estructurado y fácil de mantener para futuras funcionalidades."

---

**Duración total: ~2 minutos**
**Enfoque en conceptos clave, sin entrar demasiado en detalles técnicos**
