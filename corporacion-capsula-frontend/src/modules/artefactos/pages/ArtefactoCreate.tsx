import { useNavigate } from "react-router-dom"
import bg from "../../../assets/3.jpg"
import ArtefactoForm from "../components/ArtefactoForm"
import { useArtefactos } from "../../../context/ArtefactosContext"

const ArtefactoCreate = () => {
  const navigate = useNavigate()
  const { addArtefacto } = useArtefactos()

  const handleCreate = (data: any) => {
    addArtefacto(data)
    navigate("/artefactos") // o la ruta donde listan
  }

  return (
  <div
  className="min-h-screen text-white flex flex-col items-center relative overflow-y-auto py-10"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* contenido */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">

        <h1 className="text-3xl text-cyan-400 mb-6">
          Crear Artefacto
        </h1>

        {/*  AQUÍ METES EL FORM */}
        <ArtefactoForm onSubmit={handleCreate} />

        <button
          onClick={() => navigate("/home")}
          className="mt-6 border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
        >
          Volver
        </button>

      </div>
    </div>
  )
}

export default ArtefactoCreate