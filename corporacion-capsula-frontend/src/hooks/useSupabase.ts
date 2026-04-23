import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getStoredUserName } from '../modules/auth/utils/roles'

// Hook genérico para operaciones CRUD
export function useSupabase<T extends Record<string, any>>(table: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = getStoredUserName() || 'anonymous'

  const fetchData = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const { data: result, error: supabaseError } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', userId)
      if (supabaseError) throw supabaseError
      setData(result as T[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const insert = async (item: Omit<T, 'id' | 'created_at'>) => {
    try {
      const { data: result, error: supabaseError } = await supabase
        .from(table)
        .insert({ ...item, user_id: userId })
        .select()
      if (supabaseError) throw supabaseError
      setData(prev => [...prev, result[0] as T])
      return result[0] as T
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al insertar')
      throw err
    }
  }

  const update = async (id: string, updates: Record<string, any>) => {
    try {
      const { data: result, error: supabaseError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
      if (supabaseError) throw supabaseError
      if (result && result[0]) {
        setData(prev => prev.map(item => item.id === id ? result[0] as T : item))
      }
      return result?.[0] as T
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar')
      throw err
    }
  }

  const remove = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (supabaseError) throw supabaseError
      setData(prev => prev.filter(item => (item as any).id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
      throw err
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, fetchData, insert, update, remove }
}

// Hooks específicos
export const useFavoritos = () => useSupabase<{
  id: string
  user_id: string
  artefacto_id: number
  created_at: string
}>('user_favorites')

export const useWishlist = () => useSupabase<{
  id: string
  user_id: string
  artefacto_id: number
  priority: number
  created_at: string
}>('user_wishlist')

export const useNotas = () => useSupabase<{
  id: string
  user_id: string
  artefacto_id: number
  content: string
  created_at: string
  updated_at: string
}>('user_notes')

export const useSolicitudes = () => useSupabase<{
  id: string
  user_id: string
  user_name: string
  user_role: string
  artefacto_id: number
  artefacto_name: string
  project: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}>('usage_requests')
