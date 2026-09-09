/** Prefix public files with Vite `base` so GitHub Pages (`/a129-kirie/`) works. */
export function assetUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}
