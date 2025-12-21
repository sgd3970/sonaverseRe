/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, quality = 80) {
    try {
        const info = await sharp(inputPath)
            .webp({ quality, effort: 6 }) // effort 6 for better compression
            .toFile(outputPath);

        const originalSize = fs.statSync(inputPath).size;
        const newSize = info.size;
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);

        console.log(`✅ ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`   Optimized: ${(newSize / 1024).toFixed(2)} KB`);
        console.log(`   Reduction: ${reduction}%\n`);
    } catch (error) {
        console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    }
}

async function main() {
    const publicDir = path.join(__dirname, '../public/images/product');

    console.log('🖼️  Starting Product Image Optimization...\n');

    // Manbo Image
    await optimizeImage(
        path.join(publicDir, 'manbo/product2.png'),
        path.join(publicDir, 'manbo/product2.webp'),
        80
    );

    // Bodume Image
    await optimizeImage(
        path.join(publicDir, 'bodume/product1.png'),
        path.join(publicDir, 'bodume/product1.webp'),
        80
    );

    console.log('✨ Optimization Complete!');
}

main();
