import { useNavigate } from "react-router-dom"
import { ArrowLeft, Zap, Wrench } from "lucide-react"

const Tecnologia = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Panel
        </button>

        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-12 text-center">
          <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-12 h-12 text-amber-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Tecnología
          </h1>
          
          <p className="text-amber-300 text-lg mb-6">
            Módulo en desarrollo
          </p>
          
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
            <Wrench className="w-5 h-5" />
            <span>Estamos trabajando en esta funcionalidad</span>
          </div>

          <div className="bg-black/40 rounded-xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-300 mb-3">
              Funcionalidades planificadas:
            </h3>
            <ul className="text-left text-gray-400 space-y-2">
              <li>• Fichas técnicas de artefactos</li>
              <li>• Especificaciones tecnológicas</li>
              <li>• Manuales de operación</li>
              <li>• Análisis tecnológico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tecnologia
