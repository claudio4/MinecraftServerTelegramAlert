import fs from 'fs';
import path from 'path'

export default JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "config.json"),
    'utf8'
  )
);
