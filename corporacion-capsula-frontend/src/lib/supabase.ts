import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sesnbxswuirlxcjblfmm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlc25ieHN3dWlybHhjamJsZm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODc5NDQsImV4cCI6MjA5MjQ2Mzk0NH0.GgNm2lEZC1r8ebVZOIBaiMSneuPJv0l5SOFRu32Y0SY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_favorites: {
        Row: {
          id: string
          user_id: string
          artefacto_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artefacto_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          artefacto_id?: number
          created_at?: string
        }
      }
      user_wishlist: {
        Row: {
          id: string
          user_id: string
          artefacto_id: number
          priority: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artefacto_id: number
          priority?: number
          created_at?: string
        }
      }
      user_notes: {
        Row: {
          id: string
          user_id: string
          artefacto_id: number
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          artefacto_id: number
          content: string
          created_at?: string
          updated_at?: string
        }
      }
      usage_requests: {
        Row: {
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
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          user_role: string
          artefacto_id: number
          artefacto_name: string
          project: string
          reason: string
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
    }
  }
}
