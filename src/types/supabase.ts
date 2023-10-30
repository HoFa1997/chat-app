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
      "chat-rooms": {
        Row: {
          created_at: string
          room_id: number
          room_name: string | null
        }
        Insert: {
          created_at?: string
          room_id?: number
          room_name?: string | null
        }
        Update: {
          created_at?: string
          room_id?: number
          room_name?: string | null
        }
        Relationships: []
      }
      "forwarded-messages": {
        Row: {
          created_at: string
          "forward_id ": number
          "forwarded_message_id ": number | null
          "original_message_id ": number | null
        }
        Insert: {
          created_at?: string
          "forward_id "?: number
          "forwarded_message_id "?: number | null
          "original_message_id "?: number | null
        }
        Update: {
          created_at?: string
          "forward_id "?: number
          "forwarded_message_id "?: number | null
          "original_message_id "?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forwarded-messages_forwarded_message_id _fkey"
            columns: ["forwarded_message_id "]
            referencedRelation: "messages"
            referencedColumns: ["message_id "]
          },
          {
            foreignKeyName: "forwarded-messages_original_message_id _fkey"
            columns: ["original_message_id "]
            referencedRelation: "messages"
            referencedColumns: ["message_id "]
          }
        ]
      }
      media: {
        Row: {
          created_at: string
          "media_id ": number
          media_type: string | null
          media_url: string | null
          "message_id ": number | null
        }
        Insert: {
          created_at?: string
          "media_id "?: number
          media_type?: string | null
          media_url?: string | null
          "message_id "?: number | null
        }
        Update: {
          created_at?: string
          "media_id "?: number
          media_type?: string | null
          media_url?: string | null
          "message_id "?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "messages"
            referencedColumns: ["message_id "]
          }
        ]
      }
      mentions: {
        Row: {
          created_at: string
          "mention_id ": number
          mentioned_user_id: number | null
          "message_id ": number | null
        }
        Insert: {
          created_at?: string
          "mention_id "?: number
          mentioned_user_id?: number | null
          "message_id "?: number | null
        }
        Update: {
          created_at?: string
          "mention_id "?: number
          mentioned_user_id?: number | null
          "message_id "?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentions_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "messages"
            referencedColumns: ["message_id "]
          }
        ]
      }
      messages: {
        Row: {
          created_at: string
          "edited_at ": string | null
          "is_markdown ": boolean | null
          "message_id ": number
          "room_id ": number | null
          text_content: string | null
          "user_id ": number | null
        }
        Insert: {
          created_at?: string
          "edited_at "?: string | null
          "is_markdown "?: boolean | null
          "message_id "?: number
          "room_id "?: number | null
          text_content?: string | null
          "user_id "?: number | null
        }
        Update: {
          created_at?: string
          "edited_at "?: string | null
          "is_markdown "?: boolean | null
          "message_id "?: number
          "room_id "?: number | null
          text_content?: string | null
          "user_id "?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id _fkey"
            columns: ["room_id "]
            referencedRelation: "chat-rooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "messages_user_id _fkey"
            columns: ["user_id "]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
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
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reactions: {
        Row: {
          created_at: string
          emoji: string | null
          "message_id ": number | null
          "reaction_id ": number
          "user_id ": number | null
        }
        Insert: {
          created_at?: string
          emoji?: string | null
          "message_id "?: number | null
          "reaction_id "?: number
          "user_id "?: number | null
        }
        Update: {
          created_at?: string
          emoji?: string | null
          "message_id "?: number | null
          "reaction_id "?: number
          "user_id "?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "messages"
            referencedColumns: ["message_id "]
          },
          {
            foreignKeyName: "reactions_user_id _fkey"
            columns: ["user_id "]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      replies: {
        Row: {
          created_at: string
          "message_id ": number | null
          "reply_id ": number
          reply_text: string | null
          "user_id ": number | null
        }
        Insert: {
          created_at?: string
          "message_id "?: number | null
          "reply_id "?: number
          reply_text?: string | null
          "user_id "?: number | null
        }
        Update: {
          created_at?: string
          "message_id "?: number | null
          "reply_id "?: number
          reply_text?: string | null
          "user_id "?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "messages"
            referencedColumns: ["message_id "]
          },
          {
            foreignKeyName: "replies_user_id _fkey"
            columns: ["user_id "]
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          password_hash: string | null
          user_id: number
          username: string | null
        }
        Insert: {
          created_at?: string
          password_hash?: string | null
          user_id?: number
          username?: string | null
        }
        Update: {
          created_at?: string
          password_hash?: string | null
          user_id?: number
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
