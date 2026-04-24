import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { canDeleteArtifacts } from "../../auth/utils/roles"
import bg from "../../../assets/3.jpg"

const HOLD_DURATION = 5000

const ArtefactoEliminar = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getArtefactoById, deactivateArtefacto } = useArtefactos()
  const artefacto = getArtefactoById(Number(id))

  const [progreso, setProgreso] = useState(0)
  const [holding, setHolding] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [done, setDone] = useState(false)

  const intervalRef = useRef<any>(null)
  const startTimeRef = useRef<number | null>(null)

  const startHold = (e?: React.TouchEvent) => {
    e?.preventDefault()
    if (holding) return
    setHolding(true)
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current || 0)
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      setProgreso(pct)
      if (pct >= 100) {
        clearInterval(intervalRef.current)
        setHolding(false)
        setShowModal(true)
      }
    }, 30)
  }

  const stopHold = () => {
    if (!holding) return
    clearInterval(intervalRef.current)
    setHolding(false)
    setProgreso(0)
  }

  const confirmar = async () => {
    if (!id) return
    setShowModal(false)
    setDone(true)
    await deactivateArtefacto(id)
    setTimeout(() => navigate("/artefactos"), 1800)
  }

  if (!canDeleteArtifacts()) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", fontFamily: "'Orbitron', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');`}</style>
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 text-center">
        <p className="text-amber-400 text-xs tracking-widest uppercase mb-4">⚠ Acceso denegado</p>
        <button onClick={() => navigate("/artefactos")}
          className="px-6 py-2 border border-amber-500 text-amber-400 text-xs tracking-widest uppercase hover:bg-amber-500/10 transition-colors"
          style={{ fontFamily: "'Orbitron', monospace" }}>
          Volver al inventario
        </button>
      </div>
    </div>
  )

  if (!artefacto) return <div className="text-white p-10" style={{ fontFamily: "'Orbitron', monospace" }}>Cargando...</div>

  const fpOpacity = 0.35 + (progreso / 100) * 0.65
  const ringColor = `rgba(${Math.round(200 + (progreso / 100) * 55)},${Math.round(30 - (progreso / 100) * 30)},30,${0.4 + progreso / 100 * 0.6})`

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        .fp-ring-anim { animation: ring-pulse 1s ease-in-out infinite; }
        @keyframes ring-pulse { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.06);opacity:.4} }
        .dot-blink { animation: blink 1.2s infinite; }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:.2} }
        .hud-flicker { animation: flicker 6s infinite; }
        @keyframes flicker { 0%,94%,100%{opacity:1} 95%{opacity:.85} 97%{opacity:.9} }
        .modal-anim { animation: modalIn .2s ease-out; }
        @keyframes modalIn { from{transform:scale(.94);opacity:0} to{transform:scale(1);opacity:1} }
        .success-anim { animation: successIn .3s ease-out; }
        @keyframes successIn { from{opacity:0} to{opacity:1} }
      `}</style>

      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0" style={{
        backgroundImage: "linear-gradient(rgba(180,50,50,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(180,50,50,.04) 1px,transparent 1px)",
        backgroundSize: "32px 32px"
      }} />

      {/* Panel principal */}
      <div className="relative z-10 hud-flicker" style={{
        width: 640, fontFamily: "'Orbitron', monospace",
        background: "rgba(8,4,16,.97)",
        border: "1px solid rgba(200,30,30,.6)",
        boxShadow: "0 0 0 1px rgba(200,30,30,.1), 0 30px 80px rgba(0,0,0,.9)"
      }}>
        {/* Esquinas */}
        {[["top-[-1px] left-[-1px] border-t-2 border-l-2",""],["top-[-1px] right-[-1px] border-t-2 border-r-2",""],
          ["bottom-[-1px] left-[-1px] border-b-2 border-l-2",""],["bottom-[-1px] right-[-1px] border-b-2 border-r-2",""]].map(([cls],i) => (
          <div key={i} className={`absolute w-3.5 h-3.5 ${cls}`} style={{ borderColor: "rgba(220,40,40,.9)" }} />
        ))}

        {/* Titlebar */}
        <div style={{ background: "linear-gradient(90deg,rgba(200,30,30,.3),rgba(200,30,30,.05))", borderBottom: "1px solid rgba(200,30,30,.35)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 16, height: 16, position: "relative" }}>
            <div style={{ position: "absolute", inset: 2, border: "2px solid #e53535", borderRadius: 2 }} />
            <div style={{ position: "absolute", top: 5, left: 5, width: 6, height: 6, background: "#e53535", borderRadius: 1 }} />
          </div>
          <span style={{ color: "#e53535", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 700 }}>Borrado y Desactivación</span>
          <span style={{ color: "rgba(200,30,30,.4)", fontSize: 9, letterSpacing: ".15em", marginLeft: "auto" }}>CorporaciónCápsula</span>
        </div>

        {/* Warning bar */}
        <div style={{ background: "rgba(200,120,0,.12)", borderBottom: "1px solid rgba(200,120,0,.25)", padding: "6px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#d97706", fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase" }}>
            ▲ Advertencia — Acción crítica de borrado
          </span>
        </div>

        {/* Body: dos columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr" }}>
          {/* Columna izquierda: datos */}
          <div style={{ padding: 16 }}>
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 10 }}>Datos del artefacto</p>
            {[
              ["Código", `#${id}`],
              ["Nombre", artefacto.nombre],
              ["Estado", artefacto.estado === "obsoleto" ? "Inactivo" : "Activo"],
              ["Categoría", artefacto.categoria ?? "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ color: "rgba(255,255,255,.25)", fontSize: 8, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 10, letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 5,
                  color: k === "Estado" ? (artefacto.estado === "obsoleto" ? "#f87171" : "#4ade80") : "rgba(255,255,255,.85)" }}>
                  {k === "Estado" && <span className="dot-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: artefacto.estado === "obsoleto" ? "#f87171" : "#4ade80", display: "inline-block" }} />}
                  {v}
                </div>
              </div>
            ))}
            <div style={{ height: 1, background: "rgba(255,255,255,.05)", margin: "10px 0" }} />
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 10 }}>Mantenedor asignado</p>
            {[["Responsable", artefacto.inventor ?? "Sin asignar"]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ color: "rgba(255,255,255,.25)", fontSize: 8, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                <div style={{ color: "rgba(255,255,255,.85)", fontSize: 10 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(200,30,30,.2)" }} />

          {/* Columna derecha: biométrica */}
          <div style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <p style={{ color: "rgba(255,255,255,.3)", fontSize: 8, letterSpacing: ".2em", textTransform: "uppercase", alignSelf: "flex-start" }}>Desactivación biométrica</p>

            {/* Huella SVG */}
            <div style={{ position: "relative", width: 100, height: 100 }}>
              <div className={holding ? "fp-ring-anim" : ""} style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: `2px solid ${holding ? ringColor : "rgba(200,30,30,.2)"}`,
                transition: "border-color .1s"
              }} />
              <div style={{
                position: "absolute", inset: 8, borderRadius: "50%",
                border: `1px solid ${holding ? "rgba(200,30,30,.4)" : "rgba(200,30,30,.12)"}`,
                transition: "border-color .1s"
              }} />
              <svg style={{ position: "absolute", inset: 16 }} viewBox="0 0 68 68" fill="none">
                <g style={{ opacity: fpOpacity, transition: holding ? "opacity .03s" : "opacity .4s" }}>
                  <path d="M34 6C18.536 6 6 18.536 6 34s12.536 28 28 28 28-12.536 28-28S49.464 6 34 6z" stroke="rgba(200,30,30,0.6)" strokeWidth="1.2" fill="none"/>
                  <path d="M34 12c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22z" stroke="rgba(200,30,30,0.5)" strokeWidth="1" fill="none"/>
                  <path d="M34 20c-7.732 0-14 6.268-14 14 0 4.87 2.49 9.16 6.27 11.67" stroke="rgba(200,30,30,0.7)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                  <path d="M34 20c7.732 0 14 6.268 14 14 0 4.87-2.49 9.16-6.27 11.67" stroke="rgba(200,30,30,0.7)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                  <path d="M34 26c-4.418 0-8 3.582-8 8 0 2.76 1.4 5.19 3.54 6.67" stroke="rgba(200,30,30,0.8)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                  <path d="M34 26c4.418 0 8 3.582 8 8 0 2.76-1.4 5.19-3.54 6.67" stroke="rgba(200,30,30,0.8)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                  <circle cx="34" cy="34" r="3" fill="rgba(200,30,30,0.6)"/>
                  <path d="M34 14v4M34 50v4M14 34h4M50 34h4" stroke="rgba(200,30,30,0.3)" strokeWidth="1" strokeLinecap="round"/>
                </g>
              </svg>
            </div>

            <p style={{ color: "rgba(255,255,255,.25)", fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase" }}>
              {holding ? "Escaneando..." : progreso >= 100 ? "Verificación completada" : "Escanear huella digital"}
            </p>
            <p style={{ color: "#ef4444", fontSize: 9, letterSpacing: ".1em", minHeight: 14 }}>
              {holding ? `${Math.round(progreso)}%` : ""}
            </p>

            {/* Barra */}
            <div style={{ width: "100%", background: "rgba(255,255,255,.05)", height: 6, position: "relative", overflow: "hidden", border: "1px solid rgba(200,30,30,.2)" }}>
              <div style={{
                height: "100%", width: `${progreso}%`, background: "#dc2626",
                transition: holding ? "none" : "width .4s ease",
                boxShadow: holding ? "2px 0 8px rgba(220,38,38,.7)" : "none"
              }} />
            </div>

            <button
              onMouseDown={() => startHold()}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={(e) => startHold(e)}
              onTouchEnd={stopHold}
              style={{
                width: "100%", padding: "8px",
                border: `1px solid ${holding ? "#dc2626" : "rgba(200,30,30,.5)"}`,
                background: holding ? "rgba(200,30,30,.25)" : "rgba(200,30,30,.08)",
                color: "#ef4444", fontFamily: "'Orbitron', monospace",
                fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase",
                cursor: "pointer", userSelect: "none", outline: "none",
                transition: "background .15s, border-color .15s"
              }}>
              {holding ? "▶ Verificando..." : "Mantener para desactivar"}
            </button>

            <button
              onClick={() => navigate("/artefactos")}
              style={{
                width: "100%", padding: "7px",
                border: "1px solid rgba(255,255,255,.1)", background: "transparent",
                color: "rgba(255,255,255,.3)", fontFamily: "'Orbitron', monospace",
                fontSize: 8, letterSpacing: ".15em", textTransform: "uppercase",
                cursor: "pointer", outline: "none"
              }}>
              Cancelar operación
            </button>
          </div>
        </div>

        {/* Modal de confirmación final */}
        {showModal && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <div className="modal-anim" style={{
              width: 280, background: "rgba(8,4,16,.98)",
              border: "1px solid rgba(200,30,30,.7)", position: "relative"
            }}>
              {[["top-[-1px] left-[-1px] border-t-2 border-l-2"],["top-[-1px] right-[-1px] border-t-2 border-r-2"],
                ["bottom-[-1px] left-[-1px] border-b-2 border-l-2"],["bottom-[-1px] right-[-1px] border-b-2 border-r-2"]].map(([cls],i) => (
                <div key={i} className={`absolute w-2.5 h-2.5 ${cls}`} style={{ borderColor: "rgba(220,40,40,.9)" }} />
              ))}
              <div style={{ background: "rgba(200,30,30,.2)", borderBottom: "1px solid rgba(200,30,30,.3)", padding: "8px 14px" }}>
                <span style={{ color: "#ef4444", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase" }}>Confirmación final</span>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="17" stroke="#dc2626" strokeWidth="1.5"/>
                  <path d="M18 10v10" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="18" cy="25" r="1.5" fill="#dc2626"/>
                </svg>
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 10, letterSpacing: ".08em", textAlign: "center", lineHeight: 1.6 }}>
                  ¿Confirmas la desactivación permanente de<br/>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{artefacto.nombre}</span>?<br/>
                  <span style={{ color: "rgba(255,255,255,.35)", fontSize: 9 }}>Esta acción no se puede revertir.</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%" }}>
                  <button onClick={confirmar} style={{
                    padding: 8, border: "1px solid rgba(200,30,30,.6)", background: "rgba(200,30,30,.15)",
                    color: "#ef4444", fontFamily: "'Orbitron', monospace", fontSize: 8,
                    letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer", outline: "none"
                  }}>Confirmar</button>
                  <button onClick={() => { setShowModal(false); setProgreso(0) }} style={{
                    padding: 8, border: "1px solid rgba(255,255,255,.1)", background: "transparent",
                    color: "rgba(255,255,255,.35)", fontFamily: "'Orbitron', monospace", fontSize: 8,
                    letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", outline: "none"
                  }}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overlay de éxito */}
        {done && (
          <div className="success-anim" style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: 12, zIndex: 20
          }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(22,163,74,.15)", border: "2px solid #16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span style={{ color: "#4ade80", fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase" }}>Artefacto desactivado</span>
            <span style={{ color: "rgba(255,255,255,.3)", fontSize: 8, letterSpacing: ".12em" }}>Redirigiendo al inventario...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtefactoEliminar