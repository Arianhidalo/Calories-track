import React, { useEffect, useState } from 'react';
import Onboarding from './components/onboarding/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import MealLogger from './components/logger/MealLogger';
import { useAppContext, UserProfile, MealEntry } from './context/AppContext';

const App: React.FC = () => {
  const { setUserProfile, userProfile, addMeal, updateMeal } = useAppContext();
  const [view, setView] = useState<'onboarding' | 'dashboard' | 'logger'>(userProfile ? 'dashboard' : 'onboarding');
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  useEffect(() => {
    if (!userProfile) {
      setView('onboarding');
    }
  }, [userProfile]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setView('dashboard');
  };

  const handleSaveMeal = (meal: MealEntry, isEdit: boolean) => {
    if (isEdit) {
      updateMeal(meal.id, meal);
    } else {
      addMeal(meal);
    }
    setEditingMeal(null);
    setView('dashboard');
  };

  const handleEditMeal = (meal: MealEntry) => {
    setEditingMeal(meal);
    setView('logger');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {view === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
      {view === 'dashboard' && userProfile && (
        <Dashboard onLogMeal={() => setView('logger')} onEditMeal={handleEditMeal} />
      )}
      {view === 'logger' && (
        <MealLogger
          initialMeal={editingMeal}
          onCancel={() => {
            setEditingMeal(null);
            setView(userProfile ? 'dashboard' : 'onboarding');
          }}
          onSave={handleSaveMeal}
        />
      )}
    </div>
  );
};

export default App;
