// Copies the backend data file into the website so it can be used as a fallback
// when the API is asleep. Runs automatically before `npm run dev` and `npm run build`.
// If the backend folder is not there (e.g. on a hosting build), it keeps the committed copy.
import { copyFileSync, existsSync } from 'node:fs';

const from = '../backend/src/main/resources/portfolio-data.json';
const to = 'public/portfolio-data.json';
if (existsSync(from)) {
  copyFileSync(from, to);
  console.log('synced portfolio-data.json');
} else {
  console.log('backend folder not found - using the committed public/portfolio-data.json');
}
