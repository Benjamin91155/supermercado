import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const lastModified = new Date();

  const routes = [
    "",
    "/products",
    "/categories",
    "/offers",
    "/about",
    "/contact",
    "/cart",
    "/favorites",
    "/login",
    "/register"
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7
  }));
}
