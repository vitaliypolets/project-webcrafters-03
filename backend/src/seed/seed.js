import { connectMongoDB, disconnectMongoDB } from '../db/connectMongoDB.js';

async function seed() {
  await connectMongoDB();
  // TODO: add users and articles from the project source data.
  console.log('Seed placeholder completed');
  await disconnectMongoDB();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
