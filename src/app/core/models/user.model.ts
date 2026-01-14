export interface User {
  id: number;
  firstName: string;
  lastName: string;
  sex: string;
  email?: string
  avatarUrl?: string;
  isActive?: boolean;
  bgUrl?: string;

}