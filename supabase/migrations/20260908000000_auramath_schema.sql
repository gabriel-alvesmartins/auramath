-- ==============================================================================
-- Auramath PostgreSQL Schema Migration
-- Version: 20260908000000_auramath_schema.sql
-- Description: Full schema for Auramath mental math platform, including
-- profiles, progress, match records, anti-cheat RPC, classrooms, and seed data.
-- ==============================================================================

-- 0. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. REFERENCE CATALOG TABLES (Grades & Skins)
-- ==============================================================================

-- 1.1 Curriculum Grades Table
CREATE TABLE IF NOT EXISTS grades (
    grade_level INT PRIMARY KEY CHECK (grade_level BETWEEN 1 AND 6),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    target_techniques TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 Aura Cosmetic Skins Catalog
CREATE TABLE IF NOT EXISTS aura_skins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    unlocked_by_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. CORE USER & GAMIFICATION TABLES
-- ==============================================================================

-- 2.1 User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    current_grade_level INT DEFAULT 1 CHECK (current_grade_level BETWEEN 1 AND 6),
    total_xp BIGINT DEFAULT 0 CHECK (total_xp >= 0),
    aura_level INT DEFAULT 1 CHECK (aura_level >= 1),
    current_streak_days INT DEFAULT 0 CHECK (current_streak_days >= 0),
    highest_blitz_score INT DEFAULT 0 CHECK (highest_blitz_score >= 0),
    active_skin_id TEXT DEFAULT 'skin_aura_default' REFERENCES aura_skins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Learning Track Node Progress
CREATE TABLE IF NOT EXISTS user_node_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL, -- e.g. 'GRADE_1_ADD_LEFT_RIGHT', 'MULT_25', 'DIFF_OF_SQUARES'
    stars_earned INT NOT NULL CHECK (stars_earned BETWEEN 0 AND 3),
    best_accuracy NUMERIC(5, 2) NOT NULL CHECK (best_accuracy BETWEEN 0 AND 100),
    average_speed_ms INT NOT NULL CHECK (average_speed_ms >= 0),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, node_id)
);

-- 2.3 Unlocked Aura Skins per User
CREATE TABLE IF NOT EXISTS user_unlocked_skins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skin_id TEXT NOT NULL REFERENCES aura_skins(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, skin_id)
);

-- 2.4 Cognitive Radar History (DNA Matemático)
CREATE TABLE IF NOT EXISTS cognitive_radars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    speed_score INT NOT NULL CHECK (speed_score BETWEEN 0 AND 100),
    fermi_score INT NOT NULL CHECK (fermi_score BETWEEN 0 AND 100),
    flexibility_score INT NOT NULL CHECK (flexibility_score BETWEEN 0 AND 100),
    stamina_score INT NOT NULL CHECK (stamina_score BETWEEN 0 AND 100),
    memory_score INT NOT NULL CHECK (memory_score BETWEEN 0 AND 100),
    archetype_title TEXT NOT NULL, -- e.g. "Arquiteto Relâmpago", "Alquimista Algébrico"
    computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. MATCHES, COMPETITION & ANTI-CHEAT AUDITING
-- ==============================================================================

-- 3.1 Match Records
CREATE TABLE IF NOT EXISTS match_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    game_mode TEXT NOT NULL CHECK (game_mode IN ('blitz', 'sudden_death', 'duel_1v1', 'zen', 'flash_anzan', 'daily_challenge', 'boss')),
    seed TEXT NOT NULL,
    score INT NOT NULL,
    max_streak INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    average_reaction_ms INT NOT NULL DEFAULT 0,
    timeline_events JSONB DEFAULT '[]'::jsonb, -- [ { "q": 1, "delta_ms": 620, "correct": true, "input": "95" }, ... ]
    technique_breakdown JSONB DEFAULT '{}'::jsonb, -- { "MULT_25": { "correct": 9, "wrong": 1, "avg_ms": 1420 } }
    flagged_suspicious BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Ghost Runs (Shadow Racing)
