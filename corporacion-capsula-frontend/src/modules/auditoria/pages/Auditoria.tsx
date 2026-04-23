/**
 * 🚧 MÓDULO EN PROGRESO - DESARROLLADO POR CARLOS
 * 
 * 📋 AUDITORÍA DE ARTEFACTOS - FRONTEND ONLY
 * 
 * Estructura de tabla: id_registro, nombre_tabla, accion, id_usuario, id_artefacto, valor_anterior, valor_nuevo, fecha_operacion
 * 
 * ✅ YA IMPLEMENTADO:
 * - mockAuditLogs con datos de ejemplo (solo tabla "artefactos")
 * - Tarjetas de estadísticas (stats cards visuales)
 * - Estructura de tabla con columnas: Fecha, Usuario, Acción, Tabla, Cambios
 * - Estilo púrpura/cyan de Capsule Corp
 * - Badges de colores por acción (CREATE, UPDATE, DELETE)
 * - Muestra valor_anterior y valor_nuevo en la descripción
 * 
 * 🔧 POR IMPLEMENTAR (SOLO FRONTEND):
 * - Filtros funcionales por fecha, usuario, acción
 * - Paginación real
 * - Exportar a CSV
 * - Gráficos con recharts
 * 
 * 💡 NOTA: Solo para auditoría de artefactos. NO requiere backend.
 * 
 * 📂 Archivo: src/modules/auditoria/pages/Auditoria.tsx
 */

import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { 
  Bell, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Info,
  Code,
  Database,
  Server
} from "lucide-react"

// Datos de ejemplo para demostración// ===== MOCK DATA PARA AUDITORÍA DE ARTEFACTOS (Frontend Only) =====
// Estructura de tabla: id_registro, nombre_tabla, accion, id_usuario, id_artefacto, valor_anterior, valor_nuevo, fecha_operacion
const mockAuditLogs = [
  {
    id_registro: 1,
    nombre_tabla: "artefactos",
    accion: "CREATE",
    id_usuario: 101,
    id_artefacto: 1,
    valor_anterior: null,
    valor_nuevo: '{"nombre": "Capsule Corp #1", "categoria": "tecnologia"}',
    fecha_operacion: "2026-04-21 15:30:22"
  },
  {
    id_registro: 2,
    nombre_tabla: "artefactos",
    accion: "UPDATE",
    id_usuario: 102,
    id_artefacto: 5,
    valor_anterior: '{"nivelPeligrosidad": 3}',
    valor_nuevo: '{"nivelPeligrosidad": 6}',
    fecha_operacion: "2026-04-21 14:15:10"
  },
  {
    id_registro: 3,
    nombre_tabla: "artefactos",
    accion: "UPDATE",
    id_usuario: 103,
    id_artefacto: 12,
    valor_anterior: '{"estado": "activo"}',
    valor_nuevo: '{"estado": "obsoleto"}',
    fecha_operacion: "2026-04-21 11:22:45"
  },
  {
    id_registro: 4,
    nombre_tabla: "artefactos",
    accion: "DELETE",
    id_usuario: 101,
    id_artefacto: 8,
    valor_anterior: '{"nombre": "Nube Voladora"}',
    valor_nuevo: null,
    fecha_operacion: "2026-04-20 09:45:33"
  }
]

