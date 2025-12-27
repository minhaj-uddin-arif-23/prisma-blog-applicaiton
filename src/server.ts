// server connection and prisma

import app from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("database connected");
    app.listen(5000, () => {
      console.log("server is running on http://localhost:5000");
    });
  } catch (error) {
    console.log("failed to connect database");
    process.exit(1);
  }
}
main();
