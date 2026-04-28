/**
 * � MÓDULO BÚSQUEDA AVANZADA - DESARROLLADO POR JUAN
 * 📂 Archivo: src/modules/busqueda/pages/BusquedaAvanzada.tsx
 * 🎨 Colores: azul (#3b82f6) / cyan (#06b6d4)
 *
 * ✅ FUNCIONALIDADES:
 * - Consumo de datos con useArtefactos() (contexto)
 * - Filtros: búsqueda por texto, categorías, origen, inventor
 * - Sliders de peligrosidad y confidencialidad (rango 1-10)
 * - Ordenamiento por múltiples criterios
 * - Vista lista y vista grid
 * - Paginación (10/25/50 resultados por página)
 * - Estadísticas de resultados
 * - Autocompletado mientras escribe
 * - Búsqueda difusa con fuse.js
 * - Filtro por rango de fechas
 * - Exportar resultados a CSV
 * - Atajo de teclado Ctrl+K para buscar
 */

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Fuse from "fuse.js"
import {
  Search, Filter, User, AlertTriangle, ArrowLeft,
  Grid3X3, List, ArrowUpDown, X, Download, Lightbulb,
  Calendar, Shield
} from "lucide-react"

// ── Helpers visuales ──────────────────────────────────────────
const getEstadoColor = (estado?: string) => {
  switch (estado) {
    case "activo":     return "bg-emerald-500/20 text-emerald-400"
    case "obsoleto":   return "bg-red-500/20 text-red-400"
    case "en_pruebas": return "bg-amber-500/20 text-amber-400"
    default:           return "bg-emerald-500/20 text-emerald-400"
  }
}

const getEstadoLabel = (estado?: string) => {
  switch (estado) {
    case "activo":     return "Activo"
    case "obsoleto":   return "Obsoleto"
    case "en_pruebas": return "En pruebas"
    default:           return "Activo"
  }
}

const getPeligrosidadColor = (nivel: number) => {
  if (nivel > 6) return "text-red-400"
  if (nivel > 3) return "text-amber-400"
  return "text-emerald-400"
}

const categorias = ["transporte", "defensa", "domestico", "energia"] as const

