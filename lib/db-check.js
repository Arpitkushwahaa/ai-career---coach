import { db } from "./prisma";

export async function checkDatabaseConnection() {
  try {
    // Try to connect to the database
    await db.$connect();
    console.log("Database connection successful");
    return { connected: true };
  } catch (error) {
    console.error("Database connection failed:", error);
    return { 
      connected: false, 
      error: error.message 
    };
  } finally {
    await db.$disconnect();
  }
}

export async function isDatabaseAvailable() {
  const result = await checkDatabaseConnection();
  return result.connected;
}
