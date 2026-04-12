import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { canEditArtifacts, getStoredUserRole, isAdministrator } from "../../auth/utils/roles"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"
import { gifPorIdTipo } from "../constants/artifactVisuals"

const confidentialityLabel = (value?: number) => {
  switch (value) {
    case 1:
      return "Public"
    case 2:
      return "Restricted"
    case 3:
      return "Confidential"
    case 4:
      return "Ultra-confidential"
    default:
      return "No definido"
  }
}

const ArtefactosList = () => {
  const navigate = useNavigate()
  const { artefactos, loadArtefactos, toggleArtefactoEstado } = useArtefactos()
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const lista = useMemo(() => artefactos, [artefactos])
  const [selectedId, setSelectedId] = useState<number | null>(lista[0]?.id ?? null)

  useEffect(() => {
    loadArtefactos()
  }, [loadArtefactos])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadArtefactos()
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [loadArtefactos])

  useEffect(() => {
    if (!lista.length) {
      setSelectedId(null)
      return
    }

    const existeSeleccion = lista.some((artefacto) => artefacto.id === selectedId)
    if (!existeSeleccion) {
      setSelectedId(lista[0].id)
    }
  }, [lista, selectedId])

  const selected = lista.find((artefacto) => artefacto.id === selectedId) ?? null
  const canManageArtifacts = isAdministrator()
  const canEdit = canEditArtifacts()
  const roleLabel = getStoredUserRole()

  const imagenSeleccionada = selected
    ? selected.fotoDataUrl || gifPorIdTipo(selected.tipoArtefacto)
    : ""

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white flex relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="fixed top-20 right-5 z-50">
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center"
        >
          <img
            src={esfera}
            className="w-12 drop-shadow-[0_0_10px_orange]"
          />
          <span className="text-yellow-300 text-sm font-bold">
            Volver
          </span>
        </button>
      </div>

      <div className="relative z-10 flex w-full h-full p-4 gap-4">
        <div className="w-1/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4 flex flex-col">
          <h2 className="text-yellow-300 font-bold mb-3">
            Inventario
          </h2>

          <div className="overflow-y-auto flex-1 pr-1">
            {lista.length > 0 ? (
              lista.map((a) => {
                const inactivo = a.estado === "obsoleto"
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className={`p-3 mb-2 cursor-pointer rounded border-2 transition
                    ${selectedId === a.id
                      ? "bg-yellow-400 text-black border-yellow-200"
                      : inactivo
                        ? "bg-orange-950/90 border-red-500/60 text-orange-100 hover:bg-orange-900 hover:text-white"
                        : "bg-orange-800 border-transparent hover:bg-yellow-300 hover:text-black"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={a.fotoDataUrl || gifPorIdTipo(a.tipoArtefacto)}
                        alt=""
                        className="w-10 h-10 rounded object-cover shrink-0 border border-orange-400/50"
                      />
                      <div>
                        <div className="font-semibold">⚡ {a.nombre}</div>
                        {inactivo && (
                          <div className="text-xs mt-0.5 text-red-300 font-bold">Desactivado</div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-sm text-yellow-100/80">
                No hay artefactos disponibles.
              </div>
            )}
          </div>
        </div>

        <div className="w-2/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4 flex flex-col">
          {selected ? (
            <>
              <div className="bg-orange-700 rounded mb-3 flex justify-center items-center h-52 overflow-hidden">
                <img
                  src={imagenSeleccionada}
                  alt=""
                  className="h-44 w-full max-w-md object-contain"
                />
              </div>

              <h2 className="text-2xl text-yellow-300 font-bold mb-2">
                {selected.nombre}
              </h2>

              <div className="bg-gray-700 p-3 rounded mb-3 text-sm">
                {selected.descripcion}
              </div>

              <div className="space-y-2 text-sm">
                <p>⚙ {selected.categoria}</p>
                <p>🌍 {selected.origen}</p>
                <p>⚠ {selected.nivelPeligrosidad}</p>
                <p>🔐 {confidentialityLabel(selected.nivelConfidencialidad)}</p>
                <p>🧪 {selected.inventor || "No definido"}</p>
                <p>
                  📊{" "}
                  <span
                    className={
                      selected.estado === "obsoleto"
                        ? "text-red-400 font-bold"
                        : selected.estado === "en_pruebas"
                          ? "text-yellow-300 font-bold"
                          : "text-green-400 font-bold"
                    }
                  >
                    {selected.estado === "obsoleto"
                      ? "Inactivo"
                      : selected.estado === "en_pruebas"
                        ? "En pruebas"
                        : "Activo"}
                  </span>
                </p>
                <p>📅 {selected.fechaCreacion || "Sin fecha"}</p>
                <p>🛰️ ID {selected.id}</p>
                {roleLabel ? (
                  <p className="text-xs text-orange-200/90 mt-1">
                    Rol: <span className="font-semibold">{roleLabel}</span>
                    {!canManageArtifacts ? " (sin permiso para activar/desactivar)" : null}
                  </p>
                ) : null}
              </div>

              {canEdit ? (
                <button
                  type="button"
                  onClick={() => navigate(`/artefactos/edit/${String(selected.id)}`)}
                  className="mt-5 px-6 py-2 bg-yellow-400 text-black rounded hover:bg-orange-500"
                >
                  Editar
                </button>
              ) : null}

              {canManageArtifacts ? (
                selected.estado === "obsoleto" ? (
                  <button
                    type="button"
                    disabled={togglingId === selected.id}
                    onClick={async () => {
                      setTogglingId(selected.id)
                      try {
                        await toggleArtefactoEstado(selected.id)
                      } finally {
                        setTogglingId(null)
                      }
                    }}
                    className="mt-3 px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-500 transition shadow-[0_0_10px_lime] border border-green-400 disabled:opacity-60"
                  >
                    {togglingId === selected.id ? "Activando…" : "✓ Activar"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/artefactos/delete/${String(selected.id)}`)}
                    className="mt-3 px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-500 transition shadow-[0_0_10px_red] border border-red-400"
                  >
                    🗑 Desactivar
                  </button>
                )
              ) : (
                <p className="mt-4 text-sm text-orange-200/90 border border-orange-500/40 rounded-lg px-3 py-2 bg-black/20">
                  Solo el rol <strong>Administrador</strong> puede crear y cambiar el estado
                  (activar/desactivar) de los artefactos. El rol <strong>Usuario</strong> ya puede editarlos.
                </p>
              )}
            </>
          ) : (
            <div className="text-white p-10">Cargando...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtefactosList
