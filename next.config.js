/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "http",
        hostname: "192.168.0.111",
      },

      {
        protocol: "https",
        hostname: "dcafac59e33b.ngrok-free.app",
        pathname: "/backend/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/backend/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};
