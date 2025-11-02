#!/usr/bin/env node

/**
 * Script to optimize SVG files in public/images/
 * Preserves <title> tags for accessibility
 */

import { optimize } from 'svgo';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = join(__dirname, '..', 'public', 'images');

const config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox for responsive SVGs
          removeViewBox: false,
          // Keep title for accessibility
          removeTitle: false,
          // Keep important metadata
          removeDesc: false,
        },
      },
    },
    // Remove unnecessary attributes
    'removeEmptyAttrs',
    'removeEmptyContainers',
    // Clean up IDs
    'cleanupIds',
    // Minify styles
    'minifyStyles',
    // Remove comments
    'removeComments',
    // Convert colors to shorter format
    'convertColors',
  ],
};

// Get all SVG files
const files = readdirSync(imagesDir).filter(file => file.endsWith('.svg'));

console.log(`Found ${files.length} SVG files to optimize...\n`);

let totalOriginalSize = 0;
let totalOptimizedSize = 0;

files.forEach(file => {
  const filePath = join(imagesDir, file);
  const originalContent = readFileSync(filePath, 'utf8');
  const originalSize = Buffer.byteLength(originalContent, 'utf8');
  
  try {
    const result = optimize(originalContent, {
      path: filePath,
      ...config,
    });
    
    const optimizedContent = result.data;
    const optimizedSize = Buffer.byteLength(optimizedContent, 'utf8');
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    // Only write if there's meaningful savings
    if (optimizedSize < originalSize) {
      writeFileSync(filePath, optimizedContent, 'utf8');
      console.log(`✓ ${file}: ${(originalSize/1024).toFixed(2)}KB → ${(optimizedSize/1024).toFixed(2)}KB (${savings}% smaller)`);
      
      totalOriginalSize += originalSize;
      totalOptimizedSize += optimizedSize;
    } else {
      console.log(`- ${file}: Already optimized`);
      totalOriginalSize += originalSize;
      totalOptimizedSize += originalSize;
    }
  } catch (error) {
    console.error(`✗ Error optimizing ${file}:`, error.message);
  }
});

const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
console.log(`\n✓ Total: ${(totalOriginalSize/1024).toFixed(2)}KB → ${(totalOptimizedSize/1024).toFixed(2)}KB (${totalSavings}% smaller)`);
