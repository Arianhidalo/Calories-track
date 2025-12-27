import React, { useEffect, useMemo, useState } from 'react';
import { Camera, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { MealEntry } from '../../context/AppContext';

interface MealLoggerProps {
  onCancel: () => void;
  onSave: (meal: MealEntry, isEdit: boolean) => void;
  initialMeal?: MealEntry | null;
}

interface AnalysisResult {
  foodItems: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const randomFoods = [
  'Grilled chicken breast, Brown rice, Steamed broccoli',
  'Salmon fillet, Quinoa, Asparagus',
  'Greek yogurt with berries and granola',
  'Turkey sandwich with avocado and greens',
  'Tofu stir fry with vegetables and noodles',
];

const generateMockAnalysis = (): AnalysisResult => {
  const baseCalories = 350 + Math.round(Math.random() * 400);
  const protein = Math.round(baseCalories * 0.3 / 4 + Math.random() * 10);
  const carbs = Math.round(baseCalories * 0.4 / 4 + Math.random() * 15);
  const fat = Math.round(baseCalories * 0.3 / 9 + Math.random() * 6);
  return {
    foodItems: randomFoods[Math.floor(Math.random() * randomFoods.length)],
    calories: baseCalories,
    protein,
    carbs,
    fat,
  };
};

const MealLogger: React.FC<MealLoggerProps> = ({ onCancel, onSave, initialMeal }) => {
  const [stage, setStage] = useState<'idle' | 'analyzing' | 'result' | 'edit'>(initialMeal ? 'edit' : 'idle');
  const [preview, setPreview] = useState<string | undefined>(initialMeal?.imageUrl);
  const [form, setForm] = useState<AnalysisResult>(() =>
    initialMeal
      ? {
          foodItems: initialMeal.foodItems,
          calories: initialMeal.calories,
          protein: initialMeal.protein,
          carbs: initialMeal.carbs,
          fat: initialMeal.fat,
        }
      : { foodItems: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  const [uploadKey, setUploadKey] = useState(Date.now());

  useEffect(() => {
    if (!initialMeal && preview && stage === 'analyzing') {
      const timer = setTimeout(() => {
        const result = generateMockAnalysis();
        setForm(result);
        setStage('result');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [preview, stage, initialMeal]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage('analyzing');
  };

  const handleConfirm = () => {
    const now = new Date();
    const baseMeal: MealEntry = {
      id: initialMeal?.id ?? crypto.randomUUID(),
      timestamp: initialMeal?.timestamp ?? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: preview,
      foodItems: form.foodItems,
      calories: Math.round(form.calories),
      protein: Math.round(form.protein),
      carbs: Math.round(form.carbs),
      fat: Math.round(form.fat),
    };
    onSave(baseMeal, Boolean(initialMeal));
  };

  const resetLogger = () => {
    setStage('idle');
    setForm({ foodItems: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
    setPreview(undefined);
    setUploadKey(Date.now());
  };

  const content = useMemo(() => {
    if (stage === 'analyzing') {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-primary">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Analyzing your meal...</p>
            <p className="text-sm text-slate-600">Our AI is estimating calories and macros from the photo.</p>
          </div>
        </div>
      );
    }

    if (stage === 'result') {
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {preview && <img src={preview} alt="Meal" className="w-full rounded-2xl object-cover shadow" />}
            <div className="rounded-xl bg-emerald-50 p-4 text-emerald-800">
              <p className="text-sm font-semibold">Identified foods</p>
              <p className="text-base font-bold">{form.foodItems}</p>
              <p className="text-sm">Calories: {Math.round(form.calories)} kcal</p>
              <p className="text-sm">Protein {Math.round(form.protein)}g · Carbs {Math.round(form.carbs)}g · Fat {Math.round(form.fat)}g</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-700">AI estimate</p>
              <p className="text-4xl font-bold text-slate-900">{Math.round(form.calories)} kcal</p>
              <p className="text-sm text-slate-600">Protein {Math.round(form.protein)}g · Carbs {Math.round(form.carbs)}g · Fat {Math.round(form.fat)}g</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleConfirm} className="flex-1 min-w-[140px]">
                <CheckCircle2 className="h-4 w-4" /> Confirm & Add
              </Button>
              <Button variant="outline" onClick={() => setStage('edit')} className="flex-1 min-w-[140px]">
                Edit Details
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (stage === 'edit') {
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {preview ? (
              <img src={preview} alt="Meal" className="w-full rounded-2xl object-cover shadow" />
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <p className="text-sm text-slate-500">No image selected</p>
              </div>
            )}
            {!initialMeal && (
              <button
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
                onClick={resetLogger}
              >
                <RefreshCcw className="h-4 w-4" /> Start over
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Foods</label>
              <Input
                value={form.foodItems}
                onChange={(e) => setForm((prev) => ({ ...prev, foodItems: e.target.value }))}
                placeholder="e.g. Grilled chicken, rice, broccoli"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Calories (kcal)</label>
                <Input
                  type="number"
                  value={form.calories}
                  onChange={(e) => setForm((prev) => ({ ...prev, calories: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Protein (g)</label>
                <Input
                  type="number"
                  value={form.protein}
                  onChange={(e) => setForm((prev) => ({ ...prev, protein: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Carbs (g)</label>
                <Input
                  type="number"
                  value={form.carbs}
                  onChange={(e) => setForm((prev) => ({ ...prev, carbs: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Fat (g)</label>
                <Input
                  type="number"
                  value={form.fat}
                  onChange={(e) => setForm((prev) => ({ ...prev, fat: Number(e.target.value) }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleConfirm} className="flex-1 min-w-[140px]">
                Save changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (initialMeal) {
                    setForm({
                      foodItems: initialMeal.foodItems,
                      calories: initialMeal.calories,
                      protein: initialMeal.protein,
                      carbs: initialMeal.carbs,
                      fat: initialMeal.fat,
                    });
                    onCancel();
                    return;
                  }
                  setStage(preview ? 'result' : 'idle');
                }}
                className="flex-1 min-w-[140px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-soft">
          <Camera className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-900">Take or upload a photo of your meal</p>
          <p className="text-sm text-slate-600">We will estimate calories and macros automatically.</p>
        </div>
        <label className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark">
          <input
            key={uploadKey}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          Upload meal photo
        </label>
        {preview && (
          <img src={preview} alt="Preview" className="mt-3 h-32 w-32 rounded-xl object-cover shadow" />
        )}
      </div>
    );
  }, [stage, preview, form, uploadKey, initialMeal]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">AI photo meal logging</p>
          <h2 className="text-2xl font-bold text-slate-900">Log Meal</h2>
          <p className="text-sm text-slate-600">Upload a photo to simulate AI meal detection and macros.</p>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Photo analysis</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </div>
  );
};

export default MealLogger;
