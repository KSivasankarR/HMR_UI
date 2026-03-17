/** @type {import('next').NextConfig} */


const ContentSecurityPolicy = `
  default-src 'self' 'unsafe-inline' https://marriage.rs.ap.gov.in https://registration.ap.gov.in;
  script-src 'self' 'unsafe-inline';
  child-src https://marriage.rs.ap.gov.in https://registration.ap.gov.in;
  style-src 'self' 'unsafe-inline' https://marriage.rs.ap.gov.in https://registration.ap.gov.in https://fonts.googleapis.com https://www.gstatic.com;
  font-src 'self' 'unsafe-inline' https://fonts.gstatic.com;
  img-src * 'self' data: https:;
`

const securityHeaders = [
      {key: 'X-Frame-Options',value: 'SAMEORIGIN'},
      {key: 'X-XSS-Protection',value: '1; mode=block'},
      {key: 'X-Content-Type-Options',value: 'nosniff'},
      {key: 'Content-Security-Policy',value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()},
      {key: 'Strict-Transport-Security',value: 'max-age=63072000; includeSubDomains; preload'} 
]

require("dotenv").config();
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,
  env:{
    API_URL:process.env.API_URL,
    PAYMENT_GATEWAY_URL:process.env.PAYMENT_GATEWAY_URL,
    PORT:process.env.PORT,
    HMR_HOME_URL:process.env.HMR_HOME_URL,
    OWN_ESIGN_URL:process.env.OWN_ESIGN_URL,
    ESIGN_PAGE:process.env.ESIGN_PAGE
  },
  images: {
    unoptimized: true,
  },
  basePath:"/hmr"
}

module.exports = nextConfig
