import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useArtefactos } from "../../../context/ArtefactosContext"
import { 
  Heart, 
  Star, 
  StickyNote, 
  Send, 
  ArrowLeft, 
  Package,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"
import { useFavoritos, useWishlist, useNotas, useSolicitudes } from "../../../hooks/useSupabase"
import { getStoredUserName, getStoredUserRole } from "../../auth/utils/roles"

const MiCapsula = () => {
  const navigate = useNavigate()
  const { artefactos } = useArtefactos()
  const [activeTab, setActiveTab] = useState<"favoritos" | "wishlist" | "notas" | "solicitudes">("favoritos")

  const userName = getStoredUserName()
  const userRole = getStoredUserRole()

  const { data: favoritos, insert: addFav, remove: removeFav } = useFavoritos()
  const { data: wishlist, insert: addWish, remove: removeWish } = useWishlist()
  const { data: notas, insert: addNota, update: updateNota, remove: removeNota } = useNotas()
  const { data: solicitudes, insert: addSolicitud } = useSolicitudes()

  const [showNuevaNota, setShowNuevaNota] = useState(false)
  const [selectedArtefacto, setSelectedArtefacto] = useState<number | null>(null)
  const [notaContent, setNotaContent] = useState("")
  const [solicitudForm, setSolicitudForm] = useState({
    project: "",
    reason: ""
  })

  const isFavorito = (id: number) => favoritos.some(f => f.artefacto_id === id)
  const isInWishlist = (id: number) => wishlist.some(w => w.artefacto_id === id)

  const toggleFavorito = async (artefactoId: number) => {
    const existing = favoritos.find(f => f.artefacto_id === artefactoId)
    if (existing) {
      await removeFav(existing.id)
    } else {
      await addFav({ artefacto_id: artefactoId } as any)
    }
  }

  const toggleWishlist = async (artefactoId: number) => {
    const existing = wishlist.find(w => w.artefacto_id === artefactoId)
    if (existing) {
      await removeWish(existing.id)
    } else {
      await addWish({ artefacto_id: artefactoId, priority: 1 } as any)
    }
  }

  const crearNota = async () => {
    if (!selectedArtefacto || !notaContent.trim()) return
    await addNota({
      artefacto_id: selectedArtefacto,
      content: notaContent
    } as any)
    setNotaContent("")
    setShowNuevaNota(false)
  }

  const crearSolicitud = async (artefactoId: number) => {
    const art = artefactos.find(a => a.id === artefactoId)
    if (!art) return
    await addSolicitud({
      user_id: userName || 'anonymous',
      user_name: userName || 'Usuario',
      user_role: userRole || 'Usuario',
      artefacto_id: artefactoId,
      artefacto_name: art.nombre,
      project: solicitudForm.project || 'Proyecto General',
      reason: solicitudForm.reason || 'Uso en proyecto'
    } as any)
    setSolicitudForm({ project: "", reason: "" })
  }

  const getArtefactoById = (id: number) => artefactos.find(a => a.id === id)

  const tabs = [
    { id: "favoritos", label: "Favoritos", icon: Heart },
    { id: "wishlist", label: "Wishlist", icon: Star },
    { id: "notas", label: "Mis Notas", icon: StickyNote },
    { id: "solicitudes", label: "Mis Solicitudes", icon: Send },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/40 border-b border-cyan-400/30 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">Mi Cápsula</h1>
              <p className="text-gray-400 text-sm">Personaliza tu experiencia</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-cyan-300 font-semibold">{userName || "Usuario"}</p>
              <p className="text-gray-400 text-sm">{userRole || "Rol"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-cyan-400 text-black"
                  : "bg-black/40 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Favoritos Tab */}
        {activeTab === "favoritos" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-cyan-400">Mis Artefactos Favoritos</h2>
            {favoritos.length === 0 ? (
              <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-8 text-center">
                <Heart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No tienes favoritos aún</p>
                <p className="text-gray-500 text-sm mt-2">Agrega artefactos desde el catálogo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoritos.map((fav) => {
                  const art = getArtefactoById(fav.artefacto_id)
                  if (!art) return null
                  return (
                    <div key={fav.id} className="bg-black/40 border border-cyan-400/30 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-cyan-300">{art.nombre}</h3>
                        <button
                          onClick={() => removeFav(fav.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{art.descripcion}</p>
                      <button
                        onClick={() => navigate(`/artefactos/${art.id}`)}
                        className="text-cyan-400 text-sm hover:underline"
                      >
                        Ver detalles →
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Agregar a favoritos */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Agregar a Favoritos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {artefactos.slice(0, 12).map((art) => (
                  <button
                    key={art.id}
                    onClick={() => toggleFavorito(art.id)}
                    className={`p-3 rounded-lg text-sm transition ${
                      isFavorito(art.id)
                        ? "bg-red-400/20 border border-red-400 text-red-300"
                        : "bg-black/40 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mx-auto mb-1 ${isFavorito(art.id) ? "fill-current" : ""}`} />
                    <span className="line-clamp-1">{art.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-cyan-400">Mi Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-8 text-center">
                <Star className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Tu wishlist está vacía</p>
              </div>
            ) : (
              <div className="space-y-2">
                {wishlist.map((item) => {
                  const art = getArtefactoById(item.artefacto_id)
                  if (!art) return null
                  return (
                    <div key={item.id} className="flex items-center gap-4 bg-black/40 border border-cyan-400/30 rounded-lg p-4">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <div className="flex-1">
                        <p className="font-semibold text-cyan-300">{art.nombre}</p>
                        <p className="text-gray-400 text-sm">Prioridad: {item.priority}</p>
                      </div>
                      <button
                        onClick={() => removeWish(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Agregar a Wishlist</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {artefactos.slice(0, 12).map((art) => (
                  <button
                    key={art.id}
                    onClick={() => toggleWishlist(art.id)}
                    className={`p-3 rounded-lg text-sm transition ${
                      isInWishlist(art.id)
                        ? "bg-yellow-400/20 border border-yellow-400 text-yellow-300"
                        : "bg-black/40 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20"
                    }`}
                  >
                    <Star className={`w-4 h-4 mx-auto mb-1 ${isInWishlist(art.id) ? "fill-current" : ""}`} />
                    <span className="line-clamp-1">{art.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notas Tab */}
        {activeTab === "notas" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400">Mis Notas</h2>
              <button
                onClick={() => setShowNuevaNota(!showNuevaNota)}
                className="flex items-center gap-2 bg-cyan-400 text-black px-4 py-2 rounded-lg hover:bg-cyan-300 transition"
              >
                <Plus className="w-4 h-4" />
                Nueva Nota
              </button>
            </div>

            {showNuevaNota && (
              <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-4">
                <select
                  value={selectedArtefacto || ""}
                  onChange={(e) => setSelectedArtefacto(Number(e.target.value))}
                  className="w-full bg-black/60 border border-cyan-400/30 rounded-lg p-3 text-white mb-3"
                >
                  <option value="">Seleccionar artefacto...</option>
                  {artefactos.map((art) => (
                    <option key={art.id} value={art.id}>{art.nombre}</option>
                  ))}
                </select>
                <textarea
                  value={notaContent}
                  onChange={(e) => setNotaContent(e.target.value)}
                  placeholder="Escribe tu nota..."
                  className="w-full bg-black/60 border border-cyan-400/30 rounded-lg p-3 text-white mb-3"
                  rows={3}
                />
                <button
                  onClick={crearNota}
                  disabled={!selectedArtefacto || !notaContent.trim()}
                  className="bg-cyan-400 text-black px-4 py-2 rounded-lg hover:bg-cyan-300 transition disabled:opacity-50"
                >
                  Guardar Nota
                </button>
              </div>
            )}

            {notas.length === 0 ? (
              <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-8 text-center">
                <StickyNote className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No tienes notas aún</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notas.map((nota) => {
                  const art = getArtefactoById(nota.artefacto_id)
                  return (
                    <div key={nota.id} className="bg-black/40 border border-cyan-400/30 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-cyan-300">{art?.nombre || "Artefacto"}</h3>
                        <button
                          onClick={() => removeNota(nota.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{nota.content}</p>
                      <p className="text-gray-500 text-xs">{new Date(nota.updated_at).toLocaleString()}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Solicitudes Tab */}
        {activeTab === "solicitudes" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-cyan-400">Mis Solicitudes de Uso</h2>

            {solicitudes.length === 0 ? (
              <div className="bg-black/40 border border-cyan-400/30 rounded-xl p-8 text-center">
                <Send className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No has hecho solicitudes aún</p>
              </div>
            ) : (
              <div className="space-y-2">
                {solicitudes.map((sol) => (
                  <div key={sol.id} className="bg-black/40 border border-cyan-400/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-cyan-300">{sol.artefacto_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        sol.status === 'pending' ? 'bg-yellow-400/20 text-yellow-300' :
                        sol.status === 'approved' ? 'bg-green-400/20 text-green-300' :
                        'bg-red-400/20 text-red-300'
                      }`}>
                        {sol.status === 'pending' ? 'Pendiente' :
                         sol.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Proyecto: {sol.project}</p>
                    <p className="text-gray-400 text-sm">{sol.reason}</p>
                    <p className="text-gray-500 text-xs mt-2">{new Date(sol.requested_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Nueva solicitud */}
            <div className="mt-6 bg-black/40 border border-cyan-400/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Nueva Solicitud</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artefactos.slice(0, 6).map((art) => (
                  <div key={art.id} className="flex items-center gap-2 bg-black/60 rounded-lg p-3">
                    <span className="flex-1 text-sm text-cyan-300">{art.nombre}</span>
                    <input
                      type="text"
                      placeholder="Proyecto"
                      className="bg-black/60 border border-cyan-400/30 rounded px-2 py-1 text-xs w-24"
                      onChange={(e) => setSolicitudForm({ ...solicitudForm, project: e.target.value })}
                    />
                    <button
                      onClick={() => crearSolicitud(art.id)}
                      className="bg-cyan-400 text-black px-2 py-1 rounded text-xs hover:bg-cyan-300"
                    >
                      Solicitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MiCapsula
