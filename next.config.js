/** @type {import('next').NextConfig} */
// const nextConfig = {
//   //   output: "export", // static export mode
// };

// module.exports = nextConfig;

// next.config.js
module.exports = {
  images: {
    domains: [
      "localhost",
      "192.168.0.144",
      "192.168.0.125",
      "192.168.0.150",
      "192.168.0.111",
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
