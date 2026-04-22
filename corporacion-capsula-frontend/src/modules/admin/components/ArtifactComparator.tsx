import { useState, useMemo } from "react"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { useNavigate } from "react-router-dom"
import { 
  GitCompare,
  Search,
  X,
  ArrowRightLeft,
  AlertTriangle,
  Shield,
  Zap,
  Globe,
  User,
  FileText,
  Check,
  XCircle,
  ArrowRight
} from "lucide-react"

const ArtifactComparator = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()
  
  const [leftId, setLeftId] = useState<number | null>(null)
  const [rightId, setRightId] = useState<number | null>(null)
  const [searchLeft, setSearchLeft] = useState("")
  const [searchRight, setSearchRight] = useState("")
  const [showLeftDropdown, setShowLeftDropdown] = useState(false)
  const [showRightDropdown, setShowRightDropdown] = useState(false)
  
  // ===== FILTRAR ARTEFACTOS PARA BÚSQUEDA =====
  const leftOptions = useMemo(() => {
    return artefactos.filter(a => 
      a.nombre.toLowerCase().includes(searchLeft.toLowerCase()) &&
      a.id !== rightId
    )
  }, [artefactos, searchLeft, rightId])
  
  const rightOptions = useMemo(() => {
    return artefactos.filter(a => 
      a.nombre.toLowerCase().includes(searchRight.toLowerCase()) &&
      a.id !== leftId
    )
  }, [artefactos, searchRight, leftId])
  
  // ===== ARTEFACTOS SELECCIONADOS =====
  const leftArtifact = useMemo(() => 
    artefactos.find(a => a.id === leftId), 
    [artefactos, leftId]
  )
  
  const rightArtifact = useMemo(() => 
    artefactos.find(a => a.id === rightId), 
    [artefactos, rightId]
  )
  
  // ===== HELPERS =====
  const getPeligrosidadColor = (nivel: number) => {
    if (nivel <= 3) return "text-emerald-400"
    if (nivel <= 6) return "text-amber-400"
    if (nivel <= 8) return "text-orange-400"
    return "text-red-400"
  }
  
  const getPeligrosidadLabel = (nivel: number) => {
    if (nivel <= 3) return "Bajo"
    if (nivel <= 6) return "Medio"
    if (nivel <= 8) return "Alto"
    return "Crítico"
  }
  
  const compareValues = (left: any, right: any, type: "higher" | "lower" | "equal") => {
    if (left === undefined || right === undefined) return null
    if (left === right) return "equal"
    if (type === "higher") return left > right ? "left" : "right"
    if (type === "lower") return left < right ? "left" : "right"
    return "equal"
  }

  return (
    <div className="bg-black/40 border border-emerald-400/30 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
        <GitCompare className="w-5 h-5" />
        Comparador de Artefactos
      </h2>
      
      {/* ===== SELECTORES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Selector Izquierdo */}
        <div className="relative">
          <label className="text-emerald-400/70 text-sm font-medium mb-2 block">
            Artefacto 1
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar artefacto..."
              value={searchLeft}
              onChange={(e) => {
                setSearchLeft(e.target.value)
                setShowLeftDropdown(true)
              }}
              onFocus={() => setShowLeftDropdown(true)}
              className="w-full bg-black/40 border border-emerald-400/30 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-emerald-400/30 focus:border-emerald-400 focus:outline-none"
            />
            {leftId && (
              <button
                onClick={() => {
                  setLeftId(null)
                  setSearchLeft("")
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/50 hover:text-emerald-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Dropdown Izquierdo */}
          {showLeftDropdown && searchLeft && leftOptions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-emerald-400/30 rounded-lg max-h-48 overflow-y-auto z-50">
              {leftOptions.map(a => (
                <button
                  key={a.id}
                  onClick={() => {
                    setLeftId(a.id)
                    setSearchLeft(a.nombre)
                    setShowLeftDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-400/10 text-white text-sm border-b border-emerald-400/10 last:border-0"
                >
                  <span className="font-medium">{a.nombre}</span>
                  <span className="text-emerald-400/50 text-xs ml-2">({a.categoria})</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Selector Derecho */}
        <div className="relative">
          <label className="text-emerald-400/70 text-sm font-medium mb-2 block">
            Artefacto 2
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar artefacto..."
              value={searchRight}
              onChange={(e) => {
                setSearchRight(e.target.value)
                setShowRightDropdown(true)
              }}
              onFocus={() => setShowRightDropdown(true)}
              className="w-full bg-black/40 border border-emerald-400/30 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-emerald-400/30 focus:border-emerald-400 focus:outline-none"
            />
            {rightId && (
              <button
                onClick={() => {
                  setRightId(null)
                  setSearchRight("")
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/50 hover:text-emerald-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Dropdown Derecho */}
          {showRightDropdown && searchRight && rightOptions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-emerald-400/30 rounded-lg max-h-48 overflow-y-auto z-50">
              {rightOptions.map(a => (
                <button
                  key={a.id}
                  onClick={() => {
                    setRightId(a.id)
                    setSearchRight(a.nombre)
                    setShowRightDropdown(false)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-400/10 text-white text-sm border-b border-emerald-400/10 last:border-0"
                >
                  <span className="font-medium">{a.nombre}</span>
                  <span className="text-emerald-400/50 text-xs ml-2">({a.categoria})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside para cerrar dropdowns */}
      {(showLeftDropdown || showRightDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowLeftDropdown(false)
            setShowRightDropdown(false)
          }}
        />
      )}
      
      {/* ===== COMPARACIÓN ===== */}
      {leftArtifact && rightArtifact ? (
        <div className="space-y-4">
          {/* Header de comparación */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-center flex-1">
              <h3 className="text-lg font-bold text-white">{leftArtifact.nombre}</h3>
              <p className="text-emerald-400/50 text-sm">ID: #{leftArtifact.id}</p>
            </div>
            <div className="px-4">
              <ArrowRightLeft className="w-6 h-6 text-emerald-400/50" />
            </div>
            <div className="text-center flex-1">
              <h3 className="text-lg font-bold text-white">{rightArtifact.nombre}</h3>
              <p className="text-emerald-400/50 text-sm">ID: #{rightArtifact.id}</p>
            </div>
          </div>
          
          {/* Tabla de comparación */}
          <div className="bg-black/20 rounded-lg overflow-hidden border border-emerald-400/20">
            {/* Categoría */}
            <div className="grid grid-cols-3 border-b border-emerald-400/10">
              <div className="p-3 text-right">
                <span className="text-emerald-400/70 text-sm">{leftArtifact.categoria}</span>
              </div>
              <div className="p-3 text-center bg-emerald-400/5">
                <span className="text-emerald-400 text-xs font-medium">CATEGORÍA</span>
              </div>
              <div className="p-3 text-left">
                <span className="text-emerald-400/70 text-sm">{rightArtifact.categoria}</span>
              </div>
            </div>
            
            {/* Origen */}
            <div className="grid grid-cols-3 border-b border-emerald-400/10">
              <div className="p-3 text-right flex items-center justify-end gap-2">
                <Globe className="w-4 h-4 text-emerald-400/50" />
                <span className="text-emerald-400/70 text-sm capitalize">{leftArtifact.origen}</span>
              </div>
              <div className="p-3 text-center bg-emerald-400/5">
                <span className="text-emerald-400 text-xs font-medium">ORIGEN</span>
              </div>
              <div className="p-3 text-left flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400/50" />
                <span className="text-emerald-400/70 text-sm capitalize">{rightArtifact.origen}</span>
              </div>
            </div>
            
            {/* Peligrosidad */}
            <div className="grid grid-cols-3 border-b border-emerald-400/10">
              <div className={`p-3 text-right ${getPeligrosidadColor(leftArtifact.nivelPeligrosidad)}`}>
                <div className="flex items-center justify-end gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold">{leftArtifact.nivelPeligrosidad}/10</span>
                  <span className="text-xs opacity-70">({getPeligrosidadLabel(leftArtifact.nivelPeligrosidad)})</span>
                </div>
                {compareValues(leftArtifact.nivelPeligrosidad, rightArtifact.nivelPeligrosidad, "lower") === "left" && (
                  <span className="text-xs text-emerald-400">✓ Menos peligroso</span>
                )}
              </div>
              <div className="p-3 text-center bg-emerald-400/5">
                <span className="text-emerald-400 text-xs font-medium">PELIGROSIDAD</span>
              </div>
              <div className={`p-3 text-left ${getPeligrosidadColor(rightArtifact.nivelPeligrosidad)}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-bold">{rightArtifact.nivelPeligrosidad}/10</span>
                  <span className="text-xs opacity-70">({getPeligrosidadLabel(rightArtifact.nivelPeligrosidad)})</span>
                </div>
                {compareValues(leftArtifact.nivelPeligrosidad, rightArtifact.nivelPeligrosidad, "lower") === "right" && (
                  <span className="text-xs text-emerald-400">✓ Menos peligroso</span>
                )}
              </div>
            </div>
            
            {/* Confidencialidad */}
            <div className="grid grid-cols-3 border-b border-emerald-400/10">
              <div className="p-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Shield className="w-4 h-4 text-purple-400/70" />
                  <span className={`font-bold ${leftArtifact.nivelConfidencialidad >= 8 ? "text-purple-400" : "text-emerald-400/70"}`}>
                    {leftArtifact.nivelConfidencialidad}/10
                  </span>
                </div>
              </div>
              <div className="p-3 text-center bg-emerald-400/5">
                <span className="text-emerald-400 text-xs font-medium">CONFIDENCIALIDAD</span>
              </div>
              <div className="p-3 text-left">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400/70" />
                  <span className={`font-bold ${rightArtifact.nivelConfidencialidad >= 8 ? "text-purple-400" : "text-emerald-400/70"}`}>
                    {rightArtifact.nivelConfidencialidad}/10
                  </span>
                </div>
              </div>
            </div>
            
            {/* Inventor */}
            <div className="grid grid-cols-3 border-b border-emerald-400/10">
              <div className="p-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <User className="w-4 h-4 text-emerald-400/50" />
                  <span className="text-emerald-400/70 text-sm">{leftArtifact.inventor}</span>
                </div>
              </div>
              <div className="p-3 text-center bg-emerald-400/5">
                <span className="text-emerald-400 text-xs font-medium">INVENTOR</span>
              </div>
              <div className="p-3 text-left">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400/50" />
                  <span className="text-emerald-400/70 text-sm">{rightArtifact.inventor}</span>
                </div>
              </div>
            </div>
            
            {/* Estado */}
            <div className="grid grid-cols-3">
              <div className="p-3 text-right">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  leftArtifact.estado === "activo" || !leftArtifact.estado
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : leftArtifact.estado === "obsoleto"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}>
                  {leftArtifact.estado || "activo"}
                </span>
              </div>
              <div className="p-3 text-center bg-emerald-400/5">
                <span className="text-emerald-400 text-xs font-medium">ESTADO</span>
              </div>
              <div className="p-3 text-left">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  rightArtifact.estado === "activo" || !rightArtifact.estado
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : rightArtifact.estado === "obsoleto"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}>
                  {rightArtifact.estado || "activo"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Descripciones */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-black/20 rounded-lg p-3 border border-emerald-400/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-emerald-400/50" />
                <span className="text-emerald-400/70 text-xs font-medium">DESCRIPCIÓN</span>
              </div>
              <p className="text-gray-400 text-sm">{leftArtifact.descripcion}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3 border border-emerald-400/10">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-emerald-400/50" />
                <span className="text-emerald-400/70 text-xs font-medium">DESCRIPCIÓN</span>
              </div>
              <p className="text-gray-400 text-sm">{rightArtifact.descripcion}</p>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => navigate(`/edit/${leftArtifact.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 border border-emerald-400/30 rounded-lg hover:bg-emerald-400/20 transition text-emerald-400"
            >
              Ver {leftArtifact.nombre}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/edit/${rightArtifact.id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 border border-emerald-400/30 rounded-lg hover:bg-emerald-400/20 transition text-emerald-400"
            >
              Ver {rightArtifact.nombre}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitCompare className="w-10 h-10 text-emerald-400/50" />
          </div>
          <p className="text-gray-400 mb-2">Selecciona dos artefactos para comparar</p>
          <p className="text-gray-500 text-sm">Podrás ver diferencias en peligrosidad, confidencialidad, origen y más</p>
        </div>
      )}
    </div>
  )
}

export default ArtifactComparator
