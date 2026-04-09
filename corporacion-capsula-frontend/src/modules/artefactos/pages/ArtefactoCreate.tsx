import { useNavigate } from "react-router-dom";
import ArtefactoForm from "../components/ArtefactoForm";
import { useArtefactos } from "../../../context/ArtefactosContext";
import bg from "../../../assets/3.jpg";
import esfera from "../../../assets/7.webp";
import SaiyanParticles from "../../../components/SaiyanParticles";

const ArtefactoCreate = () => {
  const navigate = useNavigate();
  const { addArtefacto } = useArtefactos();

  const handleCreate = async (data: any) => {
    await addArtefacto(data);
    navigate("/artefactos");
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center text-white relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <SaiyanParticles />

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 w-full px-20">
        <ArtefactoForm onSubmit={handleCreate} />
      </div>
    </div>
  );
};

export default ArtefactoCreate;