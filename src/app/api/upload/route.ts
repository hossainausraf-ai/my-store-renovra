import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'কোনো ফাইল আপলোড করা হয়নি।' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);
    const originalSize = originalBuffer.length;
    const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

    // 1. If SVG: preserve vector format untouched
    if (isSvg) {
      const base64Url = `data:image/svg+xml;base64,${originalBuffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Url,
        fileName: file.name,
        originalSize,
        optimizedSize: originalSize,
        savedPercent: 0,
        format: 'svg'
      });
    }

    // 2. High-Quality WebP Compression via Sharp
    // Downsample if over 1400px (crystal sharp on 4K), auto-rotate EXIF, WebP 85% quality
    const optimizedBuffer = await sharp(originalBuffer)
      .rotate() // Auto-orient EXIF orientation
      .resize({
        width: 1400,
        height: 1400,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 85,
        effort: 4
      })
      .toBuffer();

    const optimizedSize = optimizedBuffer.length;
    const savedPercent = originalSize > 0 
      ? Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100)) 
      : 0;

    const base64Url = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
    const baseName = file.name.replace(/\.[^/.]+$/, '');

    return NextResponse.json({
      success: true,
      url: base64Url,
      fileName: `${baseName}.webp`,
      originalSize,
      optimizedSize,
      savedPercent,
      format: 'webp'
    });
  } catch (err: any) {
    console.error('Image optimization failed on upload:', err);
    return NextResponse.json({ success: false, message: err.message || 'ইমেজ অপ্টিমাইজেশন ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}
