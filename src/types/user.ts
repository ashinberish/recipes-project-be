export type User = {
  id: number;
  email: string | null;
  name: string | null;
  dob: string | null;
  sys_role: keyof Role;
  init_setup: boolean | null;
  last_login: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  disabled_at: Date | null;
  is_deleted: boolean | null;
  auth?: Auth;
};

export type Role = {
  ADMIN: "ADMIN";
  USER: "USER";
  DEV: "DEV";
  OWNER: "OWNER";
};

type Auth = {
  id?: number;
  user_id?: number;
  refresh_token?: string;
  password?: string;
  expiry_at?: string;
  updated_at?: string;
};
