#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Production Environment (Day 7)...\n');

try {
  // Step 1: Install AWS CLI via npx if not available
  console.log('📦 Ensuring AWS CLI is available...');
  try {
    execSync('npx awscli --version', { stdio: 'inherit' });
    console.log('✅ AWS CLI is ready\n');
  } catch (error) {
    console.log('⚠️  Installing AWS CLI via npx...');
    execSync('npm install -g @aws-cli/cli-node', { stdio: 'inherit' });
    console.log('✅ AWS CLI installed\n');
  }

  // Step 2: Check AWS Credentials
  console.log('🔑 Checking AWS credentials...');
  try {
    execSync('npx awscli sts get-caller-identity', { stdio: 'inherit' });
    console.log('✅ AWS credentials configured\n');
  } catch (error) {
    console.log('❌ AWS credentials not configured. Please run:');
    console.log('   npx awscli configure');
    console.log('   Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)');
    process.exit(1);
  }

  // Step 3: Deploy Backend (Serverless)
  console.log('🚀 Deploying serverless backend...');
  process.chdir(path.join(__dirname, '..'));
  execSync('npx serverless deploy --stage prod', { stdio: 'inherit' });
  console.log('✅ Backend deployed\n');

  // Step 4: Get API Gateway URL
  console.log('🔗 Getting API Gateway URL...');
  const serverlessInfo = execSync('npx serverless info --stage prod', { encoding: 'utf8' });
  const apiUrlMatch = serverlessInfo.match(/https:\/\/[a-z0-9]+\.execute-api\.[a-z0-9-]+\.amazonaws\.com\/prod/);
  const apiUrl = apiUrlMatch ? apiUrlMatch[0] : null;

  if (apiUrl) {
    console.log(`✅ API Gateway URL: ${apiUrl}\n`);
    
    // Update frontend environment
    const envContent = `REACT_APP_API_URL=${apiUrl}\nREACT_APP_STAGE=production\n`;
    fs.writeFileSync(path.join(__dirname, '..', 'frontend', '.env.production'), envContent);
    console.log('✅ Frontend environment updated\n');
  } else {
    console.log('⚠️  Could not extract API URL, please update manually\n');
  }

  // Step 5: Setup Monitoring
  console.log('📊 Setting up monitoring and observability...');
  
  // Add X-Ray tracing to serverless.yml if not present
  const serverlessPath = path.join(__dirname, '..', 'serverless.yml');
  let serverlessContent = fs.readFileSync(serverlessPath, 'utf8');
  
  if (!serverlessContent.includes('tracing:')) {
    console.log('🔍 Adding X-Ray tracing...');
    const tracingConfig = `
  tracing:
    lambda: true
    apiGateway: true`;
    
    serverlessContent = serverlessContent.replace(
      'provider:',
      `provider:${tracingConfig}`
    );
    
    fs.writeFileSync(serverlessPath, serverlessContent);
    console.log('✅ X-Ray tracing configured\n');
  }

  // Step 6: Create CloudWatch Dashboard
  console.log('📈 Creating CloudWatch dashboard...');
  const dashboardBody = {
    widgets: [
      {
        type: 'metric',
        properties: {
          metrics: [
            ['AWS/Lambda', 'Duration', 'FunctionName', 'squill-prod-ingestUsage'],
            ['AWS/Lambda', 'Errors', 'FunctionName', 'squill-prod-ingestUsage'],
            ['AWS/Lambda', 'Invocations', 'FunctionName', 'squill-prod-ingestUsage']
          ],
          period: 300,
          stat: 'Average',
          region: 'us-east-1',
          title: 'Lambda Metrics'
        }
      },
      {
        type: 'metric',
        properties: {
          metrics: [
            ['AWS/ApiGateway', '4XXError', 'ApiName', 'prod-squill'],
            ['AWS/ApiGateway', '5XXError', 'ApiName', 'prod-squill'],
            ['AWS/ApiGateway', 'Count', 'ApiName', 'prod-squill']
          ],
          period: 300,
          stat: 'Sum',
          region: 'us-east-1',
          title: 'API Gateway Metrics'
        }
      }
    ]
  };

  fs.writeFileSync('/tmp/dashboard.json', JSON.stringify(dashboardBody));
  try {
    execSync(`npx awscli cloudwatch put-dashboard --dashboard-name "Squill-Production" --dashboard-body file:///tmp/dashboard.json`, { stdio: 'inherit' });
    console.log('✅ CloudWatch dashboard created\n');
  } catch (error) {
    console.log('⚠️  Dashboard creation failed, continuing...\n');
  }

  console.log('🎉 Production environment setup complete!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Run: node scripts/deploy-frontend.js');
  console.log('   2. Test your API endpoints');
  console.log('   3. Monitor via CloudWatch dashboard');
  console.log('   4. Your Squill platform is production-ready! 🚀\n');

} catch (error) {
  console.error('❌ Production setup failed:', error.message);
  process.exit(1);
}