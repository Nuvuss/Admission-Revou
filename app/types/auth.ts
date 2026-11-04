export type UserRole = "Owner" | "AC" | "BM";

export interface UserSession {
  name: string;
  role: UserRole;
  token?: string; // Token generated upon PIN verification for Owner
  savedAt: number;
}

