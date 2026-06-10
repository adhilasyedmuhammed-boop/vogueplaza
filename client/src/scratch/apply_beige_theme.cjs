const fs = require('fs');
const path = 'client/src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Define the new Beige, Gold, and Black luxury color variables
const oldRoot = `:root {
  --black: #000000;
  --white: #ffffff;
  --cream: #F8F5F1;
  --cream-2: #F0EBE3;
  --dark: #111111;
  --dark-2: #222222;
  --gray-100: #F5F5F5;
  --gray-200: #EBEBEB;
  --gray-300: #D4D4D4;
  --gray-400: #AAAAAA;
  --gray-500: #888888;
  --gray-600: #555555;
  --gray-700: #333333;
  --gold: #B8914E;
  --gold-light: #D4AF7A;
  --gold-dark: #8B6B35;`;

const newRoot = `:root {
  --black: #111111;
  --white: #FAF8F5; /* Premium soft off-white/beige */
  --cream: #F3EFE6; /* Elegant warm beige */
  --cream-2: #EAE2D2; /* Muted sand beige */
  --dark: #111111;
  --dark-2: #222222;
  --gray-100: #FAF8F5;
  --gray-200: #EAE2D2;
  --gray-300: #D4CBB8;
  --gray-400: #A89F8D;
  --gray-500: #8C8170;
  --gray-600: #5C5449;
  --gray-700: #3D372F;
  --gold: #C5A880; /* Premium Champagne Gold */
  --gold-light: #E5D9C4;
  --gold-dark: #9B7E56;`;

css = css.replace(oldRoot, newRoot);

// Ensure card background and tags match the new soft beige theme
css = css.replace(/background:\s*#fff(fff)?;/g, 'background: var(--white);');
css = css.replace(/background-color:\s*#fff(fff)?;/g, 'background-color: var(--white);');

fs.writeFileSync(path, css, 'utf8');
console.log('Beige, Gold, and Black luxury theme applied successfully.');
