import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { isAdministrator } from "../../auth/utils/roles"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"
import capsuleIcon from "../../../assets/13.gif"

import transporteGif from "../../../assets/transporte.gif"
import energiaGif from "../../../assets/energia.gif"
import domesticaGif from "../../../assets/domestica.gif"
import defensaGif from "../../../assets/defensa.gif"

const getGif = (cat: string) => {
  switch (cat) {
    case "transporte": return transporteGif
    case "energia": return energiaGif
    case "domestico": return domesticaGif
    case "defensa": return defensaGif
    default: return energiaGif
  }
}

const ArtefactosList = () => {
  const navigate = useNavigate()

  const {
    artefactos,
    loadArtefactos,
    toggleArtefactoEstado,
  } = useArtefactos()

  const canManageEstado = isAdministrator()

  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    loadArtefactos()
  }, [loadArtefactos])

  useEffect(() => {
    if (artefactos.length === 0) {
      setSelected(null)
      return
    }
    setSelected((prev) => {
      if (prev) {
        const fresh = artefactos.find((a) => a.id === prev.id)
        if (fresh) return fresh
      }
      return artefactos[0]
    })
  }, [artefactos])

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white flex relative"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 flex w-full h-full p-4 gap-4">
        <div className="w-1/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4">
          <h2 className="text-yellow-300 font-bold mb-3">Inventario</h2>

          {artefactos?.length === 0 ? (
            <p>No hay artefactos 🚫</p>
          ) : (
            artefactos.map((a: any) => (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className={`flex items-center gap-3 p-3 mb-2 cursor-pointer rounded ${
                  selected?.id === a.id
                    ? "bg-yellow-400 text-black"
                    : "bg-orange-800 hover:bg-yellow-300 hover:text-black"
                }`}
              >
                <img
                  src={a.imagenPersonalizada ?? getGif(a.categoria)}
                  alt=""
                  className="w-12 h-12 rounded object-cover border border-orange-500/50 shrink-0 bg-black/40"
                />
                <span className="font-medium">⚡ {a.nombre}</span>
              </div>
            ))
          )}
        </div>

        <div className="w-2/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4">
          {!selected ? (
            <p>Selecciona un artefacto</p>
          ) : (
            <>
              <div className="bg-orange-700 rounded mb-3 flex justify-center items-center h-52 overflow-hidden">
                <img
                  src={selected.imagenPersonalizada ?? getGif(selected.categoria)}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <h2 className="text-2xl text-yellow-300 font-bold mb-2">
                {selected.nombre}
              </h2>

              <div className="bg-gray-700 p-3 rounded mb-3 text-sm">
                {selected.descripcion}
              </div>

              <div className="space-y-1 text-sm">
                <p>⚙ {selected.categoria}</p>
                <p>🌍 {selected.origen}</p>
                <p>⚠ {selected.nivelPeligrosidad}</p>
                <p>🧪 {selected.inventor}</p>

                <p className={selected.estado === "obsoleto" ? "text-red-400" : "text-green-400"}>
                  {selected.estado === "obsoleto" ? "Inactivo" : "Activo"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/edit/${selected.id}`)}
                className="mt-4 w-full group relative overflow-hidden rounded-xl border-2 border-yellow-400/90 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3 px-4 shadow-[0_0_22px_rgba(251,191,36,0.45)] transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(251,191,36,0.6)]"
              >
                <span className="flex items-center justify-center gap-3">
                  <img
                    src={capsuleIcon}
                    alt=""
                    className="h-11 w-11 object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.45)]"
                  />
                  <span className="text-black font-extrabold text-lg tracking-wide">
                    Editar artefacto
                  </span>
                </span>
              </button>

              {canManageEstado ? (
                <button
                  type="button"
                  onClick={async () => {
                    if (selected.estado === "obsoleto") {
                      await toggleArtefactoEstado(selected.id)
                    } else {
                      navigate(`/artefactos/delete/${selected.id}`)
                    }
                  }}
                  className={`mt-2 w-full py-2 rounded font-bold transition ${
                    selected.estado === "obsoleto"
                      ? "bg-green-500 hover:bg-green-400"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  {selected.estado === "obsoleto" ? "🟢 Activar" : "🗑 Desactivar"}
                </button>
              ) : (
                <p className="mt-3 text-xs text-gray-400 border border-orange-500/40 rounded-lg py-2 px-3">
                  Activar y desactivar artefactos solo está permitido para el rol Administrador.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtefactosList