/**
 * 📋 INSTRUCCIONES PARA CARLOS - MÓDULO DE AUDITORÍA
 * 
 * Historia de Usuario: HU-?? - Auditoría del Sistema
 * 
 * 🎯 OBJETIVO:
 * Crear el sistema de auditoría completo para registrar y consultar
 * todas las acciones realizadas en el sistema.
 * 
 * 🔧 FUNCIONALIDADES REQUERIDAS:
 * 
 * 1. REGISTRO DE EVENTOS (requiere backend):
 *    - Creación de artefactos (quién, cuándo, qué datos)
 *    - Edición de artefactos (cambios realizados)
 *    - Activación/Desactivación de artefactos
 *    - Login/Logout de usuarios
 *    - Creación de usuarios
 *    - Cambios de permisos/roles
 * 
 * 2. VISUALIZACIÓN DE LOGS:
 *    - Tabla cronológica de eventos
 *    - Filtros por: fecha, usuario, tipo de acción, módulo
 *    - Detalle expandable de cada evento
 *    - Paginación (10/25/50 eventos por página)
 * 
 * 3. EXPORTACIÓN:
 *    - Exportar a CSV
 *    - Exportar a PDF (con logo y formato institucional)
 *    - Rango de fechas seleccionable
 * 
 * 4. ESTADÍSTICAS:
 *    - Eventos por día/semana/mes
 *    - Usuarios más activos
 *    - Módulos más utilizados
 * 
 * 📂 RUTA: /auditoria
 * 
 * 🎨 DISEÑO:
 * - Tema oscuro con colores púrpura/cyan
 * - Estilo de logs de sistema (tipo terminal o tabla formal)
 * - Badges de colores según tipo de acción:
 *   - CREATE: verde
 *   - UPDATE: amarillo
 *   - DELETE: rojo
 *   - LOGIN: azul
 *   - LOGOUT: gris
 * 
 * 📡 BACKEND NECESARIO:
 * - Tabla `audit_logs` en PostgreSQL:
 *   id, user_id, user_name, action_type, module, 
 *   description, details (JSON), ip_address, created_at
 * - Endpoints:
 *   GET /api/v1/audit-logs (con filtros)
 *   POST /api/v1/audit-logs (para registrar)
 * 
 * 💡 IMPLEMENTACIÓN SUGERIDA:
 * Fase 1 (Frontend mock): Crear UI con datos de ejemplo
 * Fase 2 (Backend): Crear tabla y endpoints
 * Fase 3 (Integración): Conectar todo y capturar eventos reales
 * 
 * Estado: 🚧 ASIGNADO A CARLOS
 * Prioridad: Media
 * Fecha límite sugerida: Fin de semana
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

// Datos de ejemplo para demostración (reemplazar con backend real)
const mockAuditLogs = [
  {
    id: 1,
    user: "Dr. Brief",
    action: "CREATE",
    module: "Artefactos",
    description: "Creó artefacto 'Capsule Corp #1'",
    timestamp: "2026-04-21 15:30:22",
    details: { artefactoId: 1, nombre: "Capsule Corp #1" }
  },
  {
    id: 2,
    user: "Bulma",
    action: "UPDATE",
    module: "Artefactos",
    description: "Editó artefacto 'Radar del Dragón'",
    timestamp: "2026-04-21 14:15:10",
    details: { artefactoId: 5, campo: "descripcion" }
  },
  {
    id: 3,
    user: "Admin",
    action: "DELETE",
    module: "Usuarios",
    description: "Desactivó usuario 'test_user'",
    timestamp: "2026-04-21 12:00:00",
    details: { userId: 99, razon: "Inactividad" }
  },
  {
    id: 4,
    user: "Trunks",
    action: "LOGIN",
    module: "Auth",
    description: "Inicio de sesión exitoso",
    timestamp: "2026-04-21 09:45:33",
    details: { ip: "192.168.1.1", dispositivo: "Chrome/Windows" }
  }
]

const Auditoria = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()
  
  // Estadísticas basadas en artefactos actuales (frontend)
  const stats = useMemo(() => {
    return {
      totalEventos: mockAuditLogs.length + artefactos.length,
      eventosHoy: mockAuditLogs.filter(l => l.timestamp.includes("2026-04-21")).length,
      usuariosActivos: new Set(mockAuditLogs.map(l => l.user)).size,
      accionesCriticas: mockAuditLogs.filter(l => l.action === "DELETE").length
    }
  }, [artefactos])
  
  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "UPDATE": return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      case "DELETE": return "bg-red-500/20 text-red-400 border-red-500/50"
      case "LOGIN": return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "LOGOUT": return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
    }
  }
  
  const getActionIcon = (action: string) => {
    switch (action) {
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
            <option>LOGIN</option>
          </select>
          <select className="bg-black/40 border border-purple-500/30 rounded-lg py-2 px-4 text-white">
            <option>Todos los módulos</option>
            <option>Artefactos</option>
            <option>Usuarios</option>
            <option>Auth</option>
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
              <tr key={log.id} className="hover:bg-purple-500/5 transition">
                <td className="py-3 px-4 text-gray-400 text-sm font-mono">{log.timestamp}</td>
                <td className="py-3 px-4 text-cyan-300">{log.user}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 text-purple-300">{log.module}</td>
                <td className="py-3 px-4 text-gray-300">{log.description}</td>
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
              { tipo: "LOGIN", count: 67, color: "text-blue-400", bg: "bg-blue-400/20" },
            ].map((item) => (
              <div key={item.tipo} className={`${item.bg} border border-gray-700 rounded-lg p-3`}>
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-gray-400 text-xs">{item.tipo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ESTRUCTURA DE BASE DE DATOS EJEMPLO */}
      <div className="mt-6 bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Estructura de Base de Datos (Ejemplo)
        </h3>
        <div className="bg-black/60 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <p className="text-green-400 mb-2">-- Tabla audit_logs</p>
          <p className="text-gray-300">
            <span className="text-purple-400">CREATE TABLE</span> audit_logs (
          </p>
          <p className="text-gray-300 pl-4">
            id <span className="text-cyan-400">SERIAL PRIMARY KEY</span>,
          </p>
          <p className="text-gray-300 pl-4">
            user_id <span className="text-cyan-400">INTEGER REFERENCES</span> usuarios(id),
          </p>
          <p className="text-gray-300 pl-4">
            user_name <span className="text-cyan-400">VARCHAR(100)</span>,
          </p>
          <p className="text-gray-300 pl-4">
            action_type <span className="text-cyan-400">VARCHAR(50)</span>, <span className="text-gray-500">-- CREATE, UPDATE, DELETE, LOGIN</span>
          </p>
          <p className="text-gray-300 pl-4">
            module <span className="text-cyan-400">VARCHAR(50)</span>, <span className="text-gray-500">-- Artefactos, Usuarios, Auth</span>
          </p>
          <p className="text-gray-300 pl-4">
            description <span className="text-cyan-400">TEXT</span>,
          </p>
          <p className="text-gray-300 pl-4">
            details <span className="text-cyan-400">JSONB</span>, <span className="text-gray-500">-- Datos adicionales</span>
          </p>
          <p className="text-gray-300 pl-4">
            ip_address <span className="text-cyan-400">INET</span>,
          </p>
          <p className="text-gray-300 pl-4">
            created_at <span className="text-cyan-400">TIMESTAMP DEFAULT NOW()</span>
          </p>
          <p className="text-gray-300">);</p>
        </div>
      </div>

      {/* Instrucciones para Carlos */}
      <div className="mt-8 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" />
          📋 Tareas para Carlos - Implementación
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-medium text-sm">Fase 1: Backend</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Crear tabla <code className="text-cyan-400">audit_logs</code> en PostgreSQL</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Crear modelo <code className="text-cyan-400">AuditLog</code> en backend</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Implementar <code className="text-cyan-400">GET /api/v1/audit-logs</code></span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Implementar filtros (fecha, usuario, acción, módulo)</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-medium text-sm">Fase 2: Frontend</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Conectar con endpoint real (reemplazar mock data)</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Hacer funcionales los filtros de la UI</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Implementar exportación a CSV real</span>
              </li>
              <li className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-purple-500" />
                <span>Agregar paginación</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg">
          <p className="text-cyan-400 text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            <strong>Tip:</strong> Usa el middleware en Express para capturar automáticamente las acciones en cada endpoint
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auditoria
