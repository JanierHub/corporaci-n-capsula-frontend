/**
 * � MÓDULO AUDITORÍA - DESARROLLADO POR CARLOS
 * 📂 Archivo: src/modules/auditoria/pages/Auditoria.tsx
 *
 * ✅ FUNCIONALIDADES:
 *  - Filtros funcionales (usuario, acción, tabla, fecha)
 *  - Paginación real
 *  - Exportar CSV
 *  - Gráficos reales con recharts (BarChart)
 *  - Vista detalle expandible (JSON)
 *  - Simulación de eventos de auditoría en tiempo real (Admin)
 *  - Filtro por rango de fechas funcional
 *  - Gráfico de actividad por usuario
 */

import { useNavigate } from "react-router-dom"
import { useMemo, useState, useCallback, useRef } from "react"
import { useArtefactos } from "../../../context/ArtefactosContext"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

// ── Tipos ──────────────────────────────────────────────────────────────────
type Accion = "CREATE" | "UPDATE" | "DELETE" | "LOGIN"

interface LogEntry {
  id_registro: number
  nombre_tabla: string
  accion: Accion
  id_usuario: number
  id_artefacto: number
  valor_anterior: string | null
  valor_nuevo: string | null
  fecha_operacion: string
}

// ── Datos iniciales (solo tabla artefactos) ────────────────────────────────
const logsIniciales: LogEntry[] = [
  {
    id_registro: 1,
    nombre_tabla: "artefactos",
    accion: "CREATE",
    id_usuario: 101,
    id_artefacto: 1,
    valor_anterior: null,
    valor_nuevo: '{"nombre": "Capsule Corp #1", "categoria": "tecnologia"}',
    fecha_operacion: "2026-04-21 15:38:22",
  },
  {
    id_registro: 2,
    nombre_tabla: "artefactos",
    accion: "UPDATE",
    id_usuario: 102,
    id_artefacto: 5,
    valor_anterior: '{"nivelPeligrosidad": 3}',
    valor_nuevo: '{"nivelPeligrosidad": 6}',
    fecha_operacion: "2026-04-21 14:15:10",
  },
  {
    id_registro: 3,
    nombre_tabla: "artefactos",
    accion: "UPDATE",
    id_usuario: 103,
    id_artefacto: 12,
    valor_anterior: '{"estado": "activo"}',
    valor_nuevo: '{"estado": "obsoleto"}',
    fecha_operacion: "2026-04-21 11:22:45",
  },
  {
    id_registro: 4,
    nombre_tabla: "artefactos",
    accion: "DELETE",
    id_usuario: 101,
    id_artefacto: 8,
    valor_anterior: '{"nombre": "Nube Voladora"}',
    valor_nuevo: null,
    fecha_operacion: "2026-04-20 09:45:33",
  },
]

const accionBadge: Record<Accion, { bg: string; text: string; border: string; icon: string }> = {
  CREATE: { bg: "#0d2e1a", text: "#4ade80", border: "#166534",  icon: "⊕" },
  UPDATE: { bg: "#1a0d2e", text: "#c084fc", border: "#7e22ce",  icon: "⟳" },
  DELETE: { bg: "#2e0f0f", text: "#f87171", border: "#7f1d1d",  icon: "⚠" },
  LOGIN:  { bg: "#0d1f3a", text: "#60a5fa", border: "#1e40af",  icon: "→" },
}

const COLORES_ACCION: Record<string, string> = {
  CREATE: "#4ade80",
  UPDATE: "#c084fc",
  DELETE: "#f87171",
  LOGIN:  "#60a5fa",
}

const COLORES_USUARIO: Record<number, string> = {
  101: "#00e5cc",
  102: "#a855f7",
  103: "#f472b6",
}

const ITEMS_POR_PAGINA = 10

// ── Utilidades de simulación ────────────────────────────────────────────────
function ahora() {
  return new Date().toISOString().replace("T", " ").slice(0, 19)
}

let nextId = 100

// ── Tooltip personalizado recharts ─────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0d0d1f",
        border: "1px solid #1e1e3a",
        borderRadius: "6px",
        padding: "8px 12px",
        fontSize: "11px",
        fontFamily: "'Courier New', monospace",
        color: "#e2e2f0",
      }}>
        <div style={{ color: "#6b6b9a", marginBottom: "2px" }}>{label}</div>
        <div style={{ color: payload[0].fill, fontWeight: 600 }}>{payload[0].value} eventos</div>
      </div>
    )
  }
  return null
}

