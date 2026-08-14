import { app } from './app.js';
import { env } from './config/env.js';
import { connectMongoDB } from './db/connectMongoDB.js';

async function bootstrap(): Promise<void> {
  try {
    await connectMongoDB();
    app.listen(env.port, () => console.log(`API listening on port ${env.port}`));
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

void bootstrap();
