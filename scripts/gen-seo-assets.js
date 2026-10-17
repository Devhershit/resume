import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function genFavicons() {
  const pubDir = path.join(process.cwd(), 'public');
  const svgPath = path.join(pubDir, 'favicon.svg');

  await sharp(svgPath).resize(48, 48).png().toFile(path.join(pubDir, 'favicon-48.png'));
  console.log('Created favicon-48.png');

  await sharp(svgPath).resize(192, 192).png().toFile(path.join(pubDir, 'favicon-192.png'));
  console.log('Created favicon-192.png');

  await sharp(svgPath).resize(32, 32).toFormat('png').toFile(path.join(pubDir, 'favicon.ico'));
  console.log('Created favicon.ico');

  // Professional OpenGraph banner (1200x630)
  const ogSvg = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="50%" stop-color="#111827" />
          <stop offset="100%" stop-color="#0369a1" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#a855f7" />
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill="url(#bg)" />
      
      <circle cx="1060" cy="140" r="280" fill="#38bdf8" opacity="0.12" />
      <circle cx="120" cy="520" r="260" fill="#a855f7" opacity="0.15" />

      <rect x="70" y="70" width="1060" height="490" rx="28" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.14)" stroke-width="1.5" />

      <circle cx="120" cy="120" r="9" fill="#FF5F57" />
      <circle cx="146" cy="120" r="9" fill="#FEBC2E" />
      <circle cx="172" cy="120" r="9" fill="#28C840" />

      <rect x="120" y="165" width="370" height="38" rx="19" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1" />
      <circle cx="142" cy="184" r="5" fill="#38bdf8" />
      <text x="160" y="189" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#38bdf8" letter-spacing="0.5">SOFTWARE DEVELOPER &amp; AI SPECIALIST</text>

      <text x="120" y="280" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="68" font-weight="800" fill="#ffffff" letter-spacing="-1">Harshit</text>
      <text x="120" y="340" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="34" font-weight="700" fill="url(#textGrad)">Interactive macOS Desktop Portfolio</text>

      <text x="120" y="405" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="20" font-weight="400" fill="#94a3b8">B.Tech CSE (AI &amp; ML) @ Dronacharya College of Engineering | Faridabad, India</text>
      <text x="120" y="440" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="18" font-weight="400" fill="#cbd5e1">Full Stack Development • Machine Learning • Interactive Web Systems</text>

      <rect x="120" y="480" width="390" height="38" rx="12" fill="rgba(15, 23, 42, 0.75)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
      <text x="142" y="504" font-family="ui-monospace, monospace" font-size="14" font-weight="500" fill="#38bdf8">harshit-portfolio-alpha-85.vercel.app</text>
    </svg>
  `);

  await sharp(ogSvg).png().toFile(path.join(pubDir, 'og-image.png'));
  console.log('Created og-image.png');
}

genFavicons().catch(console.error);
