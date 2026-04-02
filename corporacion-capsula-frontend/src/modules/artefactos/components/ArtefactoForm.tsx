import { useState, useEffect } from "react";
import { Artefacto } from "../types/artefacto.types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import drBriefImg from "../../../assets/DCBrief1.jpg";
import bulmaImg from "../../../assets/bulma1.jpg";
import drHedoImg from "../../../assets/DCHedo1.jpg";

type Props = {
  onSubmit: (data: Partial<Artefacto>) => void;
  initialData?: Partial<Artefacto>;
};

// 🔬 DATOS SIMULADOS
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

// ✅ AQUÍ ESTABA LO QUE TE FALTABA
const ArtefactoForm = ({ onSubmit, initialData }: Props) => {

  const [form, setForm] = useState<Partial<Artefacto>>({
    nombre: "",
    descripcion: "",
    categoria: "defensa",
    origen: "terrestre",
    nivelPeligrosidad: 1,
    inventor: "",
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
      }));
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
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black/40 backdrop-blur-xl border border-cyan-400 rounded-2xl p-8 w-full max-w-md"
    >
      <h2 className="text-cyan-400 text-2xl mb-6 text-center">
        {initialData ? "Editar Artefacto" : "Crear Artefacto"}
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
        {cientificos.map((c) => (
          <option key={c.id} value={c.nombre}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* 🖼️ PREVIEW */}
      {cientificoSeleccionado && (
        <div className="mb-4 text-center">
          <img
            src={cientificoSeleccionado.imagen}
            alt="cientifico"
            className="w-24 h-24 object-cover mx-auto rounded-full border border-cyan-400"
          />
          <p className="text-sm text-gray-300 mt-2">
            {cientificoSeleccionado.descripcion}
          </p>
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
        className="w-full p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
      />

      {/* ⚙️ CATEGORIA */}
      <br/>
      <label className="text-cyan-400 text-sm">Categoría</label>
        <p className="text-gray-400 text-xs mb-2">
          Tipo de uso del artefacto
        </p>
      <select
        name="categoria"
        value={form.categoria}
        onChange={handleChange}
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
      >
        <option value="defensa">Defensa</option>
        <option value="transporte">Transporte</option>
        <option value="domestico">Doméstico</option>
        <option value="energia">Energía</option>
      </select>

      {/* 🌍 ORIGEN */}
      <label className="text-cyan-400 text-sm">Origen</label>
        <p className="text-gray-400 text-xs mb-2">
          De dónde proviene el artefacto
        </p>
      <select
        name="origen"
        value={form.origen}
        onChange={handleChange}
        className="w-full mb-4 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
      >
        <option value="terrestre">Terrestre</option>
        <option value="extraterrestre">Extraterrestre</option>
      </select>

      {/* ⚠️ PELIGROSIDAD */}
      <label className="text-cyan-400 text-sm">Nivel de peligrosidad</label>
        <p className="text-gray-400 text-xs mb-2">
          Define qué tan riesgoso es el artefacto
        </p>
      <select
        name="nivelPeligrosidad"
        value={form.nivelPeligrosidad}
        onChange={handleChange}
        className="w-full mb-5 p-3 bg-black/60 border border-cyan-400 text-white rounded-lg"
      >
        <option value={1}>1 - Uso común</option>
        <option value={2}>2 - Peligroso</option>
        <option value={3}>3 - Muy peligroso</option>
      </select>

      <button
        type="submit"
        className="w-full bg-cyan-400 text-black p-3 rounded-lg font-bold"
      >
        Guardar
      </button>
    </form>
  );
};

export default ArtefactoForm;
