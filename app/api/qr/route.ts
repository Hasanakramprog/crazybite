import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

const DEFAULT_TARGET_URL = 'https://crazy-bites.netlify.app/';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url') || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_TARGET_URL;
    const format = searchParams.get('format') || 'png';

    if (format === 'svg') {
      const svg = await QRCode.toString(url, {
        type: 'svg',
        color: {
          dark: '#0E0E0E',
          light: '#F5C518', // Brand yellow background
        },
        margin: 2,
        errorCorrectionLevel: 'H',
      });
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    const pngBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 600,
      margin: 2,
      color: {
        dark: '#0E0E0E',
        light: '#F5C518',
      },
      errorCorrectionLevel: 'H',
    });

    return new NextResponse(pngBuffer as any, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
