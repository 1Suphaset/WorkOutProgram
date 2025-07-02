import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg'; // เพิ่มการ import Pool ที่ตำแหน่งที่ถูกต้อง

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const userId = data.userId;
  console.log('MIGRATE DATA:', data); // เพิ่ม log

  try {
    // 1. Users
    if (data.user) {
      const { name, email } = data.user;
      await pool.query(
        `INSERT INTO users (name, email) VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,
        [name, email]
      );
    }

    // 2. Workouts
    if (Array.isArray(data.workouts)) {
      for (const w of data.workouts) {
        await pool.query(
          `INSERT INTO workouts (id, user_id, date, name, exercises, notes, completed, duration, created_at)
           VALUES ($1, (SELECT id FROM users WHERE email=$2), $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO UPDATE SET
             date=EXCLUDED.date, name=EXCLUDED.name, exercises=EXCLUDED.exercises, notes=EXCLUDED.notes,
             completed=EXCLUDED.completed, duration=EXCLUDED.duration, created_at=EXCLUDED.created_at`,
          [
            w.id,
            userId,
            w.date,
            w.name,
            JSON.stringify(w.exercises),
            w.notes,
            w.completed,
            w.duration,
            w.createdAt,
          ]
        );
      }
    }

    // 3. Templates
    if (Array.isArray(data.templates)) {
      for (const t of data.templates) {
        await pool.query(
          `INSERT INTO templates (id, user_id, name, exercises, category, created_at)
           VALUES ($1, (SELECT id FROM users WHERE email=$2), $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             name=EXCLUDED.name, exercises=EXCLUDED.exercises, category=EXCLUDED.category, created_at=EXCLUDED.created_at`,
          [
            t.id,
            userId,
            t.name,
            JSON.stringify(t.exercises),
            t.category,
            t.createdAt,
          ]
        );
      }
    }

    // 4. Exercises (custom)
    if (Array.isArray(data.customExercises)) {
      for (const ex of data.customExercises) {
        await pool.query(
          `INSERT INTO exercises (id, user_id, name, category, muscle_groups, difficulty, equipment, description, instructions, image_url, estimated_duration, is_custom, created_at)
           VALUES ($1, (SELECT id FROM users WHERE email=$2), $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO UPDATE SET
             name=EXCLUDED.name, category=EXCLUDED.category, muscle_groups=EXCLUDED.muscle_groups, difficulty=EXCLUDED.difficulty,
             equipment=EXCLUDED.equipment, description=EXCLUDED.description, instructions=EXCLUDED.instructions,
             image_url=EXCLUDED.image_url, estimated_duration=EXCLUDED.estimated_duration, is_custom=EXCLUDED.is_custom, created_at=EXCLUDED.created_at`,
          [
            ex.id,
            userId,
            ex.name,
            ex.category,
            JSON.stringify(ex.muscleGroups),
            ex.difficulty,
            ex.equipment,
            ex.description,
            JSON.stringify(ex.instructions),
            ex.imageUrl,
            ex.estimatedDuration,
            true,
            ex.createdAt,
          ]
        );
      }
    }

    // 5. Workout Logs
    if (Array.isArray(data.logs)) {
      for (const l of data.logs) {
        await pool.query(
          `INSERT INTO workout_logs (id, user_id, workout_id, completed_at, duration, exercises, notes, overall_effort)
           VALUES ($1, (SELECT id FROM users WHERE email=$2), $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
             workout_id=EXCLUDED.workout_id, completed_at=EXCLUDED.completed_at, duration=EXCLUDED.duration,
             exercises=EXCLUDED.exercises, notes=EXCLUDED.notes, overall_effort=EXCLUDED.overall_effort`,
          [
            l.id,
            userId,
            l.workoutId,
            l.completedAt,
            l.duration,
            JSON.stringify(l.exercises),
            l.notes,
            l.overallEffort,
          ]
        );
      }
    }

    // 6. Settings
    if (data.settings) {
      const s = data.settings;
      await pool.query(
        `INSERT INTO settings (user_id, name, email, notifications, reminder_time, units)
         VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4, $5, $6)
         ON CONFLICT (user_id) DO UPDATE SET
           name=EXCLUDED.name, email=EXCLUDED.email, notifications=EXCLUDED.notifications, reminder_time=EXCLUDED.reminder_time, units=EXCLUDED.units`,
        [userId, s.name, s.email, s.notifications, s.reminderTime, s.units]
      );
    }

    // 7. Progressions
    if (Array.isArray(data.progressions)) {
      for (const p of data.progressions) {
        await pool.query(
          `INSERT INTO progressions (id, user_id, template_id, current_level, start_date, completed_sessions, total_sessions, week_in_level, is_active, notes, created_at)
           VALUES ($1, (SELECT id FROM users WHERE email=$2), $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO UPDATE SET
             template_id=EXCLUDED.template_id, current_level=EXCLUDED.current_level, start_date=EXCLUDED.start_date,
             completed_sessions=EXCLUDED.completed_sessions, total_sessions=EXCLUDED.total_sessions, week_in_level=EXCLUDED.week_in_level,
             is_active=EXCLUDED.is_active, notes=EXCLUDED.notes, created_at=EXCLUDED.created_at`,
          [
            p.id,
            userId,
            p.templateId,
            p.currentLevel,
            p.startDate,
            p.completedSessions,
            p.totalSessions,
            p.weekInLevel,
            p.isActive,
            JSON.stringify(p.notes),
            p.createdAt,
          ]
        );
      }
    }

    // 8. Daily Notes
    if (Array.isArray(data.dailyNotes)) {
      for (const n of data.dailyNotes) {
        await pool.query(
          `INSERT INTO daily_notes (user_id, date, content, created_at, updated_at)
           VALUES ((SELECT id FROM users WHERE email=$1), $2, $3, $4, $5)`,
          [
            userId,
            n.date,
            n.content,
            n.createdAt,
            n.updatedAt,
          ]
        );
      }
    }

    // 9. Reminders
    if (Array.isArray(data.reminders)) {
      for (const r of data.reminders) {
        await pool.query(
          `INSERT INTO reminders (id, user_id, enabled, time, method, created_at)
           VALUES ($1, (SELECT id FROM users WHERE email=$2), $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET
             enabled=EXCLUDED.enabled, time=EXCLUDED.time, method=EXCLUDED.method, created_at=EXCLUDED.created_at`,
          [
            r.id,
            userId,
            r.enabled,
            r.time,
            r.method,
            r.createdAt,
          ]
        );
      }
    }

    // 10. Assessments
    if (Array.isArray(data.assessments)) {
      for (const a of data.assessments) {
        await pool.query(
          `INSERT INTO assessments (id, user_id, completed_at, results, overall_fitness_level, recommended_progressions, created_at)
           VALUES ($1, (SELECT id FROM users WHERE email=$2), $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             completed_at=EXCLUDED.completed_at, results=EXCLUDED.results, overall_fitness_level=EXCLUDED.overall_fitness_level,
             recommended_progressions=EXCLUDED.recommended_progressions, created_at=EXCLUDED.created_at`,
          [
            a.id,
            userId,
            a.completedAt,
            JSON.stringify(a.results),
            a.overallFitnessLevel,
            JSON.stringify(a.recommendedProgressions),
            a.createdAt,
          ]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MIGRATE ERROR:', error); // เพิ่ม log
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}