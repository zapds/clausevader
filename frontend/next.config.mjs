/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "quickchart.io"
        }],
      },
}

export default nextConfig;
