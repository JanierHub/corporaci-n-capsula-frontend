import { useNavigate, useParams } from "react-router-dom"
import bg from "../../../assets/3.jpg"
import ArtefactoForm from "../components/ArtefactoForm"
import { useArtefactos } from "../../../context/ArtefactosContext"

const ArtefactoEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { artefactos, updateArtefacto } = useArtefactos()

  const artefacto = artefactos.find((a) => a.id === Number(id))

  const handleUpdate = (data: any) => {
    updateArtefacto(Number(id), data)
    navigate("/artefactos")
  }

 if (!artefacto) {
  return (
    <div className="text-white text-center mt-20">
      <h2 className="text-2xl text-red-400">Artefacto no encontrado</h2>
      <p className="mt-2">Puede que recargaste la página</p>

      <button
        onClick={() => navigate("/artefactos")}
        className="mt-6 border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
      >
        Volver
      </button>
    </div>
  )
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">

        <h1 className="text-3xl text-cyan-400 mb-6">
          Editar Artefacto
        </h1>

        <ArtefactoForm
          onSubmit={handleUpdate}
          initialData={artefacto}
        />

        <button
          onClick={() => navigate("/artefactos")}
          className="mt-6 border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
        >
          Volver
        </button>

      </div>
    </div>
  )
}

export default ArtefactoEdit