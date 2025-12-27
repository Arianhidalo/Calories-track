import React, { useMemo, useState } from 'react';
import { ActivityLevel, GoalChoice, UserProfile } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { cn } from '../../lib/utils';
import { Dumbbell, HeartPulse, Sparkles, Target } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const goalOptions: { label: GoalChoice; description: string; icon: React.ReactNode }[] = [
  { label: 'Lose Weight', description: 'Create a healthy calorie deficit with balanced macros.', icon: <Target /> },
  { label: 'Maintain Weight', description: 'Stay energized and steady with smart tracking.', icon: <HeartPulse /> },
  { label: 'Build Muscle', description: 'Fuel strength with a slight surplus and high protein.', icon: <Dumbbell /> },
];

const activityOptions: { label: ActivityLevel; description: string; icon: React.ReactNode; factor: number }[] = [
  { label: 'Sedentary', description: 'Little or no exercise', icon: <Sparkles />, factor: 1.2 },
  { label: 'Lightly Active', description: 'Light exercise 1-3 days/week', icon: <HeartPulse />, factor: 1.375 },
  { label: 'Active', description: 'Moderate exercise 3-5 days/week', icon: <Dumbbell />, factor: 1.55 },
  { label: 'Very Active', description: 'Hard exercise 6-7 days/week', icon: <Target />, factor: 1.725 },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<GoalChoice | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('Sedentary');

  const convertToCm = (value: number, unit: 'cm' | 'in') => (unit === 'cm' ? value : value * 2.54);
  const convertToKg = (value: number, unit: 'kg' | 'lbs') => (unit === 'kg' ? value : value * 0.453592);

  const summary = useMemo(() => {
    if (age === '' || height === '' || weight === '' || !goal) return null;
    const heightCm = convertToCm(height, heightUnit);
    const weightKg = convertToKg(weight, weightUnit);
    const base =
      gender === 'Male'
        ? 10 * weightKg + 6.25 * heightCm - 5 * Number(age) + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * Number(age) - 161;

    const activityFactor = activityOptions.find((o) => o.label === activityLevel)?.factor || 1.2;
    let calories = base * activityFactor;

    if (goal === 'Lose Weight') calories -= 500;
    if (goal === 'Build Muscle') calories += 300;

    const protein = (calories * 0.3) / 4;
    const carbs = (calories * 0.4) / 4;
    const fat = (calories * 0.3) / 9;

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      heightCm,
      weightKg,
      age: Number(age),
    };
  }, [age, height, weight, goal, gender, heightUnit, weightUnit, activityLevel]);

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleComplete = () => {
    if (!summary || !goal) return;
    const profile: UserProfile = {
      age: summary.age,
      gender,
      heightCm: summary.heightCm,
      weightKg: summary.weightKg,
      activityLevel,
      goal,
      dailyCalories: summary.calories,
      dailyProtein: summary.protein,
      dailyCarbs: summary.carbs,
      dailyFat: summary.fat,
    };
    onComplete(profile);
  };

  const stepIndicator = (
    <div className="mb-6 flex items-center gap-2">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={cn('h-1 flex-1 rounded-full bg-slate-200', s <= step && 'bg-primary')}
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-8">
      <div className="flex items-start justify-between gap-3 sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-tight text-primary">CalorieTrack AI</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Smarter nutrition starts here</h1>
          <p className="mt-2 text-slate-600">
            Personalize your daily calorie and macro goals with our guided onboarding.
          </p>
        </div>
        <div className="hidden h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 px-4 py-2 text-emerald-700 shadow-soft sm:flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-wide">Step {step} of 4</span>
          <span className="text-sm">Setup</span>
        </div>
      </div>

      {stepIndicator}

      {step === 1 && (
        <Card className="border-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">Choose your primary goal</span>
              <span className="text-sm text-slate-500">Tap to select</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {goalOptions.map((option) => (
                <button
                  key={option.label}
                  className={cn(
                    'card-hover flex flex-col gap-3 rounded-2xl border p-4 text-left transition',
                    goal === option.label ? 'border-primary bg-emerald-50 glow-border' : 'border-slate-200 bg-white',
                  )}
                  onClick={() => setGoal(option.label)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-primary">
                      {option.icon}
                    </div>
                    {goal === option.label && <span className="text-sm font-semibold text-primary">Selected</span>}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{option.label}</p>
                    <p className="text-sm text-slate-600">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={nextStep} disabled={!goal} size="lg">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Tell us about yourself</CardTitle>
            <p className="text-sm text-slate-600">We use this to personalize your daily targets.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Age</label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter your age"
                  min={10}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
                <Select value={gender} onChange={(e) => setGender(e.target.value as any)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Height</label>
                  <div className="flex rounded-full bg-slate-100 p-1 text-xs font-semibold text-slate-600">
                    {(['cm', 'in'] as const).map((unit) => (
                      <button
                        key={unit}
                        className={cn(
                          'rounded-full px-3 py-1 transition',
                          heightUnit === unit ? 'bg-white text-slate-900 shadow' : 'text-slate-600',
                        )}
                        onClick={() => setHeightUnit(unit)}
                      >
                        {unit.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                  placeholder={`Height in ${heightUnit}`}
                  min={0}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Current weight</label>
                  <div className="flex rounded-full bg-slate-100 p-1 text-xs font-semibold text-slate-600">
                    {(['kg', 'lbs'] as const).map((unit) => (
                      <button
                        key={unit}
                        className={cn(
                          'rounded-full px-3 py-1 transition',
                          weightUnit === unit ? 'bg-white text-slate-900 shadow' : 'text-slate-600',
                        )}
                        onClick={() => setWeightUnit(unit)}
                      >
                        {unit.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                  placeholder={`Weight in ${weightUnit}`}
                  min={0}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Button variant="subtle" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} disabled={age === '' || height === '' || weight === '' || !goal} size="lg">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">How active are you?</CardTitle>
            <p className="text-sm text-slate-600">We adjust your targets based on your daily movement.</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {activityOptions.map((option) => (
                <button
                  key={option.label}
                  className={cn(
                    'card-hover flex items-start gap-3 rounded-2xl border p-4 text-left transition',
                    activityLevel === option.label
                      ? 'border-primary bg-emerald-50 glow-border'
                      : 'border-slate-200 bg-white',
                  )}
                  onClick={() => setActivityLevel(option.label)}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-primary">
                    {option.icon}
                  </div>
                  <div>
                    <p className="text-base font-semibold">{option.label}</p>
                    <p className="text-sm text-slate-600">{option.description}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-primary">x{option.factor}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Button variant="subtle" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep} size="lg">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && summary && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-5 text-white">
            <p className="text-sm uppercase tracking-wide">Personalized plan</p>
            <h3 className="text-2xl font-bold">Here are your daily targets</h3>
            <p className="text-sm text-emerald-50">Calculated with Mifflin-St Jeor + activity & goal adjustments.</p>
          </div>
          <CardContent className="grid gap-6 py-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Daily calories</p>
                <p className="text-5xl font-extrabold text-emerald-700">{summary.calories}</p>
                <p className="text-sm text-emerald-700">kcal per day</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-600">Protein</p>
                  <p className="text-xl font-bold text-slate-900">{summary.protein}g</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-600">Carbs</p>
                  <p className="text-xl font-bold text-slate-900">{summary.carbs}g</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-600">Fat</p>
                  <p className="text-xl font-bold text-slate-900">{summary.fat}g</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
              <h4 className="text-lg font-semibold text-slate-900">How we calculated this</h4>
              <ul className="mt-3 space-y-3">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>
                    Basal Metabolic Rate (Mifflin-St Jeor) using your age, height, weight, and gender ({gender}).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>
                    Activity factor: <strong>{activityLevel}</strong> ({activityOptions.find((o) => o.label === activityLevel)?.factor}x)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>
                    Goal adjustment: <strong>{goal}</strong>
                    {goal === 'Lose Weight' && ' (-500 kcal)'}
                    {goal === 'Build Muscle' && ' (+300 kcal)'}
                    {goal === 'Maintain Weight' && ' (no adjustment)'}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>Macro split: 30% protein, 40% carbs, 30% fat.</span>
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                  Height: {summary.heightCm.toFixed(1)} cm
                </div>
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                  Weight: {summary.weightKg.toFixed(1)} kg
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="subtle" onClick={prevStep}>
                  Back
                </Button>
                <Button size="lg" onClick={handleComplete}>
                  Start Tracking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Onboarding;