const Auditoria = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()
  
  // Estadísticas basadas en artefactos actuales (frontend)
  const stats = useMemo(() => {
    return {
      totalEventos: mockAuditLogs.length + artefactos.length,
      eventosHoy: mockAuditLogs.filter(l => l.fecha_operacion.includes("2026-04-21")).length,
      usuariosActivos: new Set(mockAuditLogs.map(l => l.id_usuario)).size,
      accionesCriticas: mockAuditLogs.filter(l => l.accion === "DELETE").length
    }
  }, [artefactos])
  
  const getActionColor = (accion: string) => {
    switch (accion) {
      case "CREATE": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "UPDATE": return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      case "DELETE": return "bg-red-500/20 text-red-400 border-red-500/50"
      case "LOGIN": return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "LOGOUT": return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
    }
  }
  
  const getActionIcon = (accion: string) => {
    switch (accion) {
      case "CREATE": return <CheckCircle2 className="w-4 h-4" />
      case "UPDATE": return <FileText className="w-4 h-4" />
      case "DELETE": return <AlertTriangle className="w-4 h-4" />
      case "LOGIN": return <User className="w-4 h-4" />
      case "LOGOUT": return <Clock className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate("/admin")}
            className="text-purple-400 hover:text-purple-300 mb-2 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Admin
          </button>
          <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Sistema de Auditoría
          </h1>
          <p className="text-gray-400 mt-1">Responsable: Carlos | Estado: En desarrollo</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition">
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Eventos</p>
          <p className="text-2xl font-bold text-purple-400">{stats.totalEventos}</p>
        </div>
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Eventos Hoy</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.eventosHoy}</p>
        </div>
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Usuarios Activos</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.usuariosActivos}</p>
        </div>
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Acciones Críticas</p>
          <p className="text-2xl font-bold text-red-400">{stats.accionesCriticas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar en logs..."
                className="w-full bg-black/40 border border-purple-500/30 rounded-lg py-2 pl-10 pr-4 text-white placeholder-purple-400/30"
              />
            </div>
          </div>
          <select className="bg-black/40 border border-purple-500/30 rounded-lg py-2 px-4 text-white">
            <option>Todas las acciones</option>
            <option>CREATE</option>
            <option>UPDATE</option>
            <option>DELETE</option>
          </select>
          <select className="bg-black/40 border border-purple-500/30 rounded-lg py-2 px-4 text-white">
            <option>Todas las tablas</option>
            <option>artefactos</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition">
            <Calendar className="w-4 h-4" />
            Rango de fechas
          </button>
        </div>
      </div>

      {/* Tabla de Logs */}
      <div className="bg-black/40 border border-purple-500/30 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-500/10 border-b border-purple-500/30">
            <tr>
              <th className="py-3 px-4 text-left text-purple-400 text-sm">Hora</th>
              <th className="py-3 px-4 text-left text-purple-400 text-sm">Usuario</th>
              <th className="py-3 px-4 text-left text-purple-400 text-sm">Acción</th>
              <th className="py-3 px-4 text-left text-purple-400 text-sm">Módulo</th>
              <th className="py-3 px-4 text-left text-purple-400 text-sm">Descripción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {mockAuditLogs.map((log) => (
              <tr key={log.id_registro} className="hover:bg-purple-500/5 transition">
                <td className="py-3 px-4 text-gray-400 text-sm font-mono">{log.fecha_operacion}</td>
                <td className="py-3 px-4 text-cyan-300">Usuario #{log.id_usuario}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${getActionColor(log.accion)}`}>
                    {getActionIcon(log.accion)}
                    {log.accion}
                  </span>
                </td>
                <td className="py-3 px-4 text-purple-300">{log.nombre_tabla}</td>
                <td className="py-3 px-4 text-gray-300 text-xs">
                  Artefacto #{log.id_artefacto}
                  {log.valor_anterior && <span className="block text-amber-400/70 mt-1">Antes: {log.valor_anterior}</span>}
                  {log.valor_nuevo && <span className="block text-emerald-400/70">Después: {log.valor_nuevo}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EJEMPLO VISUAL: Gráfico de Actividad */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Ejemplo: Eventos por Día (Mock)
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Así se verá el gráfico de actividad cuando se conecte al backend real:
          </p>
          <div className="space-y-3">
            {[
              { dia: "Lunes", eventos: 24, color: "bg-emerald-400" },
              { dia: "Martes", eventos: 18, color: "bg-cyan-400" },
              { dia: "Miércoles", eventos: 32, color: "bg-purple-400" },
              { dia: "Jueves", eventos: 15, color: "bg-amber-400" },
              { dia: "Viernes", eventos: 28, color: "bg-pink-400" },
            ].map((item) => (
              <div key={item.dia} className="flex items-center gap-3">
                <span className="text-gray-400 text-sm w-20">{item.dia}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-full flex items-center justify-end pr-2`}
                    style={{ width: `${(item.eventos / 35) * 100}%` }}
                  >
                    <span className="text-xs text-black font-medium">{item.eventos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Ejemplo: Acciones por Tipo (Mock)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { tipo: "CREATE", count: 45, color: "text-emerald-400", bg: "bg-emerald-400/20" },
              { tipo: "UPDATE", count: 32, color: "text-amber-400", bg: "bg-amber-400/20" },
              { tipo: "DELETE", count: 8, color: "text-red-400", bg: "bg-red-400/20" },
            ].map((item) => (
              <div key={item.tipo} className={`${item.bg} border border-gray-700 rounded-lg p-3`}>
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-gray-400 text-xs">{item.tipo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Módulo en Progreso - Carlos */}
      <div className="mt-8 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
            <Code className="w-5 h-5" />
            🚧 Módulo en Progreso - Carlos
          </h3>
          <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
            Frontend Only
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-medium text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              ✅ Ya implementado
            </h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>• mockAuditLogs con datos de ejemplo</li>
              <li>• Tarjetas de estadísticas (stats cards)</li>
              <li>• Estructura de tabla completa</li>
              <li>• Diseño púrpura/cyan (estilo Capsule Corp)</li>
              <li>• Badges de colores por tipo de acción</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-amber-400 font-medium text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              🔧 Por implementar
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• Filtros funcionales (fecha, usuario, acción)</li>
              <li>• Paginación real (cambiar de página)</li>
              <li>• Exportar a CSV (descargar archivo)</li>
              <li>• Gráficos con recharts (reemplazar mock)</li>
              <li>• Vista detalle expandible por fila</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg">
          <p className="text-cyan-400 text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            <strong>Referencia:</strong> Ver <code className="text-purple-400">AuditModule.tsx</code> en admin/components
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auditoria
