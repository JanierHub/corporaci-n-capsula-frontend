import { useMemo } from "react"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { useNavigate } from "react-router-dom"
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon,
  Clock,
  CheckCircle2,
  Eye,
  X
} from "lucide-react"

interface Alert {
  id: number
  type: "critical" | "warning" | "info"
  title: string
  message: string
  artefactoId: number
  artefactoNombre: string
  timestamp: string
  read: boolean
}

const AlertsPanel = () => {
  const navigate = useNavigate()
  const { artefactos, toggleArtefactoEstado } = useArtefactos()
  
  // ===== GENERAR ALERTAS DINÁMICAS =====
  const alerts = useMemo<Alert[]>(() => {
    const generatedAlerts: Alert[] = []
    
    // Alerta 1: Artefactos con peligrosidad crítica (>8)
    artefactos
      .filter(a => a.nivelPeligrosidad > 8)
      .forEach(a => {
        generatedAlerts.push({
          id: a.id * 1000 + 1,
          type: "critical",
          title: "Peligrosidad Crítica",
          message: `Nivel de peligrosidad: ${a.nivelPeligrosidad}/10. Requiere supervisión especializada.`,
          artefactoId: a.id,
          artefactoNombre: a.nombre,
          timestamp: new Date().toISOString(),
          read: false
        })
      })
    
    // Alerta 2: Artefactos en pruebas hace mucho tiempo
    artefactos
      .filter(a => a.estado === "en_pruebas")
      .forEach(a => {
        const diasEnPruebas = Math.floor(Math.random() * 30) + 5 // Simulado
        generatedAlerts.push({
          id: a.id * 1000 + 2,
          type: "warning",
          title: "En Pruebas Prolongadas",
          message: `Lleva ${diasEnPruebas} días en estado de pruebas. Considerar activación o archivo.`,
          artefactoId: a.id,
          artefactoNombre: a.nombre,
          timestamp: new Date(Date.now() - diasEnPruebas * 24 * 60 * 60 * 1000).toISOString(),
          read: false
        })
      })
    
    // Alerta 3: Artefactos con confidencialidad máxima
    artefactos
      .filter(a => a.nivelConfidencialidad >= 9)
      .forEach(a => {
        generatedAlerts.push({
          id: a.id * 1000 + 3,
          type: "info",
          title: "Alta Confidencialidad",
          message: `Nivel de confidencialidad: ${a.nivelConfidencialidad}/10. Verificar permisos de acceso.`,
          artefactoId: a.id,
          artefactoNombre: a.nombre,
          timestamp: new Date().toISOString(),
          read: false
        })
      })
    
    // Ordenar por tipo (críticas primero) y timestamp
    return generatedAlerts.sort((a, b) => {
      const typePriority = { critical: 0, warning: 1, info: 2 }
      if (typePriority[a.type] !== typePriority[b.type]) {
        return typePriority[a.type] - typePriority[b.type]
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
  }, [artefactos])
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertOctagon className="w-5 h-5" />
      case "warning": return <AlertTriangle className="w-5 h-5" />
      case "info": return <Bell className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }
  
  const getAlertColors = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-500/10 border-red-500/30 text-red-400"
      case "warning": return "bg-amber-500/10 border-amber-500/30 text-amber-400"
      case "info": return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
      default: return "bg-gray-500/10 border-gray-500/30 text-gray-400"
    }
  }
  
  const getAlertLabel = (type: string) => {
    switch (type) {
      case "critical": return "Crítica"
      case "warning": return "Advertencia"
      case "info": return "Informativa"
      default: return "Alerta"
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-black/40 border border-amber-400/30 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Panel de Alertas
        </h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-gray-400">No hay alertas activas</p>
          <p className="text-gray-500 text-sm mt-1">Todos los sistemas funcionan correctamente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/40 border border-amber-400/30 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Panel de Alertas
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{alerts.length} alertas</span>
          {alerts.filter(a => a.type === "critical").length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {alerts.filter(a => a.type === "critical").length} críticas
            </span>
          )}
        </div>
      </div>
      
      {/* Resumen de Alertas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">
            {alerts.filter(a => a.type === "critical").length}
          </p>
          <p className="text-xs text-red-400/70">Críticas</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {alerts.filter(a => a.type === "warning").length}
          </p>
          <p className="text-xs text-amber-400/70">Advertencias</p>
        </div>
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-cyan-400">
            {alerts.filter(a => a.type === "info").length}
          </p>
          <p className="text-xs text-cyan-400/70">Informativas</p>
        </div>
      </div>
      
      {/* Lista de Alertas */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border ${getAlertColors(alert.type)} transition hover:opacity-90`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      alert.type === "critical" ? "bg-red-500 text-white" :
                      alert.type === "warning" ? "bg-amber-500 text-black" :
                      "bg-cyan-500 text-white"
                    }`}>
                      {getAlertLabel(alert.type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <h4 className="font-medium text-white mb-1">{alert.title}</h4>
                <p className="text-sm opacity-80 mb-2">{alert.message}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Artefacto: <span className="text-amber-300">{alert.artefactoNombre}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {alert.type === "critical" && (
                      <button
                        onClick={() => toggleArtefactoEstado(alert.artefactoId)}
                        className="px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-300 rounded text-xs hover:bg-red-500/30 transition"
                      >
                        Desactivar
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/edit/${alert.artefactoId}`)}
                      className="p-1.5 bg-amber-400/10 border border-amber-400/30 rounded hover:bg-amber-400/20 transition"
                      title="Ver artefacto"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPanel
