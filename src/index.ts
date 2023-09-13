import * as dotenv from 'dotenv';

dotenv.config({path: process.cwd() + '/config.env'});

import app from './app';

app();

// GET LATEST OSRS ITEMS
// const api = async () => {
//     const url = "https://prices.runescape.wiki/api/v1/osrs/mapping";
//     try {
//       const response = await axios.get(url);
//       const jsonData = JSON.stringify(response.data, null, 2); // Convert object to JSON string
//       await fs.writeFile("osrs-ge-items.json", jsonData); // Write the JSON data to a file
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
// api();
