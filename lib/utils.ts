import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Canonical Exercise interface for use across the app and API
export interface Exercise {
  id: number;
  name: string;
  category: string;
  muscleGroups?: string[];
  difficulty?: string;
  equipment?: string;
  description?: string;
  instructions?: string[];
  image_url?: string;
  estimatedDuration?: number;
  isCustom?: boolean;
  createdAt?: string;
  userId?: number;
  recommendedSets?: {
    sets: number;
    reps: string;
    rest?: number;
  };
  benefits?: string[];
  tips?: string[];
  variations?: {
    name: string;
    description: string;
  }[];
}
