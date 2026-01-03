// why need this ? first we need to create admin (any project or production )first manually

import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
  try {
    console.log("admin creatation started");
    const adminCreadential = {
      name: process.env.name!,
      email: process.env.email!,
      password: process.env.password!,
      phone: process.env.PHONE,
      role: UserRole.ADMIN,
    };
    console.log(adminCreadential);

    // check admin email already exist or not

    const existEmail = await prisma.user.findUnique({
      where: { email: adminCreadential.email },
    });
    if (existEmail) {
      throw new Error("email already exist!");
    }
    const API_URI = process.env.API_URL;
    const createAdmin = await fetch(`${API_URI}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminCreadential),
    });
    const errorData = await createAdmin.json(); // ***
    console.log({ errorData });
    // update verified email
    if (createAdmin.ok) {
      console.log("admin created -------");
      await prisma.user.update({
        where: {
          email: adminCreadential.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log({ verifiedEmail: "success" });
    }

    console.log("fetch started end");
    console.log({ createAdmin });
  } catch (error: any) {
    console.error("Something went wrong");
  }
}

seedAdmin();
