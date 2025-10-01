
import { GoogleGenAI, Type } from "@google/genai";
import { Expense, Investment, UserProfile, Progress } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (expenses: Expense[], investments: Investment[]) => {
  const expenseText = expenses.map(e => `${e.category}: $${e.amount}`).join(', ');
  const investmentText = investments.map(i => `${i.name} (${i.type}): $${i.value}`).join(', ');
  
  const prompt = `
    Based on the following financial data, provide personalized advice.
    Expenses: ${expenseText || 'None'}
    Investments: ${investmentText || 'None'}
    
    Provide 2-3 actionable savings suggestions and 2-3 tax optimization tips.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          savingsSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable tips to save money based on spending habits."
          },
          taxOptimization: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggestions to optimize taxes based on investments and financial situation."
          }
        }
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const generateRecipes = async (ingredients: string, preferences: string) => {
  const prompt = `
    Generate 3 diverse recipes based on the following criteria.
    Available ingredients: ${ingredients}
    Dietary preferences: ${preferences}

    For each recipe, provide a creative name, a list of all required ingredients with quantities, and step-by-step instructions.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateFitnessPlan = async (profile: UserProfile, progress: Progress) => {
    const prompt = `
    Create a personalized 7-day fitness and meal plan for the following user, dynamically adjusting based on their progress.
    User Profile:
    - Age: ${profile.age}
    - Weight: ${profile.weight} kg
    - Height: ${profile.height} cm
    - Goal: ${profile.goal}
    
    Recent Progress & Notes: ${progress.notes}
    
    The workout plan should specify the day, the main workout focus, and details (e.g., exercises, sets, reps).
    The meal plan should suggest ideas for breakfast, lunch, and dinner for each day.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          workoutPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                workout: { type: Type.STRING },
                details: { type: Type.STRING }
              }
            }
          },
          mealPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                breakfast: { type: Type.STRING },
                lunch: { type: Type.STRING },
                dinner: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateGoalPlan = async (description: string, target: string, deadline: string) => {
  const prompt = `
    Break down the following goal into a series of simple, actionable sub-tasks.
    Goal: ${description}
    Target: ${target || 'Not specified'}
    Deadline: ${deadline || 'Not specified'}

    Provide a list of 3-5 clear, concise sub-tasks that will help achieve this goal. For each sub-task, provide a 'task' description and a 'completed' status, which should be false.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            task: { type: Type.STRING, description: "A single, actionable step towards the main goal." },
            completed: { type: Type.BOOLEAN, description: "Whether the task is completed or not." }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
};
