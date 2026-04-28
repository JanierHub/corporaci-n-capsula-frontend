import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { 
  getStoredUserName, 
  getStoredUserRole, 
  isAdministrator, 
  isProjectManager,
  isInnovationDirector,
  normalizeRole
} from "../../auth/utils/roles"
import CategoryDashboard from "../components/CategoryDashboard"
import AlertsPanel from "../components/AlertsPanel"
import ArtifactComparator from "../components/ArtifactComparator"
import { useMemo, useState } from "react"
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  ArrowLeft,
  Zap,
  BarChart3,
  Bell,
  GitCompare,
  Search,
  Shield,
  Lock
} from "lucide-react"

const AdminPanel = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "gestion" | "alerts" | "compare">("gestion")
  
  const userName = getStoredUserName()
  const userRole = getStoredUserRole() || "Usuario"
  const isAdmin = isAdministrator()
  const isManager = isProjectManager()
  const isDirector = isInnovationDirector()
  
  // Normalizar rol para comparaciones
  const normalizedRole = normalizeRole(userRole)
  
  // Función para verificar si un módulo está disponible para el rol actual
  const canAccessModule = (allowedRoles: string[]) => {
    if (isAdmin) return true // Admin accede a todo
    return allowedRoles.some(r => normalizeRole(r) === normalizedRole)
  }
  
  // Módulos que están implementados y funcionales
  const isImplemented = (path: string) => {
    const implemented = ["/artefactos", "/busqueda-avanzada", "/auditoria", "/biometrico", "/mi-capsula", "/create", "/register"]
    return implemented.includes(path)
  }
  
  // ===== ESTADÍSTICAS REALES DE ARTEFACTOS =====
  const stats = useMemo(() => {
    const total = artefactos.length
    const activos = artefactos.filter(a => a.estado === "activo" || !a.estado).length
    const obsoletos = artefactos.filter(a => a.estado === "obsoleto").length
    const enRevision = artefactos.filter(a => a.estado === "en_pruebas").length
    
    // Contar usuarios únicos por inventor (simulado)
    const inventores = new Set(artefactos.map(a => a.inventor).filter(Boolean))
    
    return {
      total,
      activos,
      obsoletos,
      enRevision,
      usuarios: inventores.size || 1
    }
  }, [artefactos])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/60 border-b border-cyan-400/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-cyan-400 tracking-wider">
                PANEL DE ADMINISTRACIÓN
              </h1>
              <p className="text-gray-400 text-sm">
                Sistema de Gestión Avanzada - Capsule Corp
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-cyan-300">{userName || "Usuario"}</p>
            <p className="text-gray-400 text-xs">{userRole || "Sin rol"}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ===== STATS CARDS CON DATOS REALES ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Artefactos */}
          <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-400/60 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Artefactos</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.total}</p>
              </div>
              <Package className="w-10 h-10 text-cyan-400/50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">En el sistema</p>
          </div>
          
          {/* Activos */}
          <div className="bg-black/40 border border-emerald-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-emerald-400/60 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Activos</p>
                <p className="text-3xl font-bold text-emerald-400">{stats.activos}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-emerald-400/50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.total > 0 ? Math.round((stats.activos / stats.total) * 100) : 0}% del total
            </p>
          </div>
          
          {/* En Revisión / Obsoletos */}
          <div className="bg-black/40 border border-amber-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-amber-400/60 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">
                  {stats.obsoletos > 0 ? "Desactivados" : "En Revisión"}
                </p>
                <p className="text-3xl font-bold text-amber-400">
                  {stats.obsoletos > 0 ? stats.obsoletos : stats.enRevision}
                </p>
              </div>
              <AlertTriangle className="w-10 h-10 text-amber-400/50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.obsoletos > 0 ? "Requieren atención" : "Pendientes de validar"}
            </p>
          </div>
          
          {/* Usuarios/Inventores */}
          <div className="bg-black/40 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm hover:border-purple-400/60 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Inventores</p>
                <p className="text-3xl font-bold text-purple-400">{stats.usuarios}</p>
              </div>
              <Users className="w-10 h-10 text-purple-400/50" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Registrados</p>
          </div>
        </div>

        {/* ===== TABS DE NAVEGACIÓN ===== */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Gestión y Alertas - SOLO PARA ADMIN */}
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("gestion")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "gestion"
                    ? "bg-cyan-400/20 border border-cyan-400 text-cyan-300"
                    : "bg-black/40 border border-cyan-400/30 text-cyan-400/70 hover:bg-cyan-400/10"
                }`}
              >
                <Package className="w-4 h-4" />
                Gestión Completa
              </button>
              
              <button
                onClick={() => setActiveTab("alerts")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === "alerts"
                    ? "bg-amber-400/20 border border-amber-400 text-amber-300"
                    : "bg-black/40 border border-amber-400/30 text-amber-400/70 hover:bg-amber-400/10"
                }`}
              >
                <Bell className="w-4 h-4" />
                Alertas del Sistema
                {artefactos.filter(a => a.nivelPeligrosidad > 8 || a.estado === "en_pruebas").length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {artefactos.filter(a => a.nivelPeligrosidad > 8 || a.estado === "en_pruebas").length}
                  </span>
                )}
              </button>
            </>
          )}
          
          {/* Dashboard - ADMIN y DIRECTORA */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "dashboard"
                ? "bg-purple-400/20 border border-purple-400 text-purple-300"
                : "bg-black/40 border border-purple-400/30 text-purple-400/70 hover:bg-purple-400/10"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard Categorías
            {(isAdmin || isDirector) && (
              <span className="text-xs bg-purple-400/30 px-2 py-0.5 rounded">
                {isAdmin ? "Admin" : "Director"}
              </span>
            )}
          </button>
          
          {/* Comparar - ADMIN y DIRECTORA */}
          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "compare"
                ? "bg-emerald-400/20 border border-emerald-400 text-emerald-300"
                : "bg-black/40 border border-emerald-400/30 text-emerald-400/70 hover:bg-emerald-400/10"
            }`}
          >
            <GitCompare className="w-4 h-4" />
            Comparar Artefactos
            {(isAdmin || isDirector) && (
              <span className="text-xs bg-emerald-400/30 px-2 py-0.5 rounded">
                {isAdmin ? "Admin" : "Director"}
              </span>
            )}
          </button>
        </div>

        {/* ===== CONTENIDO DE TABS ===== */}
        
        {/* Dashboard - Visible para Admin y Directora */}
        {activeTab === "dashboard" && (isAdmin || isDirector) && (
          <div className="mb-8">
            <CategoryDashboard />
          </div>
        )}
        
        {/* Alertas - SOLO Admin */}
        {activeTab === "alerts" && isAdmin && (
          <div className="mb-8">
            <AlertsPanel />
          </div>
        )}
        
        {/* Comparar - Visible para Admin y Directora */}
        {activeTab === "compare" && (isAdmin || isDirector) && (
          <div className="mb-8">
            <ArtifactComparator />
          </div>
        )}
        
        {/* Gestión - Solo visible para Admin */}
        {activeTab === "gestion" && isAdmin && (
          <div className="mb-8 bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm">
              Panel de gestión avanzada de artefactos y sistema.
            </p>
          </div>
        )}

        {/* ===== MÓDULOS DEL SISTEMA - Filtrados por Rol ===== */}
        <div className="bg-black/40 border border-gray-500/30 rounded-xl p-6 backdrop-blur-sm mb-6">
          <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Módulos del Sistema
            {isAdmin && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded ml-2">Admin - Acceso Total</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Inventario / Artefactos - Todos los roles */}
            <button
              onClick={() => navigate("/artefactos")}
              className="text-left p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-cyan-300 transition">Inventario</p>
                  <p className="text-xs text-cyan-400">Artefactos</p>
                </div>
              </div>
            </button>

            {/* Búsqueda Avanzada - Todos los roles */}
            <button
              onClick={() => navigate("/busqueda-avanzada")}
              className="text-left p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-blue-300 transition">Búsqueda Avanzada</p>
                  <p className="text-xs text-blue-400">Filtros complejos</p>
                </div>
              </div>
            </button>

            {/* Mi Cápsula - Todos los usuarios autenticados */}
            <button
              onClick={() => navigate("/mi-capsula")}
              className="text-left p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl hover:bg-rose-500/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-rose-300 transition">Mi Cápsula</p>
                  <p className="text-xs text-rose-400">Perfil de usuario</p>
                </div>
              </div>
            </button>

            {/* Auditoría - Todos los roles (solo Admin puede ver logs reales por protección de ruta) */}
            <button
              onClick={() => navigate("/auditoria")}
              className="text-left p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-purple-300 transition">Auditoría</p>
                  <p className="text-xs text-purple-400">Logs del sistema</p>
                </div>
              </div>
            </button>

            {/* Biométrico - Todos los roles */}
            <button
              onClick={() => navigate("/biometrico")}
              className="text-left p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl hover:bg-pink-500/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-pink-300 transition">Verificación Biométrica</p>
                  <p className="text-xs text-pink-400">Acceso seguro</p>
                </div>
              </div>
            </button>

            {/* Proyectos I+D - Todos los roles (en desarrollo) */}
            <button
              onClick={() => navigate("/proyectos")}
              className="text-left p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition group opacity-80"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-indigo-300 transition">Proyectos I+D</p>
                  <p className="text-xs text-indigo-400">En desarrollo</p>
                </div>
              </div>
            </button>

            {/* Gestión de Usuarios - Solo Admin */}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/users")}
                className="text-left p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-emerald-300 transition">Gestión de Usuarios</p>
                    <p className="text-xs text-emerald-400">Administrar roles</p>
                  </div>
                </div>
              </button>
            )}

            {/* Seguridad - Todos los roles (en desarrollo) */}
            <button
              onClick={() => navigate("/seguridad")}
              className="text-left p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition group opacity-80"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-red-300 transition">Seguridad</p>
                  <p className="text-xs text-red-400">En desarrollo</p>
                </div>
              </div>
            </button>

            {/* Tecnología - Todos los roles (en desarrollo) */}
            <button
              onClick={() => navigate("/tecnologia")}
              className="text-left p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition group opacity-80"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-amber-300 transition">Tecnología</p>
                  <p className="text-xs text-amber-400">En desarrollo</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/40 border border-cyan-400/20 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Acciones Rápidas
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/artefactos")}
              className="bg-cyan-400/20 border border-cyan-400 text-cyan-300 py-2 px-6 rounded-lg hover:bg-cyan-400/30 transition"
            >
              Ver Inventario Completo
            </button>
            {/* Todos los roles pueden crear artefactos y usuarios */}
            <button
              onClick={() => navigate("/create")}
              className="bg-emerald-400/20 border border-emerald-400 text-emerald-300 py-2 px-6 rounded-lg hover:bg-emerald-400/30 transition"
            >
              Crear Artefacto
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-purple-400/20 border border-purple-400 text-purple-300 py-2 px-6 rounded-lg hover:bg-purple-400/30 transition"
            >
              Crear Usuario
            </button>
            {/* Solo Admin puede gestionar roles */}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/users")}
                className="bg-amber-400/20 border border-amber-400 text-amber-300 py-2 px-6 rounded-lg hover:bg-amber-400/30 transition"
              >
                Gestionar Roles
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
