import { useState } from "react"
import esfera from "../../../assets/7.webp"

type Props = {
  onSubmit: (data: any) => void
  initialData?: any
}

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {
  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [categoria, setCategoria] = useState(initialData?.categoria || "defensa")
  const [origen, setOrigen] = useState(initialData?.origen || "terrestre")
  const [nivelPeligrosidad, setNivelPeligrosidad] = useState(
    initialData?.nivelPeligrosidad || 1
  )

  // 🔥 corregido
  const [cientifico, setCientifico] = useState<number | "">(
    initialData?.cientifico || ""
  )
  const [fecha, setFecha] = useState(initialData?.fecha || "")

  // 🔥 mock con imagen importada
  const cientificosMock = [
    {
      id: 1,
      nombre: "Bulma",
      imagen: esfera,
    },
    {
      id: 2,
      nombre: "Dr. Gero",
      imagen: esfera,
    },
  ]

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const data = {
      nombre,
      descripcion,
      categoria,
      origen,
      nivelPeligrosidad,
      cientifico,
      fecha,
    }

    onSubmit(data)
  }

  // 🔥 comparación correcta
  const seleccionado = cientificosMock.find(c => c.id === cientifico)

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/40 border border-cyan-400 p-6 rounded-xl backdrop-blur-xl w-full max-w-md"
    >
      <h2 className="text-cyan-400 text-xl mb-4">
        Formulario Artefacto
      </h2>

      <input
        className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      {/* 🔥 CIENTÍFICO */}
      <select
        className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        value={cientifico}
        onChange={(e) =>
          setCientifico(e.target.value ? Number(e.target.value) : "")
        }
      >
        <option value="">Seleccionar científico</option>
        {cientificosMock.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* 🔥 PREVIEW */}
      {seleccionado && (
        <div className="mb-4 flex justify-center">
          <img
            src={seleccionado.imagen}
            className="w-20 h-20 object-contain rounded-full border border-cyan-400"
          />
        </div>
      )}

      {/* 🔥 FECHA */}
      <input
        type="date"
        className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <select
        className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      >
        <option value="defensa">Defensa</option>
        <option value="transporte">Transporte</option>
        <option value="domestico">Doméstico</option>
        <option value="energia">Energía</option>
      </select>

      <select
        className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        value={origen}
        onChange={(e) => setOrigen(e.target.value)}
      >
        <option value="terrestre">Terrestre</option>
        <option value="extraterrestre">Extraterrestre</option>
      </select>

      <input
        type="number"
        className="w-full mb-4 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        placeholder="Nivel de peligrosidad"
        value={nivelPeligrosidad}
        onChange={(e) => setNivelPeligrosidad(Number(e.target.value))}
      />

      <button
        type="submit"
        className="w-full bg-cyan-400 text-black p-2 rounded font-bold"
      >
        Guardar
      </button>
    </form>
  )
}

export default ArtefactoForm