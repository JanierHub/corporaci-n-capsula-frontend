import { useState } from "react";

const ArtefactoForm = ({ onSubmit, initialData }: any) => {

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

    onSubmit({
      name: nombre,
      description: descripcion,
      category: "ENERGY",
      origin: "TERRICOLA",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-orange-900/80 border-4 border-orange-400 rounded-xl p-6 w-full max-w-4xl mx-auto shadow-[0_0_20px_orange]"
    >

      <h2 className="text-2xl text-yellow-300 font-bold mb-6 text-center">
        Registrar Artefacto
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="col-span-2 p-2 bg-black border border-orange-400 rounded text-white"
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <input
          placeholder="Tipo de artefacto"
          value={tipoArtefacto}
          onChange={(e) => setTipoArtefacto(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <select
          onChange={(e) => setCategoria(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        >
          <option>Categoría</option>
          <option>Transporte</option>
          <option>Energia</option>
          <option>Defensa</option>
          <option>Domestica</option>
        </select>

        <select
          onChange={(e) => setOrigen(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        >
          <option>Origen</option>
          <option>Terricola</option>
          <option>Saiyajin</option>
          <option>Namekiano</option>
        </select>

        <input
          placeholder="Inventor"
          value={inventor}
          onChange={(e) => setInventor(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        />

        <select
          onChange={(e) => setNivelPeligrosidad(e.target.value)}
          className="p-2 bg-black border border-orange-400 rounded text-white"
        >
          <option>Nivel peligrosidad</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
        </select>

      </div>

      <button
        type="submit"
        className="mt-6 w-full py-3 bg-yellow-400 text-black font-bold rounded hover:bg-orange-500 transition"
      >
        Guardar Artefacto
      </button>

    </form>
  );
};

export default ArtefactoForm;