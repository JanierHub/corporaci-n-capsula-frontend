/**
 * 🚧 MÓDULO EN PROGRESO - DESARROLLADO POR JUAN
 * 
 * 🔍 BÚSQUEDA AVANZADA - FRONTEND ONLY
 * 
 * ✅ YA IMPLEMENTADO:
 * - Consumo de datos con useArtefactos() (contexto)
 * - Filtros: búsqueda por texto, categorías (checkbox), origen, inventor
 * - Sliders de peligrosidad y confidencialidad (rango 1-10)
 * - Ordenamiento por nombre, peligrosidad, confidencialidad, inventor
 * - Vista lista y vista grid (toggle)
 * - Paginación (10/25/50 resultados por página)
 * - Estadísticas de resultados
 * - Diseño azul/cyan con estilo Capsule Corp
 * 
 * 🔧 POR IMPLEMENTAR:
 * - Autocompletado mientras escribe (sugerencias dropdown)
 * - Búsqueda difusa con fuse.js (encuentra similitudes: "caps" → "cápsula")
 * - Filtro por rango de fechas (date picker desde/hasta)
 * - Exportar resultados a CSV (generar archivo descargable)
 * - Atajo de teclado Ctrl+K para buscar
 * 
 * ⚠️ NOTA: Guardar búsquedas favoritas REQUIERE backend para persistir entre dispositivos.
 * Por ahora, NO implementar guardar favoritos (solo local no sirve).
 * 
 * 💡 NOTA: Todo es frontend usando datos del contexto.
 * NO requiere backend. NO crear nuevos endpoints.
 * 
 * 📂 Archivo: src/modules/busqueda/pages/BusquedaAvanzada.tsx
 * 🎨 Colores: azul (#3b82f6) / cyan (#06b6d4)
 */

import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  AlertTriangle,
  Shield,
  ArrowLeft,
  Grid3X3,
  List,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  Lightbulb,
  Target,
  Code,
  Save,
  Database
} from "lucide-react"

