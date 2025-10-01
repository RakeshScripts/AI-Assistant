
export interface Expense {
  id: string;
  category: string;
  amount: number;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  value: number;
}

export interface FinancialAdvice {
  savingsSuggestions: string[];
  taxOptimization: string[];
}

export interface Recipe {
  recipeName: string;
  ingredients: string[];
  instructions: string[];
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: string;
}

export interface Progress {
  notes: string;
}

export interface WorkoutDay {
  day: string;
  workout: string;
  details: string;
}

export interface MealDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface FitnessPlan {
  workoutPlan: WorkoutDay[];
  mealPlan: MealDay[];
}

export interface SubTask {
  task: string;
  completed: boolean;
}

export interface Goal {
    id: string;
    description: string;
    target?: string;
    deadline?: string;
    subTasks: SubTask[];
}
