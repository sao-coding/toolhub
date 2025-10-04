import { NextRequest, NextResponse } from 'next/server'

export const GET = async (_req: NextRequest) => {
  return NextResponse.json({ message: 'API is working' })
}
