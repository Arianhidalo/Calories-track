import React from 'react';
import {
  Beef,
  CalendarDays,
  Camera,
  Droplet,
  Edit2,
  Settings,
  Trash2,
  UtensilsCrossed,
  Wheat,
} from 'lucide-react';
import { useAppContext, MealEntry } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

interface DashboardProps {
  onLogMeal: () => void;
  onEditMeal: (meal: MealEntry) => void;
}

const getProgressColor = (value: number, target: number) => {
  const ratio = target ? value / target : 0;
  if (ratio > 1) return '#ef4444';
  if (ratio >= 0.8) return '#f59e0b';
  return '#10b981';
};

const formatDate = () => {
  const now = new Date();
  return now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

const MacroBar: React.FC<{ label: string; value: number; target: number; icon: React.ReactNode }> = ({
  label,
  value,
  target,
  icon,
}) => {
  const progress = Math.min(100, (value / target) * 100);
  const color = getProgressColor(value, target);
  return (
    <div className="group rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-800">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner">
            {icon}
          </span>
          <span>{label}</span>
        </div>
        <span className="text-xs font-medium text-slate-500">{Math.round(value)}g / {Math.round(target)}g</span>
      </div>
      <Progress value={progress} color={color} className="h-3 bg-slate-100" />
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onLogMeal, onEditMeal }) => {
  const { userProfile, totals, meals, deleteMeal } = useAppContext();
  const calorieProgress = userProfile ? Math.min(100, (totals.calories / userProfile.dailyCalories) * 100) : 0;
  const calorieColor = userProfile ? getProgressColor(totals.calories, userProfile.dailyCalories) : '#10b981';
  const caloriePercent = userProfile && userProfile.dailyCalories > 0
    ? Math.round((totals.calories / userProfile.dailyCalories) * 100)
    : 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-900">{formatDate()}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>Let's hit your goals today!</span>
          </div>
        </div>
        <button
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          onClick={() => console.log('Open settings')}
          aria-label="Open settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </header>

      <section className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-800">Daily Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
              <div className="flex flex-1 justify-center">
                <div className="relative h-[220px] w-[220px]">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(${calorieColor} ${calorieProgress}%, #e2e8f0 ${calorieProgress}%)`,
                      transition: 'all 0.6s ease',
                    }}
                  />
                  <div className="absolute inset-3 rounded-full bg-white shadow-inner" />
                  <div className="absolute inset-10 flex flex-col items-center justify-center gap-1 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Calories</p>
                    <p className="text-3xl font-extrabold text-slate-900">
                      {Math.round(totals.calories)} / {userProfile?.dailyCalories ?? '--'}
                    </p>
                    <p className="text-xs font-medium text-slate-600">cal</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4">
                {userProfile && (
                  <>
                    <MacroBar label="Protein" value={totals.protein} target={userProfile.dailyProtein} icon={<Beef className="h-4 w-4" />} />
                    <MacroBar label="Carbs" value={totals.carbs} target={userProfile.dailyCarbs} icon={<Wheat className="h-4 w-4" />} />
                    <MacroBar label="Fat" value={totals.fat} target={userProfile.dailyFat} icon={<Droplet className="h-4 w-4" />} />
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 text-center text-sm font-medium text-slate-600">
              {caloriePercent}% of daily goal
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-800">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              size="lg"
              className="w-full gap-2 rounded-xl bg-primary text-white shadow-md transition hover:scale-[1.01] hover:bg-emerald-600"
              onClick={onLogMeal}
            >
              <Camera className="h-5 w-5" /> Log Meal
            </Button>
            {userProfile && (
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 text-emerald-800 shadow-sm">
                <p className="text-sm font-semibold">Today's Targets</p>
                <p className="mt-1 text-lg font-bold">{userProfile.dailyCalories} cal</p>
                <p className="text-sm">Protein {userProfile.dailyProtein}g · Carbs {userProfile.dailyCarbs}g · Fat {userProfile.dailyFat}g</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <h2 className="text-lg font-semibold">Today's Meals</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{meals.length}</span>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            <UtensilsCrossed className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium">No meals logged yet. Tap the button above to get started!</p>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="divide-y divide-slate-100 p-0">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-center gap-4 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50">
                    {meal.imageUrl ? (
                      <img src={meal.imageUrl} alt={meal.foodItems} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700">No photo</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-slate-900">{meal.foodItems}</p>
                      {meal.isEdited && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Edited</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-700">{meal.calories} cal</p>
                    <p className="text-xs text-slate-500">Logged at {meal.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
                      onClick={() => onEditMeal(meal)}
                      aria-label="Edit meal"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-full border border-slate-200 p-2 text-red-500 transition hover:bg-red-50"
                      onClick={() => deleteMeal(meal.id)}
                      aria-label="Delete meal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
