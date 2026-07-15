import { cookies } from "next/headers"
import { prisma } from "./prisma"

export async function getUserFromCookies() {
  try {
    const cookieStore = await cookies()

    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value ||
      cookieStore.get("__Secure-next-auth.session-token")?.value

    if (!sessionToken) {
      console.log("No session token found in cookies")
      return null
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session) {
      console.log("Session not found in database")
      return null
    }

    if (session.expires < new Date()) {
      console.log("Session expired")
      return null
    }

    return session.user
  } catch (error) {
    console.error("getUserFromCookies error:", error)
    return null
  }
}