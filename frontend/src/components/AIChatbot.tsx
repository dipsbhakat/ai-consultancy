import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useAIPersonalization } from './AIPersonalizationEngine';
import { useAdvancedAnalytics } from './AdvancedAnalytics';

// Types
interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
  options?: ChatOption[];
  metadata?: {
    intent?: string;
    confidence?: number;
    requiresHuman?: boolean;
  };
}

interface ChatOption {
  id: string;
  text: string;
  action: 'message' | 'lead_capture' | 'schedule' | 'calculate_roi' | 'transfer_human';
  value?: string;
}

interface UserIntent {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
  requiresQualification: boolean;
}

interface LeadQualificationData {
  company?: string;
  industry?: string;
  employeeCount?: string;
  budget?: string;
  timeline?: string;
  painPoints?: string[];
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  qualificationScore: number;
}

// AI Chat Engine
class AIChatEngine {
  private static instance: AIChatEngine;
  private intentPatterns: Map<string, RegExp[]> = new Map();
  private responseTemplates: Map<string, string[]> = new Map();
  private qualificationFlow: Map<string, any> = new Map();

  constructor() {
    this.initializeIntents();
    this.initializeResponses();
    this.initializeQualificationFlow();
  }

  public static getInstance(): AIChatEngine {
    if (!AIChatEngine.instance) {
      AIChatEngine.instance = new AIChatEngine();
    }
    return AIChatEngine.instance;
  }

  private initializeIntents(): void {
    // Intent recognition patterns
    this.intentPatterns.set('pricing', [
      /how much|cost|price|pricing|budget|expensive/i,
      /what.*charge|fee|rate/i
    ]);

    this.intentPatterns.set('roi_calculation', [
      /roi|return.*investment|save.*money|calculate/i,
      /cost.*benefit|savings|efficiency/i
    ]);

    this.intentPatterns.set('implementation', [
      /how.*work|process|implement|timeline|start/i,
      /step.*step|onboard|setup/i
    ]);

    this.intentPatterns.set('demo_request', [
      /demo|show.*example|see.*action|preview/i,
      /trial|test.*drive|try.*out/i
    ]);

    this.intentPatterns.set('contact_sales', [
      /talk.*sales|speak.*someone|human|call.*me/i,
      /schedule.*meeting|book.*call|consultation/i
    ]);

    this.intentPatterns.set('technical_questions', [
      /how.*it.*work|technical|integration|api/i,
      /security|compliance|scalable/i
    ]);

    this.intentPatterns.set('case_studies', [
      /example|case.*study|success.*story|client/i,
      /similar.*company|industry.*specific/i
    ]);

    this.intentPatterns.set('support', [
      /help|support|problem|issue|trouble/i,
      /not.*working|error|bug/i
    ]);
  }

  private initializeResponses(): void {
    this.responseTemplates.set('greeting', [
      "Hi! I'm Alex, your AI assistant. I help businesses discover how AI can transform their operations. What brings you here today?",
      "Hello! I'm here to help you understand how AI can boost your business performance. What's your biggest challenge right now?",
      "Welcome! I specialize in helping companies implement AI solutions. What would you like to learn about?"
    ]);

    this.responseTemplates.set('pricing', [
      "Great question! Our AI solutions are customized based on your specific needs. To give you accurate pricing, I'd love to learn more about your business. What industry are you in?",
      "Pricing depends on your company size and requirements. Most clients see 300%+ ROI within 12 months. Would you like me to calculate potential savings for your business?",
      "I can help you understand the investment and expected returns. Our solutions typically range from $5,000-$50,000 monthly depending on scope. What's your current team size?"
    ]);

    this.responseTemplates.set('roi_calculation', [
      "Perfect! I can calculate your potential ROI right now. This usually takes just 2 minutes. What industry is your business in?",
      "I'd love to show you the numbers! Our ROI calculator considers your industry, team size, and current processes. Shall we start with your company details?",
      "Excellent! Most clients save $100K+ annually. Let me calculate your specific potential. What's your approximate team size?"
    ]);

    this.responseTemplates.set('implementation', [
      "Our implementation is surprisingly quick! Most companies are seeing results within 2-4 weeks. The process involves assessment, customization, deployment, and training. What's your ideal timeline?",
      "Great question! We follow a proven 4-step process: 1) Analysis of your current workflows, 2) AI solution design, 3) Implementation, 4) Team training. Most clients are operational in 3 weeks. What's your priority use case?",
      "Implementation timeline depends on complexity. Simple automations: 1-2 weeks. Complex AI systems: 4-6 weeks. All include full training and support. What type of solution interests you most?"
    ]);

    this.responseTemplates.set('demo_request', [
      "I'd love to show you our AI in action! We have live demos specific to different industries. What type of business are you in?",
      "Perfect! Our interactive demos show real ROI scenarios. Would you prefer a personalized demo or should I show you our quick preview video?",
      "Great choice! Seeing is believing. We can schedule a custom demo tailored to your industry. What challenges are you hoping AI will solve?"
    ]);

    this.responseTemplates.set('contact_sales', [
      "I'd be happy to connect you with our team! Let me gather a few details to ensure you get the right specialist. What's your primary goal with AI implementation?",
      "Absolutely! Our consultants love speaking with potential clients. To prepare them, what's your biggest business challenge right now?",
      "Perfect! I can schedule you with one of our AI specialists. What's the best time for a 15-minute strategy call?"
    ]);

    this.responseTemplates.set('fallback', [
      "That's a great question! Let me make sure I understand correctly. Are you asking about pricing, implementation, or something else?",
      "I want to give you the most helpful answer. Could you tell me more about what you're looking for?",
      "I'm here to help! What specific aspect of AI implementation would you like to discuss?"
    ]);
  }

