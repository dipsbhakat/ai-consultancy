import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Users, Clock, ArrowRight } from 'lucide-react';

interface ROIInputs {
  industry: string;
  employees: number;
  currentCosts: number;
  automationHours: number;
  avgSalary: number;
}

interface ROIResults {
  annualSavings: number;
  productivity: number;
  roi: number;
  paybackPeriod: number;
  implementationCost: number;
}

const industries = [
  { value: 'finance', label: 'Financial Services', multiplier: 1.4 },
  { value: 'healthcare', label: 'Healthcare', multiplier: 1.6 },
  { value: 'retail', label: 'Retail & E-commerce', multiplier: 1.2 },
  { value: 'manufacturing', label: 'Manufacturing', multiplier: 1.8 },
  { value: 'technology', label: 'Technology', multiplier: 1.3 },
  { value: 'logistics', label: 'Logistics & Supply Chain', multiplier: 1.5 },
  { value: 'other', label: 'Other', multiplier: 1.0 },
];

export const ROICalculator = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    industry: '',
    employees: 50,
    currentCosts: 500000,
    automationHours: 20,
    avgSalary: 75000,
  });

  const [results, setResults] = useState<ROIResults | null>(null);

  const calculateROI = () => {
    const industryData = industries.find(i => i.value === inputs.industry);
    const multiplier = industryData?.multiplier || 1.0;
    
    // Base calculations
    const hourlyRate = inputs.avgSalary / 2080; // Annual hours
    const automatedHours = inputs.employees * inputs.automationHours * 52; // Weekly hours * 52 weeks
    const laborSavings = automatedHours * hourlyRate * multiplier;
    
    // Efficiency gains
    const efficiencyGain = inputs.currentCosts * 0.25 * multiplier; // 25% efficiency improvement
    const errorReduction = inputs.currentCosts * 0.08 * multiplier; // 8% error cost reduction
    
    const totalAnnualSavings = laborSavings + efficiencyGain + errorReduction;
    const implementationCost = inputs.employees * 2500 + 50000; // Base cost model
    const roi = ((totalAnnualSavings - implementationCost) / implementationCost) * 100;
    const paybackPeriod = implementationCost / (totalAnnualSavings / 12);
    const productivityIncrease = (automatedHours / (inputs.employees * 2080)) * 100;

    setResults({
      annualSavings: totalAnnualSavings,
      productivity: productivityIncrease,
      roi,
      paybackPeriod,
      implementationCost,
    });
  };

  useEffect(() => {
    if (inputs.industry && inputs.employees > 0) {
      calculateROI();
    }
  }, [inputs]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary-100 to-accent-100 rounded-full px-6 py-3 mb-6">
            <Calculator className="w-5 h-5 text-primary-600 mr-2" />
            <span className="text-primary-800 font-semibold">Free ROI Calculator</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your AI Investment Returns
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly how much your business could save with AI automation. Get your personalized ROI report in under 2 minutes.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Your Business Details</h3>
                  <div className="text-sm text-gray-500">Step 1 of 1</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Industry Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Industry *
                  </label>
                  <select
                    value={inputs.industry}
                    onChange={(e) => setInputs(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    required
                  >
                    <option value="">Select your industry</option>
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee Count */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Number of Employees
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={inputs.employees}
                      onChange={(e) => setInputs(prev => ({ ...prev, employees: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      min="1"
                      max="10000"
                    />
                  </div>
                </div>

                {/* Current Annual Costs */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Current Annual Operating Costs
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={inputs.currentCosts}
                      onChange={(e) => setInputs(prev => ({ ...prev, currentCosts: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      min="50000"
                      step="10000"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Include labor, processing, and operational costs
                  </p>
                </div>

                {/* Hours to Automate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Weekly Hours per Employee (manual tasks)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={inputs.automationHours}
                      onChange={(e) => setInputs(prev => ({ ...prev, automationHours: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      min="1"
                      max="40"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Hours spent on repetitive, manual tasks that could be automated
                  </p>
                </div>

                {/* Average Salary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Average Employee Salary
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={inputs.avgSalary}
                      onChange={(e) => setInputs(prev => ({ ...prev, avgSalary: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      min="30000"
                      step="5000"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {results && inputs.industry ? (
                <>
                  <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl text-white p-8">
                    <div className="flex items-center mb-6">
                      <TrendingUp className="w-8 h-8 mr-3" />
                      <h3 className="text-2xl font-bold">Your ROI Projection</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          {formatCurrency(results.annualSavings)}
                        </div>
                        <div className="text-primary-100 text-sm">Annual Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          {formatPercent(results.roi)}
                        </div>
                        <div className="text-primary-100 text-sm">Return on Investment</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold mb-1">
                          {formatPercent(results.productivity)}
                        </div>
                        <div className="text-primary-100 text-xs">Productivity Increase</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center">
                        <div className="text-xl font-bold mb-1">
                          {results.paybackPeriod.toFixed(1)} months
                        </div>
                        <div className="text-primary-100 text-xs">Payback Period</div>
                      </div>
                    </div>

                    <button className="w-full bg-white text-primary-600 font-bold py-4 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center group">
                      Get Your Free Strategy Session
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Investment Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Implementation Cost</span>
                        <span className="font-semibold">{formatCurrency(results.implementationCost)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Annual Savings</span>
                        <span className="font-semibold text-green-600">{formatCurrency(results.annualSavings)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">3-Year Net Benefit</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(results.annualSavings * 3 - results.implementationCost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> These calculations are estimates based on industry averages. 
                      Actual results may vary based on your specific implementation and business processes.
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Fill in your details to see potential savings
                  </h3>
                  <p className="text-gray-500">
                    Get a personalized ROI calculation based on your business metrics
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
