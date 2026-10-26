const api = process.env.HAWLAT_API_URL || "http://127.0.0.1:8000";
const mobile = process.env.BUILD_TARGET === "mobile";

/** @type {import('next').NextConfig} */
export default mobile
  ? // Static export bundled inside the Capacitor app; the API origin is NEXT_PUBLIC_API_URL.
    { output: "export", trailingSlash: true, images: { unoptimized: true } }
  : {
      async rewrites() {
        return [{ source: "/api/v1/:path*", destination: `${api}/api/v1/:path*` }];
      },
      async headers() {
        return [
          {
            source: "/:path*",
            headers: [
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "X-Frame-Options", value: "DENY" },
              { key: "Referrer-Policy", value: "same-origin" },
            ],
          },
        ];
      },
    };
