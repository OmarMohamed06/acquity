// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables in .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  // Test business_sale
  console.log('\n=== TESTING BUSINESS SALE ===');
  const { data: businessData, error: businessError } = await supabase
    .from('listings')
    .select(`
      *,
      business_sale_details (*)
    `)
    .eq('type', 'business_sale');
  
  if (businessError) {
    console.error('❌ Business Error:', businessError.message);
  } else {
    console.log('✅ Found', businessData?.length, 'business listings');
    if (businessData?.[0]) {
      console.log('Business data:', JSON.stringify(businessData[0], null, 2));
    }
  }

  // Test franchise_sale
  console.log('\n=== TESTING FRANCHISE SALE ===');
  const { data: franchiseData, error: franchiseError } = await supabase
    .from('listings')
    .select(`
      *,
      franchise_sale_details (*)
    `)
    .eq('type', 'franchise_sale');
  
  if (franchiseError) {
    console.error('❌ Franchise Error:', franchiseError.message);
  } else {
    console.log('✅ Found', franchiseData?.length, 'franchise listings');
    if (franchiseData?.[0]) {
      console.log('Franchise data:', JSON.stringify(franchiseData[0], null, 2));
    }
  }

  // Test investment_opportunity
  console.log('\n=== TESTING INVESTMENT OPPORTUNITY ===');
  const { data: investmentData, error: investmentError } = await supabase
    .from('listings')
    .select(`
      *,
      investment_opportunity_details (*)
    `)
    .eq('type', 'investment_opportunity');
  
  if (investmentError) {
    console.error('❌ Investment Error:', investmentError.message);
  } else {
    console.log('✅ Found', investmentData?.length, 'investment listings');
    if (investmentData?.[0]) {
      console.log('Investment data:', JSON.stringify(investmentData[0], null, 2));
    }
  }
}

testConnection();
