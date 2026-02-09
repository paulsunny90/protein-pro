import React from 'react';
import Navigation from './navigation/Navigation';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">NutriFit Pro</h3>
              <p className="text-gray-300 text-sm">
                Premium nutrition and fitness solutions for your health journey.
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Protein Supplements</a></li>
                <li><a href="#" className="hover:text-white">Fitness Accessories</a></li>
                <li><a href="#" className="hover:text-white">Baby Nutrition</a></li>
                <li><a href="#" className="hover:text-white">Specialty Diets</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Subscription Plans</a></li>
                <li><a href="#" className="hover:text-white">Fitness Programs</a></li>
                <li><a href="#" className="hover:text-white">BMI Calculator</a></li>
                <li><a href="#" className="hover:text-white">Nutrition Tracking</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 NutriFit Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;