import { db } from './db';
import { adminUsers } from './schema';

async function main() {
  try {
    await db.insert(adminUsers).values({ userName: 'admin', passwordHash: 'hashed_password' });
    const result = await db.select().from(adminUsers);
    console.log('Successfully queried the database:', result);
  } catch (error) {
    console.error('Error querying the database:', error);
  }
}

main();