const BusquedaAvanzada = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()
  
  // ===== ESTADOS DE BÚSQUEDA =====
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([])
  const [selectedOrigen, setSelectedOrigen] = useState<string>("todos")
  const [selectedInventor, setSelectedInventor] = useState<string>("todos")
  const [peligrosidadRange, setPeligrosidadRange] = useState<[number, number]>([1, 10])
  const [confidencialidadRange, setConfidencialidadRange] = useState<[number, number]>([1, 10])
  const [estado, setEstado] = useState<string>("todos")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [sortBy, setSortBy] = useState<string>("nombre")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showFilters, setShowFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  
  // ===== VALORES ÚNICOS PARA FILTROS =====
  const inventores = useMemo(() => {
    const invs = new Set(artefactos.map(a => a.inventor).filter(Boolean))
    return Array.from(invs)
  }, [artefactos])
  
  const categorias = ["transporte", "defensa", "domestico", "energia"]
  
  // ===== FILTRAR Y ORDENAR RESULTADOS =====
  const resultadosFiltrados = useMemo(() => {
    let results = artefactos.filter(a => {
      // Búsqueda por texto
      const matchSearch = searchTerm === "" || 
        a.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtro por categorías (múltiple)
      const matchCategoria = selectedCategorias.length === 0 || selectedCategorias.includes(a.categoria)
      
      // Filtro por origen
      const matchOrigen = selectedOrigen === "todos" || a.origen === selectedOrigen
      
      // Filtro por inventor
      const matchInventor = selectedInventor === "todos" || a.inventor === selectedInventor
      
      // Filtro por peligrosidad
      const matchPeligrosidad = a.nivelPeligrosidad >= peligrosidadRange[0] && 
                                a.nivelPeligrosidad <= peligrosidadRange[1]
      
      // Filtro por confidencialidad
      const matchConfidencialidad = a.nivelConfidencialidad >= confidencialidadRange[0] && 
                                    a.nivelConfidencialidad <= confidencialidadRange[1]
      
      // Filtro por estado
      const matchEstado = estado === "todos" || (a.estado || "activo") === estado
      
      return matchSearch && matchCategoria && matchOrigen && matchInventor && 
             matchPeligrosidad && matchConfidencialidad && matchEstado
    })
    
    // Ordenamiento
    results.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "nombre":
          comparison = a.nombre.localeCompare(b.nombre)
          break
        case "peligrosidad":
          comparison = a.nivelPeligrosidad - b.nivelPeligrosidad
          break
        case "confidencialidad":
          comparison = a.nivelConfidencialidad - b.nivelConfidencialidad
          break
        case "inventor":
          comparison = a.inventor.localeCompare(b.inventor)
          break
        case "fecha":
          comparison = new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime()
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })
    
    return results
  }, [artefactos, searchTerm, selectedCategorias, selectedOrigen, selectedInventor, 
      peligrosidadRange, confidencialidadRange, estado, sortBy, sortOrder])
  
  // ===== PAGINACIÓN =====
  const totalPages = Math.ceil(resultadosFiltrados.length / resultsPerPage)
  const paginatedResults = resultadosFiltrados.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  )
  
  // ===== LIMPIAR FILTROS =====
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategorias([])
    setSelectedOrigen("todos")
    setSelectedInventor("todos")
    setPeligrosidadRange([1, 10])
    setConfidencialidadRange([1, 10])
    setEstado("todos")
    setFechaDesde("")
    setFechaHasta("")
    setCurrentPage(1)
  }
  
  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case "activo": return "bg-emerald-500/20 text-emerald-400"
      case "obsoleto": return "bg-red-500/20 text-red-400"
      case "en_pruebas": return "bg-amber-500/20 text-amber-400"
      default: return "bg-emerald-500/20 text-emerald-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/60 border-b border-blue-400/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al inicio
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                  <Search className="w-6 h-6" />
                  Búsqueda Avanzada
                </h1>
                <p className="text-gray-400 text-sm">Responsable: Juan | Estado: En desarrollo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="p-2 bg-blue-400/10 border border-blue-400/30 rounded-lg hover:bg-blue-400/20 transition"
              >
                {viewMode === "list" ? <Grid3X3 className="w-5 h-5" /> : <List className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ===== PANEL DE FILTROS ===== */}
          <div className={`${showFilters ? "lg:w-80" : "lg:w-0"} transition-all overflow-hidden`}>
            <div className="bg-black/40 border border-blue-400/30 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-blue-400 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Limpiar
                </button>
              </div>

              {/* Búsqueda por texto */}
              <div>
                <label className="text-blue-400/70 text-xs mb-1 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400/50 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Nombre, descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-blue-400/30 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder-blue-400/30"
                  />
                </div>
              </div>

              {/* Categorías */}
              <div>
                <label className="text-blue-400/70 text-xs mb-1 block">Categorías</label>
                <div className="space-y-1">
                  {categorias.map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategorias.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategorias([...selectedCategorias, cat])
                          } else {
                            setSelectedCategorias(selectedCategorias.filter(c => c !== cat))
                          }
                        }}
                        className="rounded border-blue-400/30"
                      />
                      <span className="capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origen */}
              <div>
                <label className="text-blue-400/70 text-xs mb-1 block">Origen</label>
                <select
                  value={selectedOrigen}
                  onChange={(e) => setSelectedOrigen(e.target.value)}
                  className="w-full bg-black/40 border border-blue-400/30 rounded-lg py-2 px-3 text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="terrestre">Terrestre</option>
                  <option value="extraterrestre">Extraterrestre</option>
                </select>
              </div>

              {/* Inventor */}
              <div>
                <label className="text-blue-400/70 text-xs mb-1 block">Inventor</label>
                <select
                  value={selectedInventor}
                  onChange={(e) => setSelectedInventor(e.target.value)}
                  className="w-full bg-black/40 border border-blue-400/30 rounded-lg py-2 px-3 text-sm"
                >
                  <option value="todos">Todos</option>
                  {inventores.map(inv => (
                    <option key={inv} value={inv}>{inv}</option>
                  ))}
                </select>
              </div>

              {/* Rango de peligrosidad */}
              <div>
                <label className="text-blue-400/70 text-xs mb-1 block flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Peligrosidad: {peligrosidadRange[0]} - {peligrosidadRange[1]}
                </label>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={peligrosidadRange[0]}
                    onChange={(e) => setPeligrosidadRange([parseInt(e.target.value), peligrosidadRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={peligrosidadRange[1]}
                    onChange={(e) => setPeligrosidadRange([peligrosidadRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="text-blue-400/70 text-xs mb-1 block">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full bg-black/40 border border-blue-400/30 rounded-lg py-2 px-3 text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="obsoleto">Obsoleto</option>
                  <option value="en_pruebas">En Pruebas</option>
                </select>
              </div>
            </div>

            {/* Info del Módulo */}
            <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-blue-400">🚧 Módulo en Progreso - Juan</h4>
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Frontend Only</span>
              </div>
              
              <div className="mb-3">
                <p className="text-xs text-cyan-400 mb-1">✅ Ya implementado:</p>
                <ul className="space-y-1 text-xs text-gray-500 ml-2">
                  <li>• Filtros (categoría, origen, inventor)</li>
                  <li>• Vista lista y grid</li>
                  <li>• Paginación</li>
                  <li>• Ordenamiento</li>
                  <li>• Consumo de datos con useArtefactos()</li>
                </ul>
              </div>
              
              <div>
                <p className="text-xs text-amber-400 mb-1">🔧 Por implementar:</p>
                <ul className="space-y-1 text-xs text-gray-400 ml-2">
                  <li>• Autocompletado</li>
                  <li>• Búsqueda difusa (fuzzy)</li>
                  <li>• Filtro por fechas</li>
                  <li>• Exportar CSV</li>
                </ul>
              </div>
              
              <div className="mt-3 p-2 bg-amber-900/20 border border-amber-500/30 rounded">
                <p className="text-xs text-amber-400">⚠️ Guardar favoritos REQUIERE backend para persistir entre dispositivos. No implementar aún.</p>
              </div>
            </div>
          </div>

          {/* ===== RESULTADOS ===== */}
          <div className="flex-1">
            {/* Barra de ordenamiento y stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <p className="text-gray-400 text-sm">
                Mostrando <span className="text-blue-400 font-bold">{paginatedResults.length}</span> de{" "}
                <span className="text-blue-400 font-bold">{resultadosFiltrados.length}</span> resultados
              </p>
              
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/40 border border-blue-400/30 rounded-lg py-1.5 px-3 text-sm"
                >
                  <option value="nombre">Ordenar por nombre</option>
                  <option value="peligrosidad">Ordenar por peligrosidad</option>
                  <option value="confidencialidad">Ordenar por confidencialidad</option>
                  <option value="inventor">Ordenar por inventor</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-1.5 bg-blue-400/10 border border-blue-400/30 rounded-lg"
                >
                  <ArrowUpDown className={`w-4 h-4 transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Lista de resultados */}
            {viewMode === "list" ? (
              <div className="bg-black/40 border border-blue-400/30 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-500/10 border-b border-blue-500/30">
                    <tr>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm">Nombre</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm">Categoría</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm">Inventor</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm">Peligro</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-500/10">
                    {paginatedResults.map((a) => (
                      <tr 
                        key={a.id} 
                        className="hover:bg-blue-500/5 transition cursor-pointer"
                        onClick={() => navigate(`/edit/${a.id}`)}
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{a.nombre}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{a.descripcion}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-400/10 rounded text-xs capitalize">
                            {a.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{a.inventor}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${a.nivelPeligrosidad > 6 ? "text-red-400" : a.nivelPeligrosidad > 3 ? "text-amber-400" : "text-emerald-400"}`}>
                            {a.nivelPeligrosidad}/10
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${getEstadoColor(a.estado)}`}>
                            {a.estado || "activo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedResults.map((a) => (
                  <div 
                    key={a.id}
                    className="bg-black/40 border border-blue-400/30 rounded-xl p-4 hover:border-blue-400/50 transition cursor-pointer"
                    onClick={() => navigate(`/edit/${a.id}`)}
                  >
                    <h3 className="font-bold text-white mb-2">{a.nombre}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{a.descripcion}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-400/10 rounded capitalize">{a.categoria}</span>
                      <span className="px-2 py-1 bg-purple-400/10 rounded">{a.inventor}</span>
                      <span className={`px-2 py-1 rounded ${getEstadoColor(a.estado)}`}>
                        {a.estado || "activo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Resultados por página:</span>
                  <select
                    value={resultsPerPage}
                    onChange={(e) => {
                      setResultsPerPage(parseInt(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="bg-black/40 border border-blue-400/30 rounded-lg py-1 px-2 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-blue-400/10 border border-blue-400/30 rounded-lg disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-blue-400/10 border border-blue-400/30 rounded-lg disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ===== SECCIÓN DE EJEMPLOS E INSTRUCCIONES ===== */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Ejemplo de exportar CSV */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Ejemplo: Exportar a CSV
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Botón para descargar resultados actuales en archivo CSV:
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition text-emerald-400">
            <Download className="w-4 h-4" />
            Exportar {resultadosFiltrados.length} resultados a CSV
          </button>
          <p className="text-xs text-amber-400/70 mt-3">
            ⚠️ Nota: Guardar búsquedas favoritas requiere backend. No implementar aún.
          </p>
        </div>
        
        {/* Ejemplo de autocompletado */}
        <div className="mt-6 bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Ejemplo: Autocompletado Inteligente (Por implementar)
          </h3>
          <div className="relative">
            <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300">capsule ene...</span>
            </div>
            <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-cyan-500/30 rounded-lg p-2 space-y-1">
              <p className="text-xs text-cyan-400/70 px-2">Sugerencias:</p>
              <button className="w-full text-left px-2 py-1.5 hover:bg-cyan-400/10 rounded text-sm text-white">
                🔍 <span className="text-cyan-400">Capsule</span> de <span className="text-cyan-400">Ene</span>rgía portátil
              </button>
              <button className="w-full text-left px-2 py-1.5 hover:bg-cyan-400/10 rounded text-sm text-white">
                🔍 <span className="text-cyan-400">Capsule</span> Corp Modelo <span className="text-cyan-400">Ene</span>rgético
              </button>
            </div>
          </div>
        </div>
        
        {/* Módulo en Progreso - Juan */}
        <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
              <Code className="w-5 h-5" />
              🚧 Módulo en Progreso - Desarrollado por Juan
            </h3>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
              Frontend Only
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-cyan-400 font-medium text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Funcionalidades a Implementar
              </h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 rounded border-blue-500" />
                  <span><strong>Autocompletado</strong> - Sugerencias al escribir</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 rounded border-blue-500" />
                  <span><strong>Búsqueda difusa</strong> (fuse.js) - Encuentra similitudes</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 rounded border-blue-500" />
                  <span><strong>Date picker</strong> - Filtro por rango de fechas</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 rounded border-blue-500" />
                  <span><strong>Exportar CSV</strong> - Descargar resultados</span>
                </li>
                <li className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 rounded border-blue-500" />
                  <span><strong>Atajos de teclado</strong> - Ctrl+K para buscar</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-amber-400 font-medium text-sm flex items-center gap-2">
                <Save className="w-4 h-4" />
                Requiere Backend
              </h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li className="flex items-start gap-2">
                  <span>❌ <strong>Guardar favoritos</strong> - Necesita backend para persistir entre dispositivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>❌ <strong>Historial de búsquedas</strong> - Requiere guardar en servidor</span>
                </li>
              </ul>
              <p className="text-xs text-amber-400/70 mt-2">No implementar hasta tener backend listo</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-cyan-900/30 border border-cyan-500/30 rounded-lg">
            <p className="text-cyan-400 text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <strong>Tip:</strong> Instala <code className="text-blue-400">fuse.js</code> para búsqueda difusa: <code className="text-gray-300">npm install fuse.js</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusquedaAvanzada
