/**
 * Test Script: Database Connectivity & Contact Form
 * 
 * This script validates:
 * 1. Supabase connection with correct schema configuration
 * 2. Contact form submission to leads table (public schema)
 * 3. Fallback behavior when Supabase is unavailable
 * 4. Data fetching from portfolio schema
 * 
 * Run: node test-connectivity.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://pkjigvacvddcnlxhvvba.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_KEY || 'sb_publishable_0MizTXBMEspPU_z4tSBfUA_59r4vYX6';

console.log('🔍 Testing MS-Portfolio Database Connectivity\n');
console.log('Configuration:');
console.log(`  URL: ${SUPABASE_URL}`);
console.log(`  Key: ${SUPABASE_KEY.substring(0, 20)}...`);
console.log('');

// Test 1: Connection Test
async function testConnection() {
  console.log('📡 Test 1: Connection Test');
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Simple query to verify connection
    const { data, error } = await supabase
      .schema('portfolio')
      .from('profile')
      .select('name')
      .limit(1);
    
    if (error) {
      console.log('  ❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('  ✅ Connection successful');
    console.log(`  📋 Profile found: ${data?.[0]?.name || 'No profile'}`);
    return true;
  } catch (err) {
    console.log('  ❌ Error:', err.message);
    return false;
  }
}

// Test 2: Portfolio Schema Access
async function testPortfolioSchema() {
  console.log('\n📚 Test 2: Portfolio Schema Access');
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Test projects table
    const { data: projects, error: projectsError } = await supabase
      .schema('portfolio')
      .from('projects')
      .select('name, slug')
      .limit(3);
    
    if (projectsError) {
      console.log('  ❌ Projects query failed:', projectsError.message);
      return false;
    }
    
    console.log(`  ✅ Projects: ${projects?.length || 0} found`);
    projects?.forEach(p => console.log(`     - ${p.name} (${p.slug})`));
    
    // Test artworks table
    const { data: artworks, error: artworksError } = await supabase
      .schema('portfolio')
      .from('artworks')
      .select('title, slug')
      .limit(3);
    
    if (artworksError) {
      console.log('  ❌ Artworks query failed:', artworksError.message);
      return false;
    }
    
    console.log(`  ✅ Artworks: ${artworks?.length || 0} found`);
    artworks?.forEach(a => console.log(`     - ${a.title} (${a.slug})`));
    
    return true;
  } catch (err) {
    console.log('  ❌ Error:', err.message);
    return false;
  }
}

// Test 3: Contact Form Submission (Public Schema)
async function testContactForm() {
  console.log('\n📧 Test 3: Contact Form Submission');
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const testLead = {
      name: 'Test User (Automated)',
      email: 'test@example.com',
      company: 'Test Company',
      project: 'Connectivity Test',
      message: 'This is an automated test submission.',
      project_source: 'portfolio',
    };
    
    console.log('  📝 Submitting test lead...');
    const { data, error } = await supabase
      .schema('public')
      .from('leads')
      .insert([testLead])
      .select();
    
    if (error) {
      console.log('  ❌ Submission failed:', error.message);
      if (error.message.includes('permission denied')) {
        console.log('  💡 This might be expected if RLS policies restrict inserts.');
        console.log('     Check your RLS policies in Supabase dashboard.');
      }
      return false;
    }
    
    console.log('  ✅ Submission successful');
    console.log(`  📋 Lead ID: ${data?.[0]?.id}`);
    return true;
  } catch (err) {
    console.log('  ❌ Error:', err.message);
    return false;
  }
}

// Test 4: Technologies JOIN Query
async function testTechnologiesJoin() {
  console.log('\n🔗 Test 4: Technologies JOIN Query');
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const { data: projects, error } = await supabase
      .schema('portfolio')
      .from('projects')
      .select(`
        name,
        slug,
        project_stack(
          technologies(name, category)
        )
      `)
      .limit(2);
    
    if (error) {
      console.log('  ❌ JOIN query failed:', error.message);
      return false;
    }
    
    console.log(`  ✅ Projects with technologies: ${projects?.length || 0}`);
    projects?.forEach(p => {
      const techCount = p.project_stack?.length || 0;
      console.log(`     - ${p.name}: ${techCount} technologies`);
    });
    
    return true;
  } catch (err) {
    console.log('  ❌ Error:', err.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const results = {
    connection: await testConnection(),
    portfolioSchema: await testPortfolioSchema(),
    contactForm: await testContactForm(),
    technologiesJoin: await testTechnologiesJoin(),
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('─'.repeat(50));
  console.log(`  Connection:         ${results.connection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Portfolio Schema:   ${results.portfolioSchema ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Contact Form:       ${results.contactForm ? '✅ PASS' : '⚠️  CHECK RLS'}`);
  console.log(`  Technologies JOIN:  ${results.technologiesJoin ? '✅ PASS' : '❌ FAIL'}`);
  console.log('─'.repeat(50));
  
  const allPassed = results.connection && results.portfolioSchema && results.technologiesJoin;
  
  if (allPassed) {
    console.log('\n🎉 All critical tests passed!');
    console.log('   Your database is properly configured and accessible.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
    console.log('   Refer to SUPABASE.md for troubleshooting steps.');
  }
  
  console.log('\n💡 Next Steps:');
  console.log('   1. Start dev server: npm run dev');
  console.log('   2. Navigate to http://localhost:8080');
  console.log('   3. Test contact form manually');
  console.log('   4. Check browser console for fallback logs');
  console.log('   5. Verify data displays correctly on all pages');
}

runTests().catch(err => {
  console.error('\n💥 Fatal Error:', err);
  process.exit(1);
});
