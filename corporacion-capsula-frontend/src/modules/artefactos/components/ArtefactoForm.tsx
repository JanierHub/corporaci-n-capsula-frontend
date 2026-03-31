import { useState } from "react";
import { Artefacto } from "../types/artefacto.types";

type Props = {
  onSubmit: (data: Partial<Artefacto>) => void;
};

const ArtefactoForm = ({ onSubmit }: Props) => {
  const [form, setForm] = useState<Partial<Artefacto>>({
  nombre: "",
  descripcion: "",
  categoria: "defensa",
  origen: "terrestre",
  nivelPeligrosidad: 1,
})


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8 w-full max-w-md">
      <h2 className="text-cyan-400 text-2xl mb-6 text-center">
        Crear Artefacto
      </h2>

      <input
        name="nombre"
        placeholder="Nombre"
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
        onChange={handleChange}
      />

      <input
        name="descripcion"
        placeholder="Descripción"
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
        onChange={handleChange}
      />

      <select
        name="categoria"
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
        onChange={handleChange}
      >
        <option value="defensa">Defensa</option>
        <option value="transporte">Transporte</option>
        <option value="domestico">Doméstico</option>
        <option value="energia">Energía</option>
      </select>

      <select
        name="origen"
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
        onChange={handleChange}
      >
        <option value="terrestre">Terrestre</option>
        <option value="extraterrestre">Extraterrestre</option>
      </select>

      <input
        name="nivelPeligrosidad"
        type="number"
        min="1"
        max="5"
        className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
        onChange={handleChange}
      />

      <button
        className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold"
        onClick={handleSubmit}
      >
        Guardar
      </button>
    </div>
  );
};

export default ArtefactoForm;
