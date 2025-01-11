/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/run', // Proxy endpoint
          destination: 'https://jahangir.pythonanywhere.com/run', // Actual API URL
        },
      ];
    },
  };
  
  export default nextConfig;
  