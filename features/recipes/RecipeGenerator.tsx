
import React, { useState } from 'react';
import { Recipe } from '../../types';
import { generateRecipes } from '../../services/geminiService';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg h-full flex flex-col">
        <h4 className="text-lg font-bold text-cyan-300 mb-2">{recipe.recipeName}</h4>
        <div className="flex-grow">
            <p className="font-semibold text-purple-300">Ingredients:</p>
            <ul className="list-disc list-inside text-sm text-gray-300 mb-4">
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
            <p className="font-semibold text-purple-300">Instructions:</p>
            <ol className="list-decimal list-inside text-sm text-gray-300">
                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
        </div>
    </div>
);


const RecipeGenerator: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [preferences, setPreferences] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!ingredients) {
      setError('Please list some ingredients.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    try {
      const result = await generateRecipes(ingredients, preferences);
      setRecipes(result);
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="Smart Recipe Generator">
        <div className="space-y-4">
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List ingredients you have (e.g., chicken breast, rice, broccoli, soy sauce)"
            className="w-full h-24 bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Dietary preferences (e.g., vegan, low-carb, gluten-free)"
            className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors duration-200 disabled:bg-gray-500"
          >
            {isLoading ? 'Generating...' : 'Generate Recipes'}
          </button>
        </div>
      </Card>
      
      {isLoading && <div className="mt-8"><Spinner /></div>}
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      
      {recipes.length > 0 && (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Your AI-Generated Recipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
