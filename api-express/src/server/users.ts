import { Request } from "express";
import { db } from "../db/drizzle";
import { member, user } from "../db/schema";
import { auth } from "../lib/better-auth/auth";
import { eq, inArray, not } from "drizzle-orm";

interface ApiResponse {
  success: boolean;
  message: string;
}

interface CurrentUserResponse extends ApiResponse {
  currentUser?: typeof user.$inferSelect;
  session?: any;
}

/**
 * Get current authenticated user from request headers
 */
export const getCurrentUser = async (req: Request): Promise<CurrentUserResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (!session) {
      return { success: false, message: "Unauthorized: No session found" };
    }

    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    if (!currentUser) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      message: "User authenticated",
      session,
      currentUser,
    };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "Failed to get current user" };
  }
};

/**
 * Sign in user with email and password
 */
export const signIn = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    await auth.api.signInEmail({
      body: { email, password },
    });

    return { success: true, message: "Signed in successfully." };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "An unknown error occurred." };
  }
};

/**
 * Register new user (sign up)
 */
export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<ApiResponse> => {
  try {
    await auth.api.signUpEmail({
      body: { email, password, name: username },
    });

    return { success: true, message: "Signed up successfully." };
  } catch (error) {
    const e = error as Error;
    return { success: false, message: e.message || "An unknown error occurred." };
  }
};

/**
 * Get users who are NOT members of a given organization
 */
export const getUsers = async (organizationId: string): Promise<typeof user.$inferSelect[]> => {
  try {
    const membersList = await db.query.member.findMany({
      where: eq(member.organizationId, organizationId),
    });

    const users = await db.query.user.findMany({
      where: not(inArray(user.id, membersList.map((m) => m.userId))),
    });

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};
