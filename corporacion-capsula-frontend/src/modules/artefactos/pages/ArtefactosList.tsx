import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { 
  isAdministrator, 
  canViewArtifacts, 
  canManageArtifacts, 
  canDeleteArtifacts,
  canViewArtifactByLevels,
  getSecurityLevelLabel,
  getCurrentSecurityLevel
} from "../../auth/utils/roles"
import bg from "../../../assets/3.jpg"
import esfera from "../../../assets/7.webp"
import capsuleIcon from "../../../assets/13.gif"
import { Search, Filter, X, Shield, Lock } from "lucide-react"

import transporteGif from "../../../assets/transporte.gif"
import energiaGif from "../../../assets/energia.gif"
import domesticaGif from "../../../assets/domestica.gif"
import defensaGif from "../../../assets/defensa.gif"

const getGif = (cat: string) => {
  switch (cat) {
    case "transporte": return transporteGif
    case "energia": return energiaGif
    case "domestico": return domesticaGif
    case "defensa": return defensaGif
    default: return energiaGif
  }
}

const ArtefactosList = () => {
  const navigate = useNavigate()

  // Check if user can view artifacts
  if (!canViewArtifacts()) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl text-red-400 mb-4">Acceso Restringido</h2>
          <p className="text-gray-300">No tienes permisos para ver los artefactos.</p>
          <button 
            onClick={() => navigate("/home")}
            className="mt-4 bg-cyan-400 text-black px-4 py-2 rounded"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const {
    artefactos,
    loadArtefactos,
    toggleArtefactoEstado,
  } = useArtefactos()

  const canManageEstado = canDeleteArtifacts()

  const [selected, setSelected] = useState<any>(null)

  // ===== FILTROS Y BÚSQUEDA (DISPONIBLES PARA TODOS) =====
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState<string>("todas")
  const [filterOrigen, setFilterOrigen] = useState<string>("todos")
  const [filterPeligrosidad, setFilterPeligrosidad] = useState<string>("todas")
  const [showFilters, setShowFilters] = useState(false)

  // Categorías y orígenes únicos para filtros
  const categorias = useMemo(() => {
    const cats = new Set(artefactos.map((a: any) => a.categoria))
    return Array.from(cats)
  }, [artefactos])

  const origenes = useMemo(() => {
    const ors = new Set(artefactos.map((a: any) => a.origen))
    return Array.from(ors)
  }, [artefactos])

  // Niveles de peligrosidad
  const nivelesPeligrosidad = ["Bajo", "Medio", "Alto", "Crítico"]

  // HU-10: Filtrar artefactos por nivel de seguridad del usuario
  const userSecurityLevel = getCurrentSecurityLevel()
  const maxVisibleLevel = userSecurityLevel * 2 // Nivel 5 puede ver hasta 10
  
  const artefactosVisibles = useMemo(() => {
    return artefactos.filter((a: any) => {
      const dangerLevel = a.nivelPeligrosidad ?? 1
      const confLevel = a.nivelConfidencialidad ?? 1
      // Solo mostrar artefactos que el usuario puede ver según su nivel
      return dangerLevel <= maxVisibleLevel && confLevel <= maxVisibleLevel
    })
  }, [artefactos, maxVisibleLevel])

  // Filtrar artefactos con filtros de UI (PARA TODOS LOS USUARIOS)
  const artefactosFiltrados = useMemo(() => {
    return artefactosVisibles.filter((a: any) => {
      // Búsqueda por nombre
      const matchSearch = searchTerm === "" || 
        a.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro por categoría
      const matchCategoria = filterCategoria === "todas" || a.categoria === filterCategoria

      // Filtro por origen
      const matchOrigen = filterOrigen === "todos" || a.origen === filterOrigen

      // Filtro por peligrosidad
      const matchPeligrosidad = filterPeligrosidad === "todas" || 
        (filterPeligrosidad === "Bajo" && a.nivelPeligrosidad <= 3) ||
        (filterPeligrosidad === "Medio" && a.nivelPeligrosidad > 3 && a.nivelPeligrosidad <= 6) ||
        (filterPeligrosidad === "Alto" && a.nivelPeligrosidad > 6 && a.nivelPeligrosidad <= 8) ||
        (filterPeligrosidad === "Crítico" && a.nivelPeligrosidad > 8)

      return matchSearch && matchCategoria && matchOrigen && matchPeligrosidad
    })
  }, [artefactosVisibles, searchTerm, filterCategoria, filterOrigen, filterPeligrosidad])
  
  // Contar artefactos ocultos por seguridad
  const hiddenCount = artefactos.length - artefactosVisibles.length

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("")
    setFilterCategoria("todas")
    setFilterOrigen("todos")
    setFilterPeligrosidad("todas")
  }

  useEffect(() => {
    loadArtefactos()
  }, [loadArtefactos])

  useEffect(() => {
    if (artefactos.length === 0) {
      setSelected(null)
      return
    }
    setSelected((prev: any) => {
      if (prev) {
        const fresh = artefactos.find((a) => a.id === prev.id)
        if (fresh) return fresh
      }
      return artefactos[0]
    })
  }, [artefactos])

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white flex relative"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="fixed top-20 right-5 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center">
          <img src={esfera} className="w-12 drop-shadow-[0_0_10px_orange]" />
          <span className="text-yellow-300 text-sm font-bold">Volver</span>
        </button>
      </div>

      <div className="relative z-10 flex w-full h-full p-4 gap-4">
        <div className="w-1/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4 flex flex-col h-full">
          <h2 className="text-yellow-300 font-bold mb-3">Inventario</h2>

          {/* ===== BARRA DE BÚSQUEDA (PARA TODOS) ===== */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar artefacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-orange-400/50 rounded-lg py-2 pl-10 pr-8 text-white placeholder-orange-300/50 text-sm focus:border-orange-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ===== BOTÓN DE FILTROS (PARA TODOS) ===== */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 mb-2 py-2 px-3 rounded-lg text-sm font-medium transition ${
              showFilters || filterCategoria !== "todas" || filterOrigen !== "todos" || filterPeligrosidad !== "todas"
                ? "bg-orange-500 text-white"
                : "bg-orange-800/60 text-orange-200 hover:bg-orange-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {(filterCategoria !== "todas" || filterOrigen !== "todos" || filterPeligrosidad !== "todas") && (
              <span className="bg-white text-orange-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {[filterCategoria, filterOrigen, filterPeligrosidad].filter(f => f !== "todas" && f !== "todos").length}
              </span>
            )}
          </button>

          {/* ===== PANEL DE FILTROS (PARA TODOS) ===== */}
          {showFilters && (
            <div className="bg-black/40 border border-orange-400/30 rounded-lg p-3 mb-3 space-y-3">
              {/* Filtro por Categoría */}
              <div>
                <label className="text-orange-300 text-xs font-medium mb-1 block">Categoría</label>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="w-full bg-orange-950/60 border border-orange-400/30 rounded py-1.5 px-2 text-white text-sm focus:border-orange-400 focus:outline-none"
                >
                  <option value="todas">Todas las categorías</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Origen */}
              <div>
                <label className="text-orange-300 text-xs font-medium mb-1 block">Origen</label>
                <select
                  value={filterOrigen}
                  onChange={(e) => setFilterOrigen(e.target.value)}
                  className="w-full bg-orange-950/60 border border-orange-400/30 rounded py-1.5 px-2 text-white text-sm focus:border-orange-400 focus:outline-none"
                >
                  <option value="todos">Todos los orígenes</option>
                  {origenes.map(orig => (
                    <option key={orig} value={orig}>{orig}</option>
                  ))}
                </select>
              </div>

              {/* Filtro por Peligrosidad */}
              <div>
                <label className="text-orange-300 text-xs font-medium mb-1 block">Nivel de Peligrosidad</label>
                <select
                  value={filterPeligrosidad}
                  onChange={(e) => setFilterPeligrosidad(e.target.value)}
                  className="w-full bg-orange-950/60 border border-orange-400/30 rounded py-1.5 px-2 text-white text-sm focus:border-orange-400 focus:outline-none"
                >
                  <option value="todas">Todos los niveles</option>
                  {nivelesPeligrosidad.map(nivel => (
                    <option key={nivel} value={nivel}>{nivel}</option>
                  ))}
                </select>
              </div>

              {/* Limpiar filtros */}
              <button
                onClick={clearFilters}
                className="w-full py-1.5 text-xs text-orange-300 hover:text-white border border-orange-400/30 rounded hover:bg-orange-800/50 transition"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Contador de resultados */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-300/70 text-xs">
              {artefactosFiltrados.length} de {artefactos.length} artefactos
            </p>
            {(searchTerm || filterCategoria !== "todas" || filterOrigen !== "todos" || filterPeligrosidad !== "todas") && (
              <p className="text-orange-400 text-xs">Filtrado</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {artefactosFiltrados?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-orange-300/50 mb-2">🔍</p>
                <p className="text-orange-300/70 text-sm">
                  {searchTerm || filterCategoria !== "todas" || filterOrigen !== "todos" || filterPeligrosidad !== "todas"
                    ? "No se encontraron artefactos con esos filtros"
                    : "No hay artefactos 🚫"}
                </p>
                {(searchTerm || filterCategoria !== "todas" || filterOrigen !== "todos" || filterPeligrosidad !== "todas") && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            ) : (
              artefactosFiltrados.map((a: any) => (
                <div
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`flex items-center gap-3 p-3 cursor-pointer rounded transition-all ${
                    selected?.id === a.id
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
                      : a.estado === "obsoleto"
                      ? "bg-orange-950/60 hover:bg-orange-800/80"
                      : "bg-orange-800 hover:bg-orange-700"
                  }`}
                >
                  <div className="flex flex-col items-center shrink-0">
                    <img
                      src={a.imagenPersonalizada ?? getGif(a.categoria)}
                      alt=""
                      className={`w-12 h-12 rounded object-cover border border-orange-500/50 bg-black/40 ${a.estado === "obsoleto" ? "grayscale opacity-70" : ""}`}
                    />
                    <div className={`text-xs font-medium mt-1 ${a.estado === "obsoleto" ? "text-gray-400" : "text-green-400"}`}>
                      {a.estado === "obsoleto" ? "Desactivado" : "Activado"}
                    </div>
                  </div>
                  <span className="font-medium"> {a.nombre}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-2/3 bg-orange-900/80 border-4 border-orange-400 rounded-xl p-4">
          {!selected ? (
            <p>Selecciona un artefacto</p>
          ) : (
            <>
              <div className="bg-orange-700 rounded mb-3 flex flex-col justify-center items-center h-52 overflow-hidden">
                <img
                  src={selected.imagenPersonalizada ?? getGif(selected.categoria)}
                  alt=""
                  className={`max-h-full max-w-full object-contain ${selected.estado === "obsoleto" ? "grayscale opacity-70" : ""}`}
                />
              </div>

              <h2 className="text-2xl text-yellow-300 font-bold mb-2">
                {selected.nombre}
              </h2>

              <div className="bg-gray-700 p-3 rounded mb-3 text-sm">
                {selected.descripcion}
              </div>

              <div className="space-y-1 text-sm">
                <p>⚙ {selected.categoria}</p>
                <p>🌍 {selected.origen}</p>
                <p>⚠ {selected.nivelPeligrosidad}</p>
                <p>🧪 {selected.inventor}</p>

                <p className={selected.estado === "obsoleto" ? "text-red-400" : "text-green-400"}>
                  {selected.estado === "obsoleto" ? "Inactivo" : "Activo"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/edit/${selected.id}`)}
                className="mt-4 w-full group relative overflow-hidden rounded-xl border-2 border-yellow-400/90 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-3 px-4 shadow-[0_0_22px_rgba(251,191,36,0.45)] transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(251,191,36,0.6)]"
              >
                <span className="flex items-center justify-center gap-3">
                  <img
                    src={capsuleIcon}
                    alt=""
                    className="h-11 w-11 object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.45)]"
                  />
                  <span className="text-black font-extrabold text-lg tracking-wide">
                    Editar artefacto
                  </span>
                </span>
              </button>

              {canManageEstado ? (
                <button
                  type="button"
                  onClick={async () => {
                    if (selected.estado === "obsoleto") {
                      await toggleArtefactoEstado(selected.id)
                    } else {
                      navigate(`/artefactos/delete/${selected.id}`)
                    }
                  }}
                  className={`mt-2 w-full py-2 rounded font-bold transition ${
                    selected.estado === "obsoleto"
                      ? "bg-green-500 hover:bg-green-400"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  {selected.estado === "obsoleto" ? "🟢 Activar" : "🗑 Desactivar"}
                </button>
              ) : (
                <p className="mt-3 text-xs text-gray-400 border border-orange-500/40 rounded-lg py-2 px-3">
                  Activar y desactivar artefactos solo está permitido para el rol Administrador.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtefactosList