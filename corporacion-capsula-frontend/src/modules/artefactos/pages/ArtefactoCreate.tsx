import { useNavigate } from "react-router-dom"
import bg from "../../../assets/3.jpg"

const ArtefactoCreate = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* contenido */}
      <div className="relative z-10 text-center bg-black/40 border border-cyan-400 p-10 rounded-xl backdrop-blur-xl">

        <h1 className="text-3xl text-cyan-400 mb-4">
          Módulo en construcción
        </h1>

        <p className="text-gray-300 mb-2">
          Registro de artefactos
        </p>

        <p className="text-yellow-400 mb-6">
          En progreso de realización por Juan
        </p>

        <button
          onClick={() => navigate("/home")}
          className="border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
        >
          Volver
        </button>

      </div>
    </div>
  )
}

export default ArtefactoCreate