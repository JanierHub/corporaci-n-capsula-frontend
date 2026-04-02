import { useState, useEffect } from "react";
import { Artefacto } from "../types/artefacto.types";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import drBriefImg from "../../../assets/DCBrief1.jpg"
import bulmaImg from "../../../assets/bulma1.jpg"
import drHedoImg from "../../../assets/DCHedo1.jpg"

type Props = {
  onSubmit: (data: Partial<Artefacto>) => void;
  initialData?: Partial<Artefacto>;
};

// 🔥 SIMULANDO DATOS DEL BACKEND
const cientificos = [
  {
    id: 1,
    nombre: "Dr. Brief",
    descripcion: "Fundador de Capsule Corp",
    imagen: drBriefImg,
  },
  {
    id: 2,
    nombre: "Bulma",
    descripcion: "Ingeniera jefa",
    imagen: bulmaImg,
  },
  {
    id: 3,
    nombre: "Dr. Hedo",
    descripcion: "Especialista en tecnología avanzada",
    imagen: drHedoImg,
  },
];

const ArtefactoForm = ({ onSubmit, initialData }: Props) => {
 const [form, setForm] = useState<Partial<Artefacto>>({
  nombre: "",
  descripcion: "",
  categoria: "defensa",
  origen: "terrestre",
  nivelPeligrosidad: 1,
  inventor: "", 
});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "nivelPeligrosidad" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const cientificoSeleccionado = cientificos.find(
    (c) => c.nombre === form.inventor
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/40 border border-cyan-400 p-6 rounded-xl backdrop-blur-xl w-full max-w-md"
    >
      <h2 className="text-cyan-400 text-xl mb-4">
        Formulario Artefacto
      </h2>

      {/* 🔬 CIENTIFICO */}
      <label className="text-cyan-400 text-sm">Científico creador</label>
      <p className="text-gray-400 text-xs mb-2">
        Selecciona el responsable del artefacto
      </p>

          <select
        name="inventor"
        value={form.inventor || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
      >
        <option value="">Seleccionar científico</option>
        {cientificosMock.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
      {/* 🖼️ PREVIEW */}
      {cientificoSeleccionado && (
        <div className="mb-4 text-center">
          <img
            src={seleccionado.imagen}
            className="w-20 h-20 object-contain rounded-full border border-cyan-400"
          />
        </div>
      )}

      {/* 📝 DESCRIPCION */}
      <label className="text-cyan-400 text-sm">Descripción</label>
      <p className="text-gray-400 text-xs mb-2">
        Explica qué hace el artefacto
      </p>

      <input
        name="descripcion"
        value={form.descripcion || ""}
        onChange={handleChange}
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
      />

{/* 📅 FECHA */}
<label className="text-cyan-400 text-sm">Fecha de creación</label>
<p className="text-gray-400 text-xs mb-2">
  Fecha en la que se desarrolló el artefacto
</p>

<DatePicker
  selected={form.fechaCreacion ? new Date(form.fechaCreacion) : null}
  onChange={(date: Date | null) =>
    setForm({
      ...form,
      fechaCreacion: date?.toISOString().split("T")[0],
    })
  }
  className="w-full p-3 bg-black/60 border border-cyan-400 text-white rounded-lg focus:outline-none"
  calendarClassName="bg-black text-white border border-cyan-400 rounded-xl p-2 shadow-lg shadow-cyan-400/30"
  dayClassName={() =>
    "text-white hover:bg-cyan-400 hover:text-black rounded-full transition"
  }
  popperClassName="z-50"
/>
    <form className="flex flex-col gap-4"></form>

      {/* ⚙️ CATEGORIA */}
      <label className="text-cyan-400 text-sm">Categoría</label>
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

      {/* 🌍 ORIGEN */}
      <label className="text-cyan-400 text-sm">Origen</label>
      <select
        className="w-full mb-3 p-2 bg-black/60 border border-cyan-400 text-white rounded"
        value={origen}
        onChange={(e) => setOrigen(e.target.value)}
      >
        <option value="terrestre">Terrestre</option>
        <option value="extraterrestre">Extraterrestre</option>
      </select>

      {/* ⚠️ PELIGROSIDAD */}
      <label className="text-cyan-400 text-sm">Nivel de peligrosidad</label>

      <select
        name="nivelPeligrosidad"
        value={form.nivelPeligrosidad}
        onChange={handleChange}
        className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
      >
        <option value={1}>1 - Uso común </option>
        <option value={2}>2 - Peligroso </option>
        <option value={3}>3 - Muy peligroso </option>
      </select>

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