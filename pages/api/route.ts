

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export const config = {
  runtime: 'edge', // this is a pre-requisite
  // execute this function on iad1 or hnd1, based on the connecting client location
  regions: ['iad1', 'hnd1'],
};

export const maxDuration = 40; // This function can run for a maximum of 40 seconds
export const dynamic = 'force-dynamic';
 
export function GET(request: Request) {
  return new Response('Vercel', {
    status: 200,
  });
}
 
export default function handler(request: NextRequest) {
  return NextResponse.json({
    name: `I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`,
  });

}