CREATE TABLE IF NOT EXISTS ghost_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    game_mode TEXT NOT NULL,
    elo INT NOT NULL DEFAULT 1000,
    seed TEXT NOT NULL,
    total_score INT NOT NULL,
    duration_ms INT NOT NULL,
    timeline_events JSONB NOT NULL, -- Array of play events for replay
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Daily Challenges ("Mathle")
CREATE TABLE IF NOT EXISTS daily_challenges (
    challenge_date DATE PRIMARY KEY,
    seed TEXT NOT NULL,
    question_count INT DEFAULT 20 CHECK (question_count > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Daily Challenge Submissions
CREATE TABLE IF NOT EXISTS daily_challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_date DATE NOT NULL REFERENCES daily_challenges(challenge_date) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total_time_ms INT NOT NULL CHECK (total_time_ms >= 0),
    correct_count INT NOT NULL CHECK (correct_count >= 0),
    accuracy_percentage NUMERIC(5, 2) NOT NULL CHECK (accuracy_percentage BETWEEN 0 AND 100),
    share_grid TEXT NOT NULL, -- e.g. "🟩🟩🟩🟨🟩"
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (challenge_date, user_id)
);

-- 3.5 Boss Battles
CREATE TABLE IF NOT EXISTS boss_battles (
    id TEXT PRIMARY KEY, -- e.g. 'BOSS_GRADE_1', 'BOSS_GRADE_2'
    grade_level INT NOT NULL REFERENCES grades(grade_level) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    max_hp INT NOT NULL CHECK (max_hp > 0),
    attack_timeout_ms INT NOT NULL CHECK (attack_timeout_ms > 0),
    reward_skin_id TEXT NOT NULL REFERENCES aura_skins(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. B2B / CLASSROOM & ASSIGNMENTS
-- ==============================================================================

-- 4.1 Classrooms
CREATE TABLE IF NOT EXISTS classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    invite_code VARCHAR(8) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Classroom Members
CREATE TABLE IF NOT EXISTS classroom_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (classroom_id, student_id)
);

-- 4.3 Assignments
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_techniques TEXT[] NOT NULL,
    required_question_count INT NOT NULL CHECK (required_question_count > 0),
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.4 Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    accuracy_percentage NUMERIC(5, 2) NOT NULL CHECK (accuracy_percentage BETWEEN 0 AND 100),
    technique_breakdown JSONB NOT NULL, -- { "MULT_25": { "correct": 9, "wrong": 1, "avg_ms": 1420 } }
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (assignment_id, student_id)
);

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_node_progress_user ON user_node_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_node_progress_node ON user_node_progress(node_id);
CREATE INDEX IF NOT EXISTS idx_match_records_user ON match_records(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_records_leaderboard ON match_records(game_mode, score DESC) WHERE flagged_suspicious = FALSE;
CREATE INDEX IF NOT EXISTS idx_ghost_runs_matchmaking ON ghost_runs(game_mode, elo);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_daily_submissions_date ON daily_challenge_submissions(challenge_date, total_time_ms ASC);
CREATE INDEX IF NOT EXISTS idx_classroom_members_student ON classroom_members(student_id);
CREATE INDEX IF NOT EXISTS idx_classroom_members_classroom ON classroom_members(classroom_id);
CREATE INDEX IF NOT EXISTS idx_assignments_classroom ON assignments(classroom_id, due_date ASC);
CREATE INDEX IF NOT EXISTS idx_assignment_subs_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_radars_user ON cognitive_radars(user_id, computed_at DESC);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unlocked_skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_radars ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghost_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

-- 6.1 Grades & Skins (Public Read-Only)
CREATE POLICY "Grades viewable by all authenticated and anon users"
    ON grades FOR SELECT
    USING (true);

CREATE POLICY "Aura skins viewable by all authenticated and anon users"
    ON aura_skins FOR SELECT
    USING (true);

CREATE POLICY "Boss battles viewable by all"
    ON boss_battles FOR SELECT
    USING (true);

CREATE POLICY "Daily challenges viewable by all"
    ON daily_challenges FOR SELECT
    USING (true);

-- 6.2 Profiles
CREATE POLICY "Profiles viewable by authenticated users"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 6.3 User Node Progress
CREATE POLICY "Users can view their own node progress or their students' progress"
    ON user_node_progress FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM classroom_members cm
            JOIN classrooms c ON c.id = cm.classroom_id
            WHERE cm.student_id = user_node_progress.user_id
              AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own node progress"
    ON user_node_progress FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own node progress"
    ON user_node_progress FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6.4 User Unlocked Skins
CREATE POLICY "Users can view their unlocked skins"
    ON user_unlocked_skins FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock skins"
    ON user_unlocked_skins FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 6.5 Cognitive Radars
CREATE POLICY "Users can view cognitive radars"
    ON cognitive_radars FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own cognitive radar"
    ON cognitive_radars FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 6.6 Match Records
CREATE POLICY "Users can view match records"
    ON match_records FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR flagged_suspicious = FALSE
    );

CREATE POLICY "Users can insert their own match records"
    ON match_records FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 6.7 Ghost Runs
CREATE POLICY "Ghost runs viewable by authenticated users for matchmaking"
    ON ghost_runs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert ghost runs"
    ON ghost_runs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 6.8 Daily Challenge Submissions
CREATE POLICY "Daily challenge submissions viewable by authenticated users"
    ON daily_challenge_submissions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can submit their daily challenge once"
    ON daily_challenge_submissions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 6.9 Classrooms
CREATE POLICY "Teachers can view classrooms they own or students can view classrooms they belong to"
    ON classrooms FOR SELECT
    TO authenticated
    USING (
        teacher_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM classroom_members cm
            WHERE cm.classroom_id = classrooms.id
              AND cm.student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create classrooms"
    ON classrooms FOR INSERT
    TO authenticated
    WITH CHECK (
        teacher_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
              AND p.role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "Teachers can update their own classrooms"
    ON classrooms FOR UPDATE
    TO authenticated
    USING (teacher_id = auth.uid())
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own classrooms"
    ON classrooms FOR DELETE
    TO authenticated
    USING (teacher_id = auth.uid());

-- 6.10 Classroom Members
CREATE POLICY "Classroom members viewable by teacher and students of that classroom"
    ON classroom_members FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM classrooms c
            WHERE c.id = classroom_members.classroom_id
              AND c.teacher_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM classroom_members peers
            WHERE peers.classroom_id = classroom_members.classroom_id
              AND peers.student_id = auth.uid()
        )
    );

CREATE POLICY "Students can join a classroom"
    ON classroom_members FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can leave or teachers can remove students"
    ON classroom_members FOR DELETE
    TO authenticated
    USING (
        student_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM classrooms c
            WHERE c.id = classroom_members.classroom_id
              AND c.teacher_id = auth.uid()
        )
    );

