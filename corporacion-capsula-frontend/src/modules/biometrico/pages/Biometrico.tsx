/**
 * 🚧 MÓDULO EN PROGRESO - DESARROLLADO POR CARLOS Y JUAN
 * 
 * 🔐 MÓDULO BIOMÉTRICO - FRONTEND ONLY (SIMULACIÓN VISUAL)
 * 
 * ✅ YA IMPLEMENTADO (Estructura base):
 * - Layout de terminal de seguridad cyberpunk
 * - Galería de artefactos de alta seguridad (peligrosidad > 8)
 * - Indicadores visuales de nivel de seguridad
 * - Sistema de tabs (Huella/Facial/ADN)
 * - Diseño neon cyan/pink/purple
 * 
 * 🔧 POR IMPLEMENTAR (SOLO FRONTEND * 💡 NOTA: SIMULACIÓN VISUAL PURA. NO requiere:
 *    - Hardware biométrico
 *    - Base de datos de ADN
 *    - Backend ni APIs
 * Usar: setTimeout(), Math.random(), CSS animations
 * 
 * ⚠️ PERSISTENCIA: Los logs de intentos son temporales (state/localStorage).
 * Para persistir entre dispositivos se necesitaría backend.
 * 
 * 📂 Archivo: src/modules/biometrico/pages/Biometrico.tsx
 * 🎨 Estilo: Terminal de seguridad militar cyberpunk
 * 
 * CARLOS:
 * - Filtros funcionales por nivel de seguridad
 * - Panel de acceso post-verificación (mostrar datos del artefacto)
 * - Log de intentos (localStorage o state)
 * - Alerta tras 3 intentos fallidos
 * 
 * JUAN:
 * - Scanner de huella con animación CSS (progreso 0-100%)
 * - Reconocimiento facial simulado (overlay de puntos, animación)
 * - Verificación ADN con input y validación mock
 * - Sonidos con Web Audio API (beeps, éxito, fallo)
 * - Efectos: scanlines, glitch, glow, partículas
 * - Verificación ADN (input + procesamiento)
 * - Efectos visuales y sonidos
 * 
 * Ambos:
 * - Integración de componentes
 * - Testing y ajustes
 * 
 * Estado: 🚧 ASIGNADO A CARLOS Y JUAN (COMPARTIDO)
 * Prioridad: Media
 * Fecha límite sugerida: Próxima semana
 */

import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { 
  Fingerprint,
  ScanFace,
  Dna,
  Lock,
  Unlock,
  AlertTriangle,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Eye,
  Activity,
  Zap,
  Lightbulb,
  Code,
  Database,
  Cpu,
  Volume2
} from "lucide-react"

// Tipos de verificación
interface VerificacionState {
  tipo: "huella" | "facial" | "adn" | null
  progreso: number
  estado: "idle" | "escaneando" | "procesando" | "exito" | "fallo"
  mensaje: string
  intentos: number
}