// ── Exportar CSV ──────────────────────────────────────────────
const exportarCSV = (datos: ReturnType<typeof Array.prototype.slice>) => {
  const headers = ["ID", "Nombre", "Descripción", "Categoría", "Origen",
                   "Inventor", "Peligrosidad", "Confidencialidad", "Estado", "Fecha Creación"]
  const filas = datos.map((a: any) => [
    a.id,
    `"${a.nombre}"`,
    `"${(a.descripcion ?? "").replace(/"/g, '""')}"`,
    a.categoria,
    a.origen,
    `"${a.inventor}"`,
    a.nivelPeligrosidad,
    a.nivelConfidencialidad,
    a.estado ?? "activo",
    a.fechaCreacion,
  ])
  const csv = [headers.join(","), ...filas.map(f => f.join(","))].join("\n")
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href     = url
  link.download = `artefactos_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────────────────────────
const BusquedaAvanzada = () => {
  const navigate          = useNavigate()
  const { artefactos }    = useArtefactos()
  const searchInputRef    = useRef<HTMLInputElement>(null)
  const dropdownRef       = useRef<HTMLDivElement>(null)

  // ── Estados filtros ───────────────────────────────────────
  const [searchTerm,          setSearchTerm]          = useState("")
  const [selectedCategorias,  setSelectedCategorias]  = useState<string[]>([])
  const [selectedOrigen,      setSelectedOrigen]      = useState("todos")
  const [selectedInventor,    setSelectedInventor]    = useState("todos")
  const [peligrosidadRange,   setPeligrosidadRange]   = useState<[number, number]>([1, 10])
  const [confidencialidadRange, setConfidencialidadRange] = useState<[number, number]>([1, 10])
  const [estado,              setEstado]              = useState("todos")
  const [fechaDesde,          setFechaDesde]          = useState<Date | null>(null)
  const [fechaHasta,          setFechaHasta]          = useState<Date | null>(null)

  // ── Estados UI ────────────────────────────────────────────
  const [sortBy,          setSortBy]          = useState("nombre")
  const [sortOrder,       setSortOrder]       = useState<"asc" | "desc">("asc")
  const [viewMode,        setViewMode]        = useState<"list" | "grid">("list")
  const [showFilters,     setShowFilters]     = useState(true)
  const [currentPage,     setCurrentPage]     = useState(1)
  const [resultsPerPage,  setResultsPerPage]  = useState(10)
  const [suggestions,     setSuggestions]     = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // ── Fuse.js (búsqueda difusa) ─────────────────────────────
  const fuse = useMemo(() => new Fuse(artefactos, {
    keys: ["nombre", "descripcion", "inventor"],
    threshold: 0.4,       // 0 = exacto, 1 = cualquier cosa
    includeScore: true,
    minMatchCharLength: 2,
  }), [artefactos])

  // ── Inventores únicos ─────────────────────────────────────
  const inventores = useMemo(() => {
    const set = new Set(artefactos.map(a => a.inventor).filter(Boolean))
    return Array.from(set)
  }, [artefactos])

  // ── Ctrl+K abre el buscador ───────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // ── Cerrar dropdown al hacer clic afuera ──────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // ── Autocompletado: genera sugerencias con Fuse ───────────
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)

    if (value.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const results = fuse.search(value, { limit: 6 })
    const names   = [...new Set(results.map(r => r.item.nombre))]
    setSuggestions(names)
    setShowSuggestions(names.length > 0)
  }, [fuse])

  const applySuggestion = (name: string) => {
    setSearchTerm(name)
    setShowSuggestions(false)
    setCurrentPage(1)
  }

  // ── Filtrar y ordenar ─────────────────────────────────────
  const resultadosFiltrados = useMemo(() => {
    // Si hay término de búsqueda, usar Fuse para obtener IDs relevantes
    let idsFuse: Set<number> | null = null
    if (searchTerm.trim().length >= 2) {
      const fuseResults = fuse.search(searchTerm)
      idsFuse = new Set(fuseResults.map(r => r.item.id))
    }

    let results = artefactos.filter(a => {
      // Búsqueda difusa o texto exacto
      const matchSearch =
        searchTerm.trim() === "" ||
        (idsFuse ? idsFuse.has(a.id) : (
          a.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        ))

      const matchCategoria =
        selectedCategorias.length === 0 || selectedCategorias.includes(a.categoria)

      const matchOrigen =
        selectedOrigen === "todos" || a.origen === selectedOrigen

      const matchInventor =
        selectedInventor === "todos" || a.inventor === selectedInventor

      const matchPeligrosidad =
        a.nivelPeligrosidad >= peligrosidadRange[0] &&
        a.nivelPeligrosidad <= peligrosidadRange[1]

      const matchConfidencialidad =
        a.nivelConfidencialidad >= confidencialidadRange[0] &&
        a.nivelConfidencialidad <= confidencialidadRange[1]

      const matchEstado =
        estado === "todos" || (a.estado ?? "activo") === estado

      // Filtro por fechas
      const fechaArtefacto = a.fechaCreacion ? new Date(a.fechaCreacion) : null
      const matchFechaDesde =
        !fechaDesde || !fechaArtefacto || fechaArtefacto >= fechaDesde
      const matchFechaHasta =
        !fechaHasta || !fechaArtefacto || fechaArtefacto <= fechaHasta

      return (
        matchSearch && matchCategoria && matchOrigen && matchInventor &&
        matchPeligrosidad && matchConfidencialidad && matchEstado &&
        matchFechaDesde && matchFechaHasta
      )
    })

    // Ordenamiento
    results.sort((a, b) => {
      let cmp = 0
      switch (sortBy) {
        case "nombre":          cmp = a.nombre.localeCompare(b.nombre); break
        case "peligrosidad":    cmp = a.nivelPeligrosidad - b.nivelPeligrosidad; break
        case "confidencialidad":cmp = a.nivelConfidencialidad - b.nivelConfidencialidad; break
        case "inventor":        cmp = a.inventor.localeCompare(b.inventor); break
        case "fecha":           cmp = a.fechaCreacion.localeCompare(b.fechaCreacion); break
      }
      return sortOrder === "asc" ? cmp : -cmp
    })

    return results
  }, [
    artefactos, searchTerm, fuse, selectedCategorias, selectedOrigen,
    selectedInventor, peligrosidadRange, confidencialidadRange,
    estado, fechaDesde, fechaHasta, sortBy, sortOrder,
  ])

  // ── Paginación ────────────────────────────────────────────
  const totalPages       = Math.ceil(resultadosFiltrados.length / resultsPerPage)
  const paginatedResults = resultadosFiltrados.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  )

  // ── Limpiar filtros ───────────────────────────────────────
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategorias([])
    setSelectedOrigen("todos")
    setSelectedInventor("todos")
    setPeligrosidadRange([1, 10])
    setConfidencialidadRange([1, 10])
    setEstado("todos")
    setFechaDesde(null)
    setFechaHasta(null)
    setCurrentPage(1)
    setSuggestions([])
  }

  // ── Clases reutilizables ──────────────────────────────────
  const selectClass =
    "w-full bg-black/40 border border-blue-400/30 rounded-lg py-2 px-3 text-sm text-white " +
    "focus:outline-none focus:ring-2 focus:ring-blue-400/50"

  const labelClass = "text-blue-400/70 text-xs mb-1 block"

  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

      {/* ── Header ── */}
      <div className="bg-black/60 border-b border-blue-400/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                <Search className="w-6 h-6" />
                Búsqueda Avanzada
              </h1>
              <p className="text-gray-400 text-sm">
                {resultadosFiltrados.length} resultado
                {resultadosFiltrados.length !== 1 ? "s" : ""} encontrado
                {resultadosFiltrados.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Exportar CSV */}
            <button
              onClick={() => exportarCSV(resultadosFiltrados)}
              title="Exportar resultados a CSV"
              className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30
                         rounded-lg hover:bg-emerald-500/20 transition text-emerald-400 text-sm"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            {/* Toggle filtros */}
            <button
              onClick={() => setShowFilters(p => !p)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-400/10 border border-blue-400/30
                         rounded-lg hover:bg-blue-400/20 transition text-blue-400 text-sm"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar" : "Filtros"}
            </button>
            {/* Toggle vista */}
            <button
              onClick={() => setViewMode(v => v === "list" ? "grid" : "list")}
              className="p-2 bg-blue-400/10 border border-blue-400/30 rounded-lg
                         hover:bg-blue-400/20 transition text-blue-400"
            >
              {viewMode === "list" ? <Grid3X3 className="w-5 h-5" /> : <List className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Panel filtros ── */}
          {showFilters && (
            <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
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
                    Limpiar todo
                  </button>
                </div>

                {/* Búsqueda con autocompletado */}
                <div ref={dropdownRef}>
                  <label htmlFor="search-input" className={labelClass}>
                    Buscar{" "}
                    <span className="text-blue-400/40 normal-case font-normal ml-1">
                      Ctrl+K
                    </span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/50 w-4 h-4 pointer-events-none" />
                    <input
                      id="search-input"
                      ref={searchInputRef}
                      type="text"
                      placeholder="Nombre, descripción, inventor..."
                      value={searchTerm}
                      onChange={e => handleSearchChange(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      className="w-full bg-black/40 border border-blue-400/30 rounded-lg
                                 py-2 pl-9 pr-3 text-sm text-white placeholder-blue-400/30
                                 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => { setSearchTerm(""); setSuggestions([]); setCurrentPage(1) }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400/50 hover:text-blue-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {/* Dropdown sugerencias */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50
                                      bg-gray-900 border border-blue-400/30 rounded-lg
                                      shadow-xl overflow-hidden">
                        <p className="text-xs text-blue-400/60 px-3 py-1.5 border-b border-blue-400/10">
                          Sugerencias
                        </p>
                        {suggestions.map(name => (
                          <button
                            key={name}
                            onMouseDown={() => applySuggestion(name)}
                            className="w-full text-left px-3 py-2 text-sm text-white
                                       hover:bg-blue-500/10 flex items-center gap-2 transition"
                          >
                            <Search className="w-3 h-3 text-blue-400/50 shrink-0" />
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Categorías */}
                <div>
                  <p className={labelClass}>Categoría</p>
                  <div className="space-y-1">
                    {categorias.map(cat => (
                      <label key={cat} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategorias.includes(cat)}
                          onChange={e => {
                            setSelectedCategorias(prev =>
                              e.target.checked ? [...prev, cat] : prev.filter(c => c !== cat)
                            )
                            setCurrentPage(1)
                          }}
                          className="rounded border-blue-400/30 accent-blue-400"
                        />
                        <span className="capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Origen */}
                <div>
                  <label htmlFor="select-origen" className={labelClass}>Origen</label>
                  <select
                    id="select-origen"
                    value={selectedOrigen}
                    onChange={e => { setSelectedOrigen(e.target.value); setCurrentPage(1) }}
                    className={selectClass}
                  >
                    <option value="todos">Todos</option>
                    <option value="terrestre">Terrestre</option>
                    <option value="extraterrestre">Extraterrestre</option>
                  </select>
                </div>

                {/* Inventor */}
                <div>
                  <label htmlFor="select-inventor" className={labelClass}>Inventor</label>
                  <select
                    id="select-inventor"
                    value={selectedInventor}
                    onChange={e => { setSelectedInventor(e.target.value); setCurrentPage(1) }}
                    className={selectClass}
                  >
                    <option value="todos">Todos</option>
                    {inventores.map(inv => (
                      <option key={inv} value={inv}>{inv}</option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label htmlFor="select-estado" className={labelClass}>Estado</label>
                  <select
                    id="select-estado"
                    value={estado}
                    onChange={e => { setEstado(e.target.value); setCurrentPage(1) }}
                    className={selectClass}
                  >
                    <option value="todos">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="obsoleto">Obsoleto</option>
                    <option value="en_pruebas">En Pruebas</option>
                  </select>
                </div>

                {/* Peligrosidad — rango min/max */}
                <div>
                  <label className={labelClass}>
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Peligrosidad: {peligrosidadRange[0]} – {peligrosidadRange[1]}
                  </label>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">1</span>
                    <input
                      type="range" min={1} max={10}
                      value={peligrosidadRange[0]}
                      onChange={e => {
                        const v = Number(e.target.value)
                        setPeligrosidadRange([Math.min(v, peligrosidadRange[1]), peligrosidadRange[1]])
                        setCurrentPage(1)
                      }}
                      className="flex-1 accent-blue-400"
                      aria-label="Peligrosidad mínima"
                    />
                    <input
                      type="range" min={1} max={10}
                      value={peligrosidadRange[1]}
                      onChange={e => {
                        const v = Number(e.target.value)
                        setPeligrosidadRange([peligrosidadRange[0], Math.max(v, peligrosidadRange[0])])
                        setCurrentPage(1)
                      }}
                      className="flex-1 accent-blue-400"
                      aria-label="Peligrosidad máxima"
                    />
                    <span className="text-xs text-gray-500">10</span>
                  </div>
                </div>

                {/* Confidencialidad — rango min/max */}
                <div>
                  <label className={labelClass}>
                    <Shield className="w-3 h-3 inline mr-1" />
                    Confidencialidad: {confidencialidadRange[0]} – {confidencialidadRange[1]}
                  </label>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">1</span>
                    <input
                      type="range" min={1} max={10}
                      value={confidencialidadRange[0]}
                      onChange={e => {
                        const v = Number(e.target.value)
                        setConfidencialidadRange([Math.min(v, confidencialidadRange[1]), confidencialidadRange[1]])
                        setCurrentPage(1)
                      }}
                      className="flex-1 accent-cyan-400"
                      aria-label="Confidencialidad mínima"
                    />
                    <input
                      type="range" min={1} max={10}
                      value={confidencialidadRange[1]}
                      onChange={e => {
                        const v = Number(e.target.value)
                        setConfidencialidadRange([confidencialidadRange[0], Math.max(v, confidencialidadRange[0])])
                        setCurrentPage(1)
                      }}
                      className="flex-1 accent-cyan-400"
                      aria-label="Confidencialidad máxima"
                    />
                    <span className="text-xs text-gray-500">10</span>
                  </div>
                </div>

                {/* Rango de fechas */}
                <div>
                  <label className={labelClass}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Fecha de creación
                  </label>
                  <div className="flex flex-col gap-2">
                    <DatePicker
                      selected={fechaDesde}
                      onChange={date => { setFechaDesde(date); setCurrentPage(1) }}
                      selectsStart
                      startDate={fechaDesde}
                      endDate={fechaHasta}
                      placeholderText="Desde"
                      dateFormat="dd/MM/yyyy"
                      isClearable
                      className="w-full bg-black/40 border border-blue-400/30 rounded-lg
                                 py-2 px-3 text-sm text-white placeholder-blue-400/30
                                 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                    <DatePicker
                      selected={fechaHasta}
                      onChange={date => { setFechaHasta(date); setCurrentPage(1) }}
                      selectsEnd
                      startDate={fechaDesde}
                      endDate={fechaHasta}
                      minDate={fechaDesde ?? undefined}
                      placeholderText="Hasta"
                      dateFormat="dd/MM/yyyy"
                      isClearable
                      className="w-full bg-black/40 border border-blue-400/30 rounded-lg
                                 py-2 px-3 text-sm text-white placeholder-blue-400/30
                                 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── Resultados ── */}
          <div className="flex-1 min-w-0">

            {/* Barra ordenamiento */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="text-gray-400 text-sm">
                Mostrando{" "}
                <span className="text-blue-400 font-bold">{paginatedResults.length}</span>
                {" "}de{" "}
                <span className="text-blue-400 font-bold">{resultadosFiltrados.length}</span>
                {" "}resultados
              </p>

              <div className="flex items-center gap-2">
                <label htmlFor="select-sort" className="sr-only">Ordenar por</label>
                <select
                  id="select-sort"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-black/40 border border-blue-400/30 rounded-lg py-1.5 px-3 text-sm text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  <option value="nombre">Nombre</option>
                  <option value="peligrosidad">Peligrosidad</option>
                  <option value="confidencialidad">Confidencialidad</option>
                  <option value="inventor">Inventor</option>
                  <option value="fecha">Fecha</option>
                </select>
                <button
                  onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}
                  title={sortOrder === "asc" ? "Ascendente" : "Descendente"}
                  className="p-1.5 bg-blue-400/10 border border-blue-400/30 rounded-lg
                             hover:bg-blue-400/20 transition text-blue-400"
                >
                  <ArrowUpDown className={`w-4 h-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>

            {/* Sin resultados */}
            {resultadosFiltrados.length === 0 && (
              <div className="bg-black/40 border border-blue-400/20 rounded-xl p-12 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-blue-300 font-bold text-lg">No se encontraron artefactos</p>
                <p className="text-gray-500 text-sm mt-1">Intenta ajustar los filtros</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg
                             text-blue-400 text-sm hover:bg-blue-500/20 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Vista lista */}
            {viewMode === "list" && paginatedResults.length > 0 && (
              <div className="bg-black/40 border border-blue-400/30 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-blue-500/10 border-b border-blue-500/30">
                    <tr>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm font-semibold">Nombre</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm font-semibold">Categoría</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm font-semibold">Inventor</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm font-semibold">Peligro</th>
                      <th className="py-3 px-4 text-left text-blue-400 text-sm font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-500/10">
                    {paginatedResults.map(a => (
                      <tr
                        key={a.id}
                        onClick={() => navigate(`/artefactos/edit/${a.id}`)}
                        className="hover:bg-blue-500/5 transition cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-white">{a.nombre}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{a.descripcion}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-400/10 rounded text-xs capitalize text-blue-200">
                            {a.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">{a.inventor}</td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-semibold ${getPeligrosidadColor(a.nivelPeligrosidad)}`}>
                            {a.nivelPeligrosidad}/10
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(a.estado)}`}>
                            {getEstadoLabel(a.estado)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Vista grid */}
            {viewMode === "grid" && paginatedResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedResults.map(a => (
                  <div
                    key={a.id}
                    onClick={() => navigate(`/artefactos/edit/${a.id}`)}
                    className="bg-black/40 border border-blue-400/30 rounded-xl p-4
                               hover:border-blue-400/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]
                               transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-white leading-tight">{a.nombre}</h3>
                      <span className={`text-xs font-semibold ml-2 shrink-0 ${getPeligrosidadColor(a.nivelPeligrosidad)}`}>
                        ⚠ {a.nivelPeligrosidad}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{a.descripcion}</p>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="px-2 py-0.5 bg-blue-400/10 border border-blue-400/20 rounded capitalize text-blue-200">
                        {a.categoria}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-400/10 border border-purple-400/20 rounded text-purple-200">
                        {a.inventor}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-medium ${getEstadoColor(a.estado)}`}>
                        {getEstadoLabel(a.estado)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4
                              bg-black/40 border border-blue-400/30 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <label htmlFor="select-per-page" className="text-gray-400">Por página:</label>
                  <select
                    id="select-per-page"
                    value={resultsPerPage}
                    onChange={e => { setResultsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                    className="bg-black/40 border border-blue-400/30 rounded-lg py-1 px-2
                               text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
                    className="px-3 py-1 bg-blue-400/10 border border-blue-400/30 rounded-lg
                               text-sm text-blue-300 disabled:opacity-40 hover:bg-blue-400/20 transition"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-400">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-blue-400/10 border border-blue-400/30 rounded-lg
                               text-sm text-blue-300 disabled:opacity-40 hover:bg-blue-400/20 transition"
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default BusquedaAvanzada