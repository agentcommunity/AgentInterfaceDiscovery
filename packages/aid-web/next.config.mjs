/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Add your Next.js config options here */
  transpilePackages: ['react-markdown', 'remark-gfm', '@aid/core', '@aid/conformance'],
};

export default nextConfig; 