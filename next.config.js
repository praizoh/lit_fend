/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ipfs.infura.io',
      'statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com',
      'lens.infura-ipfs.io',
      'avatar.tobi.sh',
      'avatars.dicebear.com',
      'cdn.stamp.fyi',
      ""
    ],
  },
}

module.exports = nextConfig
