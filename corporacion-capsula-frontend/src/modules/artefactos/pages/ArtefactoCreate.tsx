import { useNavigate } from "react-router-dom"
import ArtefactoForm from "../components/ArtefactoForm"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"
import { Artefacto } from "../types/artefacto.types"
import SaiyanParticles from "../../../components/SaiyanParticles"
import { isAdministrator } from "../../auth/utils/roles"

const ArtefactoCreate = () => {
  const navigate = useNavigate()
  const { addArtefacto } = useArtefactos()

  const handleCreate = async (data: Partial<Artefacto>) => {
    await addArtefacto(data)
    navigate("/artefactos")
  }

  if (!isAdministrator()) {
    return (
      <div
        className="h-screen w-screen flex justify-center items-center text-white relative"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 bg-black/80 p-6 rounded-xl border border-amber-500 max-w-md text-center px-6">
          <h2 className="text-amber-300 text-xl mb-3">Permiso denegado</h2>
          <p className="text-gray-300 text-sm mb-4">
            Crear artefactos está reservado al rol <strong>Administrador</strong> (requerido por el API).
          </p>
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-yellow-400 text-black rounded hover:bg-orange-500 font-bold"
          >
            Volver al inicio
          </button>
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

      <SaiyanParticles />

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 w-full px-20">
        <ArtefactoForm onSubmit={handleCreate} />
      </div>
    </div>
  )
}

export default ArtefactoCreate
