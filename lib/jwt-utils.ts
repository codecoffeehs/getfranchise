// utils/verifyToken.ts
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export type DecodedToken = {
  userId: string;
  role: string;
};

export const verifyToken = async (
  token: string,
): Promise<DecodedToken | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // ⚡ Adjust based on how your JWT is issued (these are common claim keys)
    const userId = payload.sub as string; // usually `sub` holds user id
    const role = payload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] as string;

    if (!userId) return null;

    return { userId, role };
  } catch {
    return null;
  }
};
