import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, Lock, ShieldAlert } from "lucide-react"

const AccesoDenegado = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { moduleName, allowedRoles, userRole } = location.state || {}

  const formatRoles = (roles: string[]) => {
    if (roles.length === 1) return roles[0]
    if (roles.length === 2) return `${roles[0]} o ${roles[1]}`
    return `${roles.slice(0, -1).join(", ")} o ${roles[roles.length - 1]}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/80 border border-red-500/30 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Acceso Restringido
        </h1>

        {moduleName ? (
          <>
            <p className="text-gray-400 mb-6">
              El módulo <span className="text-red-400 font-semibold">{moduleName}</span> es exclusivo para:
            </p>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-red-300">
                <Lock className="w-4 h-4" />
                <span className="font-medium">{formatRoles(allowedRoles || ["Administrador"])}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Tu rol actual: <span className="text-gray-300">{userRole || "Usuario"}</span>
            </p>
          </>
        ) : (
          <p className="text-gray-400 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/home")}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Home
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-all"
          >
            Ir al Panel de Admin
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccesoDenegado
