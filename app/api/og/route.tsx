import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          gap: '40px',
        }}
      >
        {/* Title */}
        <div style={{ fontSize: '96px', fontWeight: 'bold' }}>
          Task Manager
        </div>

        {/* Tech Stack */}
        <div style={{ fontSize: '48px', color: '#0ea5e9', fontWeight: '600' }}>
          Next.js • Prisma • PostgreSQL • Docker
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '36px', color: '#cbd5e1' }}>
          Modern Task Management Built with Next.js 16 & React 19
        </div>

        {/* Features */}
        <div style={{ fontSize: '24px', color: '#94a3b8' }}>
          Beautiful UI • Dark/Light Mode • Full CRUD • Server Actions
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
