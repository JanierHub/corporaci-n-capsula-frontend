import { useMemo } from "react"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"
import { 
  BarChart3, 
  Package, 
  Shield, 
  Zap,
  Car,
  Home,
  Crosshair
} from "lucide-react"

const CategoryDashboard = () => {
  const { artefactos } = useArtefactos()
  
  // ===== ESTADÍSTICAS POR CATEGORÍA =====
  const categoryStats = useMemo(() => {
    const stats = {
      transporte: artefactos.filter(a => a.categoria === "transporte").length,
      defensa: artefactos.filter(a => a.categoria === "defensa").length,
      domestico: artefactos.filter(a => a.categoria === "domestico").length,
      energia: artefactos.filter(a => a.categoria === "energia").length,
    }
    return stats
  }, [artefactos])
  
  // ===== DATOS PARA GRÁFICO =====
  const pieData = useMemo(() => [
    { name: "Transporte", value: categoryStats.transporte, color: "#06b6d4", icon: Car },
    { name: "Defensa", value: categoryStats.defensa, color: "#ef4444", icon: Shield },
    { name: "Doméstico", value: categoryStats.domestico, color: "#10b981", icon: Home },
    { name: "Energía", value: categoryStats.energia, color: "#f59e0b", icon: Zap },
  ].filter(d => d.value > 0), [categoryStats])
  
  // ===== DATOS POR NIVEL DE PELIGROSIDAD =====
  const dangerStats = useMemo(() => {
    const bajo = artefactos.filter(a => a.nivelPeligrosidad <= 3).length
    const medio = artefactos.filter(a => a.nivelPeligrosidad > 3 && a.nivelPeligrosidad <= 6).length
    const alto = artefactos.filter(a => a.nivelPeligrosidad > 6 && a.nivelPeligrosidad <= 8).length
    const critico = artefactos.filter(a => a.nivelPeligrosidad > 8).length
    
    return [
      { name: "Bajo", value: bajo, color: "#10b981" },
      { name: "Medio", value: medio, color: "#f59e0b" },
      { name: "Alto", value: alto, color: "#ef4444" },
      { name: "Crítico", value: critico, color: "#7c3aed" },
    ]
  }, [artefactos])
  
  // ===== DATOS POR ORIGEN =====
  const originStats = useMemo(() => {
    const terrestre = artefactos.filter(a => a.origen === "terrestre").length
    const extraterrestre = artefactos.filter(a => a.origen === "extraterrestre").length
    
    return [
      { name: "Terrestre", value: terrestre, color: "#3b82f6" },
      { name: "Extraterrestre", value: extraterrestre, color: "#8b5cf6" },
    ]
  }, [artefactos])
  
  const total = artefactos.length
  
  if (total === 0) {
    return (
      <div className="bg-black/40 border border-purple-400/30 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Dashboard de Categorías
        </h2>
        <div className="text-center py-12">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-gray-400">No hay artefactos para mostrar estadísticas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/40 border border-purple-400/30 rounded-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Dashboard de Categorías
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== GRÁFICO DE CATEGORÍAS (Pie) ===== */}
        <div className="bg-black/20 rounded-xl p-4 border border-purple-400/20">
          <h3 className="text-sm font-medium text-purple-300 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Distribución por Categoría
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(0,0,0,0.8)", 
                    border: "1px solid rgba(168,85,247,0.3)",
                    borderRadius: "8px"
                  }}
                  labelStyle={{ color: "#a855f7" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Leyenda de categorías */}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-gray-400">{cat.name}: {cat.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* ===== GRÁFICO DE PELIGROSIDAD (Barras) ===== */}
        <div className="bg-black/20 rounded-xl p-4 border border-purple-400/20">
          <h3 className="text-sm font-medium text-purple-300 mb-4 flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            Distribución por Peligrosidad
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dangerStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#a855f7" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#a855f7" 
                  fontSize={12}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(0,0,0,0.8)", 
                    border: "1px solid rgba(168,85,247,0.3)",
                    borderRadius: "8px"
                  }}
                  labelStyle={{ color: "#a855f7" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dangerStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* ===== GRÁFICO DE ORIGEN ===== */}
        <div className="bg-black/20 rounded-xl p-4 border border-purple-400/20">
          <h3 className="text-sm font-medium text-purple-300 mb-4">Distribución por Origen</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={originStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {originStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(0,0,0,0.8)", 
                    border: "1px solid rgba(168,85,247,0.3)",
                    borderRadius: "8px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* ===== RESUMEN NUMÉRICO ===== */}
        <div className="bg-black/20 rounded-xl p-4 border border-purple-400/20">
          <h3 className="text-sm font-medium text-purple-300 mb-4">Resumen Detallado</h3>
          <div className="space-y-3">
            {pieData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: cat.color }}
                  >
                    <cat.icon className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${total > 0 ? (cat.value / total) * 100 : 0}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                  <span className="text-white font-medium w-8 text-right">{cat.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-purple-400/20">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total de Artefactos</span>
              <span className="text-2xl font-bold text-purple-400">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryDashboard
