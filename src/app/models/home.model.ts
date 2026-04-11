export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface Freelancer {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  image: string;
  skills: string[];
}
