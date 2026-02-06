import React, { useState } from 'react';
import { Calculator, Heart, Activity, Target, TrendingUp, MessageCircle, Send, Bot } from 'lucide-react';

const BMICalculator = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [bmiMessage, setBmiMessage] = useState<string>('');
  const [healthRisk, setHealthRisk] = useState<string>('');

  // AI Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your health assistant. I can help you understand your BMI results and provide personalized health recommendations. Enter your details in the calculator to get started!", sender: 'ai' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const calculateBMI = () => {
    if (!height || !weight) return;

    let heightInMeters = 0;
    let weightInKg = 0;

    if (unit === 'metric') {
      heightInMeters = parseFloat(height) / 100; // Convert cm to meters
      weightInKg = parseFloat(weight);
    } else {
      // Convert inches to meters and pounds to kg
      heightInMeters = parseFloat(height) * 0.0254;
      weightInKg = parseFloat(weight) * 0.453592;
    }

    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
      alert('Please enter valid values');
      return;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    setResult(parseFloat(bmi.toFixed(1)));

    // Determine category and health risk
    let cat = '';
    let msg = '';
    let risk = '';

    if (bmi < 18.5) {
      cat = 'Underweight';
      msg = 'You may be underweight. Consider consulting a healthcare provider.';
      risk = 'Low risk, but may have nutrient deficiencies.';
    } else if (bmi < 25) {
      cat = 'Normal weight';
      msg = 'Congratulations! You have a healthy weight.';
      risk = 'Least risk of developing health problems.';
    } else if (bmi < 30) {
      cat = 'Overweight';
      msg = 'Consider lifestyle changes to reach a healthier weight.';
      risk = 'Increased risk of developing health problems.';
    } else {
      cat = 'Obese';
      msg = 'Consult a healthcare provider for guidance on weight management.';
      risk = 'High risk of developing health problems.';
    }

    setCategory(cat);
    setBmiMessage(msg);
    setHealthRisk(risk);

    // Add AI recommendation based on result
    const aiRecommendation = getAIRecommendation(bmi, cat, gender, parseInt(age));
    setChatMessages(prev => [...prev, { id: Date.now(), text: aiRecommendation, sender: 'ai' }]);
  };

  const getAIRecommendation = (bmi: number, category: string, gender: string, age: number) => {
    let recommendation = `Based on your BMI of ${bmi.toFixed(1)} (${category}), here are some personalized recommendations:\n\n`;
    
    if (bmi < 18.5) {
      recommendation += "• Consider increasing your caloric intake with nutrient-dense foods\n";
      recommendation += "• Focus on healthy proteins and complex carbohydrates\n";
      recommendation += "• Consider strength training exercises to build muscle mass\n";
      recommendation += "• Consult a healthcare provider for personalized advice\n";
    } else if (bmi >= 18.5 && bmi < 25) {
      recommendation += "• Maintain your current healthy lifestyle\n";
      recommendation += "• Continue regular exercise and balanced nutrition\n";
      recommendation += "• Stay hydrated and get adequate sleep\n";
      recommendation += "• Monitor your weight periodically\n";
    } else if (bmi >= 25 && bmi < 30) {
      recommendation += "• Aim for a calorie deficit through diet and exercise\n";
      recommendation += "• Incorporate at least 150 minutes of moderate exercise weekly\n";
      recommendation += "• Focus on portion control and whole foods\n";
      recommendation += "• Consider consulting a nutritionist\n";
    } else {
      recommendation += "• Consult a healthcare provider for a structured weight loss plan\n";
      recommendation += "• Focus on gradual, sustainable weight loss\n";
      recommendation += "• Combine diet changes with regular physical activity\n";
      recommendation += "• Consider professional support for long-term success\n";
    }

    recommendation += "\nWould you like more specific advice on nutrition or exercise?";
    return recommendation;
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setAge('');
    setResult(null);
    setCategory('');
    setBmiMessage('');
    setHealthRisk('');
  };

  const getBmiColor = () => {
    if (!result) return 'text-gray-500';
    if (result < 18.5) return 'text-blue-500';
    if (result < 25) return 'text-green-500';
    if (result < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBmiBarPosition = () => {
    if (!result) return 0;
    // Position the indicator on the scale (0-40 range)
    return Math.min(Math.max(result, 0), 40) * 2.5; // Scale to 0-100%
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const newUserMessage = { id: Date.now(), text: currentMessage, sender: 'user' };
    setChatMessages(prev => [...prev, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage, result, category);
      setChatMessages(prev => [...prev, { id: Date.now(), text: aiResponse, sender: 'ai' }]);
    }, 1000);

    setCurrentMessage('');
  };

  const generateAIResponse = (userMessage: string, bmi: number | null, category: string) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('thank') || lowerMsg.includes('help')) {
      return "You're welcome! I'm here to help with your health journey. Feel free to ask anything about BMI, nutrition, or fitness.";
    } else if (lowerMsg.includes('bmi') || lowerMsg.includes('weight')) {
      if (bmi !== null) {
        return `Your BMI is ${bmi.toFixed(1)} (${category}). This is calculated using your height and weight. A healthy BMI typically ranges from 18.5 to 24.9.`;
      } else {
        return "BMI (Body Mass Index) is a measure of body fat based on height and weight. Enter your details in the calculator to see your BMI.";
      }
    } else if (lowerMsg.includes('diet') || lowerMsg.includes('food') || lowerMsg.includes('nutrition')) {
      return "A balanced diet includes plenty of fruits and vegetables, lean proteins, whole grains, and healthy fats. Portion control is also important for maintaining a healthy weight.";
    } else if (lowerMsg.includes('exercise') || lowerMsg.includes('workout') || lowerMsg.includes('fitness')) {
      return "For general health, aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week, combined with muscle-strengthening activities on 2 or more days.";
    } else if (lowerMsg.includes('protein') || lowerMsg.includes('supplement')) {
      return "Protein is essential for muscle maintenance and repair. Good sources include lean meats, fish, eggs, dairy, legumes, and nuts. For active individuals, aim for 0.8-1g of protein per kg of body weight.";
    } else {
      return "I'm your health assistant! I can provide information about BMI, nutrition, fitness, and personalized recommendations based on your health metrics. How else can I assist you today?";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BMI Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Body Mass Index and get personalized health insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Calculator className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Calculate Your BMI</h2>
            </div>

            {/* Unit Toggle */}
            <div className="mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setUnit('metric')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    unit === 'metric'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    unit === 'imperial'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Imperial (lbs/in)
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height ({unit === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={`Enter height in ${unit === 'metric' ? 'cm' : 'inches'}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Enter weight in ${unit === 'metric' ? 'kg' : 'lbs'}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Female</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={calculateBMI}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Calculate BMI
                </button>
                <button
                  onClick={resetCalculator}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="mt-8">
              {/* BMI Result */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Heart className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
                </div>

                {result !== null ? (
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getBmiColor()}`}>{result}</div>
                    <div className="text-xl font-semibold text-gray-900 mb-2">{category}</div>
                    <p className="text-gray-600 mb-6">{bmiMessage}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="text-sm text-gray-600 mb-2">Health Risk Level</div>
                      <div className="text-sm text-gray-900 font-medium">{healthRisk}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter your details to calculate your BMI</p>
                  </div>
                )}
              </div>

              {/* BMI Scale */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">BMI Scale</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="relative h-6 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full overflow-hidden">
                    {result !== null && (
                      <div 
                        className="absolute top-0 w-1 h-8 bg-white border-2 border-gray-900 rounded-full -mt-1"
                        style={{ left: `${getBmiBarPosition()}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-900 whitespace-nowrap">
                          Your BMI
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Underweight<br/>&lt;18.5</span>
                    <span>Normal<br/>18.5-24.9</span>
                    <span>Overweight<br/>25-29.9</span>
                    <span>Obese<br/>&ge;30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Chatbot Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <Bot className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Health Assistant</h2>
              </div>
              
              <div className="flex-grow flex flex-col">
                <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-grow overflow-y-auto max-h-96">
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {msg.text.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your health..."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Health & Fitness Tips</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Maintain Balance</h3>
                  <p className="text-gray-600 text-sm">
                    A balanced diet with adequate protein, carbs, and fats is essential for optimal health.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Stay Active</h3>
                  <p className="text-gray-600 text-sm">
                    Regular exercise helps maintain a healthy weight and reduces disease risk.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Regular Monitoring</h3>
                  <p className="text-gray-600 text-sm">
                    Track your BMI and other health metrics regularly to monitor your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;