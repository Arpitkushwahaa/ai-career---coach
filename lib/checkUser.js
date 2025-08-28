import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      console.log("No user found in currentUser()");
      return null;
    }

    console.log("Checking user with ID:", user.id);

    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      console.log("Found existing user:", loggedInUser.id);
      return loggedInUser;
    }

    console.log("Creating new user for:", user.id);
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress || '',
      },
    });

    console.log("Created new user:", newUser.id);
    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};
