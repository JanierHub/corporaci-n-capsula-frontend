import { useNavigate, useParams } from "react-router-dom";
import ArtefactoForm from "../components/ArtefactoForm";
import { useArtefactos } from "../../../context/ArtefactosContext";
import bg from "../../../assets/3.jpg";

const ArtefactoEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { artefactos, editArtefacto } = useArtefactos();

  const artefacto = artefactos.find((a) => a.id === id);

  const handleUpdate = async (data: any) => {
    await editArtefacto(id!, data);
    navigate("/artefactos");
  };

  if (!artefacto) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p>Artefacto no encontrado</p>
        <button onClick={() => navigate("/artefactos")} className="ml-4 underline">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
      }}
    >
      <ArtefactoForm onSubmit={handleUpdate} initialData={artefacto} />

      <button
        onClick={() => navigate("/artefactos")}
        className="mt-6 border border-cyan-400 px-6 py-2 rounded-lg"
      >
        Volver
      </button>
    </div>
  );
};

export default ArtefactoEdit;