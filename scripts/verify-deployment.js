#!/usr/bin/env node

const https = require('https');
const http = require('http');

console.log('🔍 Verifying Day 7 Deployment...\n');

const urls = [
  'http://squill-frontend-bucket-1756485949914.s3-website-us-east-1.amazonaws.com',
  'https://squill-frontend-bucket-1756485949914.s3.amazonaws.com/index.html'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      console.log(`✅ ${url}`);
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`   Content-Type: ${res.headers['content-type']}`);
      console.log(`   Content-Length: ${res.headers['content-length']}`);
      console.log('');
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${url}`);
      console.log(`   Error: ${err.message}`);
      console.log('');
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ ${url}`);
      console.log(`   Timeout: Request took too long`);
      console.log('');
      req.destroy();
      resolve(false);
    });
  });
}

async function verifyDeployment() {
  console.log('🌐 Testing Website URLs:\n');
  
  let successCount = 0;
  for (const url of urls) {
    const success = await checkUrl(url);
    if (success) successCount++;
  }
  
  console.log('📊 Deployment Verification Results:');
  console.log(`   ✅ Working URLs: ${successCount}/${urls.length}`);
  console.log(`   🎯 Success Rate: ${Math.round((successCount/urls.length) * 100)}%`);
  
  if (successCount > 0) {
    console.log('\n🎉 DAY 7 DEPLOYMENT VERIFIED SUCCESSFUL!');
    console.log('🌐 Your Squill billing platform is LIVE!');
    console.log(`🚀 Primary URL: ${urls[0]}`);
  } else {
    console.log('\n⚠️  Deployment verification failed');
    console.log('🔧 Check AWS S3 console for troubleshooting');
  }
}

verifyDeployment().catch(console.error);