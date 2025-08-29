#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Squill Frontend Deployment (Day 7)...\n');

// Configuration
const BUCKET_NAME = 'squill-frontend-bucket-' + Date.now();
const REGION = 'us-east-1';
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

try {
  // Step 1: Build React App
  console.log('📦 Building React application...');
  process.chdir(FRONTEND_DIR);
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React build completed\n');

  // Step 2: Create S3 Bucket
  console.log('🪣 Creating S3 bucket...');
  try {
    execSync(`npx awscli s3 mb s3://${BUCKET_NAME} --region ${REGION}`, { stdio: 'inherit' });
    console.log(`✅ S3 bucket created: ${BUCKET_NAME}\n`);
  } catch (error) {
    console.log('⚠️  Bucket might already exist, continuing...\n');
  }

  // Step 3: Configure S3 for Static Website Hosting
  console.log('🌐 Configuring S3 for static website hosting...');
  const websiteConfig = {
    IndexDocument: { Suffix: 'index.html' },
    ErrorDocument: { Key: 'index.html' }
  };
  
  fs.writeFileSync('/tmp/website-config.json', JSON.stringify(websiteConfig, null, 2));
  execSync(`npx awscli s3api put-bucket-website --bucket ${BUCKET_NAME} --website-configuration file:///tmp/website-config.json`, { stdio: 'inherit' });
  console.log('✅ Website hosting configured\n');

  // Step 4: Set Bucket Policy for Public Read
  console.log('🔓 Setting bucket policy for public access...');
  const bucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`
      }
    ]
  };
  
  fs.writeFileSync('/tmp/bucket-policy.json', JSON.stringify(bucketPolicy, null, 2));
  execSync(`npx awscli s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy file:///tmp/bucket-policy.json`, { stdio: 'inherit' });
  console.log('✅ Bucket policy set\n');

  // Step 5: Sync Build Files to S3
  console.log('📤 Uploading build files to S3...');
  execSync(`npx awscli s3 sync build/ s3://${BUCKET_NAME} --delete --cache-control "max-age=31536000" --exclude "*.html"`, { stdio: 'inherit' });
  execSync(`npx awscli s3 sync build/ s3://${BUCKET_NAME} --delete --cache-control "max-age=0, no-cache, no-store, must-revalidate" --include "*.html"`, { stdio: 'inherit' });
  console.log('✅ Files uploaded to S3\n');

  // Step 6: Create CloudFront Distribution
  console.log('☁️  Creating CloudFront distribution...');
  
  // Update CloudFront config with actual bucket name
  const cloudfrontConfigPath = path.join(__dirname, '..', 'cloudfront-config.json');
  const cloudfrontConfig = JSON.parse(fs.readFileSync(cloudfrontConfigPath, 'utf8'));
  cloudfrontConfig.Origins.Items[0].DomainName = `${BUCKET_NAME}.s3.amazonaws.com`;
  cloudfrontConfig.CallerReference = `squill-${Date.now()}`;
  
  fs.writeFileSync('/tmp/cloudfront-config.json', JSON.stringify(cloudfrontConfig, null, 2));
  
  const distributionResult = execSync(`npx awscli cloudfront create-distribution --distribution-config file:///tmp/cloudfront-config.json`, { encoding: 'utf8' });
  const distribution = JSON.parse(distributionResult);
  const cloudfrontDomain = distribution.Distribution.DomainName;
  
  console.log('✅ CloudFront distribution created\n');

  // Step 7: Display Results
  console.log('🎉 Deployment Complete!\n');
  console.log('📊 Deployment Summary:');
  console.log(`   S3 Bucket: ${BUCKET_NAME}`);
  console.log(`   S3 Website URL: http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com`);
  console.log(`   CloudFront URL: https://${cloudfrontDomain}`);
  console.log(`   Status: Live and ready for production! 🚀\n`);

  // Save deployment info
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    bucketName: BUCKET_NAME,
    cloudfrontDomain: cloudfrontDomain,
    s3WebsiteUrl: `http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com`,
    cloudfrontUrl: `https://${cloudfrontDomain}`,
    region: REGION
  };
  
  fs.writeFileSync(path.join(__dirname, '..', 'deployment-info.json'), JSON.stringify(deploymentInfo, null, 2));
  console.log('💾 Deployment info saved to deployment-info.json');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}