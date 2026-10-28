/**
 * Renovra Client-Side Image Optimizer
 * 
 * Automatically downsamples huge high-resolution images (4K/8K/phone photos),
 * converts them to modern WebP format, and compresses them with near-lossless
 * visual perception (85% quality).
 */

export interface OptimizeOptions {
  maxDimension?: number; // max width or height (default 1200)
  quality?: number;      // 0.1 to 1.0 (default 0.85)
}

export interface OptimizeResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  savedPercent: number;
  format: string;
  width: number;
  height: number;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function optimizeImageClient(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizeResult> {
  const { maxDimension = 1200, quality = 0.85 } = options;
  const originalSize = file.size;

  // 1. If it's SVG, keep as-is (vector graphics are already optimal)
  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      file,
      dataUrl,
      originalSize,
      optimizedSize: originalSize,
      savedPercent: 0,
      format: 'svg',
      width: 0,
      height: 0,
    };
  }

  // 2. Load image onto an HTML5 Image element
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate scale if image exceeds max dimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Draw onto Canvas with high quality smoothing
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Try modern WebP first
      let targetMime = 'image/webp';
      let dataUrl = canvas.toDataURL(targetMime, quality);

      // Fallback if browser can't produce webp dataUrl
      if (!dataUrl.startsWith('data:image/webp')) {
        targetMime = 'image/jpeg';
        dataUrl = canvas.toDataURL(targetMime, quality);
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas blob export failed'));
            return;
          }

          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const newFileName = `${baseName}.webp`;
          const optimizedFile = new File([blob], newFileName, { type: targetMime });

          const optimizedSize = blob.size;
          const savedPercent = originalSize > 0 
            ? Math.max(0, Math.round(((originalSize - optimizedSize) / originalSize) * 100))
            : 0;

          resolve({
            file: optimizedFile,
            dataUrl,
            originalSize,
            optimizedSize,
            savedPercent,
            format: 'webp',
            width,
            height,
          });
        },
        targetMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('ইমেজ ফাইলটি পড়তে ব্যর্থ হয়েছে।'));
    };

    img.src = objectUrl;
  });
}
