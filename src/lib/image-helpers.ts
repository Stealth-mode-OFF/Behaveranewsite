export type ResponsiveImageOptions = {
  widths: number[];
  sizes?: string;
  quality?: number;
};

export type ResponsiveImageProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
};

const UNSPLASH_HOST = "images.unsplash.com";

function isUnsplashUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return url.hostname === UNSPLASH_HOST;
  } catch {
    return false;
  }
}

function buildUnsplashUrl(src: string, width: number, quality: number): string {
  if (!isUnsplashUrl(src)) return src;
  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("q", String(quality));
  url.searchParams.set("w", String(width));
  return url.toString();
}

export function getResponsiveImageProps(
  src: string,
  options: ResponsiveImageOptions,
): ResponsiveImageProps {
  if (!isUnsplashUrl(src)) {
    return { src };
  }

  const quality = options.quality ?? 80;
  const widths = options.widths.length ? options.widths : [800, 1200];
  const maxWidth = Math.max(...widths);

  return {
    src: buildUnsplashUrl(src, maxWidth, quality),
    srcSet: widths
      .map((width) => `${buildUnsplashUrl(src, width, quality)} ${width}w`)
      .join(", "),
    sizes: options.sizes,
  };
}
