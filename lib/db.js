import { neon } from '@neondatabase/serverless';

let isInitialized = false;

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return null;
  }
  return neon(dbUrl);
}

export async function initDb() {
  const sql = getDb();
  if (!sql) return false;
  if (isInitialized) return true;

  await sql`
    CREATE TABLE IF NOT EXISTS parallel_lanes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      color TEXT NOT NULL,
      badge TEXT NOT NULL,
      position INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS parallel_tasks (
      id TEXT PRIMARY KEY,
      lane_id TEXT NOT NULL,
      text TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT FALSE,
      position INT NOT NULL DEFAULT 0,
      created_at BIGINT NOT NULL
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_tasks_lane ON parallel_tasks(lane_id);
  `;

  isInitialized = true;
  return true;
}

export async function loadBoardData() {
  const sql = getDb();
  if (!sql) return null;

  await initDb();

  const rawLanes = await sql`
    SELECT id, title, color, badge, position
    FROM parallel_lanes
    ORDER BY position ASC, created_at ASC
  `;

  const rawTasks = await sql`
    SELECT id, lane_id as "laneId", text, done, position, created_at as "createdAt"
    FROM parallel_tasks
    ORDER BY position ASC, created_at DESC
  `;

  return {
    lanes: rawLanes.map(l => ({
      id: l.id,
      title: l.title,
      color: l.color,
      badge: l.badge
    })),
    tasks: rawTasks.map(t => ({
      id: t.id,
      laneId: t.laneId,
      text: t.text,
      done: Boolean(t.done),
      createdAt: Number(t.createdAt)
    }))
  };
}

export async function syncBoardData(lanes, tasks) {
  const sql = getDb();
  if (!sql) return false;

  await initDb();

  // Clear and rewrite or upsert
  // Since tasks and lanes are lightweight client-managed boards, replacing or batch upsert is cleanest
  await sql`BEGIN`;
  try {
    // Upsert or sync lanes
    const laneIds = (lanes || []).map(l => l.id);
    if (laneIds.length > 0) {
      await sql`DELETE FROM parallel_lanes WHERE NOT (id = ANY(${laneIds}))`;
      for (let i = 0; i < lanes.length; i++) {
        const lane = lanes[i];
        await sql`
          INSERT INTO parallel_lanes (id, title, color, badge, position)
          VALUES (${lane.id}, ${lane.title}, ${lane.color}, ${lane.badge || `Lane ${i+1}`}, ${i})
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            color = EXCLUDED.color,
            badge = EXCLUDED.badge,
            position = EXCLUDED.position
        `;
      }
    } else {
      await sql`DELETE FROM parallel_lanes`;
    }

    // Upsert or sync tasks
    const taskIds = (tasks || []).map(t => t.id);
    if (taskIds.length > 0) {
      await sql`DELETE FROM parallel_tasks WHERE NOT (id = ANY(${taskIds}))`;
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        await sql`
          INSERT INTO parallel_tasks (id, lane_id, text, done, position, created_at)
          VALUES (${t.id}, ${t.laneId}, ${t.text}, ${Boolean(t.done)}, ${i}, ${BigInt(t.createdAt || Date.now())})
          ON CONFLICT (id) DO UPDATE SET
            lane_id = EXCLUDED.lane_id,
            text = EXCLUDED.text,
            done = EXCLUDED.done,
            position = EXCLUDED.position
        `;
      }
    } else {
      await sql`DELETE FROM parallel_tasks`;
    }

    await sql`COMMIT`;
    return true;
  } catch (err) {
    await sql`ROLLBACK`;
    console.error('syncBoardData error:', err);
    throw err;
  }
}
