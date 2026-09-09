import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { assetUrl } from "@/lib/asset-url";
import appCss from "../styles.css?url";

const APP_NAME = "KIRIE 漫画";
const spa = import.meta.env.VITE_SPA === "1";

function AppBody() {
  if (spa) return <Outlet />;
  return (
    <>
      <PreviewHostBridge />
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  );
}

export const Route = createRootRoute({
  head: spa
    ? undefined
    : () => ({
        meta: [
          { charSet: "utf-8" },
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          { title: APP_NAME },
          { name: "theme-color", content: "#1c1814" },
          { name: "description", content: "日式 RPG 立绘贴在城市风景上 — 大半身人物和背景透视脱钩，用量化网格一格一格拼漫画。" },
        ],
        links: [
          { rel: "icon", type: "image/svg+xml", href: assetUrl("favicon.svg") },
          { rel: "stylesheet", href: appCss },
          { rel: "manifest", href: assetUrl("__grok/manifest.webmanifest") },
          { rel: "apple-touch-icon", href: assetUrl("__grok/icon-180.png") },
        ],
      }),
  component: spa
    ? AppBody
    : () => (
        <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
          <head>
            <HeadContent />
          </head>
          <body>
            <AppBody />
            <Scripts />
          </body>
        </html>
      ),
});