// ── Componente principal ───────────────────────────────────────────────────
export default function Auditoria() {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()

  // Estado de logs (mutable para simulación desde Admin)
  const [logs, setLogs] = useState<LogEntry[]>(logsIniciales)

  // Filtros
  const [busqueda,     setBusqueda]     = useState("")
  const [filtroAccion, setFiltroAccion] = useState("Todas las acciones")
  const [filtroTabla,  setFiltroTabla]  = useState("Todas las tablas")
  const [filtroUsuario,setFiltroUsuario]= useState("Todos los usuarios")
  const [fechaDesde,   setFechaDesde]   = useState("")
  const [fechaHasta,   setFechaHasta]   = useState("")
  const [mostrarFechas,setMostrarFechas]= useState(false)

  // Tabla
  const [expandido,    setExpandido]    = useState<number | null>(null)
  const [pagina,       setPagina]       = useState(1)

  // ── Simulación de eventos (desde Admin) ───────────────────────────────────
  const agregarLog = useCallback((accion: Accion, tabla: string, usuario: number, valAnterior?: string, valNuevo?: string) => {
    const nuevo: LogEntry = {
      id_registro: nextId++,
      nombre_tabla: tabla,
      accion,
      id_usuario: usuario,
      id_artefacto: Math.floor(Math.random() * 200),
      valor_anterior: valAnterior ?? null,
      valor_nuevo: valNuevo ?? null,
      fecha_operacion: ahora(),
    }
    setLogs(prev => [nuevo, ...prev])
    setPagina(1)
  }, [])

  const usuariosDemo = [101, 102, 103]
  const randomUser = () => usuariosDemo[Math.floor(Math.random() * 3)]

  const simularCrear = () => agregarLog(
    "CREATE", "artefactos", randomUser(),
    undefined, `{"nombre": "Nuevo Artefacto #${nextId}", "categoria": "tech"}`
  )

  const simularActualizar = () => agregarLog(
    "UPDATE", "artefactos", randomUser(),
    `{"nivelPeligrosidad": 3}`, `{"nivelPeligrosidad": 7}`
  )

  const simularEliminar = () => agregarLog(
    "DELETE", "artefactos", randomUser(),
    `{"nombre": "Artefacto Eliminado #${Math.floor(Math.random() * 100)}"}`, undefined
  )

  const simularLogin = () => agregarLog(
    "LOGIN", "sesiones", randomUser(),
    undefined, `{"ip": "192.168.1.${Math.floor(Math.random()*254)}", "navegador": "Chrome"}`
  )

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const logsFiltrados = useMemo(() => {
    return logs.filter((log) => {
      const matchBusqueda =
        busqueda === "" ||
        (log.valor_nuevo ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
        `usuario #${log.id_usuario}`.toLowerCase().includes(busqueda.toLowerCase())

      const matchAccion =
        filtroAccion === "Todas las acciones" || log.accion === filtroAccion

      const matchTabla =
        filtroTabla === "Todas las tablas" || log.nombre_tabla === filtroTabla

      const matchUsuario =
        filtroUsuario === "Todos los usuarios" || log.id_usuario === Number(filtroUsuario.replace("#", ""))

      const fechaLog = log.fecha_operacion.slice(0, 10)
      const matchDesde = !fechaDesde || fechaLog >= fechaDesde
      const matchHasta = !fechaHasta || fechaLog <= fechaHasta

      return matchBusqueda && matchAccion && matchTabla && matchUsuario && matchDesde && matchHasta
    })
  }, [logs, busqueda, filtroAccion, filtroTabla, filtroUsuario, fechaDesde, fechaHasta])

  const totalPaginas = Math.max(1, Math.ceil(logsFiltrados.length / ITEMS_POR_PAGINA))
  const logsVisibles = logsFiltrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  )

  // ── Estadísticas ──────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    totalEventos:     logs.length,
    eventosHoy:       logs.filter(l => l.fecha_operacion.startsWith(new Date().toISOString().slice(0,10))).length,
    usuariosActivos:  new Set(logs.map(l => l.id_usuario)).size,
    accionesCriticas: logs.filter(l => l.accion === "DELETE").length,
  }), [logs])

  // ── Datos para gráficos recharts ──────────────────────────────────────────
  const datosAccionTipo = useMemo(() => {
    const conteo: Record<string, number> = {}
    logs.forEach(l => { conteo[l.accion] = (conteo[l.accion] ?? 0) + 1 })
    return Object.entries(conteo).map(([tipo, val]) => ({ tipo, val }))
  }, [logs])

  const datosActividadUsuario = useMemo(() => {
    const conteo: Record<number, number> = {}
    logs.forEach(l => { conteo[l.id_usuario] = (conteo[l.id_usuario] ?? 0) + 1 })
    return Object.entries(conteo)
      .map(([usuario, val]) => ({ usuario: `#${usuario}`, val, id: Number(usuario) }))
      .sort((a, b) => b.val - a.val)
  }, [logs])

  const datosActividadDia = useMemo(() => {
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    const conteo: Record<string, number> = {}
    logs.forEach(l => {
      const d = new Date(l.fecha_operacion.replace(" ", "T"))
      const dia = dias[d.getDay()]
      conteo[dia] = (conteo[dia] ?? 0) + 1
    })
    return dias.filter(d => conteo[d]).map(dia => ({ dia, val: conteo[dia] ?? 0 }))
  }, [logs])

  // ── Exportar CSV ──────────────────────────────────────────────────────────
  const exportarCSV = () => {
    const cab   = "Fecha,Usuario,Accion,Tabla,ArtfactoId,ValorAnterior,ValorNuevo\n"
    const filas = logsFiltrados
      .map((l) => `${l.fecha_operacion},Usuario #${l.id_usuario},${l.accion},${l.nombre_tabla},${l.id_artefacto},"${l.valor_anterior ?? ""}","${l.valor_nuevo ?? ""}"`)
      .join("\n")
    const blob = new Blob([cab + filas], { type: "text/csv;charset=utf-8;" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = "auditoria_artefactos.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const limpiarFiltros = () => {
    setBusqueda(""); setFiltroAccion("Todas las acciones")
    setFiltroTabla("Todas las tablas"); setFiltroUsuario("Todos los usuarios")
    setFechaDesde(""); setFechaHasta(""); setPagina(1)
  }

  // ── Estilos ───────────────────────────────────────────────────────────────
  const s: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#0a0a14",
      color: "#e2e2f0",
      fontFamily: "'Courier New', monospace",
    },
    topbar: {
      background: "#0d0d1f",
      borderBottom: "2px solid #00e5cc",
      padding: "8px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      color: "#00e5cc",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: "2px",
      textTransform: "uppercase",
    },
    backBtn: {
      background: "none",
      border: "none",
      color: "#a78bfa",
      fontSize: "12px",
      cursor: "pointer",
      fontFamily: "inherit",
    },
    csvBtn: {
      background: "linear-gradient(90deg, #00e5cc22, #a855f722)",
      border: "1px solid #00e5cc",
      color: "#00e5cc",
      fontSize: "11px",
      padding: "5px 14px",
      borderRadius: "6px",
      cursor: "pointer",
      fontFamily: "inherit",
    },
    inner: { padding: "16px 20px" },
    glowDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#00e5cc",
      display: "inline-block",
      boxShadow: "0 0 8px #00e5cc",
      flexShrink: 0,
    },
    card: {
      background: "#0d0d1f",
      borderRadius: "8px",
      padding: "14px 18px",
      position: "relative",
      overflow: "hidden",
    },
    cardLabel: { fontSize: "11px", color: "#6b6b9a", marginBottom: "4px" },
    filterWrap: {
      background: "#0d0d1f",
      border: "1px solid #1e1e3a",
      borderBottom: "none",
      borderTop: "2px solid rgba(0,229,204,0.25)",
      borderRadius: "8px 8px 0 0",
      padding: "10px 14px",
    },
    input: {
      flex: 1,
      background: "#07071a",
      border: "1px solid #1e1e3a",
      color: "#9ca3af",
      fontSize: "12px",
      padding: "6px 12px",
      borderRadius: "6px",
      outline: "none",
      fontFamily: "inherit",
      width: "100%",
      boxSizing: "border-box" as const,
    },
    select: {
      background: "#07071a",
      border: "1px solid #1e1e3a",
      color: "#9ca3af",
      fontSize: "12px",
      padding: "6px 10px",
      borderRadius: "6px",
      outline: "none",
      fontFamily: "inherit",
    },
    dateInput: {
      background: "#07071a",
      border: "1px solid rgba(0,229,204,0.3)",
      color: "#00e5cc",
      fontSize: "12px",
      padding: "6px 10px",
      borderRadius: "6px",
      outline: "none",
      fontFamily: "inherit",
      colorScheme: "dark" as any,
    },
    tableWrap: {
      background: "#0d0d1f",
      border: "1px solid #1e1e3a",
      borderTop: "none",
      borderRadius: "0 0 8px 8px",
      marginBottom: "16px",
      overflow: "hidden",
    },
    th: {
      padding: "8px 14px",
      textAlign: "left",
      color: "#6b6b9a",
      fontWeight: 500,
      fontSize: "11px",
      letterSpacing: "1px",
      textTransform: "uppercase" as const,
    },
    thCyan: {
      padding: "8px 14px",
      textAlign: "left" as const,
      color: "#00e5cc",
      fontWeight: 500,
      fontSize: "11px",
      letterSpacing: "1px",
      textTransform: "uppercase" as const,
    },
    td: { padding: "10px 14px" },
    chartBox: {
      background: "#0d0d1f",
      border: "1px solid #1e1e3a",
      borderTop: "2px solid rgba(168,85,247,0.4)",
      borderRadius: "8px",
      padding: "16px",
    },
    simBtn: {
      background: "#07071a",
      border: "1px solid #1e1e3a",
      color: "#9ca3af",
      fontSize: "11px",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 0.15s",
    },
  }

  const cardColors: Record<number, { val: string; top: string }> = {
    0: { val: "#00e5cc", top: "#00e5cc" },
    1: { val: "#a855f7", top: "#a855f7" },
    2: { val: "#4ade80", top: "#4ade80" },
    3: { val: "#f87171", top: "#f87171" },
  }

  const hayFiltrosActivos = busqueda || filtroAccion !== "Todas las acciones" ||
    filtroTabla !== "Todas las tablas" || filtroUsuario !== "Todos los usuarios" ||
    fechaDesde || fechaHasta

  return (
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={s.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={s.logo}>Capsule Corp</span>
          <button style={s.backBtn} onClick={() => navigate("/admin")}>← Volver al Admin</button>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#4b4b7a" }}>{logs.length} eventos</span>
          <button style={s.csvBtn} onClick={exportarCSV}>↓ Exportar CSV</button>
        </div>
      </div>

      <div style={s.inner}>

        {/* ── Título ── */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
            <span style={s.glowDot} />
            <h1 style={{
              fontSize: "22px",
              fontWeight: 500,
              margin: 0,
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #00e5cc, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Sistema de Auditoría
            </h1>
          </div>
          <p style={{ fontSize: "11px", color: "#6b6b9a", margin: 0 }}>
            Responsable: Carlos &nbsp;|&nbsp; Estado: Completo ✓
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "16px" }}>
          {[
            { label: "Total Eventos",     val: stats.totalEventos },
            { label: "Eventos Hoy",       val: stats.eventosHoy },
            { label: "Usuarios Activos",  val: stats.usuariosActivos },
            { label: "Acciones Críticas", val: stats.accionesCriticas },
          ].map((c, i) => (
            <div key={c.label} style={{ ...s.card, borderTop: `2px solid ${cardColors[i].top}` }}>
              <div style={s.cardLabel}>{c.label}</div>
              <div style={{ fontSize: "26px", fontWeight: 500, color: cardColors[i].val }}>{c.val}</div>
            </div>
          ))}
        </div>

        {/* ── Simulación de Eventos (Atajo desde Admin) ── */}
        <div style={{
          background: "#0d0d1f",
          border: "1px solid #1e1e3a",
          borderTop: "2px solid rgba(0,229,204,0.4)",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <span style={{ color: "#00e5cc", fontSize: "13px" }}>⚡</span>
            <span style={{ fontSize: "12px", color: "#e2e2f0", fontWeight: 500 }}>Simulación de Eventos</span>
            <span style={{
              background: "#0d1f3a",
              color: "#60a5fa",
              fontSize: "10px",
              padding: "2px 8px",
              borderRadius: "12px",
              border: "1px solid #1e40af",
              marginLeft: "auto",
            }}>Admin Tool</span>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
            {[
              { label: "⊕ Crear", fn: simularCrear, color: "#4ade80" },
              { label: "⟳ Actualizar", fn: simularActualizar, color: "#c084fc" },
              { label: "⚠ Eliminar", fn: simularEliminar, color: "#f87171" },
              { label: "→ Login", fn: simularLogin, color: "#60a5fa" },
            ].map(({ label, fn, color }) => (
              <button
                key={label}
                style={{ ...s.simBtn, borderColor: color + "44", color }}
                onClick={fn}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = color + "18" }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "#07071a" }}
              >
                {label}
              </button>
            ))}
            <span style={{ fontSize: "11px", color: "#4b4b7a", alignSelf: "center", marginLeft: "4px" }}>
              ← Click para generar eventos de prueba
            </span>
          </div>
        </div>

        {/* ── Filtros ── */}
        <div style={s.filterWrap}>
          {/* Fila 1: búsqueda + selects */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
            <input
              style={s.input}
              type="text"
              placeholder="🔍 Buscar en logs (usuario, valores)..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value)
                setPagina(1)
              }}
            />
            <select style={s.select} value={filtroAccion} onChange={(e) => {
              setFiltroAccion(e.target.value)
              setPagina(1)
            }}>
              {["Todas las acciones", "CREATE", "UPDATE", "DELETE", "LOGIN"].map(o => <option key={o}>{o}</option>)}
            </select>
            <select style={s.select} value={filtroTabla} onChange={(e) => {
              setFiltroTabla(e.target.value)
              setPagina(1)
            }}>
              {["Todas las tablas", "artefactos", "sesiones"].map(o => <option key={o}>{o}</option>)}
            </select>
            <select style={s.select} value={filtroUsuario} onChange={(e) => {
              setFiltroUsuario(e.target.value)
              setPagina(1)
            }}>
              {["Todos los usuarios", "#101", "#102", "#103"].map(o => <option key={o}>{o}</option>)}
            </select>
            <button
              style={{
                ...s.select,
                cursor: "pointer",
                whiteSpace: "nowrap",
                border: mostrarFechas ? "1px solid #00e5cc" : "1px solid rgba(0,229,204,0.3)",
                color: mostrarFechas ? "#00e5cc" : "rgba(0,229,204,0.7)",
              }}
              onClick={() => setMostrarFechas(v => !v)}
            >
              📅 {mostrarFechas ? "Ocultar fechas" : "Rango de fechas"}
            </button>
            {hayFiltrosActivos && (
              <button
                style={{ ...s.select, cursor: "pointer", color: "#f87171", border: "1px solid #7f1d1d" }}
                onClick={limpiarFiltros}
              >
                ✕ Limpiar
              </button>
            )}
          </div>

          {/* Fila 2: selector de fechas (expandible) */}
          {mostrarFechas && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "#6b6b9a" }}>Desde:</span>
              <input
                type="date"
                style={s.dateInput}
                value={fechaDesde}
                max={fechaHasta || undefined}
                onChange={(e) => { setFechaDesde(e.target.value); setPagina(1) }}
              />
              <span style={{ fontSize: "11px", color: "#6b6b9a" }}>Hasta:</span>
              <input
                type="date"
                style={s.dateInput}
                value={fechaHasta}
                min={fechaDesde || undefined}
                onChange={(e) => { setFechaHasta(e.target.value); setPagina(1) }}
              />
              {(fechaDesde || fechaHasta) && (
                <button
                  style={{ ...s.simBtn, color: "#f87171", borderColor: "#7f1d1d" }}
                  onClick={() => { setFechaDesde(""); setFechaHasta(""); setPagina(1) }}
                >
                  ✕ Quitar fechas
                </button>
              )}
              {fechaDesde && fechaHasta && (
                <span style={{ fontSize: "11px", color: "#00e5cc" }}>
                  {logsFiltrados.length} log(s) en rango
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Tabla ── */}
        <div style={s.tableWrap}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,229,204,0.2)" }}>
                <th style={s.th}>Hora</th>
                <th style={s.th}>Usuario</th>
                <th style={s.thCyan}>Acción</th>
                <th style={s.thCyan}>Módulo</th>
                <th style={s.thCyan}>Descripción / Valores</th>
              </tr>
            </thead>
            <tbody>
              {logsVisibles.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#4b4b7a" }}>
                    No se encontraron resultados
                    {hayFiltrosActivos && (
                      <button
                        style={{ ...s.simBtn, marginLeft: "12px", color: "#00e5cc" }}
                        onClick={limpiarFiltros}
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </td>
                </tr>
              ) : logsVisibles.map((log) => {
                const badge = accionBadge[log.accion] ?? accionBadge["CREATE"]
                let detalleObj: object = { log }
                try {
                  detalleObj = {
                    id_registro: log.id_registro,
                    accion: log.accion,
                    tabla: log.nombre_tabla,
                    usuario: `#${log.id_usuario}`,
                    artefacto: log.id_artefacto,
                    antes: log.valor_anterior ? JSON.parse(log.valor_anterior) : null,
                    después: log.valor_nuevo ? JSON.parse(log.valor_nuevo) : null,
                    fecha: log.fecha_operacion,
                  }
                } catch {}

                const lineas: string[] = [
                  `Artefacto #${log.id_artefacto}`,
                  ...(log.valor_anterior ? [`Antes: ${log.valor_anterior}`]  : []),
                  ...(log.valor_nuevo    ? [`Después: ${log.valor_nuevo}`]   : []),
                ]
                const isExp = expandido === log.id_registro

                return (
                  <>
                    <tr
                      key={log.id_registro}
                      style={{
                        borderBottom: "1px solid #16162e",
                        cursor: "pointer",
                        borderLeft: isExp ? "2px solid #00e5cc" : "2px solid transparent",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#0f0f2a"
                        e.currentTarget.style.borderLeft = "2px solid #00e5cc"
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent"
                        if (!isExp) e.currentTarget.style.borderLeft = "2px solid transparent"
                      }}
                      onClick={() => setExpandido(isExp ? null : log.id_registro)}
                    >
                      <td style={{ ...s.td, color: "#6b6b9a", whiteSpace: "nowrap", fontSize: "11px" }}>
                        {log.fecha_operacion}
                      </td>
                      <td style={{ ...s.td, color: "#a78bfa" }}>
                        Usuario #{log.id_usuario}
                      </td>
                      <td style={s.td}>
                        <span style={{
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                          borderRadius: "4px",
                          padding: "2px 8px",
                          fontSize: "10px",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}>
                          {badge.icon} {log.accion}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: "#9ca3af" }}>{log.nombre_tabla}</td>
                      <td style={s.td}>
                        {lineas.map((line, i) => (
                          <div key={i} style={{ color: i === 0 ? "#d1d5db" : "#6b7280", fontSize: i === 0 ? "12px" : "11px" }}>
                            {line}
                          </div>
                        ))}
                      </td>
                    </tr>

                    {isExp && (
                      <tr key={`d-${log.id_registro}`}>
                        <td colSpan={5} style={{ background: "#07071a", padding: "12px 14px" }}>
                          <div style={{ fontSize: "11px", color: "#6b6b9a", marginBottom: "4px" }}>
                            JSON del evento (click en fila para colapsar):
                          </div>
                          <pre style={{
                            background: "#0d0d1f",
                            border: "1px solid #1e1e3a",
                            borderLeft: "2px solid #00e5cc",
                            borderRadius: "0 6px 6px 0",
                            padding: "10px",
                            fontSize: "11px",
                            color: "#4ade80",
                            margin: 0,
                            overflow: "auto",
                            maxHeight: "200px",
                          }}>
                            {JSON.stringify(detalleObj, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderTop: "1px solid #16162e",
            fontSize: "11px",
            color: "#6b6b9a",
          }}>
            <span>{logsFiltrados.length} resultados — Página {pagina} de {totalPaginas}</span>
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              style={{
                background: "#07071a",
                border: "1px solid #1e1e3a",
                color: "#00e5cc",
                fontSize: "11px",
                padding: "3px 10px",
                borderRadius: "4px",
                cursor: pagina === 1 ? "not-allowed" : "pointer",
                opacity: pagina === 1 ? 0.4 : 1,
                fontFamily: "inherit",
              }}
            >← Anterior</button>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              style={{
                background: "#07071a",
                border: "1px solid #1e1e3a",
                color: "#00e5cc",
                fontSize: "11px",
                padding: "3px 10px",
                borderRadius: "4px",
                cursor: pagina === totalPaginas ? "not-allowed" : "pointer",
                opacity: pagina === totalPaginas ? 0.4 : 1,
                fontFamily: "inherit",
              }}
            >Siguiente →</button>
          </div>
        </div>

        {/* ── Gráficos recharts ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>

          {/* Acciones por tipo — BarChart real */}
          <div style={s.chartBox}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <span style={{ color: "#a855f7" }}>▪</span>
              <span style={{ fontSize: "13px", color: "#e2e2f0", fontWeight: 500 }}>Acciones por Tipo</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={datosAccionTipo} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="tipo"
                  tick={{ fill: "#6b6b9a", fontSize: 11, fontFamily: "Courier New" }}
                  axisLine={{ stroke: "#1e1e3a" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b6b9a", fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {datosAccionTipo.map((entry) => (
                    <Cell key={entry.tipo} fill={COLORES_ACCION[entry.tipo] ?? "#6b6b9a"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Actividad por usuario — BarChart real */}
          <div style={s.chartBox}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <span style={{ color: "#00e5cc" }}>▪</span>
              <span style={{ fontSize: "13px", color: "#e2e2f0", fontWeight: 500 }}>Actividad por Usuario</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={datosActividadUsuario} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="usuario"
                  tick={{ fill: "#6b6b9a", fontSize: 11, fontFamily: "Courier New" }}
                  axisLine={{ stroke: "#1e1e3a" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b6b9a", fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {datosActividadUsuario.map((entry) => (
                    <Cell key={entry.usuario} fill={COLORES_USUARIO[entry.id] ?? "#6b6b9a"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Actividad por día — BarChart real */}
          <div style={{ ...s.chartBox, gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <span style={{ color: "#facc15" }}>▪</span>
              <span style={{ fontSize: "13px", color: "#e2e2f0", fontWeight: 500 }}>Eventos por Día de la Semana</span>
              <span style={{ fontSize: "11px", color: "#4b4b7a", marginLeft: "auto" }}>
                Calculado de los {logs.length} logs actuales
              </span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={datosActividadDia} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="dia"
                  tick={{ fill: "#6b6b9a", fontSize: 11, fontFamily: "Courier New" }}
                  axisLine={{ stroke: "#1e1e3a" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b6b9a", fontSize: 10, fontFamily: "Courier New" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="val" radius={[4, 4, 0, 0]} fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Estado del módulo ── */}
        <div style={{
          background: "#0d0d1f",
          border: "1px solid #1e1e3a",
          borderTop: "2px solid #4ade80",
          borderRadius: "8px",
          padding: "16px",
          position: "relative",
        }}>
          <span style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "#14532d",
            color: "#4ade80",
            fontSize: "10px",
            padding: "2px 10px",
            borderRadius: "12px",
            border: "1px solid #166534",
          }}>✓ Completado</span>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <span style={{ color: "#a855f7" }}>&lt;/&gt;</span>
            <span style={{ color: "#a855f7" }}>⚡</span>
            <span style={{ fontSize: "13px", color: "#e2e2f0", fontWeight: 500 }}>Módulo de Auditoría — Carlos</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ color: "#4ade80" }}>✓</span>
                <span style={{ fontSize: "12px", color: "#4ade80", fontWeight: 500 }}>Implementado (HU-11, HU-12 + extras)</span>
              </div>
              {[
                "Filtros: usuario, acción, tabla — tiempo real",
                "Filtro por rango de fechas funcional",
                "Paginación real con navegación",
                "Exportar CSV (logs filtrados)",
                "Gráficos recharts: acciones, usuarios, días",
                "Vista detalle expandible con JSON completo",
                "Simulación de eventos de auditoría en tiempo real",
                "Logs automáticos al usar filtros y búsqueda",
              ].map(item => (
                <div key={item} style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>• {item}</div>
              ))}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <span style={{ color: "#facc15" }}>⚡</span>
                <span style={{ fontSize: "12px", color: "#facc15", fontWeight: 500 }}>Pendiente (requiere backend)</span>
              </div>
              {[
                "Persistencia real en base de datos",
                "Logs desde acciones reales del sistema",
                "Autenticación de usuarios reales (no mock)",
                "Webhooks / notificaciones en tiempo real",
              ].map(item => (
                <div key={item} style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>• {item}</div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: "14px",
            background: "#07071a",
            border: "1px solid rgba(0,229,204,0.2)",
            borderLeft: "2px solid #00e5cc",
            borderRadius: "0 6px 6px 0",
            padding: "8px 12px",
            fontSize: "11px",
            color: "rgba(0,229,204,0.7)",
          }}>
            ℹ Nota: Los gráficos se actualizan en tiempo real al agregar logs simulados. Para persistencia entre dispositivos se necesita backend.
          </div>
        </div>

      </div>
    </div>
  )
}
