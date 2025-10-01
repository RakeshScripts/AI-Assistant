
import React, { useState } from 'react';
import { UserProfile, Progress, FitnessPlan } from '../../types';
import { generateFitnessPlan } from '../../services/geminiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const FitnessTracker: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    weight: 70,
    height: 175,
    goal: 'Build muscle and improve cardio',
  });
  const [progress, setProgress] = useState<Progress>({ notes: 'Completed most workouts last week, feeling stronger.' });
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await generateFitnessPlan(profile, progress);
      setPlan(result);
    } catch (err) {
      setError('Failed to generate fitness plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-8">
        <Card title="Your Profile">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Age</label>
            <input type="number" name="age" value={profile.age} onChange={handleProfileChange} className="w-full bg-gray-700 border border-gray-600 rounded p-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Weight (kg)</label>
            <input type="number" name="weight" value={profile.weight} onChange={handleProfileChange} className="w-full bg-gray-700 border border-gray-600 rounded p-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Height (cm)</label>
            <input type="number" name="height" value={profile.height} onChange={handleProfileChange} className="w-full bg-gray-700 border border-gray-600 rounded p-2" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Fitness Goal</label>
            <textarea name="goal" value={profile.goal} onChange={handleProfileChange} className="w-full h-20 bg-gray-700 border border-gray-600 rounded p-2" />
          </div>
        </Card>
        <Card title="Track Progress">
           <textarea
            name="progressNotes"
            value={progress.notes}
            onChange={(e) => setProgress({ notes: e.target.value })}
            placeholder="How was your week? Any challenges or achievements?"
            className="w-full h-24 bg-gray-700 border border-gray-600 rounded p-2"
          />
        </Card>
        <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:bg-gray-500">
          {isLoading ? 'Generating Plan...' : 'Generate/Update AI Plan'}
        </button>
      </div>

      <div className="md:col-span-2">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {plan ? (
          <div className="space-y-8">
            <Card title="Your AI-Generated Workout Plan">
              <div className="space-y-4">
                {plan.workoutPlan.map(day => (
                  <div key={day.day} className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="font-bold text-cyan-300">{day.day}: <span className="text-white font-medium">{day.workout}</span></p>
                    <p className="text-sm text-gray-300 ml-2">{day.details}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Your AI-Generated Meal Plan">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="p-2">Day</th>
                      <th className="p-2">Breakfast</th>
                      <th className="p-2">Lunch</th>
                      <th className="p-2">Dinner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {plan.mealPlan.map(day => (
                      <tr key={day.day}>
                        <td className="p-2 font-semibold text-cyan-300">{day.day}</td>
                        <td className="p-2">{day.breakfast}</td>
                        <td className="p-2">{day.lunch}</td>
                        <td className="p-2">{day.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        ) : (
          !isLoading && <div className="flex justify-center items-center h-full rounded-lg border-2 border-dashed border-gray-700">
            <p className="text-gray-500">Your personalized plan will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessTracker;
