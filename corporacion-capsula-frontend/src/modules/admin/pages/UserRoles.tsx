import { useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Shield, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getStoredAccessToken } from "../../auth/utils/roles"
import { API_URL } from "../../../config/api"

interface User {
  id_usuario: number
  nombre: string
  id_rol: number
  rol_nombre?: string
}

const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Directora de Innovacion" },
  { id: 3, nombre: "Experto en tecnologia extraterrestre" },
  { id: 4, nombre: "Especialista en seguridad" },
  { id: 5, nombre: "Inventor/Tester" },
  { id: 6, nombre: "Gestor de proyectos" },
  { id: 7, nombre: "Usuario" },
]

const UserRoles = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = getStoredAccessToken()
      const res = await fetch(`${API_URL}/user`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
      if (!res.ok) throw new Error("Error cargando usuarios")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError("No se pudieron cargar los usuarios")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: number, newRoleId: number) => {
    try {
      setUpdating(userId)
      const token = getStoredAccessToken()
      const res = await fetch(`${API_URL}/user/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ role: newRoleId })
      })
      if (!res.ok) throw new Error("Error actualizando rol")
      await fetchUsers()
      alert("Rol actualizado correctamente")
    } catch (err) {
      alert("Error al actualizar el rol")
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const getRoleName = (roleId: number) => {
    return ROLES.find(r => r.id === roleId)?.nombre || `Rol ${roleId}`
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
            {ROLES.map(rol => (
              <div key={rol.id} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold">
                  {rol.id}
                </span>
                <span className="text-gray-400">{rol.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="bg-black/40 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-gray-900/50">
            <h3 className="text-lg font-semibold text-cyan-400">Usuarios</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay usuarios registrados</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {users.map((user) => (
                <div key={user.id_usuario} className="p-4 flex items-center justify-between hover:bg-white/5 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">
                        {user.nombre?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.nombre}</p>
                      <p className="text-xs text-gray-500">ID: {user.id_usuario}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 hidden md:inline">
                      Rol actual: <span className="text-purple-400">{getRoleName(user.id_rol)}</span>
                    </span>
                    
                    <select
                      value={user.id_rol}
                      onChange={(e) => updateUserRole(user.id_usuario, Number(e.target.value))}
                      disabled={updating === user.id_usuario}
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400 disabled:opacity-50"
                    >
                      {ROLES.map(rol => (
                        <option key={rol.id} value={rol.id}>{rol.nombre}</option>
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
