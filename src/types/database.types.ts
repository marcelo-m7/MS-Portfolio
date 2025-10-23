export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  portfolio: {
    Tables: {
      artwork_materials: {
        Row: {
          artwork_id: string
          created_at: string | null
          display_order: number
          id: string
          material: string
        }
        Insert: {
          artwork_id: string
          created_at?: string | null
          display_order?: number
          id?: string
          material: string
        }
        Update: {
          artwork_id?: string
          created_at?: string | null
          display_order?: number
          id?: string
          material?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_materials_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_media: {
        Row: {
          artwork_id: string
          created_at: string | null
          display_order: number
          id: string
          media_url: string
        }
        Insert: {
          artwork_id: string
          created_at?: string | null
          display_order?: number
          id?: string
          media_url: string
        }
        Update: {
          artwork_id?: string
          created_at?: string | null
          display_order?: number
          id?: string
          media_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_media_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
        ]
      }
      artworks: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          slug: string
          title: string
          updated_at: string | null
          url_3d: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
          url_3d?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
          url_3d?: string | null
          year?: number
        }
        Relationships: []
      }
      contact: {
        Row: {
          availability: string
          created_at: string | null
          email: string
          error_message: string
          id: string
          note: string | null
          success_message: string
          updated_at: string | null
        }
        Insert: {
          availability: string
          created_at?: string | null
          email: string
          error_message: string
          id?: string
          note?: string | null
          success_message: string
          updated_at?: string | null
        }
        Update: {
          availability?: string
          created_at?: string | null
          email?: string
          error_message?: string
          id?: string
          note?: string | null
          success_message?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          created_at: string | null
          display_order: number | null
          end_date: string | null
          id: string
          location: string
          org: string
          role: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          location: string
          org: string
          role: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          location?: string
          org?: string
          role?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      experience_highlights: {
        Row: {
          created_at: string | null
          display_order: number
          experience_id: string
          highlight: string
          id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          experience_id: string
          highlight: string
          id?: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          experience_id?: string
          highlight?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_highlights_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experience"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar: string | null
          bio: string
          created_at: string | null
          headline: string
          id: string
          lang_default: string | null
          location: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          bio: string
          created_at?: string | null
          headline: string
          id?: string
          lang_default?: string | null
          location: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string
          created_at?: string | null
          headline?: string
          id?: string
          lang_default?: string | null
          location?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_stack: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          project_id: string
          technology_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          project_id: string
          technology_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          project_id?: string
          technology_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_stack_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_stack_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          domain: string | null
          full_description: string
          id: string
          name: string
          repo_url: string | null
          slug: string
          status: string | null
          summary: string
          thumbnail: string | null
          updated_at: string | null
          url: string | null
          visibility: string | null
          year: number
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          domain?: string | null
          full_description: string
          id?: string
          name: string
          repo_url?: string | null
          slug: string
          status?: string | null
          summary: string
          thumbnail?: string | null
          updated_at?: string | null
          url?: string | null
          visibility?: string | null
          year: number
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          domain?: string | null
          full_description?: string
          id?: string
          name?: string
          repo_url?: string | null
          slug?: string
          status?: string | null
          summary?: string
          thumbnail?: string | null
          updated_at?: string | null
          url?: string | null
          visibility?: string | null
          year?: number
        }
        Relationships: []
      }
      series: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          slug: string
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      series_works: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          series_id: string
          work_slug: string
          work_type: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          series_id: string
          work_slug: string
          work_type: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          series_id?: string
          work_slug?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_works_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          level: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          level: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          level?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      technologies: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      thought_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
          thought_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
          thought_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
          thought_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thought_tags_thought_id_fkey"
            columns: ["thought_id"]
            isOneToOne: false
            referencedRelation: "thoughts"
            referencedColumns: ["id"]
          },
        ]
      }
      thoughts: {
        Row: {
          body: string
          created_at: string | null
          date: string
          display_order: number | null
          excerpt: string
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          date: string
          display_order?: number | null
          excerpt: string
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          date?: string
          display_order?: number | null
          excerpt?: string
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
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
  public: {
    Tables: {
      leads: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          project: string
          project_source: string | null
        }
        Insert: {
          company?: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          project?: string
          project_source?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          project?: string
          project_source?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  portfolio: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
