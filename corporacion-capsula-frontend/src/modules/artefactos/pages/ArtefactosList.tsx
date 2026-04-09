import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"

import transporteGif from "../../../assets/transporte.gif"
import energiaGif from "../../../assets/energia.gif"
import domesticaGif from "../../../assets/domestica.gif"
import defensaGif from "../../../assets/defensa.gif"

const getGifByCategoria = (categoria: string) => {
  switch (categoria) {
    case "TRANSPORT": return transporteGif
    case "ENERGY": return energiaGif
    case "DOMESTIC": return domesticaGif
    case "DEFENSE": return defensaGif
    default: return energiaGif
  }
}

const ArtefactosList = () => {
  const navigate = useNavigate()
  const { artefactos, loadArtefactos } = useArtefactos()

  const [selected, setSelected] = useState<any>(null)

  // 🔥 cargar datos (backend o mock)
  useEffect(() => {
    loadArtefactos()
  }, [])

  // 🔥 mapping backend → UI antigua
  const lista = artefactos.map((a) => ({
    id: a.id,
    nombre: a.name,
    descripcion: a.description,
    categoria: a.category,
    origen: a.origin,
    nivelPeligrosidad: a.dangerLevel,
    estado: a.state,
    inventor: a.inventor,
    fecha: a.createdAt,
  }))

  // 🔥 seleccionar primero
  useEffect(() => {
    if (lista.length > 0) {
      setSelected(lista[0])
    }
  }, [artefactos])

  if (!selected) {
    return <div className="text-white p-10">Cargando...</div>
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white flex relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* 🔥 BOTÓN VOLVER */}
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

        {/* LISTA */}
        <div className="w-1/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4 flex flex-col">

          <h2 className="text-yellow-300 font-bold mb-3">
            Inventario
          </h2>

          <div className="overflow-y-auto flex-1 pr-1">
            {lista.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className={`p-3 mb-2 cursor-pointer rounded
                  ${selected?.id === a.id
                    ? "bg-yellow-400 text-black"
                    : "bg-orange-800 hover:bg-yellow-300 hover:text-black"
                  }`}
              >
                ⚡ {a.nombre}
              </div>
            ))}
          </div>

        </div>

        {/* DETALLE */}
        <div className="w-2/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4 flex flex-col">

          {/* GIF */}
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
            <p>🧪 {selected.inventor}</p>
            <p>📊 {selected.estado}</p>
            <p>📅 {selected.fecha}</p>
          </div>

          {/* EDITAR */}
          <button
            onClick={() => navigate(`/edit/${String(selected.id)}`)}
            className="mt-5 px-6 py-2 bg-yellow-400 text-black rounded hover:bg-orange-500"
          >
            Editar
          </button>

          {/* 🔥 DESACTIVAR (ARREGLADO) */}
          <button
            onClick={() => navigate(`/artefactos/delete/${String(selected.id)}`)}
            className="mt-3 px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-500 transition shadow-[0_0_10px_red] border border-red-400"
          >
            🗑 Desactivar
          </button>

        </div>

      </div>
    </div>
  )
}

export default ArtefactosList