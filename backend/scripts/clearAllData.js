// backend/scripts/clearAllData.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set in .env. Exiting.');
  process.exit(1);
}

async function clearAllDocs() {
  console.log('Connecting to:', MONGODB_URI);
  // connect without deprecated options
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  // Get the database name we are connected to
  const db = mongoose.connection.db;
  console.log('Using database:', db.databaseName);

  // List collections from the database (reliable)
  const collections = await db.listCollections().toArray();
  if (!collections || collections.length === 0) {
    console.log('No collections found in this database.');
    await mongoose.disconnect();
    return;
  }

  console.log('Collections found:', collections.map(c => c.name));

  // Safety: ask for environment variable override to actually delete
  // (Optional: remove interactive prompt if running in CI)
  const SKIP = ['system.indexes']; // add any you want to skip
  // If you want to only clear user collections, you can set a whitelist:
  // const WHITELIST = ['projects','experience','personalinfos'];
  // if using whitelist, only clear those
  const useWhitelist = false; // set to true if you want to only clear WHITELIST
  const WHITELIST = [];

  for (const collInfo of collections) {
    const name = collInfo.name;
    if (SKIP.includes(name)) {
      console.log(`Skipping system collection: ${name}`);
      continue;
    }
    if (useWhitelist && !WHITELIST.includes(name)) {
      console.log(`Skipping (not in whitelist): ${name}`);
      continue;
    }

    try {
      const collection = db.collection(name);
      const result = await collection.deleteMany({});
      console.log(`Cleared ${name} — deleted ${result.deletedCount} documents`);
    } catch (err) {
      console.error(`Error clearing ${name}:`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log('Disconnected. All done.');
}

clearAllDocs().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
