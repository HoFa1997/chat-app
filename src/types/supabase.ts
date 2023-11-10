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
      ChatRooms: {
        Row: {
          created_at: string
          room_id: number
          room_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          room_id?: number
          room_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          room_id?: number
          room_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ChatRooms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ForwardedMessages: {
        Row: {
          created_at: string
          forward_id: number
          forwarded_message_id: number | null
          original_message_id: number | null
        }
        Insert: {
          created_at?: string
          forward_id?: number
          forwarded_message_id?: number | null
          original_message_id?: number | null
        }
        Update: {
          created_at?: string
          forward_id?: number
          forwarded_message_id?: number | null
          original_message_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ForwardedMessages_forwarded_message_id_fkey"
            columns: ["forwarded_message_id"]
            isOneToOne: false
            referencedRelation: "Messages"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "ForwardedMessages_original_message_id_fkey"
            columns: ["original_message_id"]
            isOneToOne: false
            referencedRelation: "Messages"
            referencedColumns: ["message_id"]
          }
        ]
      }
      Media: {
        Row: {
          created_at: string
          media_id: number
          media_type: string | null
          media_url: string | null
          message_id: number | null
        }
        Insert: {
          created_at?: string
          media_id?: number
          media_type?: string | null
          media_url?: string | null
          message_id?: number | null
        }
        Update: {
          created_at?: string
          media_id?: number
          media_type?: string | null
          media_url?: string | null
          message_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Media_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "Messages"
            referencedColumns: ["message_id"]
          }
        ]
      }
      Mentions: {
        Row: {
          created_at: string
          mention_id: number
          mentioned_user_id: string | null
          message_id: number | null
        }
        Insert: {
          created_at?: string
          mention_id?: number
          mentioned_user_id?: string | null
          message_id?: number | null
        }
        Update: {
          created_at?: string
          mention_id?: number
          mentioned_user_id?: string | null
          message_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Mentions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "Messages"
            referencedColumns: ["message_id"]
          }
        ]
      }
      Messages: {
        Row: {
          created_at: string
          edited_at: string | null
          is_markdown: boolean | null
          message_id: number
          room_id: number | null
          text_content: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          edited_at?: string | null
          is_markdown?: boolean | null
          message_id?: number
          room_id?: number | null
          text_content?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          edited_at?: string | null
          is_markdown?: boolean | null
          message_id?: number
          room_id?: number | null
          text_content?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "ChatRooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "Messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Reactions: {
        Row: {
          created_at: string
          message_id: number | null
          reaction_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          message_id?: number | null
          reaction_id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          message_id?: number | null
          reaction_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "Messages"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "Reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      Replies: {
        Row: {
          created_at: string
          message_id: number | null
          reply_id: number
          reply_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          message_id?: number | null
          reply_id?: number
          reply_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          message_id?: number | null
          reply_id?: number
          reply_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Replies_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "Messages"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "Replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_permission: "channels.delete" | "messages.delete"
      app_role: "admin" | "moderator" | "quest"
      user_status: "ONLINE" | "OFFLINE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
