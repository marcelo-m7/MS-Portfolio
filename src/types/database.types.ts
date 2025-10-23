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
      artwork_materials: {
        Row: {
          artwork_id: string | null
          created_at: string | null
          display_order: number | null
          id: string | null
          material: string | null
        }
        Insert: {
          artwork_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          material?: string | null
        }
        Update: {
          artwork_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          material?: string | null
        }
        Relationships: []
      }
      artwork_media: {
        Row: {
          artwork_id: string | null
          created_at: string | null
          display_order: number | null
          id: string | null
          media_url: string | null
        }
        Insert: {
          artwork_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          media_url?: string | null
        }
        Update: {
          artwork_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          media_url?: string | null
        }
        Relationships: []
      }
      artworks: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
          url_3d: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          url_3d?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          url_3d?: string | null
          year?: number | null
        }
        Relationships: []
      }
      contact: {
        Row: {
          availability: string | null
          created_at: string | null
          email: string | null
          error_message: string | null
          id: string | null
          note: string | null
          success_message: string | null
          updated_at: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string | null
          email?: string | null
          error_message?: string | null
          id?: string | null
          note?: string | null
          success_message?: string | null
          updated_at?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string | null
          email?: string | null
          error_message?: string | null
          id?: string | null
          note?: string | null
          success_message?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      experience: {
        Row: {
          created_at: string | null
          display_order: number | null
          end_date: string | null
          id: string | null
          location: string | null
          org: string | null
          role: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string | null
          location?: string | null
          org?: string | null
          role?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string | null
          location?: string | null
          org?: string | null
          role?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      experience_highlights: {
        Row: {
          created_at: string | null
          display_order: number | null
          experience_id: string | null
          highlight: string | null
          id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          experience_id?: string | null
          highlight?: string | null
          id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          experience_id?: string | null
          highlight?: string | null
          id?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string | null
          headline: string | null
          id: string | null
          lang_default: string | null
          location: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          headline?: string | null
          id?: string | null
          lang_default?: string | null
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          headline?: string | null
          id?: string | null
          lang_default?: string | null
          location?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_stack: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string | null
          project_id: string | null
          technology_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          project_id?: string | null
          technology_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          project_id?: string | null
          technology_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string | null
          display_order: number | null
          domain: string | null
          full_description: string | null
          id: string | null
          name: string | null
          repo_url: string | null
          slug: string | null
          status: string | null
          summary: string | null
          thumbnail: string | null
          updated_at: string | null
          url: string | null
          visibility: string | null
          year: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          domain?: string | null
          full_description?: string | null
          id?: string | null
          name?: string | null
          repo_url?: string | null
          slug?: string | null
          status?: string | null
          summary?: string | null
          thumbnail?: string | null
          updated_at?: string | null
          url?: string | null
          visibility?: string | null
          year?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          domain?: string | null
          full_description?: string | null
          id?: string | null
          name?: string | null
          repo_url?: string | null
          slug?: string | null
          status?: string | null
          summary?: string | null
          thumbnail?: string | null
          updated_at?: string | null
          url?: string | null
          visibility?: string | null
          year?: number | null
        }
        Relationships: []
      }
      series: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
      series_works: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string | null
          series_id: string | null
          work_slug: string | null
          work_type: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          series_id?: string | null
          work_slug?: string | null
          work_type?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          series_id?: string | null
          work_slug?: string | null
          work_type?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          display_order: number | null
          id: string | null
          level: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          level?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string | null
          level?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      technologies: {
        Row: {
          category: string | null
          created_at: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      thought_tags: {
        Row: {
          created_at: string | null
          id: string | null
          tag: string | null
          thought_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          tag?: string | null
          thought_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          tag?: string | null
          thought_id?: string | null
        }
        Relationships: []
      }
      thoughts: {
        Row: {
          body: string | null
          created_at: string | null
          date: string | null
          display_order: number | null
          excerpt: string | null
          id: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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
  public: {
    Enums: {},
  },
} as const
