/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: "frame-ancestors 'self' https://*.dynamics.com https://*.crm.dynamics.com https://*.dynamics365.com *"
              },
              {
                key: 'Access-Control-Allow-Origin',
                value: '*'
              }
            ],
          },
        ];
      },
};

export default nextConfig;
