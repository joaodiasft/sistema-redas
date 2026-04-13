import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";

export async function getSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