-- 6.11 Assignments
CREATE POLICY "Assignments viewable by classroom teacher and enrolled students"
    ON assignments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM classrooms c
            WHERE c.id = assignments.classroom_id
              AND c.teacher_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM classroom_members cm
            WHERE cm.classroom_id = assignments.classroom_id
              AND cm.student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create assignments for their classrooms"
    ON assignments FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM classrooms c
            WHERE c.id = assignments.classroom_id
              AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update assignments for their classrooms"
    ON assignments FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM classrooms c
            WHERE c.id = assignments.classroom_id
              AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can delete assignments for their classrooms"
    ON assignments FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM classrooms c
            WHERE c.id = assignments.classroom_id
              AND c.teacher_id = auth.uid()
        )
    );

-- 6.12 Assignment Submissions
CREATE POLICY "Students can view their submissions or teachers can view submissions to their assignments"
    ON assignment_submissions FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM assignments a
            JOIN classrooms c ON c.id = a.classroom_id
            WHERE a.id = assignment_submissions.assignment_id
              AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can submit their assignment"
    ON assignment_submissions FOR INSERT
    TO authenticated
    WITH CHECK (
        student_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM assignments a
            JOIN classroom_members cm ON cm.classroom_id = a.classroom_id
            WHERE a.id = assignment_submissions.assignment_id
              AND cm.student_id = auth.uid()
        )
    );

