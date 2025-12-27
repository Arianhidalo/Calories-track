import React, { createContext, useContext, useMemo, useState } from 'react';

export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Active' | 'Very Active';
export type GoalChoice = 'Lose Weight' | 'Maintain Weight' | 'Build Muscle';

type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: GoalChoice;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export interface MealEntry {
  id: string;
  timestamp: string;
  imageUrl?: string;
  foodItems: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isEdited?: boolean;
}

interface AppContextValue {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  meals: MealEntry[];
  addMeal: (meal: MealEntry) => void;
  updateMeal: (id: string, meal: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  totals: { calories: number; protein: number; carbs: number; fat: number };
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>([]);

  const addMeal = (meal: MealEntry) => setMeals((prev) => [meal, ...prev]);

  const updateMeal = (id: string, meal: Partial<MealEntry>) =>
    setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...meal, isEdited: true } : m)));

  const deleteMeal = (id: string) => setMeals((prev) => prev.filter((m) => m.id !== id));

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [meals]);

  const value: AppContextValue = {
    userProfile,
    setUserProfile,
    meals,
    addMeal,
    updateMeal,
    deleteMeal,
    totals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
