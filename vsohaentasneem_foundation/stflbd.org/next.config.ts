import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://stflbd.app",
      "font-src 'self' data:",
      "connect-src 'self' https://stflbd.app https://*.stflbd.app",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const adminSecurityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
  {
    key: "Cache-Control",
    value: "no-store, no-cache, must-revalidate, max-age=0",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: adminSecurityHeaders,
      },
      {
        source: "/admin",
        headers: adminSecurityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/foundation",
        destination: "/",
        permanent: true,
      },
      {
        source: "/foundation/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/download",
        destination: "https://stflbd.app/download",
        permanent: true,
      },
      {
        source: "/roadmap",
        destination: "https://stflbd.app/roadmap",
        permanent: true,
      },
      {
        source: "/account-deletion",
        destination: "https://stflbd.app/account-deletion",
        permanent: true,
      },
      {
        source: "/v/:code*",
        destination: "https://stflbd.app/v/:code*",
        permanent: true,
      },
      {
        source: "/verify/:path*",
        destination: "https://stflbd.app/verify/:path*",
        permanent: true,
      },
      {
        source: "/verify",
        destination: "https://stflbd.app/verify",
        permanent: true,
      },
      {
        source: "/demo",
        destination: "https://stflbd.app/demo",
        permanent: true,
      },
      {
        source: "/demo/:path*",
        destination: "https://stflbd.app/demo/:path*",
        permanent: true,
      },
      {
        source: "/finance",
        destination: "https://stflbd.app/demo/finance",
        permanent: true,
      },
      {
        source: "/operations",
        destination: "https://stflbd.app/demo/operations",
        permanent: true,
      },
      {
        source: "/governance",
        destination: "https://stflbd.app/demo/governance",
        permanent: true,
      },
      {
        source: "/outcomes",
        destination: "https://stflbd.app/demo/outcomes",
        permanent: true,
      },
      {
        source: "/compliance",
        destination: "https://stflbd.app/demo/compliance",
        permanent: true,
      },
      {
        source: "/documents",
        destination: "https://stflbd.app/demo/documents",
        permanent: true,
      },
      {
        source: "/people",
        destination: "https://stflbd.app/demo/people",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "https://stflbd.app/demo/projects",
        permanent: true,
      },
      {
        source: "/projects/:path*",
        destination: "https://stflbd.app/demo/projects",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
