import { NextResponse } from 'next/server';
import { loadBoardData, syncBoardData, getDb } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isAvailable = Boolean(getDb());
    if (!isAvailable) {
      return NextResponse.json({
        dbConnected: false,
        lanes: null,
        tasks: null
      });
    }

    const data = await loadBoardData();
    return NextResponse.json({
      dbConnected: true,
      lanes: data.lanes,
      tasks: data.tasks
    });
  } catch (err) {
    console.error('API /api/board GET error:', err);
    return NextResponse.json(
      { dbConnected: false, error: err.message, lanes: null, tasks: null },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAvailable = Boolean(getDb());
    if (!isAvailable) {
      return NextResponse.json(
        { dbConnected: false, error: 'DATABASE_URL not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { lanes, tasks } = body;

    if (!Array.isArray(lanes) || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Invalid payload: lanes and tasks arrays are required' },
        { status: 400 }
      );
    }

    await syncBoardData(lanes, tasks);
    return NextResponse.json({ success: true, dbConnected: true });
  } catch (err) {
    console.error('API /api/board POST error:', err);
    return NextResponse.json(
      { dbConnected: false, error: err.message },
      { status: 500 }
    );
  }
}
