/** @type {import('next').NextConfig} */


// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'ALLOWALL'
            },
            {
              key: 'Content-Security-Policy',
              value: "frame-ancestors *;" // Allows all domains
            },
            {
              key: 'Access-Control-Allow-Origin',
              value: '*' // Allows all origins
            }
          ],
        },
      ];
    },
  }
  

export default nextConfig;