-- ==============================================================================
-- 7. STORED PROCEDURES & RPC FUNCTIONS
-- ==============================================================================

-- 7.1 Automatic Profile & Default Skins Trigger on New User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_default_username TEXT;
    v_display_name TEXT;
    v_role TEXT;
BEGIN
    v_default_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        'aura_' || LOWER(SUBSTRING(REPLACE(NEW.id::text, '-', ''), 1, 8))
    );
    v_display_name := COALESCE(
        NEW.raw_user_meta_data->>'display_name',
        'Aura Apprentice'
    );
    v_role := COALESCE(
        NEW.raw_user_meta_data->>'role',
        'student'
    );
    IF v_role NOT IN ('student', 'teacher', 'admin') THEN
        v_role := 'student';
    END IF;

    -- Create profile
    INSERT INTO public.profiles (
        id,
        username,
        display_name,
        role,
        current_grade_level,
        total_xp,
        aura_level,
        current_streak_days,
        highest_blitz_score
    )
    VALUES (
        NEW.id,
        v_default_username,
        v_display_name,
        v_role,
        1,
        0,
        1,
        0,
        0
    )
    ON CONFLICT (id) DO NOTHING;

    -- Grant default unlocked Aura skins
    INSERT INTO public.user_unlocked_skins (user_id, skin_id)
    SELECT NEW.id, id
    FROM public.aura_skins
    WHERE unlocked_by_default = TRUE
    ON CONFLICT (user_id, skin_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7.2 Updated_at timestamp trigger for profiles
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7.3 Stored Procedure RPC: submit_match_score with Anti-Cheat Validation
-- Rejects matches where >10% of responses have reaction times under 150ms.
CREATE OR REPLACE FUNCTION public.submit_match_score(
    p_game_mode TEXT,
    p_seed TEXT,
    p_score INT,
    p_max_streak INT,
    p_total_questions INT,
    p_correct_answers INT,
    p_average_reaction_ms INT,
    p_timeline_events JSONB DEFAULT '[]'::jsonb,
    p_technique_breakdown JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_match_id UUID;
    v_total_events INT := 0;
    v_sub_150ms_count INT := 0;
    v_sub_150ms_ratio NUMERIC := 0.0;
    v_is_suspicious BOOLEAN := FALSE;
    v_xp_gained BIGINT := 0;
    v_current_xp BIGINT := 0;
    v_new_total_xp BIGINT := 0;
    v_new_aura_level INT := 1;
    v_highest_blitz INT := 0;
    v_is_new_high_score BOOLEAN := FALSE;
    v_streak_multiplier NUMERIC := 1.0;
    v_event RECORD;
BEGIN
    -- Authenticate caller
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'rejected', true,
            'code', 'UNAUTHORIZED',
            'message', 'User must be authenticated to submit match score'
        );
    END IF;

    -- Validate input game mode
    IF p_game_mode NOT IN ('blitz', 'sudden_death', 'duel_1v1', 'zen', 'flash_anzan', 'daily_challenge', 'boss') THEN
        RETURN jsonb_build_object(
            'success', false,
            'rejected', true,
            'code', 'INVALID_GAME_MODE',
            'message', 'Unknown game mode provided'
        );
    END IF;

    -- --------------------------------------------------------------------------
    -- ANTI-CHEAT VALIDATION:
    -- Check response latency timeline. Human physical motor response limit is ~150ms.
    -- If >10% of responses are under 150ms, mark suspicious and reject validation.
    -- --------------------------------------------------------------------------
    IF p_timeline_events IS NOT NULL AND jsonb_typeof(p_timeline_events) = 'array' THEN
        v_total_events := jsonb_array_length(p_timeline_events);

        IF v_total_events > 0 THEN
            SELECT COUNT(*)
            INTO v_sub_150ms_count
            FROM jsonb_array_elements(p_timeline_events) AS elem
            WHERE COALESCE((elem->>'delta_ms')::NUMERIC, (elem->>'deltaMs')::NUMERIC, 9999) < 150;

            v_sub_150ms_ratio := (v_sub_150ms_count::NUMERIC / v_total_events::NUMERIC);

            IF v_sub_150ms_ratio > 0.10 THEN
                v_is_suspicious := TRUE;
            END IF;
        END IF;
    END IF;

    -- Also check average reaction ms sanity check if sufficient questions were answered
    IF p_total_questions >= 5 AND p_average_reaction_ms < 150 THEN
        v_is_suspicious := TRUE;
    END IF;

    -- Record the match in match_records regardless (for audit & forensic trail)
    INSERT INTO public.match_records (
        user_id,
        game_mode,
        seed,
        score,
        max_streak,
        total_questions,
        correct_answers,
        average_reaction_ms,
        timeline_events,
        technique_breakdown,
        flagged_suspicious
    )
    VALUES (
        v_user_id,
        p_game_mode,
        p_seed,
        p_score,
        p_max_streak,
        p_total_questions,
        p_correct_answers,
        p_average_reaction_ms,
        p_timeline_events,
        p_technique_breakdown,
        v_is_suspicious
    )
    RETURNING id INTO v_match_id;

    -- If flagged suspicious, reject score consolidation and return security notice
    IF v_is_suspicious THEN
        RETURN jsonb_build_object(
            'success', false,
            'rejected', true,
            'flagged', true,
            'match_id', v_match_id,
            'code', 'ANTI_CHEAT_SUSPICIOUS_LATENCY',
            'reason', 'Rejected: more than 10% of responses had sub-150ms reaction time, violating physical reflex limits.',
            'metrics', jsonb_build_object(
                'total_events', v_total_events,
                'sub_150ms_events', v_sub_150ms_count,
                'sub_150ms_ratio', ROUND(v_sub_150ms_ratio, 4)
            )
        );
    END IF;

    -- --------------------------------------------------------------------------
    -- LEGITIMATE MATCH PROCESSING: Calculate XP, Streaks & Leaderboard Updates
    -- --------------------------------------------------------------------------
    -- Streak bonus multiplier
    IF p_max_streak >= 35 THEN
        v_streak_multiplier := 2.5;
    ELSIF p_max_streak >= 20 THEN
        v_streak_multiplier := 2.0;
    ELSIF p_max_streak >= 10 THEN
        v_streak_multiplier := 1.5;
    ELSIF p_max_streak >= 5 THEN
        v_streak_multiplier := 1.2;
    ELSE
        v_streak_multiplier := 1.0;
    END IF;

    -- Base XP = correct answers * 15 + score / 5
    v_xp_gained := ROUND((p_correct_answers * 15 + GREATEST(p_score, 0) / 5) * v_streak_multiplier);

    -- Fetch current player profile stats
    SELECT total_xp, highest_blitz_score
    INTO v_current_xp, v_highest_blitz
    FROM public.profiles
    WHERE id = v_user_id
    FOR UPDATE;

    v_new_total_xp := v_current_xp + v_xp_gained;
    -- Aura level scales as 1 + floor(sqrt(total_xp / 100))
    v_new_aura_level := GREATEST(1, FLOOR(1 + SQRT(v_new_total_xp / 100))::INT);

    -- Check new high score for blitz
    IF p_game_mode = 'blitz' AND p_score > v_highest_blitz THEN
        v_highest_blitz := p_score;
        v_is_new_high_score := TRUE;
    END IF;

    -- Update user profile
    UPDATE public.profiles
    SET
        total_xp = v_new_total_xp,
        aura_level = v_new_aura_level,
        highest_blitz_score = v_highest_blitz,
        updated_at = NOW()
    WHERE id = v_user_id;

    -- If eligible, persist as a Ghost Run for shadow racing matchmaking
    IF p_game_mode IN ('blitz', 'sudden_death') AND p_total_questions >= 8 AND p_correct_answers >= 5 THEN
        INSERT INTO public.ghost_runs (
            user_id,
            game_mode,
            elo,
            seed,
            total_score,
            duration_ms,
            timeline_events
        )
        VALUES (
            v_user_id,
            p_game_mode,
            GREATEST(800, LEAST(2400, 1000 + (p_score * 2))),
            p_seed,
            p_score,
            GREATEST(1000, p_total_questions * p_average_reaction_ms),
            p_timeline_events
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'rejected', false,
        'flagged', false,
        'match_id', v_match_id,
        'xp_gained', v_xp_gained,
        'new_total_xp', v_new_total_xp,
        'new_aura_level', v_new_aura_level,
        'is_new_high_score', v_is_new_high_score,
        'highest_blitz_score', v_highest_blitz
    );
END;
$$;

-- ==============================================================================
-- 8. SEED DATA
-- ==============================================================================

-- 8.1 Seed the 6 Curriculum Grades
INSERT INTO public.grades (grade_level, title, subtitle, description, target_techniques)
VALUES
(
    1,
    'Magnitude e Fluxo Esquerda-Direita',
    'Grau I: Fundamentos de Decomposição Posicional',
    'Desenvolve a intuição posicional de soma e subtração mental direta da esquerda para a direita, compensação aditiva e complemento de bases decimais (10, 100, 1000).',
    ARRAY['ADD_LEFT_TO_RIGHT', 'SUB_LEFT_TO_RIGHT', 'ADD_COMPENSATION', 'SUB_COMPENSATION', 'COMPLEMENT_BASE_10']
),
(
    2,
    'Fatores Notáveis e Divisores Decimais',
    'Grau II: Multiplicação Acelerada por Simetria',
    'Explora atalhos de cálculo para fatores notáveis com simetria decimal: fatores 5, 25, 50, 125, o método do acordeão para 11, multiplicação por 15 e 99, e a técnica de dimediação.',
    ARRAY['MULT_5', 'MULT_25', 'MULT_50', 'MULT_125', 'MULT_11_ACCORDION', 'MULT_15', 'MULT_99', 'HALVING_AND_DOUBLING']
),
(
    3,
    'Geometria e Produtos Notáveis',
    'Grau III: Identidades Algébricas Mentais',
    'Transforma expressões algébricas em intuição espacial instantânea: quadrados de números terminados em 5, produtos centrados em bases modulares (50 e 100) e a regra da diferença de quadrados.',
    ARRAY['SQUARES_ENDING_5', 'MODULAR_BASE_50', 'MODULAR_BASE_100', 'DIFF_OF_SQUARES']
),
(
    4,
    'Aproximações e Olho de Fermi',
    'Grau IV: Discriminação de Magnitude e Estimativa Rápida',
    'Focado em rapidez decisória sob pressão: arredondamento dinâmico, notação científica intuitiva e eliminação de distratores de ordens de grandeza em menos de 3 segundos.',
    ARRAY['FERMI_ORDER_OF_MAGNITUDE', 'RATIO_APPROXIMATION', 'PERCENTAGE_BENCHMARKS', 'RAPID_ROUNDING']
),
(
    5,
    'Sistemas Formais Históricos: Védica e Trachtenberg',
    'Grau V: Mecânica Cruzada e Aritmética de Vizinhança',
    'Domínio dos sistemas de cálculo de alto rendimento: Sutra Védico Urdhva-Tiryagbhyam (multiplicação vertical e cruzada) e o Sistema Trachtenberg de multiplicação direta dígito a dígito.',
    ARRAY['VEDIC_URDHVA_TIRYAGBHYAM', 'TRACHTENBERG_MULT_6', 'TRACHTENBERG_MULT_7', 'TRACHTENBERG_MULT_12']
),
(
    6,
    'Aritmética Modular, Soroban Anzan e Transcendência',
    'Grau VI: Visuoespacialidade e Validação Instantânea',
    'O ápice da fluência mental: projeções ultra-rápidas do Flash Anzan visuoespacial sem subvocalização e checagem de erros a 0ms através da Prova dos Noves e dos Onzes.',
    ARRAY['FLASH_ANZAN_SUM', 'CASTING_OUT_NINES', 'CASTING_OUT_ELEVENS', 'TRANSCENDENT_MIX']
)
ON CONFLICT (grade_level) DO UPDATE
SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    target_techniques = EXCLUDED.target_techniques;

-- 8.2 Seed Default Aura Skins Catalog
INSERT INTO public.aura_skins (id, name, description, rarity, unlocked_by_default)
VALUES
(
    'skin_aura_default',
    'Centelha Primordial (Spark)',
    'Aura bioluminescente original com flutuação senoidal translúcida e tons ciano e violeta.',
    'common',
    TRUE
),
(
    'skin_aura_zen',
    'Orbe Zen Lofi',
    'Aura meditativa serena com vibração harmônica contínua, otimizada para o Modo Zen.',
    'common',
    TRUE
),
(
    'skin_chronos_shifter',
    'Chrono Shifter',
    'Fragmento temporal cristalizado, conquistado ao derrotar Chronos, o Devorador de Dígitos.',
    'rare',
    FALSE
),
(
    'skin_quantum_surge',
    'Pulso de Plasma Quântico',
    'Asas luminosas com aceleração eletromagnética, forjadas no domínio dos Fatores Notáveis.',
    'rare',
    FALSE
),
(
    'skin_overdrive_vector',
    'Vórtice Hipersônico',
    'Anéis giroscópicos em rotação contínua com rastro cromático do Grau III de Geometria.',
    'epic',
    FALSE
),
(
    'skin_supernova_core',
    'Núcleo de Supernova',
    'Portal de geometria sagrada radiante com brilho estelar, concedido no Olho de Fermi.',
    'epic',
    FALSE
),
(
    'skin_vedic_lotus',
    'Lótus Harmônica Védica',
    'Mandalas entrelaçadas de cálculo transcendental derivadas dos sutras de Urdhva-Tiryagbhyam.',
    'epic',
    FALSE
),
(
    'skin_singularity_godmode',
    'Singularidade Quântica (Godmode)',
    'Disco de acreção prismático definitivo. O ápice visual dos mestres do Grau VI.',
    'legendary',
    FALSE
)
ON CONFLICT (id) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    rarity = EXCLUDED.rarity,
    unlocked_by_default = EXCLUDED.unlocked_by_default;

-- 8.3 Seed Boss Battles (First Boss Battle & Grades 2 to 6)
INSERT INTO public.boss_battles (id, grade_level, name, title, max_hp, attack_timeout_ms, reward_skin_id)
VALUES
(
    'BOSS_GRADE_1',
    1,
    'Chronos, o Devorador de Dígitos',
    'Arconte da Magnitude e Fluxo Esquerda-Direita',
    100,
    3500,
    'skin_chronos_shifter'
),
(
    'BOSS_GRADE_2',
    2,
    'Fractal, o Mestre dos Fatores',
    'Tecelão da Simetria e Decomposição Decimal',
    150,
    3000,
    'skin_quantum_surge'
),
(
    'BOSS_GRADE_3',
    3,
    'Axioma, o Guardião da Geometria',
    'Soberano dos Quadrados e Produtos Notáveis',
    200,
    2800,
    'skin_overdrive_vector'
),
(
    'BOSS_GRADE_4',
    4,
    'Singular, a Mente de Fermi',
    'Oráculo das Grandes Ordens de Magnitude',
    250,
    2500,
    'skin_supernova_core'
),
(
    'BOSS_GRADE_5',
    5,
    'Brahma, o Arquiteto Védico',
    'Mestre Supremo da Mecânica Cruzada e Trachtenberg',
    300,
    2200,
    'skin_vedic_lotus'
),
(
    'BOSS_GRADE_6',
    6,
    'Aether, o Lorde da Transcendência',
    'Avatar Supremo do Flash Anzan e Aritmética Modular',
    400,
    1800,
    'skin_singularity_godmode'
)
ON CONFLICT (id) DO UPDATE
SET
    grade_level = EXCLUDED.grade_level,
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    max_hp = EXCLUDED.max_hp,
    attack_timeout_ms = EXCLUDED.attack_timeout_ms,
    reward_skin_id = EXCLUDED.reward_skin_id;

-- ==============================================================================
-- END OF MIGRATION
-- ==============================================================================
