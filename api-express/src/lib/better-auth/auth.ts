import { db } from "../../db/drizzle";
import { schema } from "../../db/schema";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { lastLoginMethod, organization } from "better-auth/plugins";
import { Resend } from "resend";
import { admin, member, owner } from "./permissions";
// import { getActiveOrganization } from "../organizations"; // pastikan path sesuai struktur project-mu
import { getActiveOrganization } from "@/server/organizations";
const resend = new Resend(process.env.RESEND_API_KEY as string);

// --- Email Components ---
// Jika belum ada, ubah menjadi string HTML sederhana agar tidak error
// atau buat file komponen React terpisah di folder `emails/`
const VerifyEmail = ({ username, verifyUrl }: any) => `
  <p>Hi ${username},</p>
  <p>Verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>
`;

const ForgotPasswordEmail = ({ username, resetUrl, userEmail }: any) => `
  <p>Hi ${username},</p>
  <p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>
  <p>Your account email: ${userEmail}</p>
`;

const OrganizationInvitationEmail = ({ email, invitedByUsername, invitedByEmail, teamName, inviteLink }: any) => `
  <p>Hi ${email},</p>
  <p>${invitedByUsername} (${invitedByEmail}) invited you to join <strong>${teamName}</strong>.</p>
  <p>Click <a href="${inviteLink}">here</a> to accept the invitation.</p>
`;

// --- Better Auth Config ---
export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Verify your email",
        html: VerifyEmail({ username: user.name, verifyUrl: url }),
      });
    },
    sendOnSignUp: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Reset your password",
        html: ForgotPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      });
    },
    requireEmailVerification: true,
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const organizationData = await getActiveOrganization(session.userId);
          return {
            data: {
              ...session,
              activeOrganizationId: organizationData?.id,
            },
          };
        },
      },
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.APP_URL}/api/accept-invitation/${data.id}`;
        await resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: data.email,
          subject: "You've been invited to join our organization",
          html: OrganizationInvitationEmail({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          }),
        });
      },
      roles: { owner, admin, member },
    }),
    lastLoginMethod(),
  ],
});
