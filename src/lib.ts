import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export interface Session {
  user: User;
  expires: string;
  iat: number;
  exp: number;
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8 days from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createSessionToken(user: User) {
  // Create the session
  const expires = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  return session;
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
