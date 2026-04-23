import { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const { status, user_id } = req.query
      let query = supabase.from('usage_requests').select('*')
      if (status) query = query.eq('status', status)
      if (user_id) query = query.eq('user_id', user_id)
      const { data, error } = await query.order('requested_at', { ascending: false })
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      const { user_id, user_name, user_role, artefacto_id, artefacto_name, project, reason } = req.body
      const { data, error } = await supabase
        .from('usage_requests')
        .insert({
          user_id,
          user_name,
          user_role,
          artefacto_id,
          artefacto_name,
          project,
          reason,
          status: 'pending'
        })
        .select()
      if (error) throw error
      return res.status(201).json(data)
    }

    if (req.method === 'PUT') {
      const { id, status, reviewed_by } = req.body
      const { data, error } = await supabase
        .from('usage_requests')
        .update({
          status,
          reviewed_by,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      if (error) throw error
      return res.status(200).json(data)
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}
