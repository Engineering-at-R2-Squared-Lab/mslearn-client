// lib/auth.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

// Login function that calls your external API
export async function loginUser(
  credentials: Record<string, unknown>
): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("API URL is not defined");
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();

    Cookies.set("auth", data.token, {
      expires: 7,
      secure: process.env.NODE_ENV !== "development",
    });

    return true;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}

export function isAuthenticated(): boolean {
  const token = Cookies.get("auth");
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function logoutUser(): void {
  Cookies.remove("auth");
}

export function getToken(): string | undefined {
  return Cookies.get("auth");
}
