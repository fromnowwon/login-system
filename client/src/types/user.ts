export interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  google_id?: string;
  profile_image?: string;
}
