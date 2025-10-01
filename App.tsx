
import React, { useState } from 'react';
import FinanceAdvisor from './features/finance/FinanceAdvisor';
import RecipeGenerator from './features/recipes/RecipeGenerator';
import FitnessTracker from './features/fitness/FitnessTracker';
import GoalSetter from './features/goals/GoalSetter';
import TabButton from './components/TabButton';
import FinanceIcon from './components/icons/FinanceIcon';
import RecipeIcon from './components/icons/RecipeIcon';
import FitnessIcon from './components/icons/FitnessIcon';
import GoalIcon from './components/icons/GoalIcon';

enum AppTab {
  FINANCE = 'FINANCE',
  RECIPES = 'RECIPES',
  FITNESS = 'FITNESS',
  GOALS = 'GOALS',
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.FINANCE);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.FINANCE:
        return <FinanceAdvisor />;
      case AppTab.RECIPES:
        return <RecipeGenerator />;
      case AppTab.FITNESS:
        return <FitnessTracker />;
      case AppTab.GOALS:
        return <GoalSetter />;
      default:
        return <FinanceAdvisor />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Personal Assistant
          </h1>
          <p className="text-gray-400 mt-2">Your lifestyle, optimized.</p>
        </header>

        <nav className="flex justify-center mb-8 bg-gray-800/50 rounded-lg p-2 backdrop-blur-sm max-w-xl mx-auto">
          <TabButton
            label="Finance"
            icon={<FinanceIcon />}
            isActive={activeTab === AppTab.FINANCE}
            onClick={() => setActiveTab(AppTab.FINANCE)}
          />
          <TabButton
            label="Recipes"
            icon={<RecipeIcon />}
            isActive={activeTab === AppTab.RECIPES}
            onClick={() => setActiveTab(AppTab.RECIPES)}
          />
          <TabButton
            label="Fitness"
            icon={<FitnessIcon />}
            isActive={activeTab === AppTab.FITNESS}
            onClick={() => setActiveTab(AppTab.FITNESS)}
          />
          <TabButton
            label="Goals"
            icon={<GoalIcon />}
            isActive={activeTab === AppTab.GOALS}
            onClick={() => setActiveTab(AppTab.GOALS)}
          />
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
