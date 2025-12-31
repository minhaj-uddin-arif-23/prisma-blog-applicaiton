// Better auth , user authentication setup, with extra functionality added and implement email send using nodemailer
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: true,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  // google sign-in/sign-up
  socialProviders: {
    google: {
      prompt:'select_account consent',
      accessType:'offline',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification:true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log({ user, url, token });

      try {
        const veryficationEmail = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Auth" <no-reply@yourdomain.com>',
          to: user.email,
          subject: "Confirm Your Email Address",
          text: `
Welcome to ${user.name},

Please verify your email address by visiting the link below:
${veryficationEmail}

This verification link will expire shortly for security reasons.

If you did not create an account, no action is required.

— Prisma Auth Team
`,
          html: `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background:#0f172a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="540" cellpadding="0" cellspacing="0"
            style="
              background:#ffffff;
              border-radius:14px;
              padding:40px;
              font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
              box-shadow:0 20px 40px rgba(0,0,0,0.25);
            ">

            <!-- Logo / Brand -->
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <div style="
                  width:56px;
                  height:56px;
                  background:linear-gradient(135deg,#2563eb,#4f46e5);
                  border-radius:14px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  color:#ffffff;
                  font-size:22px;
                  font-weight:700;
                ">
                  P
                </div>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="text-align:center;">
                <h1 style="
                  margin:0;
                  font-size:24px;
                  color:#0f172a;
                  font-weight:700;
                ">
                  Verify your email
                </h1>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding-top:18px;">
                <p style="
                  margin:0;
                  font-size:15px;
                  color:#475569;
                  line-height:1.7;
                  text-align:center;
                ">
                  Thanks for creating an account with <strong>Prisma Auth</strong>.
                  To continue, please confirm that this email address belongs to you.
                </p>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:32px 0;">
                <a href="${veryficationEmail}"
                  style="
                    background:linear-gradient(135deg,#2563eb,#4f46e5);
                    color:#ffffff;
                    padding:14px 32px;
                    border-radius:10px;
                    font-size:15px;
                    font-weight:600;
                    text-decoration:none;
                    display:inline-block;
                  ">
                  Verify Email Address
                </a>
              </td>
            </tr>

            <!-- Fallback -->
            <tr>
              <td>
                <p style="
                  font-size:13px;
                  color:#64748b;
                  text-align:center;
                  line-height:1.6;
                ">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>
                <p style="
                  font-size:12px;
                  color:#2563eb;
                  text-align:center;
                  word-break:break-all;
                ">
                  ${veryficationEmail}
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:28px 0;">
                <hr style="border:none;border-top:1px solid #e5e7eb;">
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td>
                <p style="
                  font-size:12px;
                  color:#94a3b8;
                  text-align:center;
                  line-height:1.6;
                  margin:0;
                ">
                  This link will expire for security reasons.<br/>
                  If you didn’t sign up, you can safely ignore this email.
                </p>

                <p style="
                  font-size:11px;
                  color:#cbd5f5;
                  text-align:center;
                  margin-top:20px;
                ">
                  © ${new Date().getFullYear()} Prisma Auth — All rights reserved
                </p>
              </td>
            </tr>

          </table>
          <!-- End Card -->

        </td>
      </tr>
    </table>
  </body>
</html>
  `,
        });
      } catch (error) {
        console.error("somthing wrong");
        throw new Error();
      }
    },
  },
});
