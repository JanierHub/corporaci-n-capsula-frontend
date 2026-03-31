import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import bg from "../../../assets/3.jpg"
import capsule from "../../../assets/13.gif"
import esfera from "../../../assets/7.webp"

const ArtefactosList = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()

  const artefactosMock = [
    {
      id: 1,
      nombre: "Capsula Hoi Poi",
      descripcion: "Permite almacenar objetos en miniatura",
      categoria: "domestico",
      origen: "terrestre",
      nivelPeligrosidad: 1,
    },
    {
      id: 2,
      nombre: "Scouter",
      descripcion: "Mide el nivel de poder de los enemigos",
      categoria: "defensa",
      origen: "extraterrestre",
      nivelPeligrosidad: 3,
    },
    {
      id: 3,
      nombre: "Radar del Dragón",
      descripcion: "Detecta las esferas del dragón",
      categoria: "energia",
      origen: "terrestre",
      nivelPeligrosidad: 2,
    },
  ]

  const lista = artefactos.length > 0 ? artefactos : artefactosMock
  const [selected, setSelected] = useState(lista[0])

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden flex"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* 🔥 BOTÓN VOLVER ESFERA */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={() => navigate("/home")}
          className="flex flex-col items-center hover:scale-110 transition"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src={esfera}
              className="w-full h-full object-contain drop-shadow-[0_0_15px_orange]"
            />
          </div>
          <span className="text-xs text-yellow-300 mt-1">
            Volver
          </span>
        </button>
      </div>

      <div className="relative z-10 flex w-full p-6 gap-6">

        {/* 🔵 LISTA */}
        <div className="w-1/3 bg-black/50 border border-cyan-400 rounded-xl p-4 overflow-y-auto">

          <h2 className="text-cyan-400 mb-4 text-xl">Inventario</h2>

          {lista.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelected(a)}
              className={`p-3 mb-2 cursor-pointer rounded-lg transition 
                ${selected?.id === a.id
                  ? "bg-cyan-400 text-black"
                  : "bg-black/40 hover:bg-cyan-400 hover:text-black"
                }`}
            >
              {a.nombre}
            </div>
          ))}

        </div>

        {/* 🔵 DETALLE */}
        <div className="w-2/3 bg-black/50 border border-cyan-400 rounded-xl p-6 flex">

          {selected ? (
            <>
              <div className="w-2/3">

                <h2 className="text-2xl text-cyan-300 mb-4">
                  {selected.nombre}
                </h2>

                <p className="text-gray-300 mb-4">
                  {selected.descripcion}
                </p>

                <div className="space-y-2 text-sm">
                  <p>⚙ Categoría: {selected.categoria}</p>
                  <p>🌍 Origen: {selected.origen}</p>
                  <p>⚠ Peligro: {selected.nivelPeligrosidad}</p>
                </div>

                {/* 🔥 BOTÓN EDITAR FUNCIONAL */}
                <button
                  onClick={() => navigate(`/edit/${selected.id}`)}
                  className="mt-6 border border-cyan-400 px-6 py-2 rounded-lg hover:bg-cyan-400 hover:text-black transition"
                >
                  Editar
                </button>

              </div>

              <div className="w-1/3 flex items-center justify-center">
                <img
                  src={capsule}
                  className="w-40 object-contain drop-shadow-[0_0_20px_cyan]"
                />
              </div>
            </>
          ) : (
            <p>No hay selección</p>
          )}

        </div>

      </div>
    </div>
  )
}

export default ArtefactosList