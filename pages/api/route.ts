export const maxDuration = 40; // This function can run for a maximum of 40 seconds
export const dynamic = 'force-dynamic';
 
export function GET(request: Request) {
  return new Response('Vercel', {
    status: 200,
  });
}