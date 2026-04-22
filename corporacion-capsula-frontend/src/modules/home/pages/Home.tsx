import { useNavigate } from "react-router-dom"
import videoBg from "../../../assets/14.mp4"
import capsule from "../../../assets/13.gif"
import logo from "../../../assets/5.gif"
import { getStoredUserName, getStoredUserRole, isAdministrator, canViewArtifacts, isProjectManager, isInnovationDirector } from "../../auth/utils/roles"

const Home = () => {
  const navigate = useNavigate()

  const userName = getStoredUserName()
  const userRole = getStoredUserRole()
  const isAdmin = isAdministrator()
  const isManager = isProjectManager()
  const isDirector = isInnovationDirector()

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">

      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <img
        src={capsule}
        className="absolute top-10 right-10 w-24 animate-bounce opacity-70 z-10"
      />

      <div className="relative z-10 flex w-full h-full">

        <div className="w-1/2 flex items-center justify-center p-10">

          <div className="bg-black/40 border border-cyan-400 rounded-2xl p-8 w-full max-w-md backdrop-blur-xl">

            <div className="flex flex-col items-center">

              <img
                src={logo}
                className="w-28 mb-4 drop-shadow-[0_0_20px_cyan]"
              />

              {/* 🔥 AQUÍ ESTÁ EL CAMBIO */}
              <h2 className="text-xl text-cyan-300">
                Bienvenido, {userName || "Usuario"}
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Sistema Capsule Corp
              </p>

              <p className="text-cyan-200/90 text-xs mb-6">
                Rol actual: {userRole || "Sin rol"}
              </p>

            </div>

            <div className="flex flex-col gap-4">

              {canViewArtifacts() && (
                <button
                  onClick={() => navigate("/artefactos")}
                  className="bg-cyan-400 text-black py-3 rounded-lg font-bold hover:scale-105 transition"
                >
                  Ver Inventario
                </button>
              )}

              {(isAdmin || isManager || isDirector) && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition shadow-lg shadow-purple-500/30"
                >
                  Panel de Administración
                </button>
              )}

              {isAdmin ? (
                <>
                  <button
                    onClick={() => navigate("/create")}
                    className="border border-cyan-400 py-3 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                  >
                    Crear Artefacto
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="border border-emerald-400 py-3 rounded-lg hover:bg-emerald-400 hover:text-black transition"
                  >
                    Crear Usuario
                  </button>
                </>
              ) : (
                <div className="border border-cyan-400/40 py-3 px-4 rounded-lg text-sm text-gray-300 bg-black/20">
                  Las acciones de crear artefactos y crear usuarios estan reservadas al rol Administrador.
                </div>
              )}

              {/* ===== MÓDULOS DEL EQUIPO ===== */}
              <div className="mt-4 pt-4 border-t border-gray-600/30">
                <p className="text-gray-400 text-xs mb-3 text-center">Módulos en Desarrollo</p>
                
                {/* Búsqueda Avanzada - Juan */}
                <button
                  onClick={() => navigate("/busqueda-avanzada")}
                  className="w-full border border-blue-400 py-3 rounded-lg hover:bg-blue-400 hover:text-black transition mb-2 flex items-center justify-center gap-2"
                >
                  <span>🔍</span>
                  <span>Búsqueda Avanzada</span>
                  <span className="text-xs bg-blue-400/20 px-2 py-0.5 rounded text-blue-300">Juan</span>
                </button>
                <p className="text-blue-400/50 text-xs text-center mb-3">Módulo en desarrollo por Juan</p>
                
                {/* Auditoría - Carlos */}
                <button
                  onClick={() => navigate("/auditoria")}
                  className="w-full border border-purple-400 py-3 rounded-lg hover:bg-purple-400 hover:text-black transition mb-2 flex items-center justify-center gap-2"
                >
                  <span>📊</span>
                  <span>Auditoría del Sistema</span>
                  <span className="text-xs bg-purple-400/20 px-2 py-0.5 rounded text-purple-300">Carlos</span>
                </button>
                <p className="text-purple-400/50 text-xs text-center mb-3">Módulo en desarrollo por Carlos</p>
                
                {/* Biométrico - Carlos y Juan */}
                <button
                  onClick={() => navigate("/biometrico")}
                  className="w-full border border-pink-400 py-3 rounded-lg hover:bg-pink-400 hover:text-black transition mb-2 flex items-center justify-center gap-2"
                >
                  <span>🧬</span>
                  <span>Verificación Biométrica</span>
                  <span className="text-xs bg-pink-400/20 px-2 py-0.5 rounded text-pink-300">Carlos & Juan</span>
                </button>
                <p className="text-pink-400/50 text-xs text-center">Módulo en desarrollo por Carlos y Juan</p>
              </div>

            </div>
          </div>

        </div>

        <div className="w-1/2 flex items-center justify-center">

          <div className="text-center max-w-md">

            <h1 className="text-4xl text-cyan-400 mb-6 tracking-widest">
              CAPSULE CORP SYSTEM
            </h1>

            <p className="text-gray-300">
              Bienvenido al sistema de gestión de artefactos tecnológicos.
              Controla, crea y administra dispositivos con niveles de seguridad avanzados.
            </p>

            <div className="mt-10 w-40 h-40 mx-auto bg-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Home
