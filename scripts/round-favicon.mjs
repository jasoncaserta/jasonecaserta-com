import sharp from 'sharp';
import fs from 'fs';

const input = 'src/assets/social-share.png';
const outputPng = 'public/favicon.png';
const outputIco = 'public/favicon.ico';
const outputSocial = 'src/assets/social-share.png';

async function roundCorners() {
  const size = 512; // Base size for favicon/social
  const radius = size * 0.2; // 20% radius for a nice rounded look

  // Create a mask for rounded corners
  const mask = Buffer.from(
    `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" /></svg>`
  );

  const roundedImage = await sharp(input)
    .resize(size, size)
    .composite([{
      input: mask,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // Write to all destinations
  fs.writeFileSync(outputPng, roundedImage);
  fs.writeFileSync(outputSocial, roundedImage);
  
  // Also create a smaller favicon.ico
  const icoImage = await sharp(roundedImage)
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync(outputIco, icoImage);

  console.log('Successfully rounded corners and updated favicons!');
}

roundCorners().catch(err => {
  console.error(err);
  process.exit(1);
});
