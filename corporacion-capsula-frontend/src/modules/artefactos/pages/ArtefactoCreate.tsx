import { useNavigate } from "react-router-dom";
import ArtefactoForm from "../components/ArtefactoForm";
import { useArtefactos } from "../../../context/ArtefactosContext";
import { canManageArtifacts } from "../../auth/utils/roles";
import bg from "../../../assets/3.jpg";
import esfera from "../../../assets/7.webp";
import SaiyanParticles from "../../../components/SaiyanParticles";

const ArtefactoCreate = () => {
  const navigate = useNavigate();
  const { addArtefacto } = useArtefactos();

  if (!canManageArtifacts()) {
    navigate("/home");
    return null;
  }

  const handleCreate = async (data: Parameters<typeof addArtefacto>[0]) => {
    try {
      const nombreArtefacto = data.nombre || "Artefacto sin nombre";
      await addArtefacto(data);
      alert(`✅ "${nombreArtefacto}" creado con éxito.`);
      navigate("/artefactos");
    } catch (e) {
      console.error(e);
      window.alert(e instanceof Error ? e.message : "No se pudo crear el artefacto.");
    }
  }

  return (
    <div
      className="h-screen w-screen flex justify-center items-center text-white relative"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <SaiyanParticles />

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center">
          <img src={esfera} className="w-12" />
        </button>
      </div>

      <div className="relative z-10 w-full px-20">
        <ArtefactoForm mode="create" onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default ArtefactoCreate;