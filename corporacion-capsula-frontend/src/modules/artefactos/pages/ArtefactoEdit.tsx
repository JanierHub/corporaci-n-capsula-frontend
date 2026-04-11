import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import bg from "../../../assets/3.jpg"
import ArtefactoForm from "../components/ArtefactoForm"
import { useArtefactos } from "../../../context/ArtefactosContext"

const ArtefactoEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getArtefactoById, updateArtefacto } = useArtefactos()

  const artefacto = useMemo(
    () => getArtefactoById(Number(id)),
    [getArtefactoById, id]
  )

  const handleSubmit = (data: any) => {
    if (!artefacto) return

    updateArtefacto(artefacto.id, data)
    navigate("/artefactos")
  }

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center relative overflow-y-auto py-10"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
        {artefacto ? (
          <>
            <ArtefactoForm
              initialData={artefacto}
              onSubmit={handleSubmit}
            />

            <button
              onClick={() => navigate("/artefactos")}
              className="mt-6 border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
            >
              Volver
            </button>
          </>
        ) : (
          <div className="text-center bg-black/40 border border-cyan-400 p-10 rounded-xl backdrop-blur-xl">
            <h1 className="text-3xl text-cyan-400 mb-4">
              Artefacto no encontrado
            </h1>

            <p className="text-gray-300 mb-6">
              El registro que intentas editar ya no existe en el inventario.
            </p>

            <button
              onClick={() => navigate("/artefactos")}
              className="border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtefactoEdit
