/**
 * Simple demo script to test the free Google Translate endpoint
 * Run in browser console to verify translation works
 */

async function testFreeTranslation() {
  console.log('🌐 Testing Free Google Translate Endpoint...\n');
  
  const testCases = [
    { text: 'Hello, world!', from: 'en', to: 'pt', expected: 'Olá Mundo!' },
    { text: 'Bonjour', from: 'fr', to: 'en', expected: 'Hello' },
    { text: 'Hola', from: 'es', to: 'pt', expected: 'Olá' },
  ];
  
  for (const test of testCases) {
    try {
      const params = new URLSearchParams({
        client: 'gtx',
        sl: test.from,
        tl: test.to,
        dt: 't',
        q: test.text,
      });
      
      const url = `https://translate.googleapis.com/translate_a/single?${params}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const translation = data[0]
        .filter(item => Array.isArray(item) && item[0])
        .map(item => item[0])
        .join('');
      
      console.log(`✅ "${test.text}" (${test.from}) → "${translation}" (${test.to})`);
      console.log(`   Expected: "${test.expected}"`);
      console.log(`   Match: ${translation.toLowerCase().includes(test.expected.toLowerCase()) ? '✅' : '⚠️'}\n`);
    } catch (error) {
      console.error(`❌ Failed to translate "${test.text}":`, error);
    }
  }
  
  console.log('✅ Translation test complete!');
}

// Run the test
testFreeTranslation();