  private initializeQualificationFlow(): void {
    this.qualificationFlow.set('industry', {
      question: "What industry is your business in?",
      options: [
        { text: "Manufacturing", value: "manufacturing" },
        { text: "Healthcare", value: "healthcare" },
        { text: "Finance", value: "finance" },
        { text: "Retail/E-commerce", value: "retail" },
        { text: "Technology", value: "technology" },
        { text: "Other", value: "other" }
      ]
    });

    this.qualificationFlow.set('company_size', {
      question: "How many employees does your company have?",
      options: [
        { text: "1-10 employees", value: "1-10" },
        { text: "11-50 employees", value: "11-50" },
        { text: "51-200 employees", value: "51-200" },
        { text: "201-1000 employees", value: "201-1000" },
        { text: "1000+ employees", value: "1000+" }
      ]
    });

    this.qualificationFlow.set('timeline', {
      question: "When are you looking to implement AI solutions?",
      options: [
        { text: "Immediately (within 1 month)", value: "immediate" },
        { text: "Within 3 months", value: "3-months" },
        { text: "Within 6 months", value: "6-months" },
        { text: "Just exploring options", value: "exploring" }
      ]
    });

    this.qualificationFlow.set('budget', {
      question: "What's your approximate budget for AI implementation?",
      options: [
        { text: "Under $10,000", value: "under-10k" },
        { text: "$10,000 - $50,000", value: "10k-50k" },
        { text: "$50,000 - $200,000", value: "50k-200k" },
        { text: "Over $200,000", value: "over-200k" },
        { text: "Need help determining budget", value: "unknown" }
      ]
    });
  }

  public analyzeIntent(message: string): UserIntent {
    const text = message.toLowerCase();
    let bestMatch = { intent: 'fallback', confidence: 0 };

    // Check each intent pattern
    for (const [intent, patterns] of this.intentPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          const confidence = this.calculateConfidence(text, pattern);
          if (confidence > bestMatch.confidence) {
            bestMatch = { intent, confidence };
          }
        }
      }
    }

    // Extract entities (simple keyword extraction)
    const entities: Record<string, string> = {};
    
    // Industry entities
    const industries = ['manufacturing', 'healthcare', 'finance', 'retail', 'technology'];
    for (const industry of industries) {
      if (text.includes(industry)) {
        entities.industry = industry;
      }
    }

    // Size entities
    const sizePatterns = [
      { pattern: /\b(\d+)\s*employee/i, key: 'employees' },
      { pattern: /\b(\d+)\s*people/i, key: 'employees' },
      { pattern: /small\s*business/i, key: 'size', value: 'small' },
      { pattern: /large\s*company/i, key: 'size', value: 'large' }
    ];

    for (const { pattern, key, value } of sizePatterns) {
      const match = text.match(pattern);
      if (match) {
        entities[key] = value || match[1];
      }
    }

    return {
      intent: bestMatch.intent,
      confidence: bestMatch.confidence,
      entities,
      requiresQualification: ['pricing', 'demo_request', 'contact_sales'].includes(bestMatch.intent)
    };
  }

  private calculateConfidence(text: string, pattern: RegExp): number {
    const matches = text.match(pattern);
    if (!matches) return 0;
    
    // Simple confidence based on match length and text length
    const matchLength = matches[0].length;
    const textLength = text.length;
    return Math.min(0.95, (matchLength / textLength) * 2 + 0.3);
  }

  public generateResponse(intent: string, entities: Record<string, string>): string {
    const templates = this.responseTemplates.get(intent) || this.responseTemplates.get('fallback')!;
    let response = templates[Math.floor(Math.random() * templates.length)];

    // Personalize response based on entities
    if (entities.industry) {
      response = response.replace('your business', `your ${entities.industry} business`);
    }

    if (entities.employees) {
      response = response.replace('your company', `your ${entities.employees}-person company`);
    }

    return response;
  }

  public getQualificationQuestion(stage: string): any {
    return this.qualificationFlow.get(stage);
  }

  public calculateQualificationScore(data: LeadQualificationData): number {
    let score = 0;

    // Industry scoring
    const industryScores: Record<string, number> = {
      manufacturing: 25,
      healthcare: 25,
      finance: 30,
      technology: 20,
      retail: 20,
      other: 10
    };
    score += industryScores[data.industry || 'other'] || 10;

    // Company size scoring
    const sizeScores: Record<string, number> = {
      '1-10': 10,
      '11-50': 15,
      '51-200': 25,
      '201-1000': 30,
      '1000+': 25
    };
    score += sizeScores[data.employeeCount || '1-10'] || 10;

    // Timeline scoring
    const timelineScores: Record<string, number> = {
      immediate: 30,
      '3-months': 25,
      '6-months': 15,
      exploring: 5
    };
    score += timelineScores[data.timeline || 'exploring'] || 5;

    // Budget scoring
    const budgetScores: Record<string, number> = {
      'under-10k': 5,
      '10k-50k': 15,
      '50k-200k': 25,
      'over-200k': 30,
      unknown: 10
    };
    score += budgetScores[data.budget || 'unknown'] || 10;

    // Contact info completeness
    if (data.contactInfo?.email) score += 10;
    if (data.contactInfo?.phone) score += 5;

    return Math.min(100, score);
  }
}

