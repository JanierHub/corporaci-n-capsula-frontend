import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"
import transporteGif from "../../../assets/1.gif"
import energiaGif from "../../../assets/11.gif"
import domesticaGif from "../../../assets/13.gif"
import defensaGif from "../../../assets/5.gif"

const getGifByCategoria = (categoria: string) => {
  switch (categoria) {
    case "transporte":
      return transporteGif
    case "energia":
      return energiaGif
    case "domestico":
      return domesticaGif
    case "defensa":
      return defensaGif
    default:
      return energiaGif
  }
}

const ArtefactosList = () => {
  const navigate = useNavigate()
  const { artefactos, loadArtefactos } = useArtefactos()
  const lista = useMemo(() => artefactos, [artefactos])
  const [selectedId, setSelectedId] = useState<number | null>(lista[0]?.id ?? null)

  useEffect(() => {
    loadArtefactos()
  }, [])

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
            {lista.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`p-3 mb-2 cursor-pointer rounded
                  ${selectedId === a.id
                    ? "bg-yellow-400 text-black"
                    : "bg-orange-800 hover:bg-yellow-300 hover:text-black"
                  }`}
              >
                ⚡ {a.nombre}
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4 flex flex-col">
          {selected ? (
            <>
              <div className="bg-orange-700 rounded mb-3 flex justify-center items-center h-52">
                <img
                  src={getGifByCategoria(selected.categoria)}
                  className="h-40 object-contain"
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
                <p>🧪 {selected.inventor || "No definido"}</p>
                <p>
                  📊{" "}
                  <span
                    className={
                      selected.estado === "obsoleto"
                        ? "text-red-400 font-bold"
                        : "text-green-400"
                    }
                  >
                    {selected.estado === "obsoleto" ? "Inactivo" : "Activo"}
                  </span>
                </p>
                <p>📅 {selected.fechaCreacion || "Sin fecha"}</p>
              </div>

              <button
                onClick={() => navigate(`/edit/${String(selected.id)}`)}
                className="mt-5 px-6 py-2 bg-yellow-400 text-black rounded hover:bg-orange-500"
              >
                Editar
              </button>

              <button
                onClick={() => navigate(`/artefactos/delete/${String(selected.id)}`)}
                className="mt-3 px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-500 transition shadow-[0_0_10px_red] border border-red-400"
              >
                🗑 Desactivar
              </button>
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
