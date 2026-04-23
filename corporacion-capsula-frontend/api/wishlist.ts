import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://sesnbxswuirlxcjblfmm.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous'

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('user_wishlist')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: true })
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      const { artefacto_id, priority = 1 } = req.body
      const { data, error } = await supabase
        .from('user_wishlist')
        .insert({ user_id: userId, artefacto_id, priority })
        .select()
      if (error) throw error
      return res.status(201).json(data)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      const { error } = await supabase
        .from('user_wishlist')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (error) throw error
      return res.status(200).json({ message: 'Eliminado de wishlist' })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}
