-- =====================================================================
-- MOTOREL DIAG - SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'rider', 'mechanic', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto create profile trigger with automatic admin role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  IF LOWER(NEW.email) = 'zerelpingkian@gmail.com' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Rider'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = CASE WHEN LOWER(EXCLUDED.email) = 'zerelpingkian@gmail.com' THEN 'admin' ELSE profiles.role END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. MOTORCYCLE BRANDS & MODELS
CREATE TABLE IF NOT EXISTS public.motorcycle_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.motorcycle_brands ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.motorcycle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.motorcycle_brands(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  engine_cc INTEGER NOT NULL,
  fuel_system TEXT NOT NULL,
  year_start INTEGER,
  year_end INTEGER,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.motorcycle_models ENABLE ROW LEVEL SECURITY;

-- 4. CATEGORIES & GUIDES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_time INTEGER NOT NULL,
  tools_required TEXT[] DEFAULT '{}',
  safety_notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.guide_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.guide_steps ENABLE ROW LEVEL SECURITY;

-- 5. MANUAL TROUBLESHOOTING DECISION TREE
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.inspection_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_id UUID REFERENCES public.symptoms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  tools_needed TEXT[] DEFAULT '{}',
  inspection_procedure TEXT NOT NULL,
  normal_result TEXT,
  abnormal_result TEXT,
  safety_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inspection_steps ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.possible_causes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  explanation TEXT,
  repair_recommendation TEXT,
  estimated_time INTEGER,
  difficulty TEXT,
  tools_required TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.possible_causes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.troubleshooting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_step_id UUID REFERENCES public.inspection_steps(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('Normal', 'Abnormal', 'Not Sure', 'Skip')),
  next_inspection_step_id UUID REFERENCES public.inspection_steps(id) ON DELETE SET NULL,
  possible_cause_id UUID REFERENCES public.possible_causes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.troubleshooting_rules ENABLE ROW LEVEL SECURITY;

-- 6. USER BOOKMARKS & LEARNING PROGRESS
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, guide_id)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- 7. COMMUNITY POSTS & COMMENTS
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 8. INDEXES FOR SEARCH
CREATE INDEX IF NOT EXISTS idx_guides_title ON public.guides USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_models_name ON public.motorcycle_models USING gin (model_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_problems_title ON public.problems USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_symptoms_title ON public.symptoms USING gin (title gin_trgm_ops);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES

-- Helper functions for checking user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- BRANDS, MODELS, CATEGORIES, GUIDES, STEPS, TROUBLESHOOTING (Public Read, Admin Write)
CREATE POLICY "Public read brands" ON public.motorcycle_brands FOR SELECT USING (true);
CREATE POLICY "Admin write brands" ON public.motorcycle_brands FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read models" ON public.motorcycle_models FOR SELECT USING (true);
CREATE POLICY "Admin write models" ON public.motorcycle_models FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read guides" ON public.guides FOR SELECT USING (true);
CREATE POLICY "Admin write guides" ON public.guides FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read guide steps" ON public.guide_steps FOR SELECT USING (true);
CREATE POLICY "Admin write guide steps" ON public.guide_steps FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read problems" ON public.problems FOR SELECT USING (true);
CREATE POLICY "Admin write problems" ON public.problems FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read symptoms" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "Admin write symptoms" ON public.symptoms FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read inspection steps" ON public.inspection_steps FOR SELECT USING (true);
CREATE POLICY "Admin write inspection steps" ON public.inspection_steps FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read possible causes" ON public.possible_causes FOR SELECT USING (true);
CREATE POLICY "Admin write possible causes" ON public.possible_causes FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public read troubleshooting rules" ON public.troubleshooting_rules FOR SELECT USING (true);
CREATE POLICY "Admin write troubleshooting rules" ON public.troubleshooting_rules FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

-- BOOKMARKS
CREATE POLICY "Users view own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- LEARNING PROGRESS
CREATE POLICY "Users view own learning progress" ON public.learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users upsert own learning progress" ON public.learning_progress
  FOR ALL USING (auth.uid() = user_id);

-- COMMUNITY POSTS
CREATE POLICY "Public view posts" ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Author, Moderator or Admin update/delete posts" ON public.posts
  FOR ALL USING (
    auth.uid() = author_id OR 
    public.get_user_role(auth.uid()) IN ('moderator', 'admin')
  );

-- COMMUNITY COMMENTS
CREATE POLICY "Public view comments" ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Author, Moderator or Admin update/delete comments" ON public.comments
  FOR ALL USING (
    auth.uid() = author_id OR 
    public.get_user_role(auth.uid()) IN ('moderator', 'admin')
  );

-- 10. STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('guides', 'guides', true),
  ('motorcycles', 'motorcycles', true),
  ('avatars', 'avatars', true),
  ('community', 'community', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public bucket access guides" ON storage.objects FOR SELECT USING (bucket_id = 'guides');
CREATE POLICY "Public bucket access motorcycles" ON storage.objects FOR SELECT USING (bucket_id = 'motorcycles');
CREATE POLICY "Public bucket access avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public bucket access community" ON storage.objects FOR SELECT USING (bucket_id = 'community');

CREATE POLICY "Authenticated upload community images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'community' AND auth.role() = 'authenticated');

CREATE POLICY "Users upload avatars" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
