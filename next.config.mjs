/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Local development proxy to Flask API
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:5000/:path*', // Flask backend
          },
        ]
      : []
  },
}

export default nextConfig
