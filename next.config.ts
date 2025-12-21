import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	// config the image
	images: {
		domains: ['images.unsplash.com', 'giddy-narwhal-61.convex.cloud'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'giddy-narwhal-61.convex.cloud',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
