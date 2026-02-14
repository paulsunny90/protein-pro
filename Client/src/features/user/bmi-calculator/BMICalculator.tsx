import { useState } from 'react';
import { Calculator, Heart, Target, Send, Bot } from 'lucide-react';
import { sendChatMessage } from '../../../services/chatService';

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
  const [isChatLoading, setIsChatLoading] = useState(false);

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

    // Gender-specific recommendations
    if (gender === 'female') {
      recommendation += `As a ${age > 50 ? 'woman over 50' : 'woman'}, consider:\n`;
      if (age > 50) {
        recommendation += "• Focus on calcium and vitamin D for bone health\n";
        recommendation += "• Include strength training to maintain muscle mass\n";
        recommendation += "• Monitor iron levels, especially if menstruating\n\n";
      } else {
        recommendation += "• Ensure adequate iron intake\n";
        recommendation += "• Consider prenatal nutrition if planning pregnancy\n\n";
      }
    } else {
      recommendation += `As a ${age > 50 ? 'man over 50' : 'man'}, consider:\n`;
      if (age > 50) {
        recommendation += "• Focus on heart health with omega-3 fatty acids\n";
        recommendation += "• Include resistance training for muscle maintenance\n";
        recommendation += "• Monitor testosterone levels with age\n\n";
      } else {
        recommendation += "• Focus on building lean muscle mass\n";
        recommendation += "• Ensure adequate protein intake\n\n";
      }
    }

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

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isChatLoading) return;

    const userMsgText = currentMessage;
    // Add user message
    const newUserMessage = { id: Date.now(), text: userMsgText, sender: 'user' as const };
    setChatMessages(prev => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsChatLoading(true);

    try {
      const context = result ? { bmi: result, category, healthRisk, gender, age } : null;
      const aiResponse = await sendChatMessage(userMsgText, context);

      setChatMessages(prev => [...prev, { id: Date.now(), text: aiResponse, sender: 'ai' as const }]);
    } catch (error: any) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: error.message || "I'm sorry, I'm having trouble connecting to my health knowledge base right now. Please try again later.",
        sender: 'ai' as const
      }]);
    } finally {
      setIsChatLoading(false);
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
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${unit === 'metric'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${unit === 'imperial'
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
                    <span>Underweight<br />&lt;18.5</span>
                    <span>Normal<br />18.5-24.9</span>
                    <span>Overweight<br />25-29.9</span>
                    <span>Obese<br />&ge;30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Chatbot Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col border border-gray-100">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md mr-3 group transition-transform hover:scale-110">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold leading-tight">Health Assistant</h2>
                      <div className="flex items-center text-blue-100 text-xs mt-0.5">
                        <span className="flex h-2 w-2 mr-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        AI Powered • Online
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-grow flex flex-col p-4 bg-slate-50/50">
                <div className="flex-grow overflow-y-auto max-h-[500px] mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                  <div className="space-y-4 pt-2">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${msg.sender === 'user'
                            ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                            }`}
                        >
                          {msg.text.split('\n').map((line, i) => (
                            <p key={i} className={i > 0 ? 'mt-2' : ''}>
                              {line.startsWith('•') ? (
                                <span className="flex items-start">
                                  <span className="mr-2 text-indigo-400">•</span>
                                  <span>{line.substring(2)}</span>
                                </span>
                              ) : line}
                            </p>
                          ))}
                          <div className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-100 shadow-sm flex items-center">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                          </div>
                          <span className="ml-3 text-sm text-gray-500 font-medium">Assistant is thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative mt-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about diet, exercise or supplements..."
                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all text-sm outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isChatLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-md disabled:bg-gray-300 disabled:scale-100"
                  >
                    <Send className="h-5 w-5" />
                  </button>
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