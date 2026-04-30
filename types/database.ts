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
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          created_at?: string
        }
      }
      funnel_stages: {
        Row: {
          id: string
          workspace_id: string
          name: string
          order_index: number
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          order_index?: number
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          order_index?: number
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          workspace_id: string
          stage_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          job_title: string | null
          source: string | null
          notes: string | null
          owner_id: string | null
          status: 'active' | 'inactive' | 'converted' | 'lost'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          stage_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          source?: string | null
          notes?: string | null
          owner_id?: string | null
          status?: 'active' | 'inactive' | 'converted' | 'lost'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          stage_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          source?: string | null
          notes?: string | null
          owner_id?: string | null
          status?: 'active' | 'inactive' | 'converted' | 'lost'
          created_at?: string
          updated_at?: string
        }
      }
      custom_fields: {
        Row: {
          id: string
          workspace_id: string
          name: string
          key: string
          field_type: 'text' | 'number' | 'date' | 'boolean' | 'select'
          options: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          key: string
          field_type: 'text' | 'number' | 'date' | 'boolean' | 'select'
          options?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          key?: string
          field_type?: 'text' | 'number' | 'date' | 'boolean' | 'select'
          options?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_custom_values: {
        Row: {
          id: string
          lead_id: string
          custom_field_id: string
          value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          custom_field_id: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          custom_field_id?: string
          value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stage_required_fields: {
        Row: {
          id: string
          workspace_id: string
          stage_id: string
          field_key: string
          is_custom_field: boolean
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          stage_id: string
          field_key: string
          is_custom_field?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          stage_id?: string
          field_key?: string
          is_custom_field?: boolean
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          workspace_id: string
          name: string
          context: string
          generation_prompt: string
          trigger_stage_id: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          context: string
          generation_prompt: string
          trigger_stage_id?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          context?: string
          generation_prompt?: string
          trigger_stage_id?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      generated_messages: {
        Row: {
          id: string
          lead_id: string
          campaign_id: string
          content: string
          status: 'generated' | 'sent' | 'copied'
          generation_type: 'manual' | 'trigger'
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          campaign_id: string
          content: string
          status?: 'generated' | 'sent' | 'copied'
          generation_type?: 'manual' | 'trigger'
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          campaign_id?: string
          content?: string
          status?: 'generated' | 'sent' | 'copied'
          generation_type?: 'manual' | 'trigger'
          sent_at?: string | null
          created_at?: string
        }
      }
      lead_activities: {
        Row: {
          id: string
          lead_id: string
          workspace_id: string
          type:
            | 'lead_created'
            | 'lead_updated'
            | 'stage_changed'
            | 'message_generated'
            | 'message_sent'
            | 'auto_generation_failed'
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          workspace_id: string
          type:
            | 'lead_created'
            | 'lead_updated'
            | 'stage_changed'
            | 'message_generated'
            | 'message_sent'
            | 'auto_generation_failed'
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          workspace_id?: string
          type?:
            | 'lead_created'
            | 'lead_updated'
            | 'stage_changed'
            | 'message_generated'
            | 'message_sent'
            | 'auto_generation_failed'
          metadata?: Json | null
          created_at?: string
        }
      }
        Relationships: []
      }
    Views: {}
    Functions: {
      is_workspace_member: {
        Args: { p_workspace_id: string; p_user_id: string }
        Returns: boolean
      }
      create_workspace_with_defaults: {
        Args: { p_name: string; p_slug: string; p_user_id: string }
        Returns: string
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
