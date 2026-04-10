import { useState } from "react";
import { Artefacto } from "../types/artefacto.types";

type Props = {
  onSubmit: (data: Artefacto) => void;
  initialData?: Partial<Artefacto>;
};

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {

  const [codigo, setCodigo] = useState(initialData?.code || "");
  const [nombre, setNombre] = useState(initialData?.name || "");
  const [descripcion, setDescripcion] = useState(initialData?.description || "");
  const [fecha, setFecha] = useState(initialData?.createdAt || "");
  const [tipoArtefacto, setTipoArtefacto] = useState(initialData?.artifactType || "");
  const [categoria, setCategoria] = useState("");
  const [origen, setOrigen] = useState("");
  const [inventor, setInventor] = useState(initialData?.inventor || "");
  const [nivelPeligrosidad, setNivelPeligrosidad] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Artefacto = {
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
    };

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/70 p-6 rounded-xl border border-yellow-400 shadow-[0_0_20px_orange]"
    >

      <h2 className="text-2xl text-yellow-300 mb-4 font-bold">
        Crear Artefacto
      </h2>

      {/* CODIGO */}
      <input
        placeholder="Código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      />

      {/* NOMBRE */}
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      />

      {/* DESCRIPCIÓN */}
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      />

      {/* FECHA */}
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      />

      {/* TIPO */}
      <input
        placeholder="Tipo de artefacto"
        value={tipoArtefacto}
        onChange={(e) => setTipoArtefacto(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      />

      {/* CATEGORIA */}
      <select
        onChange={(e) => setCategoria(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      >
        <option>Seleccionar categoría</option>
        <option>Transporte</option>
        <option>Energia</option>
        <option>Defensa</option>
        <option>Domestica</option>
      </select>

      {/* ORIGEN */}
      <select
        onChange={(e) => setOrigen(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      >
        <option>Seleccionar origen</option>
        <option>Terricola</option>
        <option>Saiyajin</option>
        <option>Namekiano</option>
      </select>

      {/* INVENTOR */}
      <input
        placeholder="Inventor"
        value={inventor}
        onChange={(e) => setInventor(e.target.value)}
        className="w-full mb-3 p-2 bg-black border border-yellow-400 text-white rounded"
      />

      {/* PELIGROSIDAD */}
      <select
        onChange={(e) => setNivelPeligrosidad(e.target.value)}
        className="w-full mb-4 p-2 bg-black border border-yellow-400 text-white rounded"
      >
        <option>Seleccionar peligrosidad</option>
        <option value="bajo">Bajo</option>
        <option value="medio">Medio</option>
        <option value="alto">Alto</option>
      </select>

      {/* BOTÓN */}
      <button
        type="submit"
        className="w-full py-2 bg-yellow-400 text-black font-bold rounded hover:bg-orange-500 transition"
      >
        Guardar Artefacto
      </button>

    </form>
  );
};

export default ArtefactoForm;