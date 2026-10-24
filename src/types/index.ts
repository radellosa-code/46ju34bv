export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Category = 
  | 'Cooking' 
  | 'Tech' 
  | 'Construction' 
  | 'Lifehack' 
  | 'Science'
  | string;

export interface StepChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface GuideStep {
  id: string;
  title: string;
  detail: string;
  tip?: string;
  suggestedMinutes?: number;
  checklist?: StepChecklistItem[];
}

export interface Guide {
  id: string;
  title: string;
  category: Category;
  time: string;
  difficulty: Difficulty;
  description: string;
  tags?: string[];
  prerequisites?: string[];
  steps: GuideStep[];
  createdAt: string;
  updatedAt: string;
  timesCompleted?: number;
}
