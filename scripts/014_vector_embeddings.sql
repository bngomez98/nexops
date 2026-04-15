-- ============================================================
-- Migration 014 — vector extension and document_embeddings table
-- ============================================================

-- Enable the pgvector extension so the `vector` type is available.
create extension if not exists vector with schema extensions;

-- Table to store vector embeddings alongside the source document text.
-- The embedding column holds a 384-dimensional vector produced by an
-- embedding model (e.g. all-MiniLM-L6-v2 or a Supabase edge function).
create table if not exists public.document_embeddings (
  id        serial primary key,
  title     text not null,
  body      text not null,
  embedding extensions.vector(384)
);

-- Index for approximate nearest-neighbour search using cosine distance.
create index if not exists document_embeddings_embedding_idx
  on public.document_embeddings
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100);
