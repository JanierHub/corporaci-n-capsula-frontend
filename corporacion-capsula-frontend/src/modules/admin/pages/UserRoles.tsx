import { useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Shield, AlertCircle, Search, Filter, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { getAllUsers, updateUserRole, getAllRoles, type User, type Role } from "../../auth/services/userService"
import { getStoredAccessToken, getStoredUserName } from "../../auth/utils/roles"

const UserRoles = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)
  
  // HU-05: Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<number | "all">("all")
  
  // Obtener usuario actual para no permitir auto-modificación
  const currentUserName = getStoredUserName()

  useEffect(() => {
    loadData()
  }, [])

  // HU-05: Aplicar filtros cuando cambian
  useEffect(() => {
    let filtered = users
    
    // Filtro por nombre
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filtro por rol
    if (selectedRole !== "all") {
      filtered = filtered.filter(u => u.id_rol === selectedRole)
    }
    
    setFilteredUsers(filtered)
  }, [users, searchTerm, selectedRole])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, rolesData] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ])
      setUsers(usersData)
      setFilteredUsers(usersData)
      setRoles(rolesData)
    } catch (err) {
      console.error("Error cargando datos:", err)
      setError(`No se pudieron cargar los datos: ${err instanceof Error ? err.message : "Error desconocido"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId: number, newRoleId: number) => {
    try {
      setUpdating(userId)
      await updateUserRole(userId, newRoleId)
      // Actualización optimistica: actualizar localmente primero
      setUsers(prev => prev.map(u => 
        u.id_usuario === userId ? { ...u, id_rol: newRoleId } : u
      ))
    } catch (err) {
      console.error("Error actualizando rol:", err)
      const errorMsg = err instanceof Error ? err.message : "Error desconocido"
      alert(`Error al actualizar el rol:\n${errorMsg}`)
      // Recargar datos si falló
      await loadData()
    } finally {
      setUpdating(null)
    }
  }

  const getRoleName = (roleId: number) => {
    return roles.find(r => r.id_rol === roleId)?.nombre_rol || `Rol ${roleId}`
  }

  const getRoleSecurityLevel = (roleId: number) => {
    return roles.find(r => r.id_rol === roleId)?.nivel_seguridad || ""
  }
  
  // HU-04: Verificar si el usuario puede modificar su propio rol
  const canModifyOwnRole = (userName: string) => {
    return userName.toLowerCase() !== currentUserName?.toLowerCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Panel
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-purple-400 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Gestión de Usuarios y Roles
            </h1>
            <p className="text-gray-400 text-sm">Asigna roles a los usuarios del sistema</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-medium">Solo Administradores</p>
            <p className="text-gray-400 text-sm">Esta funcionalidad está reservada para usuarios con rol Administrador.</p>
          </div>
        </div>

        {/* Roles disponibles */}
        <div className="bg-black/40 border border-gray-700 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Roles del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {roles.map((rol: Role) => (
              <div key={rol.id_rol} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold">
                  {rol.id_rol}
                </span>
                <span className="text-gray-400">{rol.nombre_rol}</span>
                <span className="text-xs text-gray-600">({rol.nivel_seguridad})</span>
              </div>
            ))}
          </div>
        </div>

        {/* HU-05: Filtros y búsqueda */}
        <div className="bg-black/40 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Todos los roles</option>
                {roles.map(r => (
                  <option key={r.id_rol} value={r.id_rol}>
                    {r.nombre_rol}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>

        {/* HU-05: Lista de usuarios con filtros */}
        <div className="bg-black/40 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-cyan-400">
              Usuarios ({filteredUsers.length} de {users.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {users.length === 0 ? "No hay usuarios registrados" : "No se encontraron usuarios con los filtros aplicados"}
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <div key={user.id_usuario} className="p-4 flex items-center justify-between hover:bg-white/5 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">
                        {user.nombre?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.nombre}</p>
                      <p className="text-xs text-gray-500">
                        ID: {user.id_usuario} {user.edad && `• ${user.edad} años`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 hidden md:inline">
                      Rol: <span className="text-purple-400">{getRoleName(user.id_rol)}</span>
                    </span>
                    
                    {/* HU-04: No permitir cambiar el propio rol */}
                    <select
                      value={user.id_rol}
                      onChange={(e) => handleUpdateRole(user.id_usuario, Number(e.target.value))}
                      disabled={updating === user.id_usuario || !canModifyOwnRole(user.nombre)}
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!canModifyOwnRole(user.nombre) ? "No puedes cambiar tu propio rol" : getRoleSecurityLevel(user.id_rol)}
                    >
                      {roles.map(rol => (
                        <option key={rol.id_rol} value={rol.id_rol}>
                          {rol.nombre_rol}
                        </option>
                      ))}
                    </select>

                    {updating === user.id_usuario && (
                      <span className="text-xs text-purple-400">Actualizando...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserRoles
