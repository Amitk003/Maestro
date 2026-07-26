import { NextResponse } from 'next/server';
import { parseIntent, generateSequence } from '../../../../lib/api/intentParser';

export async function POST(request: Request) {
  const body = await request.json();
  const { text } = body;

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'text field is required' }, { status: 400 });
  }

  const intent = parseIntent(text);
  const sequence = generateSequence(intent);

  return NextResponse.json({ intent, sequence });
}
