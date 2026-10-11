-- ==============================================================================
-- Crazy Bites Database Migration: Add lbp_rate to settings table
-- Run this query in your Supabase project's SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS lbp_rate bigint NOT NULL DEFAULT 89500;
