import { useState } from 'react';
import { CheckCircle, Clock, Star, Shield, Users } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  savings?: string;
}

const SubscriptionsPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('gold');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans: SubscriptionPlan[] = [
    {
      id: 'silver',
      name: 'Silver Plan',
      price: billingCycle === 'annual' ? 24.99 : 29.99,
      period: billingCycle === 'annual' ? '/month (billed yearly)' : '/month',
      description: 'Perfect for beginners starting their fitness journey',
      features: [
        'Basic protein powder (1kg)',
        'Standard shipping',
        'Access to basic workout plans',
        'Email support',
        'Weekly nutrition tips'
      ],
      popular: false,
      savings: billingCycle === 'annual' ? 'Save 17%' : undefined
    },
    {
      id: 'gold',
      name: 'Gold Plan',
      price: billingCycle === 'annual' ? 39.99 : 49.99,
      period: billingCycle === 'annual' ? '/month (billed yearly)' : '/month',
      description: 'Ideal for regular gym-goers and fitness enthusiasts',
      features: [
        'Premium protein blend (2kg)',
        'Free shipping',
        'Custom workout plans',
        'Priority support',
        'Monthly consultations',
        'Exclusive recipes',
        'Progress tracking'
      ],
      popular: true,
      savings: billingCycle === 'annual' ? 'Save 17%' : undefined
    },
    {
      id: 'platinum',
      name: 'Platinum Plan',
      price: billingCycle === 'annual' ? 59.99 : 79.99,
      period: billingCycle === 'annual' ? '/month (billed yearly)' : '/month',
      description: 'For serious athletes and bodybuilders',
      features: [
        'Elite protein products (3kg)',
        'Express shipping',
        'Personal trainer access',
        'VIP support',
        'Custom meal plans',
        'Bi-weekly consultations',
        'Advanced analytics',
        'Exclusive community access'
      ],
      popular: false,
      savings: billingCycle === 'annual' ? 'Save 25%' : undefined
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Flexible Cancellation',
      description: 'Cancel anytime with no hidden fees'
    },
    {
      icon: Clock,
      title: 'Automatic Delivery',
      description: 'Receive products on your schedule'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Premium products with satisfaction guarantee'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Access to nutritionists and trainers'
    }
  ];

  const faqs = [
    {
      question: 'Can I change my subscription plan?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the beginning of your next billing cycle.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime through your account dashboard. There are no cancellation fees.'
    },
    {
      question: 'What if I want to pause my deliveries?',
      answer: 'You can pause your subscription for up to 3 months and resume whenever you\'re ready.'
    },
    {
      question: 'Are there any shipping costs?',
      answer: 'Shipping is free on Gold and Platinum plans. Silver plan members pay standard shipping fees.'
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Nutrition Plan
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Flexible subscription options to fuel your fitness journey.
            Customize your nutrition and get it delivered regularly.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Annual (Save up to 25%)
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 border-2 cursor-pointer transition-all ${selectedPlan === plan.id
                  ? 'border-blue-500 bg-gradient-to-b from-blue-50 to-white scale-105 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-white hover:border-blue-300'
                  } ${plan.popular ? 'border-blue-500' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {plan.savings}
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${selectedPlan === plan.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Our Subscription Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to succeed in your fitness journey, delivered with convenience and quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tailored Nutrition for Your Goals
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our subscription service adapts to your changing needs. Whether you're bulking, cutting,
                or maintaining, we've got the right nutrition plan for you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Customizable delivery schedules</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Adjustable portion sizes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Seasonal flavor rotations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Expert nutritional guidance</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
                  <p className="text-gray-600">Join thousands of satisfied subscribers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our subscription service
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of customers who trust our nutrition plans
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionsPage;