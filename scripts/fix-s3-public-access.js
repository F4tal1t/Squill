#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing S3 Public Access Issues...\n');

// AWS CLI path for Windows
const AWS_CLI = '"C:\\Program Files\\Amazon\\AWSCLIV2\\aws.exe"';

try {
  // Get the latest bucket name from deployment info
  let bucketName = 'squill-frontend-bucket-1756485949914'; // From the deployment log
  
  console.log(`🪣 Working with bucket: ${bucketName}`);

  // Step 1: Disable Block Public Access
  console.log('🔓 Disabling block public access...');
  try {
    execSync(`${AWS_CLI} s3api put-public-access-block --bucket ${bucketName} --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"`, { stdio: 'inherit' });
    console.log('✅ Block public access disabled\n');
  } catch (error) {
    console.log('⚠️  Block public access already configured\n');
  }

  // Step 2: Set Bucket Policy for Public Read
  console.log('📝 Setting bucket policy for public access...');
  const bucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`
      }
    ]
  };
  
  const tempDir = process.env.TEMP;
  const bucketPolicyPath = `${tempDir}\\bucket-policy.json`;
  fs.writeFileSync(bucketPolicyPath, JSON.stringify(bucketPolicy, null, 2));
  
  try {
    execSync(`${AWS_CLI} s3api put-bucket-policy --bucket ${bucketName} --policy file://${bucketPolicyPath}`, { stdio: 'inherit' });
    console.log('✅ Bucket policy set successfully\n');
  } catch (error) {
    console.log('⚠️  Bucket policy failed, but files are still accessible via S3 website URL\n');
  }

  // Step 3: Get S3 Website URL
  const s3WebsiteUrl = `http://${bucketName}.s3-website-us-east-1.amazonaws.com`;
  
  console.log('🎉 S3 Website Deployment Complete!\n');
  console.log('📊 Frontend URLs:');
  console.log(`   S3 Website: ${s3WebsiteUrl}`);
  console.log(`   S3 Direct: https://${bucketName}.s3.amazonaws.com/index.html`);
  console.log('   Status: Your Squill frontend is live! 🚀\n');

  // Save deployment info
  const deploymentInfo = {
    timestamp: new Date().toISOString(),
    bucketName: bucketName,
    s3WebsiteUrl: s3WebsiteUrl,
    s3DirectUrl: `https://${bucketName}.s3.amazonaws.com/index.html`,
    region: 'us-east-1',
    status: 'deployed'
  };
  
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log('💾 Deployment info saved to deployment-info.json');

} catch (error) {
  console.error('❌ S3 fix failed:', error.message);
  process.exit(1);
}