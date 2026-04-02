import { useState } from "react"
import bulmaGif from "../../../assets/bulma2.gif"
import geroGif from "../../../assets/DCGero1.gif"

type Props = {
  onSubmit: (data: any) => void
  initialData?: any
}

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {
  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")

  // 🔥 ENUM (RESPETA DIAGRAMA)
  const [categoria, setCategoria] = useState(initialData?.categoria || "")

  // 🔥 STRING LIBRE
  const [origen, setOrigen] = useState(initialData?.origen || "")
  const [nivelPeligrosidad, setNivelPeligrosidad] = useState(initialData?.nivelPeligrosidad || "")
  const [estado, setEstado] = useState(initialData?.estado || "")
  const [inventor, setInventor] = useState(initialData?.inventor || "")
  const [fecha, setFecha] = useState(initialData?.fecha || "")

  const inventoresMock = [
    { nombre: "Bulma", gif: bulmaGif },
    { nombre: "Dr. Gero", gif: geroGif },
  ]

  const seleccionado = inventoresMock.find(i => i.nombre === inventor)

  const handleSubmit = (e: any) => {
    e.preventDefault()

    onSubmit({
      nombre,
      descripcion,
      categoria,
      origen,
      nivelPeligrosidad,
      estado,
      inventor,
      fecha,
    })
  }

  return (
    <form className="bg-black/40 border border-cyan-400 p-6 rounded-xl w-full max-w-md" onSubmit={handleSubmit}>

      <h2 className="text-cyan-400 text-xl mb-4">Formulario Artefacto</h2>

      <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 rounded"/>

      <input placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 rounded"/>

      {/* 🔥 INVENTOR STRING */}
      <input placeholder="Inventor (ej: Bulma)" value={inventor} onChange={(e) => setInventor(e.target.value)} className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 rounded"/>

      {seleccionado && (
        <div className="mb-4 flex justify-center">
          <img src={seleccionado.gif} className="w-24"/>
        </div>
      )}

      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 rounded"/>

      {/* 🔥 CATEGORIA ENUM */}
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 rounded">
        <option value="">Seleccionar categoría</option>
        <option value="Defensa">Defensa</option>
        <option value="Transporte">Transporte</option>
        <option value="Domestica">Domestica</option>
        <option value="Energia">Energia</option>
      </select>

      <input placeholder="Origen (ej: Terrestre)" value={origen} onChange={(e) => setOrigen(e.target.value)} className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 rounded"/>

      <input placeholder="Nivel de peligrosidad (ej: Alto)" value={nivelPeligrosidad} onChange={(e) => setNivelPeligrosidad(e.target.value)} className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 rounded"/>

      <input placeholder="Estado (ej: Activo)" value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full mb-4 p-2 bg-black/60 border border-cyan-400 rounded"/>

      <button className="w-full bg-cyan-400 text-black p-2 rounded font-bold">
        Guardar
      </button>

    </form>
  )
}

export default ArtefactoForm