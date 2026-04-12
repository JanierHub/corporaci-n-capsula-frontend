import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"

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

  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    loadArtefactos()
  }, [loadArtefactos])

  useEffect(() => {
    if (artefactos.length > 0) setSelected(artefactos[0])
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
                className={`p-3 mb-2 cursor-pointer rounded ${
                  selected?.id === a.id
                    ? "bg-yellow-400 text-black"
                    : "bg-orange-800 hover:bg-yellow-300 hover:text-black"
                }`}
              >
                ⚡ {a.nombre}
              </div>
            ))
          )}
        </div>

        <div className="w-2/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4">
          {!selected ? (
            <p>Selecciona un artefacto</p>
          ) : (
            <>
              <div className="bg-orange-700 rounded mb-3 flex justify-center items-center h-52">
                <img src={getGif(selected.categoria)} className="h-40" />
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
                onClick={() => navigate(`/edit/${selected.id}`)}
                className="mt-4 w-full py-2 bg-yellow-400 text-black rounded"
              >
                Editar
              </button>

              <button
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtefactosList