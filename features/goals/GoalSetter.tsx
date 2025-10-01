
import React, { useState } from 'react';
import { Goal, SubTask } from '../../types';
import { generateGoalPlan } from '../../services/geminiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const GoalSetter: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ description: '', target: '', deadline: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.description) {
      setError('Please enter a goal description.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const subTasks = await generateGoalPlan(newGoal.description, newGoal.target, newGoal.deadline);
      const goalToAdd: Goal = {
        id: Date.now().toString(),
        description: newGoal.description,
        target: newGoal.target,
        deadline: newGoal.deadline,
        subTasks: subTasks,
      };
      setGoals([...goals, goalToAdd]);
      setNewGoal({ description: '', target: '', deadline: '' });
    } catch (err) {
      setError('Failed to generate a plan for your goal. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const handleToggleSubTask = (goalId: string, taskIndex: number) => {
    setGoals(goals.map(goal => {
        if (goal.id === goalId) {
            const updatedSubTasks = goal.subTasks.map((subTask, index) => {
                if (index === taskIndex) {
                    return { ...subTask, completed: !subTask.completed };
                }
                return subTask;
            });
            return { ...goal, subTasks: updatedSubTasks };
        }
        return goal;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card title="Set a New Goal">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <input
            type="text"
            name="description"
            value={newGoal.description}
            onChange={handleInputChange}
            placeholder="What is your goal? (e.g., Learn React)"
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="target"
              value={newGoal.target}
              onChange={handleInputChange}
              placeholder="Measurable target (e.g., Build 3 apps)"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <input
              type="date"
              name="deadline"
              value={newGoal.deadline}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:bg-gray-500"
          >
            {isLoading ? 'Generating Plan...' : 'Add Goal & Get AI Plan'}
          </button>
          {isLoading && <Spinner />}
          {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
        </form>
      </Card>

      <div className="space-y-6">
        {goals.map(goal => (
          <Card key={goal.id} title={goal.description}>
            <div className="space-y-3">
                <div className="flex justify-between items-start text-sm">
                    {goal.target && <p className="text-gray-400"><span className="font-semibold text-purple-300">Target:</span> {goal.target}</p>}
                    {goal.deadline && <p className="text-gray-400"><span className="font-semibold text-purple-300">Deadline:</span> {goal.deadline}</p>}
                </div>
                <div>
                    <h4 className="font-semibold text-cyan-300 mb-2">Action Plan:</h4>
                    <ul className="space-y-2">
                        {goal.subTasks.map((subTask, index) => (
                           <li key={index} className="flex items-center bg-gray-700/50 p-2 rounded-md">
                               <input type="checkbox" checked={subTask.completed} onChange={() => handleToggleSubTask(goal.id, index)} className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-purple-500 focus:ring-purple-600" />
                               <span className={`ml-3 ${subTask.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>{subTask.task}</span>
                           </li>
                        ))}
                    </ul>
                </div>
                <button onClick={() => handleRemoveGoal(goal.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 mt-2">
                    Remove Goal
                </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalSetter;
