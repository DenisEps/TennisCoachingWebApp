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
      users: {
        Row: {
          id: string
          email: string
          role: 'coach' | 'client'
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'coach' | 'client'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'coach' | 'client'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coach_availability: {
        Row: {
          id: string
          coach_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          coach_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          coach_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          coach_id: string
          client_id: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          coach_id: string
          client_id: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          coach_id?: string
          client_id?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 