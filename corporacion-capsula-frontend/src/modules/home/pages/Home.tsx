import { useNavigate } from "react-router-dom"
import { getStoredUserRole, isAdministrator } from "../../auth/utils/roles"
import videoBg from "../../../assets/14.mp4"
import capsule from "../../../assets/13.gif"
import logo from "../../../assets/5.gif"

const Home = () => {
  const navigate = useNavigate()
  const userRole = getStoredUserRole()
  const isAdmin = isAdministrator()

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">

      {/* 🎬 VIDEO FONDO */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* overlay oscuro */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* cápsula animada */}
      <img
        src={capsule}
        className="absolute top-10 right-10 w-24 animate-bounce opacity-70 z-10"
      />

      {/* contenido */}
      <div className="relative z-10 flex w-full h-full">

        {/* 🔵 PANEL IZQUIERDO */}
        <div className="w-1/2 flex items-center justify-center p-10">

          <div className="bg-black/40 border border-cyan-400 rounded-2xl p-8 w-full max-w-md backdrop-blur-xl">

            <div className="flex flex-col items-center">

              <img
                src={logo}
                className="w-28 mb-4 drop-shadow-[0_0_20px_cyan]"
              />

              <h2 className="text-xl text-cyan-300">
                Bienvenido{userRole ? ` — ${userRole}` : ""}
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Sistema Capsule Corp
                {!isAdmin && userRole ? (
                  <span className="block mt-2 text-amber-200/90">
                    Tu rol no incluye gestión de artefactos en el API; ver inventario puede estar limitado.
                  </span>
                ) : null}
              </p>

            </div>

            <div className="flex flex-col gap-4">

              <button
                onClick={() => navigate("/artefactos")}
                className="bg-cyan-400 text-black py-3 rounded-lg font-bold hover:scale-105 transition"
              >
                Ver Inventario
              </button>

              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => navigate("/artefactos/create")}
                  className="border border-cyan-400 py-3 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  Crear Artefacto
                </button>
              ) : null}

            </div>
          </div>

        </div>

        {/* 🔵 PANEL DERECHO */}
        <div className="w-1/2 flex items-center justify-center">

          <div className="text-center max-w-md">

            <h1 className="text-4xl text-cyan-400 mb-6 tracking-widest">
              CAPSULE CORP SYSTEM
            </h1>

            <p className="text-gray-300">
              Bienvenido al sistema de gestión de artefactos tecnológicos.
              Controla, crea y administra dispositivos con niveles de seguridad avanzados.
            </p>

            {/* aura tipo ki */}
            <div className="mt-10 w-40 h-40 mx-auto bg-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Home
