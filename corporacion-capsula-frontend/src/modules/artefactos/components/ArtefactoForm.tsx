import { useState, useEffect } from "react"
import bulmaGif from "../../../assets/bulma2.gif"
import geroGif from "../../../assets/DCGero1.gif"

type Props = {
  onSubmit: (data: any) => void
  initialData?: any
}

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {

  const esEdicion = !!initialData

  const [codigo, setCodigo] = useState(initialData?.codigo || "")
  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "")
  const [categoria, setCategoria] = useState(initialData?.categoria || "")
  const [origen, setOrigen] = useState(initialData?.origen || "")
  const [nivelPeligrosidad, setNivelPeligrosidad] = useState(initialData?.nivelPeligrosidad || "")
  const [estado, setEstado] = useState(initialData?.estado || "")
  const [inventor, setInventor] = useState(initialData?.inventor || "")
  const [fecha, setFecha] = useState(initialData?.fecha || "")
  const [tipoArtefacto, setTipoArtefacto] = useState(initialData?.tipoArtefacto || "")

  const inventoresMock = [
    { nombre: "Bulma", gif: bulmaGif },
    { nombre: "Dr. Gero", gif: geroGif },
  ]

  const seleccionado = inventoresMock.find(i => i.nombre === inventor)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      // 🔥 BACKEND
      code: codigo,
      name: nombre,
      description: descripcion,
      createdAt: fecha,
      artifactType: tipoArtefacto,

      category:
        categoria === "Transporte" ? "TRANSPORT" :
        categoria === "Energia" ? "ENERGY" :
        categoria === "Defensa" ? "DEFENSE" :
        categoria === "Domestica" ? "DOMESTIC" :
        "ENERGY",

      origin:
        origen === "Terricola" ? "TERRICOLA" :
        origen === "Saiyajin" ? "SAIYAJIN" :
        origen === "Namekiano" ? "NAMEKIANO" :
        "TERRICOLA",

      inventor,

      dangerLevel:
        nivelPeligrosidad === "alto" ? "High" :
        nivelPeligrosidad === "medio" ? "Mid" :
        "Low",

      confidentialityLevel: "Public",
      state: "Activo",
    })
  }

  const inputClass = "w-full p-2 bg-black/60 border border-orange-400 rounded text-white"

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-orange-900/70 border-4 border-orange-400 p-6 rounded-xl w-full max-w-5xl mx-auto"
    >

      <h2 className="text-orange-300 text-xl mb-5 font-bold text-center">
        {esEdicion ? "Editar Artefacto" : "Registrar Artefacto"}
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input placeholder="Código" value={codigo} onChange={e => setCodigo(e.target.value)} className={inputClass} />

        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className={inputClass} />

        <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} className={inputClass} />

        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inputClass} />

        <input placeholder="Tipo de artefacto" value={tipoArtefacto} onChange={e => setTipoArtefacto(e.target.value)} className={inputClass} />

        <select value={categoria} onChange={e => setCategoria(e.target.value)} className={inputClass}>
          <option value="">Categoría</option>
          <option value="Transporte">Transporte</option>
          <option value="Energia">Energia</option>
          <option value="Defensa">Defensa</option>
          <option value="Domestica">Domestica</option>
        </select>

        <select value={origen} onChange={e => setOrigen(e.target.value)} className={inputClass}>
          <option value="">Origen</option>
          <option value="Terricola">Terricola</option>
          <option value="Saiyajin">Saiyajin</option>
          <option value="Namekiano">Namekiano</option>
        </select>

        <input placeholder="Inventor" value={inventor} onChange={e => setInventor(e.target.value)} className={inputClass} />

        <input placeholder="Nivel peligrosidad" value={nivelPeligrosidad} onChange={e => setNivelPeligrosidad(e.target.value)} className={inputClass} />

      </div>

      {seleccionado && (
        <div className="flex justify-center mt-4">
          <img src={seleccionado.gif} className="w-24" />
        </div>
      )}

      <button className="w-full bg-orange-400 text-black p-2 mt-4 font-bold">
        Guardar Artefacto
      </button>

    </form>
  )
}

export default ArtefactoForm