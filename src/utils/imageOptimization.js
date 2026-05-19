/**
 * Image Optimization Utility
 * Handles responsive images, lazy loading, and format conversion
 */

/**
 * Generate optimized image sources for modern formats
 * @param {string} imagePath - Path to image (e.g., 'projects/image.jpg')
 * @param {object} options - Configuration options
 * @returns {object} - Object with src, srcSet, and lazy loading attributes
 */
export const generateOptimizedImage = (imagePath, options = {}) => {
  const {
    widths = [320, 640, 960, 1280],
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    quality = 80,
    lazy = true,
  } = options;

  // Remove file extension
  const [path, ext] = imagePath.lastIndexOf('.') > -1
    ? [imagePath.slice(0, imagePath.lastIndexOf('.')), imagePath.slice(imagePath.lastIndexOf('.'))]
    : [imagePath, ''];

  // Generate srcSet for WebP format (modern browsers)
  const webpSrcSet = widths
    .map(w => `${path}-${w}w.webp ${w}w`)
    .join(', ');

  // Generate srcSet for AVIF format (next-gen, most efficient)
  const avifSrcSet = widths
    .map(w => `${path}-${w}w.avif ${w}w`)
    .join(', ');

  // Fallback JPEG for older browsers
  const jpegSrcSet = widths
    .map(w => `${path}-${w}w${ext} ${w}w`)
    .join(', ');

  return {
    src: imagePath, // Fallback for <img>
    webpSrcSet,
    avifSrcSet,
    jpegSrcSet,
    sizes,
    loading: lazy ? 'lazy' : 'eager',
    decoding: 'async',
  };
};

/**
 * Create a picture element for optimal image delivery
 * Usage: <picture>
 *          <source srcSet={getPictureSource('img.jpg').avif} type="image/avif" />
 *          <source srcSet={getPictureSource('img.jpg').webp} type="image/webp" />
 *          <img src={getPictureSource('img.jpg').src} alt="..." />
 *        </picture>
 */
export const getPictureSource = (imagePath, sizes = '(max-width: 640px) 100vw, 50vw') => {
  const [path] = imagePath.lastIndexOf('.') > -1
    ? [imagePath.slice(0, imagePath.lastIndexOf('.')), imagePath.slice(imagePath.lastIndexOf('.'))]
    : [imagePath, ''];

  return {
    avif: `${path}.avif`,
    webp: `${path}.webp`,
    jpeg: imagePath,
    sizes,
  };
};

/**
 * Preload critical images
 * @param {array} imagePaths - Array of image paths to preload
 */
export const preloadImages = (imagePaths = []) => {
  if (typeof document === 'undefined') return;

  imagePaths.forEach(imagePath => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imagePath;
    link.imagesrcset = generateOptimizedImage(imagePath).webpSrcSet;
    link.imagesizes = generateOptimizedImage(imagePath).sizes;
    document.head.appendChild(link);
  });
};

/**
 * Calculate optimal image dimensions based on container
 * @param {number} containerWidth - Width of container in px
 * @param {number} aspectRatio - Image aspect ratio (width/height)
 * @returns {object} - {width, height}
 */
export const calculateImageDimensions = (containerWidth, aspectRatio = 16 / 9) => {
  return {
    width: containerWidth,
    height: Math.round(containerWidth / aspectRatio),
  };
};

/**
 * Get image loading placeholder (LQIP - Low Quality Image Placeholder)
 * Blurred color or minimal SVG
 */
export const getImagePlaceholder = (color = '#e5e7eb') => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='${color.replace('#', '%23')}' width='16' height='9'/%3E%3C/svg%3E`;
};

/**
 * Format image path for CDN delivery (if using CDN)
 * Adjust based on your CDN provider (Cloudinary, Vercel, etc.)
 */
export const getCDNImageUrl = (imagePath, { width, quality = 80, format = 'auto' } = {}) => {
  // Example for Vercel/Next.js Image Optimization
  // Adjust URL based on your CDN
  const baseUrl = '/api/images'; // Or your CDN endpoint
  const params = new URLSearchParams({
    url: imagePath,
    w: width,
    q: quality,
    f: format,
  });
  return `${baseUrl}?${params.toString()}`;
};