// React Component
export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [qualificationData, setQualificationData] = useState<LeadQualificationData>({
    qualificationScore: 0
  });
  const [qualificationStage, setQualificationStage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { predictiveModel } = useAIPersonalization();
  const { trackEvent } = useAdvancedAnalytics();
  const chatEngine = AIChatEngine.getInstance();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send greeting message
      const greeting = chatEngine.generateResponse('greeting', {});
      addBotMessage(greeting, [
        { id: 'pricing', text: '💰 Pricing & ROI', action: 'message', value: 'How much does it cost?' },
        { id: 'demo', text: '🎬 See a Demo', action: 'message', value: 'Can I see a demo?' },
        { id: 'implementation', text: '⚙️ How it Works', action: 'message', value: 'How does implementation work?' },
        { id: 'contact', text: '📞 Talk to Expert', action: 'transfer_human' }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, message]);
    trackEvent('BUTTON_CLICK', { buttonText: `chatbot_user_message` });
  };

  const addBotMessage = (content: string, options?: ChatOption[], metadata?: any) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: Date.now(),
        options,
        metadata
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay for realism
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userInput = currentMessage;
    addUserMessage(userInput);
    setCurrentMessage('');

    // Analyze intent
    const intent = chatEngine.analyzeIntent(userInput);
    
    // Handle qualification flow
    if (qualificationStage) {
      handleQualificationResponse(userInput);
      return;
    }

    // Generate response based on intent
    const response = chatEngine.generateResponse(intent.intent, intent.entities);
    
    if (intent.requiresQualification && intent.confidence > 0.6) {
      // Start qualification flow
      startQualificationFlow();
    } else {
      // Regular response with options
      const options = generateContextualOptions(predictiveModel);
      addBotMessage(response, options, { intent: intent.intent, confidence: intent.confidence });
    }
  };

  const startQualificationFlow = () => {
    const firstQuestion = chatEngine.getQualificationQuestion('industry');
    setQualificationStage('industry');
    
    addBotMessage(
      `To give you the most relevant information, ${firstQuestion.question}`,
      firstQuestion.options.map((opt: any) => ({
        id: opt.value,
        text: opt.text,
        action: 'message' as const,
        value: opt.text
      }))
    );
  };

  const handleQualificationResponse = (response: string) => {
    const stages = ['industry', 'company_size', 'timeline', 'budget'];
    const currentIndex = stages.indexOf(qualificationStage!);
    
    // Update qualification data
    const updatedData = { ...qualificationData };
    if (qualificationStage === 'industry') {
      updatedData.industry = response.toLowerCase().replace(/[^a-z]/g, '');
    } else if (qualificationStage === 'company_size') {
      updatedData.employeeCount = response;
    } else if (qualificationStage === 'timeline') {
      updatedData.timeline = response.toLowerCase().replace(/[^a-z-]/g, '');
    } else if (qualificationStage === 'budget') {
      updatedData.budget = response.toLowerCase().replace(/[^a-z0-9-]/g, '');
    }

    setQualificationData(updatedData);

    // Move to next stage or finish
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      const nextQuestion = chatEngine.getQualificationQuestion(nextStage);
      setQualificationStage(nextStage);
      
      addBotMessage(
        nextQuestion.question,
        nextQuestion.options.map((opt: any) => ({
          id: opt.value,
          text: opt.text,
          action: 'message' as const,
          value: opt.text
        }))
      );
    } else {
      // Qualification complete
      finishQualification(updatedData);
    }
  };

  const finishQualification = (data: LeadQualificationData) => {
    const score = chatEngine.calculateQualificationScore(data);
    setQualificationData({ ...data, qualificationScore: score });
    setQualificationStage(null);

    let response = '';
    let options: ChatOption[] = [];

    if (score >= 70) {
      response = "Perfect! Based on your needs, you're an excellent fit for our AI solutions. I'd love to connect you with our team for a personalized strategy session.";
      options = [
        { id: 'schedule', text: '📅 Schedule Strategy Call', action: 'schedule' },
        { id: 'roi', text: '📊 Calculate My ROI', action: 'calculate_roi' },
        { id: 'demo', text: '🎬 See Industry Demo', action: 'message', value: 'Show me a demo for my industry' }
      ];
    } else if (score >= 40) {
      response = "Great! I can see how AI could benefit your business. Let me show you some relevant resources and options.";
      options = [
        { id: 'roi', text: '📊 Calculate Potential ROI', action: 'calculate_roi' },
        { id: 'resources', text: '📚 Get Implementation Guide', action: 'lead_capture' },
        { id: 'questions', text: '❓ Ask More Questions', action: 'message', value: 'I have more questions' }
      ];
    } else {
      response = "Thanks for the information! AI can still benefit your business. Let me share some educational resources to help you explore the possibilities.";
      options = [
        { id: 'guide', text: '📖 Download AI Guide', action: 'lead_capture' },
        { id: 'examples', text: '📝 See Success Stories', action: 'message', value: 'Show me case studies' },
        { id: 'future', text: '🔮 Plan for Future', action: 'message', value: 'Help me plan for the future' }
      ];
    }

    addBotMessage(response, options);
    
    trackEvent('FORM_SUBMIT', {
      formId: 'chatbot_qualification',
      score: score
    });
  };

  const generateContextualOptions = (model: any): ChatOption[] => {
    const baseOptions: ChatOption[] = [
      { id: 'pricing', text: '💰 Pricing Info', action: 'message', value: 'Tell me about pricing' },
      { id: 'demo', text: '🎬 See Demo', action: 'message', value: 'Can I see a demo?' },
      { id: 'contact', text: '📞 Talk to Expert', action: 'transfer_human' }
    ];

    // Add AI-powered recommendations
    if (model?.conversionProbability > 0.6) {
      baseOptions.unshift(
        { id: 'roi', text: '📊 Calculate ROI', action: 'calculate_roi' },
        { id: 'schedule', text: '📅 Book Meeting', action: 'schedule' }
      );
    }

    return baseOptions.slice(0, 4); // Limit to 4 options
  };

  const handleOptionClick = (option: ChatOption) => {
    addUserMessage(option.text);

    switch (option.action) {
      case 'message':
        if (option.value) {
          const intent = chatEngine.analyzeIntent(option.value);
          const response = chatEngine.generateResponse(intent.intent, intent.entities);
          addBotMessage(response);
        }
        break;
      
      case 'calculate_roi':
        addBotMessage(
          "I'll open our ROI calculator for you! This will show you potential savings based on your business size and industry.",
          [{ id: 'continue', text: '✅ Continue Chat', action: 'message', value: 'Thanks, what else can you help with?' }]
        );
        trackEvent('ROI_CALCULATION', { source: 'chatbot' });
        // Here you would open the ROI calculator
        break;
      
      case 'schedule':
        addBotMessage(
          "Perfect! I'll connect you with our calendar system to book a strategy call with one of our AI specialists.",
          [{ id: 'continue', text: '✅ Continue Chat', action: 'message', value: 'Thanks for setting that up' }]
        );
        trackEvent('BUTTON_CLICK', { buttonText: 'chatbot_schedule_meeting' });
        break;
      
      case 'lead_capture':
        addBotMessage(
          "I'd be happy to send you our comprehensive AI implementation guide! What's your email address?",
          []
        );
        break;
      
      case 'transfer_human':
        addBotMessage(
          "I'll connect you with one of our AI specialists right away. They'll be able to answer any specific questions and provide personalized recommendations.",
          [{ id: 'continue', text: '✅ Thanks', action: 'message', value: 'Thank you' }]
        );
        trackEvent('BUTTON_CLICK', { buttonText: 'chatbot_transfer_human' });
        break;
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-purple-100">Alex • Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.metadata?.confidence && (
                    <p className="text-xs opacity-70 mt-1">
                      Confidence: {(message.metadata.confidence * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
                
                {/* Options */}
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(option)}
                        className="block w-full text-left p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 mr-2 ${
                message.type === 'user' ? 'order-1 bg-purple-100' : 'order-2 bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-purple-600" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-3 max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isTyping}
            className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatbot;
