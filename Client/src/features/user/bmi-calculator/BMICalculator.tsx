import { useState } from 'react';
import { Calculator, Send, Bot, Activity, Info, ChevronRight, MessageSquare } from 'lucide-react';
import { sendChatMessage } from '../../../services/chatService';

const BMICalculator = () => {
  const [unit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [bmiMessage, setBmiMessage] = useState<string>('');
  const [healthRisk, setHealthRisk] = useState<string>('');

  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "GREETINGS ATHLETE. I am your specialized biometric advisor. Enter your physiological data to initialize performance analysis.", sender: 'ai' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const calculateBMI = () => {
    if (!height || !weight) return;

    let heightInMeters = 0;
    let weightInKg = 0;

    if (unit === 'metric') {
      heightInMeters = parseFloat(height) / 100;
      weightInKg = parseFloat(weight);
    } else {
      heightInMeters = parseFloat(height) * 0.0254;
      weightInKg = parseFloat(weight) * 0.453592;
    }

    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
      alert('Please enter valid biometric data');
      return;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    setResult(parseFloat(bmi.toFixed(1)));

    let cat = '';
    let msg = '';
    let risk = '';

    if (bmi < 18.5) {
      cat = 'Underweight';
      msg = 'Caloric deficit detected. Nutritional reinforcement required.';
      risk = 'Nutrient deficiency protocol active.';
    } else if (bmi < 25) {
      cat = 'Optimal';
      msg = 'Peak physiological state maintained. Ideal for advanced performance.';
      risk = 'Minimum biochemical risk detected.';
    } else if (bmi < 30) {
      cat = 'Overweight';
      msg = 'Metabolic load exceeding optimal levels. Lifestyle optimization recommended.';
      risk = 'Incubation of metabolic risk factors possible.';
    } else {
      cat = 'Obese';
      msg = 'Critical metabolic load. Immediate intervention protocol recommended.';
      risk = 'Elevated physiological risk level.';
    }

    setCategory(cat);
    setBmiMessage(msg);
    setHealthRisk(risk);

    const aiRecommendation = getAIRecommendation(bmi, cat, gender, parseInt(age) || 25);
    setChatMessages((prev: any) => [...prev, { id: Date.now(), text: aiRecommendation, sender: 'ai' }]);
  };

  const getAIRecommendation = (bmi: number, category: string, gender: string, age: number) => {
    let recommendation = `BIOMETRIC ANALYSIS: BMI ${bmi.toFixed(1)} [${category.toUpperCase()}]\n\n`;

    if (gender === 'female') {
      recommendation += `FEMALE PROTOCOL [AGE ${age}]:\n`;
      if (age > 50) {
        recommendation += "• Bone density reinforcement: Priority Calcium + Vit D\n";
        recommendation += "• Lean mass preservation: Resistance training required\n";
      } else {
        recommendation += "• Micronutrient focus: Optimize Iron intake\n";
        recommendation += "• Metabolic optimization via clean proteins\n\n";
      }
    } else {
      recommendation += `MALE PROTOCOL [AGE ${age}]:\n`;
      if (age > 50) {
        recommendation += "• Cardiovascular protection: Omega-3 optimization\n";
        recommendation += "• Hypertrophy maintenance: Heavy resistance training\n";
      } else {
        recommendation += "• Anabolic environment: Protein threshold 2g/kg\n";
        recommendation += "• Strength foundation: Core multi-joint movements\n\n";
      }
    }

    const finalAdvice = bmi < 18.5 ? "STRATEGIC GAIN: Increase caloric density via clean fats and complex carbs." :
      bmi < 25 ? "MAINTENANCE: Sustain current high-performance protocols. Focus on micronutrient timing." :
        "STRATEGIC DEFICIT: Execute controlled caloric restriction. Prioritize HIIT and protein-sparing nutrition.";

    recommendation += `STRATEGY: ${finalAdvice}\n\nInitialize deeper consultation?`;
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
    if (!result) return 'text-slate-600';
    if (result < 18.5) return 'text-blue-400';
    if (result < 25) return 'text-[#a3e635]';
    if (result < 30) return 'text-orange-400';
    return 'text-rose-500';
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isChatLoading) return;
    const userMsgText = currentMessage;
    const newUserMessage = { id: Date.now(), text: userMsgText, sender: 'user' as const };
    setChatMessages((prev: any) => [...prev, newUserMessage]);
    setCurrentMessage('');
    setIsChatLoading(true);

    try {
      const context = result ? { bmi: result, category, healthRisk, gender, age } : null;
      const aiResponse = await sendChatMessage(userMsgText, context);
      setChatMessages((prev: any) => [...prev, { id: Date.now(), text: aiResponse, sender: 'ai' as const }]);
    } catch (error: any) {
      setChatMessages((prev: any) => [...prev, {
        id: Date.now(),
        text: "CHANNEL INTERFERENCE DETECTED. Re-establishing link...",
        sender: 'ai' as const
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#a3e635] selection:text-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-24">
        {/* Header Section */}
        <div className="mb-20 animate-fade-in text-center lg:text-left">
          <h1 className="text-6xl md:text-9xl font-black mb-4 tracking-[calc(-0.04em)] uppercase leading-none">
            CALCULATE YOUR BMI
          </h1>
          <p className="text-xl text-slate-500 font-medium tracking-tight">
            Metric (kg/cm) — Know your body, fuel it right
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Main Calculator Card */}
          <div className="w-full lg:max-w-2xl mx-auto lg:mx-0">
            <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
              {/* Card Header */}
              <div className="flex items-center mb-12">
                <div className="w-14 h-14 bg-[#a3e635] rounded-2xl flex items-center justify-center mr-6 shadow-lg shadow-[#a3e635]/20">
                  <Calculator className="h-7 w-7 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">BMI CALCULATOR</h2>
                  <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-0.5">Body Mass Index</p>
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">WEIGHT (KG)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 75"
                      className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl py-6 px-8 text-xl font-black text-white focus:outline-none focus:border-[#a3e635]/30 transition-all placeholder:text-slate-800"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">HEIGHT (CM)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 175"
                      className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl py-6 px-8 text-xl font-black text-white focus:outline-none focus:border-[#a3e635]/30 transition-all placeholder:text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">AGE</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-[#0d0d0d] border border-white/5 rounded-2xl py-6 px-8 text-xl font-black text-white focus:outline-none focus:border-[#a3e635]/30 transition-all placeholder:text-slate-800"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">GENDER</label>
                    <div className="flex p-1 bg-[#0d0d0d] rounded-2xl border border-white/5 h-[76px]">
                      {['male', 'female'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g as any)}
                          className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === g
                            ? 'bg-[#a3e635] text-black shadow-lg shadow-[#a3e635]/10'
                            : 'text-slate-600 hover:text-white'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={calculateBMI}
                    className="w-full bg-[#a3e635] text-black py-7 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-[#a3e635]/20 transition-all active:scale-[0.98] flex items-center justify-center group"
                  >
                    <span>Calculate BMI</span>
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="w-full mt-4 text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-slate-400 transition-colors"
                  >
                    Reset Biometric Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full lg:flex-grow flex flex-col gap-10">
            {result !== null ? (
              <div className="animate-fade-in space-y-10">
                <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-12 shadow-2xl text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Activity className="w-48 h-48 text-[#a3e635]" />
                  </div>

                  <h3 className="text-xs font-black text-[#a3e635]/50 uppercase tracking-[0.4em] mb-8">Biosensory Result</h3>
                  <div className={`text-9xl font-black tracking-tighter leading-none mb-6 ${getBmiColor()}`}>
                    {result}
                  </div>
                  <div className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">
                    {category}
                  </div>
                  <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-10">
                    {bmiMessage}
                  </p>

                  <div className="bg-black/40 border border-white/5 rounded-3xl p-8 max-w-sm mx-auto">
                    <div className="flex items-center justify-center text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">
                      <Info className="w-3.5 h-3.5 mr-2" />
                      Protocol Analysis
                    </div>
                    <div className={`text-sm font-black uppercase tracking-widest ${getBmiColor()}`}>
                      {healthRisk}
                    </div>
                  </div>
                </div>

                {/* Tactical Recommendation Card */}
                <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl group cursor-pointer hover:border-[#a3e635]/20 transition-all"
                  onClick={() => setShowChat(true)}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mr-5 border border-white/10">
                        <Bot className="w-6 h-6 text-[#a3e635]" />
                      </div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Tactical Summary</h3>
                    </div>
                    <div className="text-[10px] font-black text-[#a3e635] uppercase tracking-widest px-3 py-1 bg-[#a3e635]/10 rounded-full">
                      New Analysis Available
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Personalized high-performance nutrition and training protocols have been generated based on your biometric profile.
                  </p>
                  <div className="mt-8 flex items-center text-[10px] font-black text-[#a3e635] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                    Initialize Full Consultation <ChevronRight className="ml-1 w-3 h-3" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-white/10 rounded-[3rem]">
                <Activity className="w-20 h-20 text-[#a3e635] mb-8 animate-pulse" />
                <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Awaiting Data</h3>
                <p className="text-slate-600 text-xs font-black uppercase tracking-widest mt-2">Initialize analysis to view profile</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Button as seen in screenshot */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-10 right-10 w-20 h-20 bg-[#a3e635] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(162,230,53,0.3)] hover:scale-110 transition-all active:scale-95 group focus:outline-none z-50"
      >
        <MessageSquare className="w-8 h-8 text-black fill-current" />
        {isChatLoading && (
          <div className="absolute top-0 right-0 w-6 h-6 bg-white border-4 border-[#a3e635] rounded-full animate-bounce"></div>
        )}
      </button>

      {/* Modern AI Chat Drawer */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowChat(false)}></div>
          <div className="relative w-full max-w-xl bg-black border-l border-white/10 flex flex-col animate-slide-in-right shadow-2xl">
            {/* Chat Header */}
            <div className="p-10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#a3e635]/10 rounded-2xl flex items-center justify-center mr-5 border border-[#a3e635]/20">
                  <Bot className="w-6 h-6 text-[#a3e635]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">BIOSENTRY AI</h3>
                  <div className="flex items-center mt-1">
                    <span className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse mr-2 shadow-[0_0_10px_#a3e635]"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-slate-600 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
              >
                Close Unit
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-grow overflow-y-auto p-10 space-y-10 scrollbar-hide">
              {chatMessages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-sm font-medium leading-relaxed relative ${msg.sender === 'user'
                    ? 'bg-[#a3e635] text-black font-black rounded-tr-none shadow-xl shadow-[#a3e635]/10'
                    : 'bg-[#0d0d0d] text-slate-300 border border-white/5 rounded-tl-none'}`}>

                    {msg.text.split('\n').map((line: string, i: number) => (
                      <p key={i} className={i > 0 ? 'mt-4' : ''}>
                        {line.startsWith('•') ? (
                          <span className="flex items-start">
                            <span className="mr-3 text-[#a3e635]">•</span>
                            <span>{line.substring(2)}</span>
                          </span>
                        ) : line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] rounded-tl-none p-8">
                    <div className="flex space-x-2">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <div key={i} className="w-2 h-2 bg-[#a3e635] rounded-full animate-bounce" style={{ animationDelay: `${d}s` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-10 border-t border-white/10 bg-black">
              <div className="relative">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Input tactical query for biometric lab..."
                  className="w-full bg-[#0d0d0d] border border-white/5 rounded-3xl pl-8 pr-20 py-6 text-sm font-bold text-white focus:border-[#a3e635]/30 outline-none transition-all placeholder:text-slate-800"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isChatLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#a3e635] text-black rounded-2xl hover:scale-105 transition-all flex items-center justify-center disabled:opacity-30"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;