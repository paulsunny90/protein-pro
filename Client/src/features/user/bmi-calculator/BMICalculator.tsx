import { useState, useEffect } from 'react';
import { Calculator, Send, Bot, Activity, Info, ChevronRight, MessageSquare, ShoppingCart } from 'lucide-react';
import { sendChatMessage } from '../../../services/chatService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProducts } from '../../../store/slice/productSlice';
import { addToCart } from '../../../store/slice/cartSlice';
import type { Product } from '../../../store/slice/productSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [dynamicTips, setDynamicTips] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products } = useAppSelector((state: any) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(false));
  }, [dispatch]);

  const getSuggestedProducts = (bmi: number, allProducts: Product[]) => {
    // 1. Get Core Categories
    const proteinProducts = allProducts.filter(p => p.category === 'Protein' || p.name.toLowerCase().includes('protein'));
    const foodProducts = allProducts.filter(p => p.productType === 'Foods');
    const juiceProducts = allProducts.filter(p => p.category === 'Beverages' || p.name.toLowerCase().includes('juice'));

    // 2. Multi-Macro Sorting Logic
    const sortByMacros = (a: Product, b: Product) => {
      if (bmi < 18.5) {
        // Underweight: Priority High Calories + High Protein
        const scoreA = (a.calories || 0) + (a.protein || 0) * 4;
        const scoreB = (b.calories || 0) + (b.protein || 0) * 4;
        return scoreB - scoreA;
      } else if (bmi < 25) {
        // Optimal: Balance + High Fiber
        const scoreA = (a.fiber || 0) * 10 + (a.protein || 0) * 2;
        const scoreB = (b.fiber || 0) * 10 + (b.protein || 0) * 2;
        return scoreB - scoreA;
      } else {
        // Overweight/Obese: High Fiber + High Protein + Low Calorie
        const scoreA = (a.fiber || 0) * 15 + (a.protein || 0) * 5 - (a.calories || 0) / 10;
        const scoreB = (b.fiber || 0) * 15 + (b.protein || 0) * 5 - (b.calories || 0) / 10;
        return scoreB - scoreA;
      }
    };

    const protein = [...proteinProducts].sort(sortByMacros).slice(0, 1);
    const food = [...foodProducts].sort(sortByMacros).slice(0, 1);
    const juice = [...juiceProducts].sort(sortByMacros).slice(0, 1);

    // 3. Strategic Category based on BMI
    let strategicCat = '';
    if (bmi < 18.5) strategicCat = 'Protein';
    else if (bmi < 25) strategicCat = 'Vitamins';
    else if (bmi < 30) strategicCat = 'Supplements';
    else strategicCat = 'Fitness';

    const strategic = allProducts.filter(p =>
      p.category === strategicCat &&
      !protein.some(x => x._id === p._id) &&
      !food.some(x => x._id === p._id) &&
      !juice.some(x => x._id === p._id)
    ).sort(sortByMacros).slice(0, 1);

    const combined = [...protein, ...food, ...juice, ...strategic];
    const unique = Array.from(new Set(combined.map(p => p._id))).map(id => combined.find(p => p._id === id)!);

    return unique.slice(0, 4);
  };

  const handleAddToCart = async (product: Product) => {
    if (product._id) {
      try {
        await dispatch(addToCart({
          productId: product._id,
          quantity: 1,
          size: 'Medium'
        })).unwrap();
        toast.success(`${product.name} added to cart!`);
      } catch (err: any) {
        toast.error(err || 'Failed to add to cart');
      }
    }
  };

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

    const suggestions = getSuggestedProducts(bmi, products);
    setSuggestedProducts(suggestions);

    // Initial message based on hardcoded logic (fallback)
    const fallbackRecommendation = getAIRecommendation(bmi, cat, gender, parseInt(age) || 25, suggestions);
    setChatMessages((prev: any) => [...prev, { id: Date.now(), text: fallbackRecommendation, sender: 'ai', suggestions: suggestions }]);

    // Fetch Dynamic AI Analysis from Gemini
    fetchDynamicAITips(bmi, cat, risk, suggestions);
  };

  const fetchDynamicAITips = async (bmi: number, category: string, risk: string, suggestions: Product[]) => {
    setIsGeneratingAI(true);
    try {
      const productList = suggestions.map(p => 
        `${p.name} (₹${p.price}) [Macros: P:${p.protein || 0}g, C:${p.carbs || 0}g, F:${p.fat || 0}g, Fiber:${p.fiber || 0}g, Cal:${p.calories || 0}kcal]`
      ).join(', ');
      
      const prompt = `INITIAL BIOMETRIC SCAN COMPLETE.
BMI: ${bmi} (${category})
RISK: ${risk}
RECOMMENDED PROTOCOL ARSENAL: ${productList}

Generate a concise, high-impact tactical nutrition protocol. Analyze the macro-nutritional density (Protein, Carbs, Fat, Fiber) of the recommended products and explain how this specific macro-ratio optimizes the user's current biometric state. Use professional, bio-hacker terminology.`;

      const context = { bmi, category, healthRisk: risk, gender, age };
      const aiResponse = await sendChatMessage(prompt, context);
      setDynamicTips(aiResponse);

      // Also add to chat for persistence
      setChatMessages((prev: any) => [...prev, {
        id: Date.now(),
        text: `CORE PROTOCOL GENERATED:\n\n${aiResponse}`,
        sender: 'ai',
        suggestions: suggestions
      }]);
    } catch (error) {
      console.error("Failed to fetch dynamic tips:", error);
      setDynamicTips("ANALYSIS INTERFERENCE. FALLBACK PROTOCOL ACTIVE.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getAIRecommendation = (bmi: number, category: string, gender: string, age: number, suggestions: Product[]) => {
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

    recommendation += `STRATEGY: ${finalAdvice}\n\n`;

    recommendation += `TACTICAL NUTRITION TIPS:\n`;
    if (bmi < 18.5) {
      recommendation += "• Caloric Surplus: Aim for 300-500 extra clean calories daily.\n";
      recommendation += "• Liquid Nutrition: Utilize high-protein smoothies between meals.\n";
      recommendation += "• Strength Over Cardio: Prioritize heavy resistance training.\n\n";
    } else if (bmi < 25) {
      recommendation += "• Micronutrient Timing: Consume juices/antioxidants post-workout.\n";
      recommendation += "• Protein Threshold: Maintain 1.6g-2g of protein per kg of bodyweight.\n";
      recommendation += "• Hydration Protocol: Minimum 3-4L electrolyte-balanced water.\n\n";
    } else {
      recommendation += "• Fiber Loading: Increase intake of green vegetables to improve satiety.\n";
      recommendation += "• Carb Cycling: Focus complex carbs around training windows only.\n";
      recommendation += "• Fasted Activity: Consider 20 min of light morning cardio.\n\n";
    }

    if (suggestions.length > 0) {
      recommendation += `RECOMMENDED SUPPLEMENTS:\n`;
      suggestions.forEach(p => {
        recommendation += `• ${p.name} - ₹${p.price}\n`;
      });
    }

    recommendation += `\nInitialize deeper consultation?`;
    return recommendation;
  };

  const resetCalculator = () => {
    setHealthRisk('');
    setSuggestedProducts([]);
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
          <h1 className="text-2xl tracking-widest font-normal  md:text-5xl font-black mb-4 tracking-[calc(-0.04em)] uppercase leading-none">
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
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        {isGeneratingAI ? "Generating AI Protocol..." : "AI Tactical Summary"}
                      </h3>
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isGeneratingAI ? "bg-orange-500/10 text-orange-500 animate-pulse" : "bg-[#a3e635]/10 text-[#a3e635]"
                      }`}>
                      {isGeneratingAI ? "Syncing Bio-Data" : "New Analysis Available"}
                    </div>
                  </div>
                  <div className="text-slate-500 text-sm font-medium leading-relaxed min-h-[60px]">
                    {isGeneratingAI ? (
                      <div className="flex flex-col gap-2">
                        <div className="h-2 w-full bg-white/5 rounded-full animate-pulse"></div>
                        <div className="h-2 w-3/4 bg-white/5 rounded-full animate-pulse"></div>
                        <div className="h-2 w-1/2 bg-white/5 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <p className="line-clamp-3">
                        {dynamicTips || "Personalized high-performance nutrition and training protocols have been generated based on your biometric profile."}
                      </p>
                    )}
                  </div>
                  <div className="mt-8 flex items-center text-[10px] font-black text-[#a3e635] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                    Initialize Full Consultation <ChevronRight className="ml-1 w-3 h-3" />
                  </div>
                </div>

                {/* Suggested Products Section */}
                {suggestedProducts.length > 0 && (
                  <div className="animate-fade-in space-y-8">
                    <div className="flex items-center justify-between px-4">
                      <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em]">Recommended Arsenal</h3>
                      <div className="h-px flex-grow mx-8 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {suggestedProducts.map((product) => (
                        <div
                          key={product._id}
                          className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-4 hover:border-[#a3e635]/30 transition-all group relative overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/products/${product._id}`)}
                        >
                          <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-black">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          </div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-1 line-clamp-1">{product.name}</h4>
                          <div className="grid grid-cols-2 gap-1 mb-3">
                            <div className="bg-white/5 rounded-md px-1.5 py-1 flex flex-col items-center">
                              <span className="text-[6px] font-black text-slate-600 uppercase">Protein</span>
                              <span className="text-[8px] font-black text-[#a3e635]">{product.protein || 0}g</span>
                            </div>
                            <div className="bg-white/5 rounded-md px-1.5 py-1 flex flex-col items-center">
                              <span className="text-[6px] font-black text-slate-600 uppercase">Fiber</span>
                              <span className="text-[8px] font-black text-blue-400">{product.fiber || 0}g</span>
                            </div>
                            <div className="bg-white/5 rounded-md px-1.5 py-1 flex flex-col items-center">
                              <span className="text-[6px] font-black text-slate-600 uppercase">Carbs</span>
                              <span className="text-[8px] font-black text-orange-400">{product.carbs || 0}g</span>
                            </div>
                            <div className="bg-white/5 rounded-md px-1.5 py-1 flex flex-col items-center">
                              <span className="text-[6px] font-black text-slate-600 uppercase">Energy</span>
                              <span className="text-[8px] font-black text-white">{product.calories || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-[#a3e635]">₹{product.price}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              className="p-2 bg-[#a3e635] text-black rounded-xl hover:scale-105 transition-all"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  <div className={`max-w-[85%] p-8 rounded-[2.5rem] text-sm font-medium leading-relaxed relative ${
                    msg.sender === 'user'
                      ? 'bg-[#a3e635] text-black font-black rounded-tr-none shadow-xl shadow-[#a3e635]/10'
                      : 'bg-[#0d0d0d] text-slate-300 border border-white/5 rounded-tl-none'
                  }`}>

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

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <p className="text-[10px] font-black text-[#a3e635] uppercase tracking-[0.2em] mb-4">TACTICAL RECOMMENDATIONS:</p>
                        <div className="space-y-3">
                          {msg.suggestions.map((p: Product) => (
                            <div
                              key={p._id}
                              className="flex items-center bg-black/40 rounded-2xl p-3 border border-white/5 cursor-pointer hover:border-[#a3e635]/20 transition-all"
                              onClick={() => navigate(`/products/${p._id}`)}
                            >
                              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover mr-4" />
                              <div className="flex-grow">
                                <h4 className="text-[10px] font-black text-white uppercase leading-tight line-clamp-1">{p.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1 overflow-x-auto scrollbar-hide">
                                  <span className="text-[7px] font-black bg-[#a3e635]/10 text-[#a3e635] px-1 rounded">P: {p.protein || 0}g</span>
                                  <span className="text-[7px] font-black bg-blue-500/10 text-blue-400 px-1 rounded">Fi: {p.fiber || 0}g</span>
                                  <span className="text-[7px] font-black bg-orange-500/10 text-orange-400 px-1 rounded">C: {p.carbs || 0}g</span>
                                  <span className="text-[7px] font-black bg-white/10 text-white px-1 rounded">{p.calories || 0}k</span>
                                </div>
                                <span className="text-[10px] font-bold text-[#a3e635] mt-1 block">₹{p.price}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(p);
                                }}
                                className="p-2 bg-[#a3e635]/10 text-[#a3e635] rounded-lg hover:bg-[#a3e635] hover:text-black transition-all"
                              >
                                <ShoppingCart className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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