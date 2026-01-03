// why need this ? first we need to create admin (any project or production )first manually

import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
  try {
    const adminCreadential = {
      name: process.env.name,
      email: process.env.email,
      password: process.env.password,
      role: UserRole.ADMIN,
    };

    // check admin email already exist or not

    const existEmail = await prisma.user.findUnique({
      where: { email: adminCreadential.email as string },
    });
    if (existEmail) {
      throw new Error("email already exist!");
    }
    const createAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(adminCreadential),
      }
    );
  } catch (error: any) {
    console.error("Something went wrong");
  }
}
