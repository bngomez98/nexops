-- ============================================================
-- Migration 015 — example vector-backed documents table
-- ============================================================

-- Enable the pgvector extension so the `vector` type is available.
create extension if not exists vector with schema extensions;

-- Create a simple documents table with a 384-dimensional embedding column.
create table documents (
  id serial primary key,
  title text not null,
  body text not null,
  embedding extensions.vector(384)
);
