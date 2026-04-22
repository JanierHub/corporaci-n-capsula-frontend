import { useState, useMemo } from "react"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { useNavigate } from "react-router-dom"
import { 
  Search, 
  Filter, 
  X, 
  Eye, 
  Power, 
  PowerOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package
} from "lucide-react"

const AuditModule = () => {
  const navigate = useNavigate()
  const { artefactos, toggleArtefactoEstado, loadArtefactos } = useArtefactos()
  
  // ===== ESTADOS DE FILTROS =====
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState<string>("todas")
  const [filterEstado, setFilterEstado] = useState<string>("todos")
  const [filterOrigen, setFilterOrigen] = useState<string>("todos")
  const [filterPeligrosidad, setFilterPeligrosidad] = useState<string>("todas")
  const [showFilters, setShowFilters] = useState(true)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  
  // ===== VALORES ÚNICOS PARA FILTROS =====
  const categorias = useMemo(() => {
    const cats = new Set(artefactos.map(a => a.categoria))
    return Array.from(cats)
  }, [artefactos])
  
  const origenes = useMemo(() => {
    const origs = new Set(artefactos.map(a => a.origen))
    return Array.from(origs)
  }, [artefactos])
  
  const nivelesPeligrosidad = ["Bajo", "Medio", "Alto", "Crítico"]
  
  // ===== FILTRAR ARTEFACTOS =====
  const artefactosFiltrados = useMemo(() => {
    return artefactos.filter((a) => {
      // Búsqueda por nombre, descripción o inventor
      const matchSearch = searchTerm === "" || 
        a.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.inventor?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtro por categoría
      const matchCategoria = filterCategoria === "todas" || a.categoria === filterCategoria
      
      // Filtro por estado
      const matchEstado = filterEstado === "todos" || a.estado === filterEstado
      
      // Filtro por origen
      const matchOrigen = filterOrigen === "todos" || a.origen === filterOrigen
      
      // Filtro por peligrosidad
      const matchPeligrosidad = filterPeligrosidad === "todas" || 
        (filterPeligrosidad === "Bajo" && a.nivelPeligrosidad <= 3) ||
        (filterPeligrosidad === "Medio" && a.nivelPeligrosidad > 3 && a.nivelPeligrosidad <= 6) ||
        (filterPeligrosidad === "Alto" && a.nivelPeligrosidad > 6 && a.nivelPeligrosidad <= 8) ||
        (filterPeligrosidad === "Crítico" && a.nivelPeligrosidad > 8)
      
      return matchSearch && matchCategoria && matchEstado && matchOrigen && matchPeligrosidad
    })
  }, [artefactos, searchTerm, filterCategoria, filterEstado, filterOrigen, filterPeligrosidad])
  
  // ===== LIMPIAR FILTROS =====
  const clearFilters = () => {
    setSearchTerm("")
    setFilterCategoria("todas")
    setFilterEstado("todos")
    setFilterOrigen("todos")
    setFilterPeligrosidad("todas")
    setSelectedItems(new Set())
  }
  
  // ===== ACTIVAR/DESACTIVAR MÚLTIPLES =====
  const handleSelectAll = () => {
    if (selectedItems.size === artefactosFiltrados.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(artefactosFiltrados.map(a => a.id)))
    }
  }
  
  const handleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }
  
  // ===== ACTIVAR/DESACTIVAR INDIVIDUAL =====
  const handleToggleEstado = async (id: number) => {
    await toggleArtefactoEstado(id)
  }
  
  // ===== REFRESCAR DATOS =====
  const handleRefresh = async () => {
    await loadArtefactos()
  }
  
  // ===== EXPORTAR A CSV =====
  const handleExport = () => {
    const headers = ["ID", "Nombre", "Categoría", "Origen", "Peligrosidad", "Estado", "Inventor"]
    const rows = artefactosFiltrados.map(a => [
      a.id,
      a.nombre,
      a.categoria,
      a.origen,
      a.nivelPeligrosidad,
      a.estado || "activo",
      a.inventor
    ])
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `artefactos_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // ===== HELPERS =====
  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case "activo": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
      case "obsoleto": return "bg-red-500/20 text-red-400 border-red-500/50"
      case "en_pruebas": return "bg-amber-500/20 text-amber-400 border-amber-500/50"
      default: return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
    }
  }
  
  const getEstadoIcon = (estado?: string) => {
    switch (estado) {
      case "activo": return <CheckCircle2 className="w-4 h-4" />
      case "obsoleto": return <PowerOff className="w-4 h-4" />
      case "en_pruebas": return <Clock className="w-4 h-4" />
      default: return <CheckCircle2 className="w-4 h-4" />
    }
  }
  
  const getPeligrosidadColor = (nivel: number) => {
    if (nivel <= 3) return "text-emerald-400"
    if (nivel <= 6) return "text-amber-400"
    if (nivel <= 8) return "text-orange-400"
    return "text-red-400"
  }

  return (
    <div className="bg-black/40 border border-cyan-400/30 rounded-xl backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-cyan-400/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Gestión de Artefactos
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 bg-cyan-400/10 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/20 transition"
              title="Refrescar"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-emerald-400/10 border border-emerald-400/30 rounded-lg hover:bg-emerald-400/20 transition text-emerald-400 text-sm"
            >
              Exportar CSV
            </button>
          </div>
        </div>
        
        {/* ===== BARRA DE BÚSQUEDA ===== */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/50 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o inventor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-cyan-400/30 rounded-lg py-2.5 pl-10 pr-12 text-white placeholder-cyan-400/30 focus:border-cyan-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400/50 hover:text-cyan-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* ===== BOTÓN DE FILTROS ===== */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition ${
            showFilters 
              ? "bg-cyan-400/20 border border-cyan-400/50 text-cyan-300" 
              : "bg-black/40 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
          }`}
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          {(filterCategoria !== "todas" || filterEstado !== "todos" || filterOrigen !== "todos" || filterPeligrosidad !== "todas") && (
            <span className="bg-cyan-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {[filterCategoria, filterEstado, filterOrigen, filterPeligrosidad].filter(f => f !== "todas" && f !== "todos").length}
            </span>
          )}
        </button>
        
        {/* ===== PANEL DE FILTROS ===== */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-black/20 rounded-lg border border-cyan-400/10">
            {/* Filtro por Estado */}
            <div>
              <label className="text-cyan-400/70 text-xs font-medium mb-1.5 block">Estado</label>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full bg-black/40 border border-cyan-400/30 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="obsoleto">Obsoleto</option>
                <option value="en_pruebas">En Pruebas</option>
              </select>
            </div>
            
            {/* Filtro por Categoría */}
            <div>
              <label className="text-cyan-400/70 text-xs font-medium mb-1.5 block">Categoría</label>
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="w-full bg-black/40 border border-cyan-400/30 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro por Origen */}
            <div>
              <label className="text-cyan-400/70 text-xs font-medium mb-1.5 block">Origen</label>
              <select
                value={filterOrigen}
                onChange={(e) => setFilterOrigen(e.target.value)}
                className="w-full bg-black/40 border border-cyan-400/30 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value="todos">Todos los orígenes</option>
                {origenes.map(orig => (
                  <option key={orig} value={orig}>{orig}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro por Peligrosidad */}
            <div>
              <label className="text-cyan-400/70 text-xs font-medium mb-1.5 block">Peligrosidad</label>
              <select
                value={filterPeligrosidad}
                onChange={(e) => setFilterPeligrosidad(e.target.value)}
                className="w-full bg-black/40 border border-cyan-400/30 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-400 focus:outline-none"
              >
                <option value="todas">Todos los niveles</option>
                {nivelesPeligrosidad.map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* ===== CONTADOR Y LIMPIAR ===== */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-cyan-400/70 text-sm">
            Mostrando <span className="text-cyan-400 font-bold">{artefactosFiltrados.length}</span> de{" "}
            <span className="text-cyan-400 font-bold">{artefactos.length}</span> artefactos
            {selectedItems.size > 0 && (
              <span className="ml-2 text-emerald-400">({selectedItems.size} seleccionados)</span>
            )}
          </p>
          {(searchTerm || filterCategoria !== "todas" || filterEstado !== "todos" || filterOrigen !== "todos" || filterPeligrosidad !== "todas") && (
            <button
              onClick={clearFilters}
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
      
      {/* ===== TABLA DE ARTEFACTOS ===== */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/40 border-b border-cyan-400/20">
            <tr>
              <th className="py-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.size === artefactosFiltrados.length && artefactosFiltrados.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-cyan-400/30 bg-black/40 text-cyan-400 focus:ring-cyan-400"
                />
              </th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">Nombre</th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">Categoría</th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">Origen</th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">Peligro</th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">Estado</th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">Inventor</th>
              <th className="py-3 px-4 text-left text-cyan-400/70 text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-400/10">
            {artefactosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="text-cyan-400/30 text-5xl mb-4">📭</div>
                  <p className="text-cyan-400/50 mb-2">
                    {searchTerm || filterCategoria !== "todas" || filterEstado !== "todos" || filterOrigen !== "todos" || filterPeligrosidad !== "todas"
                      ? "No se encontraron artefactos con esos filtros"
                      : "No hay artefactos en el sistema"}
                  </p>
                  {(searchTerm || filterCategoria !== "todas" || filterEstado !== "todos" || filterOrigen !== "todos" || filterPeligrosidad !== "todas") && (
                    <button
                      onClick={clearFilters}
                      className="text-cyan-400 hover:text-cyan-300 text-sm underline"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              artefactosFiltrados.map((artefacto) => (
                <tr 
                  key={artefacto.id} 
                  className={`hover:bg-cyan-400/5 transition ${
                    selectedItems.has(artefacto.id) ? "bg-cyan-400/10" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(artefacto.id)}
                      onChange={() => handleSelectItem(artefacto.id)}
                      className="rounded border-cyan-400/30 bg-black/40 text-cyan-400 focus:ring-cyan-400"
                    />
                  </td>
                  <td className="py-3 px-4 text-cyan-400/50 text-sm">#{artefacto.id}</td>
                  <td className="py-3 px-4">
                    <p className="text-white font-medium">{artefacto.nombre}</p>
                    <p className="text-cyan-400/50 text-xs truncate max-w-xs">
                      {artefacto.descripcion?.substring(0, 50)}...
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400/80 text-xs capitalize">
                      {artefacto.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400/70 text-sm capitalize">
                    {artefacto.origen}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${getPeligrosidadColor(artefacto.nivelPeligrosidad)}`}>
                      {artefacto.nivelPeligrosidad}/10
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoColor(artefacto.estado)}`}>
                      {getEstadoIcon(artefacto.estado)}
                      <span className="capitalize">{artefacto.estado || "activo"}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-cyan-400/70 text-sm">
                    {artefacto.inventor}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/edit/${artefacto.id}`)}
                        className="p-1.5 bg-cyan-400/10 border border-cyan-400/30 rounded hover:bg-cyan-400/20 transition"
                        title="Ver/Editar"
                      >
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => handleToggleEstado(artefacto.id)}
                        className={`p-1.5 border rounded transition ${
                          artefacto.estado === "obsoleto"
                            ? "bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20"
                            : "bg-red-400/10 border-red-400/30 hover:bg-red-400/20"
                        }`}
                        title={artefacto.estado === "obsoleto" ? "Activar" : "Desactivar"}
                      >
                        {artefacto.estado === "obsoleto" ? (
                          <Power className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <PowerOff className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* ===== FOOTER CON ACCIONES MASIVAS ===== */}
      {selectedItems.size > 0 && (
        <div className="p-4 bg-cyan-400/10 border-t border-cyan-400/20 flex items-center justify-between">
          <p className="text-cyan-400 text-sm">
            {selectedItems.size} artefacto(s) seleccionado(s)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedItems(new Set())}
              className="px-4 py-2 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                for (const id of selectedItems) {
                  await toggleArtefactoEstado(id)
                }
                setSelectedItems(new Set())
              }}
              className="px-4 py-2 bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 rounded-lg hover:bg-cyan-400/30 transition text-sm"
            >
              Alternar Estado
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditModule
