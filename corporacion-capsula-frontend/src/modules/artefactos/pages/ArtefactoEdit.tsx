import { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ArtefactoForm from "../components/ArtefactoForm"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"

const ArtefactoEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getArtefactoById, updateArtefacto, loadArtefactos } = useArtefactos()

  const artefacto = useMemo(() => {
    if (!id) return undefined
    return getArtefactoById(Number(id))
  }, [getArtefactoById, id])

  useEffect(() => {
    if (!artefacto) {
      loadArtefactos()
    }
  }, [artefacto, loadArtefactos])

  const handleUpdate = async (data: any) => {
    if (!id) return

    await updateArtefacto(Number(id), data)
    navigate("/artefactos")
  }

  if (!artefacto) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <div className="fixed top-20 right-5 z-50">
          <button onClick={() => navigate("/artefactos")} className="flex flex-col items-center">
            <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
            <span className="text-yellow-300 text-sm font-bold">Volver</span>
          </button>
        </div>

        <div className="relative z-10 bg-black/50 border border-orange-400 rounded-xl p-8 text-center">
          <h2 className="text-yellow-300 text-2xl font-bold mb-3">
            Cargando artefacto
          </h2>
          <p className="text-gray-200">
            Estamos buscando la información para editarla.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen w-screen flex justify-center items-center text-white relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/artefactos")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 w-full px-20">
        <ArtefactoForm onSubmit={handleUpdate} initialData={artefacto} />
      </div>
    </div>
  )
}

export default ArtefactoEdit
