import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const GET = async (_req: NextRequest) => {
  return NextResponse.json({ message: 'API is working' })
}
