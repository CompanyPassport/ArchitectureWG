const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  showLineNumbers: true,
})

/** @type {import('next').NextConfig} */
module.exports = {
  ...withNextra(),
  basePath: '/ArchitectureWG',
  assetPrefix: '/ArchitectureWG/',
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: 'loose',
  },
}
