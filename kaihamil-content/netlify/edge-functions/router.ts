import type { Context } from "https://edge.netlify.com";

export default async function handler(request: Request, context: Context) {
  const url = new URL(request.url);
  const host = url.hostname;

  // Groove Pal domain routing
  if (host === "groovepal.com" || host === "www.groovepal.com") {
    // Skip if already has /products/groove-pal prefix (avoid double rewrite)
    if (url.pathname.startsWith("/products/groove-pal")) {
      return context.next();
    }
    
    // Rewrite to groove-pal content
    const newPath = url.pathname === "/" 
      ? "/products/groove-pal/index.html"
      : `/products/groove-pal${url.pathname}`;
    
    return context.rewrite(newPath);
  }

  // Valé subdomain routing
  if (host === "vale.kaihamil.com") {
    // Strip /vale/ prefix if present (avoid double path)
    let pathname = url.pathname;
    if (pathname.startsWith("/vale/")) {
      pathname = pathname.slice(5); // Remove "/vale"
    }
    
    const newPath = pathname === "/" || pathname === ""
      ? "/vale/index.html"
      : `/vale${pathname}`;
    
    return context.rewrite(newPath);
  }

  // Default: continue to origin
  return context.next();
}

export const config = {
  path: "/*",
};
