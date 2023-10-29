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
      ForwardedMessages: {
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
            foreignKeyName: "ForwardedMessages_forwarded_message_id _fkey"
            columns: ["forwarded_message_id "]
            referencedRelation: "Messages"
            referencedColumns: ["message_id "]
          },
          {
            foreignKeyName: "ForwardedMessages_original_message_id _fkey"
            columns: ["original_message_id "]
            referencedRelation: "Messages"
            referencedColumns: ["message_id "]
          }
        ]
      }
      Media: {
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
            foreignKeyName: "Media_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "Messages"
            referencedColumns: ["message_id "]
          }
        ]
      }
      Mentions: {
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
            foreignKeyName: "Mentions_mentioned_user_id_fkey"
            columns: ["mentioned_user_id"]
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Mentions_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "Messages"
            referencedColumns: ["message_id "]
          }
        ]
      }
      Messages: {
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
            foreignKeyName: "Messages_room_id _fkey"
            columns: ["room_id "]
            referencedRelation: "ChatRooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "Messages_user_id _fkey"
            columns: ["user_id "]
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      Reactions: {
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
            foreignKeyName: "Reactions_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "Messages"
            referencedColumns: ["message_id "]
          },
          {
            foreignKeyName: "Reactions_user_id _fkey"
            columns: ["user_id "]
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      Replies: {
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
            foreignKeyName: "Replies_message_id _fkey"
            columns: ["message_id "]
            referencedRelation: "Messages"
            referencedColumns: ["message_id "]
          },
          {
            foreignKeyName: "Replies_user_id _fkey"
            columns: ["user_id "]
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      Users: {
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
