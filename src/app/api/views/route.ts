import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function POST() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: 'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN' },
      { status: 503 },
    );
  }
  try {
    const count = await redis.incr('portfolio-views');
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json(
      { error: 'Unable to connect to Redis' },
      { status: 503 },
    );
  }
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: 'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN' },
      { status: 503 },
    );
  }
  try {
    const count = (await redis.get<number>('portfolio-views')) || 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json(
      { error: 'Unable to connect to Redis' },
      { status: 503 },
    );
  }
}
