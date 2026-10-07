/**
 * Helper utilities for handling single-image and multi-image posts on one card/div
 */

export function extractMediaGallery(item: { url: string; caption?: string | null }): string[] {
  if (!item || !item.url) return [];
  if (!item.caption) return [item.url];

  const match = item.caption.match(/<!--GALLERY:(.*?)-->/);
  if (match && match[1]) {
    try {
      const urls = JSON.parse(match[1]);
      if (Array.isArray(urls) && urls.length > 0) {
        return urls;
      }
    } catch {
      // Fallback to primary URL
    }
  }

  return [item.url];
}

export function cleanCaption(caption?: string | null): string {
  if (!caption) return "";
  return caption.replace(/<!--GALLERY:(.*?)-->/g, "").trim();
}

export function formatPostCaption(userCaption: string, imageUrls: string[]): string {
  const trimmed = (userCaption || "").trim();
  if (!imageUrls || imageUrls.length <= 1) return trimmed || "";
  const marker = `<!--GALLERY:${JSON.stringify(imageUrls)}-->`;
  return trimmed ? `${trimmed}\n${marker}` : marker;
}
