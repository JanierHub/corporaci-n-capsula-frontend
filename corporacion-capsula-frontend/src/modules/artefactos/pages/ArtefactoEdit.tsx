import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ArtefactoForm from "../components/ArtefactoForm"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { fetchArtefactoById } from "../services/artefactoService"
import type { Artefacto } from "../types/artefacto.types"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"

const ArtefactoEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { artefactos, updateArtefacto, loadArtefactos } = useArtefactos()
  const [fetched, setFetched] = useState<Artefacto | undefined>(undefined)
  const [fetchDone, setFetchDone] = useState(false)

  const pid = id ? Number(id) : NaN

  const fromList = useMemo(() => {
    if (!Number.isFinite(pid)) return undefined
    return artefactos.find((a) => a.id === pid)
  }, [artefactos, pid])

  const artefacto = fromList ?? fetched

  useEffect(() => {
    loadArtefactos()
  }, [loadArtefactos])

  useEffect(() => {
    if (!Number.isFinite(pid)) {
      setFetchDone(true)
      return
    }
    if (fromList) {
      setFetched(undefined)
      setFetchDone(true)
      return
    }
    setFetchDone(false)
    let cancelled = false
    fetchArtefactoById(pid).then((one) => {
      if (!cancelled) {
        setFetched(one ?? undefined)
        setFetchDone(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [pid, fromList])

  const handleUpdate = async (data: Partial<Artefacto>) => {
    if (!Number.isFinite(pid)) return

    await updateArtefacto(pid, data)
    navigate("/artefactos")
  }

  if (!artefacto) {
    const invalidId = id != null && !Number.isFinite(pid)
    const notFound = fetchDone && Number.isFinite(pid) && !fromList && !fetched
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
            <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" alt="" />
            <span className="text-yellow-300 text-sm font-bold">Volver</span>
          </button>
        </div>

        <div className="relative z-10 bg-black/50 border border-orange-400 rounded-xl p-8 text-center max-w-md">
          <h2 className="text-yellow-300 text-2xl font-bold mb-3">
            {invalidId
              ? "ID no válido"
              : notFound
                ? "Artefacto no encontrado"
                : "Cargando artefacto"}
          </h2>
          <p className="text-gray-200">
            {invalidId
              ? "Revisa la URL de edición."
              : notFound
                ? "No hay datos para este id o no tenés permisos."
                : "Estamos cargando los datos para editar."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen w-screen flex justify-center items-center text-white relative overflow-y-auto"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/artefactos")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" alt="" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 w-full px-6 md:px-20 py-24">
        <ArtefactoForm
          key={artefacto.id}
          mode="edit"
          onSubmit={handleUpdate}
          initialData={artefacto}
        />
      </div>
    </div>
  )
}

export default ArtefactoEdit
