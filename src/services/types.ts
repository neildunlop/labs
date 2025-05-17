export interface AuthUser {
  id: number;
  email: string;
  username: string;
  sub: string;
  role: 'admin' | 'user';
  is_active: boolean;
} 