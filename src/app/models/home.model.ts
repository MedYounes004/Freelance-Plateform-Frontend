export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface Freelancer {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  subscription: string;
  createdAt?: string;
  category: string;
}
