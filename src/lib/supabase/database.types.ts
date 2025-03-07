export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          website: string | null;
          created_at: string;
          updated_at: string;
          email_verified: boolean;
        };
        Insert: {
          id: string;
          name?: string | null;
          email: string;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
          email_verified?: boolean;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
          email_verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      sites: {
        Row: {
          id: string;
          user_id: string;
          domain: string;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain?: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tracking_events: {
        Row: {
          id: string;
          site_id: string;
          event_type: string;
          event_data: Json;
          created_at: string;
          ip_address: string | null;
          user_agent: string | null;
          url: string | null;
        };
        Insert: {
          id?: string;
          site_id: string;
          event_type: string;
          event_data: Json;
          created_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          url?: string | null;
        };
        Update: {
          id?: string;
          site_id?: string;
          event_type?: string;
          event_data?: Json;
          created_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tracking_events_site_id_fkey";
            columns: ["site_id"];
            isOneToOne: false;
            referencedRelation: "sites";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
