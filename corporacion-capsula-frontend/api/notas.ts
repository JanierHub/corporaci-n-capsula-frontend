import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const userId = req.headers['x-user-id'] as string || 'anonymous'

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      const { artefacto_id, content } = req.body
      const { data, error } = await supabase
        .from('user_notes')
        .insert({ user_id: userId, artefacto_id, content })
        .select()
      if (error) throw error
      return res.status(201).json(data)
    }

    if (req.method === 'PUT') {
      const { id, content } = req.body
      const { data, error } = await supabase
        .from('user_notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
      if (error) throw error
      return res.status(200).json({ message: 'Nota eliminada' })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}