const Biometrico = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()
  
  const [selectedArtefacto, setSelectedArtefacto] = useState<number | null>(null)
  const [verificacion, setVerificacion] = useState<VerificacionState>({
    tipo: null,
    progreso: 0,
    estado: "idle",
    mensaje: "",
    intentos: 0
  })
  const [bloqueado, setBloqueado] = useState(false)
  const [tiempoBloqueo, setTiempoBloqueo] = useState(0)
  
  // ===== ARTEFACTOS QUE REQUIEREN VERIFICACIÓN =====
  const artefactosBiometricos = useMemo(() => {
    return artefactos.filter(a => 
      a.nivelPeligrosidad > 8 || a.nivelConfidencialidad > 8
    ).sort((a, b) => 
      (b.nivelPeligrosidad + b.nivelConfidencialidad) - 
      (a.nivelPeligrosidad + a.nivelConfidencialidad)
    )
  }, [artefactos])
  
  // ===== DETERMINAR NIVEL DE SEGURIDAD =====
  const getNivelSeguridad = (artefacto: any) => {
    const score = artefacto.nivelPeligrosidad + artefacto.nivelConfidencialidad
    if (score >= 17) return 3 // Máximo
    if (score >= 14) return 2 // Medio
    return 1 // Básico
  }
  
  // ===== SIMULAR VERIFICACIÓN =====
  const iniciarVerificacion = (tipo: "huella" | "facial" | "adn") => {
    if (bloqueado) return
    
    setVerificacion({
      tipo,
      progreso: 0,
      estado: "escaneando",
      mensaje: tipo === "huella" ? "Coloque su dedo en el escáner..." :
               tipo === "facial" ? "Posicione su rostro frente a la cámara..." :
               "Inserte muestra de ADN...",
      intentos: verificacion.intentos
    })
    
    // Simular progreso
    let progreso = 0
    const interval = setInterval(() => {
      progreso += Math.random() * 15
      if (progreso >= 100) {
        progreso = 100
        clearInterval(interval)
        
        // Cambiar a procesando
        setVerificacion(prev => ({
          ...prev,
          progreso: 100,
          estado: "procesando",
          mensaje: "Procesando datos..."
        }))
        
        // Resultado final después de delay
        setTimeout(() => {
          const exito = Math.random() > 0.15 // 85% éxito
          
          if (exito) {
            setVerificacion(prev => ({
              ...prev,
              estado: "exito",
              mensaje: "✓ Verificación exitosa. Acceso concedido."
            }))
          } else {
            const nuevosIntentos = verificacion.intentos + 1
            setVerificacion(prev => ({
              ...prev,
              estado: "fallo",
              mensaje: "✗ Verificación fallida. Intente nuevamente.",
              intentos: nuevosIntentos
            }))
            
            // Bloquear tras 3 intentos
            if (nuevosIntentos >= 3) {
              setBloqueado(true)
              setTiempoBloqueo(30)
            }
          }
        }, 1500)
      } else {
        setVerificacion(prev => ({
          ...prev,
          progreso
        }))
      }
    }, 200)
  }
  
  // ===== TEMPORIZADOR DE BLOQUEO =====
  useEffect(() => {
    if (bloqueado && tiempoBloqueo > 0) {
      const timer = setInterval(() => {
        setTiempoBloqueo(t => {
          if (t <= 1) {
            setBloqueado(false)
            setVerificacion(prev => ({ ...prev, intentos: 0 }))
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [bloqueado, tiempoBloqueo])
  
  const artefactoActual = artefactos.find(a => a.id === selectedArtefacto)
  const nivelSeguridad = artefactoActual ? getNivelSeguridad(artefactoActual) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/60 border-b border-pink-500/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Admin
              </button>
              <div>
                <h1 className="text-2xl font-bold text-pink-400 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Verificación Biométrica
                </h1>
                <p className="text-gray-400 text-sm">Responsables: Carlos y Juan | Estado: En desarrollo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-pink-400" />
              <span className="text-sm text-pink-400">Nivel de Seguridad: Máximo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {!selectedArtefacto ? (
          <>
            {/* ===== GALERÍA DE ARTEFACTOS BIOMÉTRICOS ===== */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Artefactos de Alta Seguridad
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Estos artefactos requieren verificación biométrica por su alta peligrosidad o confidencialidad.
              </p>
            </div>
            
            {artefactosBiometricos.length === 0 ? (
              <div className="text-center py-12 bg-black/40 border border-pink-500/30 rounded-xl">
                <Shield className="w-16 h-16 text-pink-400/30 mx-auto mb-4" />
                <p className="text-gray-400">No hay artefactos que requieran verificación biométrica</p>
                <p className="text-gray-500 text-sm mt-1">
                  Los artefactos con peligrosidad o confidencialidad {'>'} 8 aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artefactosBiometricos.map((a) => {
                  const nivel = getNivelSeguridad(a)
                  return (
                    <div 
                      key={a.id}
                      className="bg-black/40 border border-pink-500/30 rounded-xl p-4 hover:border-pink-500/60 transition cursor-pointer group"
                      onClick={() => setSelectedArtefacto(a.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="w-5 h-5 text-pink-400" />
                          <span className="text-xs text-pink-400 font-medium">ID: #{a.id}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          nivel === 3 ? "bg-red-500/20 text-red-400 border border-red-500/50" :
                          nivel === 2 ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" :
                          "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        }`}>
                          Nivel {nivel}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-white mb-2 group-hover:text-pink-300 transition">
                        {a.nombre}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">{a.descripcion}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex gap-3">
                          <span className="text-red-400">
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            {a.nivelPeligrosidad}/10
                          </span>
                          <span className="text-purple-400">
                            <Shield className="w-3 h-3 inline mr-1" />
                            {a.nivelConfidencialidad}/10
                          </span>
                        </div>
                        <span className="text-pink-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Verificar
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* ===== PANEL DE VERIFICACIÓN ===== */}
            <button
              onClick={() => {
                setSelectedArtefacto(null)
                setVerificacion({ tipo: null, progreso: 0, estado: "idle", mensaje: "", intentos: 0 })
              }}
              className="mb-4 text-pink-400 hover:text-pink-300 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la lista
            </button>
            
            {artefactoActual && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info del artefacto */}
                <div className="bg-black/40 border border-pink-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-pink-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{artefactoActual.nombre}</h2>
                      <p className="text-pink-400/70 text-sm">Acceso Restringido - Nivel {nivelSeguridad}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-4">{artefactoActual.descripcion}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-400/70 text-xs mb-1">Peligrosidad</p>
                      <p className="text-2xl font-bold text-red-400">{artefactoActual.nivelPeligrosidad}/10</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-purple-400/70 text-xs mb-1">Confidencialidad</p>
                      <p className="text-2xl font-bold text-purple-400">{artefactoActual.nivelConfidencialidad}/10</p>
                    </div>
                  </div>
                  
                  {verificacion.estado === "exito" && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <Unlock className="w-5 h-5" />
                        <span className="font-bold">Acceso Concedido</span>
                      </div>
                      <p className="text-emerald-400/70 text-sm">
                        Verificación completada. Puede acceder a los datos del artefacto.
                      </p>
                      <button
                        onClick={() => navigate(`/edit/${artefactoActual.id}`)}
                        className="mt-3 w-full py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition"
                      >
                        Ver Detalles Completos
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Scanner biométrico */}
                <div className="bg-black/40 border border-pink-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
                    <ScanFace className="w-5 h-5" />
                    Estación de Verificación
                  </h3>
                  
                  {bloqueado ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <p className="text-red-400 font-bold mb-2">Sistema Bloqueado</p>
                      <p className="text-gray-400 text-sm mb-4">
                        Demasiados intentos fallidos. Espere {tiempoBloqueo} segundos.
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-400 h-2 rounded-full transition-all"
                          style={{ width: `${(tiempoBloqueo / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : verificacion.estado === "idle" ? (
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm mb-4">
                        Seleccione método de verificación requerido:
                      </p>
                      
                      {/* Nivel 1: Huella */}
                      <button
                        onClick={() => iniciarVerificacion("huella")}
                        className="w-full flex items-center gap-3 p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg hover:bg-pink-500/20 transition"
                      >
                        <Fingerprint className="w-8 h-8 text-pink-400" />
                        <div className="text-left">
                          <p className="font-medium text-white">Verificación por Huella</p>
                          <p className="text-xs text-pink-400/70">Requerido Nivel 1</p>
                        </div>
                      </button>
                      
                      {/* Nivel 2: Facial */}
                      {nivelSeguridad >= 2 && (
                        <button
                          onClick={() => iniciarVerificacion("facial")}
                          className="w-full flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition"
                        >
                          <ScanFace className="w-8 h-8 text-purple-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">Reconocimiento Facial</p>
                            <p className="text-xs text-purple-400/70">Requerido Nivel 2</p>
                          </div>
                        </button>
                      )}
                      
                      {/* Nivel 3: ADN */}
                      {nivelSeguridad >= 3 && (
                        <button
                          onClick={() => iniciarVerificacion("adn")}
                          className="w-full flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition"
                        >
                          <Dna className="w-8 h-8 text-red-400" />
                          <div className="text-left">
                            <p className="font-medium text-white">Verificación de ADN</p>
                            <p className="text-xs text-red-400/70">Requerido Nivel 3 - Máxima Seguridad</p>
                          </div>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {/* Animación de escaneo */}
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-pink-500/30 rounded-full" />
                        <div 
                          className="absolute inset-0 border-4 border-pink-400 rounded-full border-t-transparent animate-spin"
                          style={{ animationDuration: "1s" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {verificacion.tipo === "huella" && <Fingerprint className="w-12 h-12 text-pink-400" />}
                          {verificacion.tipo === "facial" && <ScanFace className="w-12 h-12 text-purple-400" />}
                          {verificacion.tipo === "adn" && <Dna className="w-12 h-12 text-red-400" />}
                        </div>
                      </div>
                      
                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            verificacion.estado === "exito" ? "bg-emerald-400" :
                            verificacion.estado === "fallo" ? "bg-red-400" :
                            "bg-pink-400"
                          }`}
                          style={{ width: `${verificacion.progreso}%` }}
                        />
                      </div>
                      
                      <p className={`font-medium ${
                        verificacion.estado === "exito" ? "text-emerald-400" :
                        verificacion.estado === "fallo" ? "text-red-400" :
                        "text-pink-400"
                      }`}>
                        {verificacion.mensaje}
                      </p>
                      
                      {verificacion.estado === "fallo" && (
                        <button
                          onClick={() => setVerificacion({ tipo: null, progreso: 0, estado: "idle", mensaje: "", intentos: verificacion.intentos })}
                          className="mt-4 px-4 py-2 bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded-lg hover:bg-pink-500/30 transition"
                        >
                          Reintentar
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Contador de intentos */}
                  {verificacion.intentos > 0 && verificacion.estado !== "exito" && (
                    <div className="mt-4 text-center">
                      <p className="text-amber-400 text-sm">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Intentos fallidos: {verificacion.intentos}/3
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* ===== EJEMPLOS VISUALES E INSTRUCCIONES ===== */}
        
        {/* Ejemplo de Scanner de Huella Mejorado */}
        <div className="mt-8 bg-gray-900/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Ejemplo: Scanner de Huella 3D (Mejorado por Juan)
          </h3>
          <div className="flex items-center gap-8">
            <div className="relative w-40 h-40">
              {/* Mock de scanner avanzado */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border-2 border-cyan-400/50" />
              <div className="absolute inset-2 border border-cyan-400/30 rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="w-20 h-20 text-cyan-400" />
              </div>
              {/* Líneas de escaneo */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 animate-ping" style={{ animationDuration: "2s", animationDelay: "1s" }} />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-gray-400 text-sm">Ideas para mejorar el scanner:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Efecto de líneas de escaneo con Canvas</li>
                <li>• Partículas cuando detecta "huella"</li>
                <li>• Sonido de beep al completar</li>
                <li>• Vibración del teléfono (si es posible)</li>
                <li>• Transición de color según progreso</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Ejemplo de Reconocimiento Facial */}
        <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
            <ScanFace className="w-5 h-5" />
            Ejemplo: Reconocimiento Facial (Por implementar)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/40 rounded-xl p-4 border border-purple-500/30">
              <p className="text-purple-400/70 text-xs mb-3">Vista previa simulada:</p>
              <div className="relative aspect-video bg-black/60 rounded-lg overflow-hidden">
                {/* Mock de cámara facial */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-40 border-2 border-purple-400/50 rounded-lg relative">
                    {/* Puntos de reconocimiento facial */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    {/* Líneas de conexión */}
                    <svg className="absolute inset-0 w-full h-full">
                      <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
                      <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
                      <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-purple-500/20 rounded px-2 py-1 text-center">
                    <p className="text-purple-300 text-xs">Reconociendo rostro...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Tareas para implementar:</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span>Simular detección de puntos faciales con SVG animado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span>Agregar sonidos de escaneo (beep, success, error)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-purple-400 mt-0.5" />
                  <span>Barra de "confianza" que sube mientras escanea</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 🚧 MÓDULO EN PROGRESO */}
        <div className="mt-8 bg-pink-900/20 border-2 border-pink-500/50 rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-pink-400 mb-2">🚧 MÓDULO EN PROGRESO</h2>
            <p className="text-gray-400">Responsables: Carlos y Juan</p>
            <p className="text-xs text-pink-300/70 mt-1">Modifíquenlo a su antojo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
              <h4 className="text-cyan-400 font-medium mb-2">Carlos - Lógica</h4>
              <p className="text-sm text-gray-400">Filtros, logs de intentos, panel de acceso</p>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
              <h4 className="text-purple-400 font-medium mb-2">Juan - Visual</h4>
              <p className="text-sm text-gray-400">Scanner animado, efectos, sonidos</p>
            </div>
          </div>
          
          {/* Ejemplo pequeño de escaneo */}
          <div className="mt-4 bg-black/40 rounded-lg p-4 border border-pink-500/30">
            <p className="text-pink-400 text-sm font-medium mb-2">Ejemplo: Scanner de Huella</p>
            <div className="w-32 h-32 mx-auto rounded-full bg-black border-2 border-pink-500/50 flex items-center justify-center relative overflow-hidden">
              <Fingerprint className="w-16 h-16 text-pink-400/50" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/20 to-transparent animate-pulse" />
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">Simulación con CSS/Canvas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Biometrico
