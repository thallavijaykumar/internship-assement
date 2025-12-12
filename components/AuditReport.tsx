import React from 'react';
import { AlertCircle, CheckCircle2, Layout, MousePointerClick, Smartphone, Zap } from 'lucide-react';

const AuditReport: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          UI/UX Audit Report: PrepXL
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Analysis of current user interface, experience bottlenecks, and actionable improvement strategies.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-400">
            <Smartphone size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
          <p className="text-sm text-gray-400">
            Current layout has overflow issues on screens &lt; 375px. Tap targets in navigation are too small (32px vs recommended 44px).
          </p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Performance</h3>
          <p className="text-sm text-gray-400">
            LCP (Largest Contentful Paint) is 2.4s. Images are not lazy-loaded. Hero banner is unoptimized PNG (1.2MB).
          </p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors">
          <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 text-pink-400">
            <MousePointerClick size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Conversion</h3>
          <p className="text-sm text-gray-400">
            Primary CTA contrast ratio is 3:1 (Low). "Get Started" flow has 5 steps; suggest reducing to 3 for higher retention.
          </p>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-semibold flex items-center gap-3">
          <Layout className="text-blue-400" />
          Detailed Recommendations
        </h3>
        
        {/* Section 1 */}
        <div className="bg-surface rounded-2xl overflow-hidden border border-white/5">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-semibold text-lg">Hero Section Overhaul</h4>
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-mono uppercase">High Priority</span>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 shrink-0 mt-1" size={18} />
                  <p className="text-sm text-gray-400"><strong>Problem:</strong> Headline is vague ("Prepare Better"). Does not communicate value proposition immediately.</p>
               </div>
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 shrink-0 mt-1" size={18} />
                  <p className="text-sm text-gray-400"><strong>Solution:</strong> Change to "Master Your Exams with AI-Driven Mock Tests". Add social proof (trust badges) above fold.</p>
               </div>
            </div>
            <div className="h-48 bg-black/40 rounded-lg flex items-center justify-center border border-dashed border-white/10 text-gray-600">
               [Screenshot Mockup Placeholder]
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-surface rounded-2xl overflow-hidden border border-white/5">
           <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-semibold text-lg">Navigation & Architecture</h4>
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-mono uppercase">Medium Priority</span>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-400 shrink-0 mt-1" size={18} />
                  <p className="text-sm text-gray-400"><strong>Problem:</strong> "Resources", "Blog", and "Guides" are separate links causing clutter.</p>
               </div>
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 shrink-0 mt-1" size={18} />
                  <p className="text-sm text-gray-400"><strong>Solution:</strong> Consolidate into a mega-menu under "Learn". Make "Login" secondary and "Sign Up" primary button style.</p>
               </div>
            </div>
             <div className="h-48 bg-black/40 rounded-lg flex items-center justify-center border border-dashed border-white/10 text-gray-600">
               [Wireframe Mockup Placeholder]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;
