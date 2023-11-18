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
      channel_members: {
        Row: {
          channel_id: string | null
          last_read_message_id: string | null
          last_read_update: string | null
          member_id: string | null
        }
        Insert: {
          channel_id?: string | null
          last_read_message_id?: string | null
          last_read_update?: string | null
          member_id?: string | null
        }
        Update: {
          channel_id?: string | null
          last_read_message_id?: string | null
          last_read_update?: string | null
          member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_members_last_read_message_id_fkey"
            columns: ["last_read_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      channels: {
        Row: {
          created_by: string
          description: string | null
          id: string
          inserted_at: string
          is_archived: boolean | null
          is_private: boolean | null
          is_read_only: boolean | null
          last_activity_at: string
          last_message_preview: string | null
          member_limit: number | null
          slug: string
        }
        Insert: {
          created_by: string
          description?: string | null
          id?: string
          inserted_at?: string
          is_archived?: boolean | null
          is_private?: boolean | null
          is_read_only?: boolean | null
          last_activity_at?: string
          last_message_preview?: string | null
          member_limit?: number | null
          slug: string
        }
        Update: {
          created_by?: string
          description?: string | null
          id?: string
          inserted_at?: string
          is_archived?: boolean | null
          is_private?: boolean | null
          is_read_only?: boolean | null
          last_activity_at?: string
          last_message_preview?: string | null
          member_limit?: number | null
          slug?: string
        }
        Relationships: []
      }
      message_mentions: {
        Row: {
          id: string
          mentioned_user_id: string | null
          message_id: string | null
        }
        Insert: {
          id?: string
          mentioned_user_id?: string | null
          message_id?: string | null
        }
        Update: {
          id?: string
          mentioned_user_id?: string | null
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_mentions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string | null
          deleted_at: string | null
          edited_at: string | null
          id: string
          inserted_at: string
          media_urls: Json | null
          metadata: Json | null
          original_message_id: string | null
          reactions: Json | null
          replied_message_preview: string | null
          reply_to_message_id: string | null
          type: Database["public"]["Enums"]["message_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          content?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          inserted_at?: string
          media_urls?: Json | null
          metadata?: Json | null
          original_message_id?: string | null
          reactions?: Json | null
          replied_message_preview?: string | null
          reply_to_message_id?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string | null
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          inserted_at?: string
          media_urls?: Json | null
          metadata?: Json | null
          original_message_id?: string | null
          reactions?: Json | null
          replied_message_preview?: string | null
          reply_to_message_id?: string | null
          type?: Database["public"]["Enums"]["message_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_original_message_id_fkey"
            columns: ["original_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          mention_id: string | null
          message_id: string | null
          message_preview: string | null
          read_at: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mention_id?: string | null
          message_id?: string | null
          message_preview?: string | null
          read_at?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mention_id?: string | null
          message_id?: string | null
          message_preview?: string | null
          read_at?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_mention_id_fkey"
            columns: ["mention_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      pinned_messages: {
        Row: {
          channel_id: string
          id: string
          message_id: string
          pinned_at: string
          pinned_by: string
        }
        Insert: {
          channel_id: string
          id?: string
          message_id: string
          pinned_at?: string
          pinned_by: string
        }
        Update: {
          channel_id?: string
          id?: string
          message_id?: string
          pinned_at?: string
          pinned_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "pinned_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pinned_messages_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          }
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: string
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: string
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_permission:
        | "channels.create"
        | "channels.delete"
        | "channels.edit"
        | "messages.create"
        | "messages.delete"
        | "messages.edit"
        | "users.view"
        | "users.edit"
        | "users.delete"
        | "roles.create"
        | "roles.edit"
        | "roles.delete"
      app_role: "admin" | "moderator" | "member" | "guest"
      message_type:
        | "text"
        | "image"
        | "video"
        | "audio"
        | "link"
        | "giphy"
        | "file"
      notification_type:
        | "message"
        | "channel_invite"
        | "mention"
        | "reply"
        | "thread_update"
        | "channel_update"
        | "member_join"
        | "member_leave"
        | "user_activity"
        | "task_assignment"
        | "event_reminder"
        | "system_update"
        | "security_alert"
        | "like_reaction"
        | "feedback_request"
        | "performance_insight"
      user_status: "ONLINE" | "OFFLINE" | "AWAY" | "BUSY" | "INVISIBLE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
