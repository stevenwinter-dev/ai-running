"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import PlanCreateForm from "@/components/PlanCreateForm";
import RunPlan from "@/components/RunPlan";

export default function RunningPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>(null);
  
  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    setError(null);
    setFormValues(values);
    
    try {
      const response = await fetch("/api/running-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to generate the plan.");
      }

      const data = await response.json();
      const { plan } = data;
      setPlan(plan);
      
      // Scroll to results
      if (plan) {
        setTimeout(() => {
          document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error("Error fetching plan:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setPlan(null);
    setFormValues(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#151b2d] to-gray-900 text-white">
      {/* App Header/Navigation */}
      <header className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-gray-700/50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => window.location.reload()}
            aria-label="Go to Home / Refresh"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white text-lg">🏃</span>
            </div>
            <h1 className="text-xl font-bold">Running Plan AI</h1>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Form (only shown if no plan exists) */}
          {!plan && (
            <div className="w-full lg:w-1/3">
              <PlanCreateForm 
                isLoading={isLoading} 
                error={error} 
                onSubmit={handleSubmit} 
              />
            </div>
          )}
          
          {/* Right Side - Results (full width when plan exists) */}
          <div id="results" className={`w-full ${!plan ? 'lg:w-2/3' : 'lg:w-full'}`}>
            {isLoading ? (
              <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 border-4 border-t-teal-500 border-r-transparent border-b-teal-500 border-l-transparent rounded-full animate-spin"></div>
                  <p className="text-lg font-medium text-white">Generating your personalized running plan...</p>
                  <p className="text-sm text-gray-300">This may take a moment</p>
                </div>
              </Card>
            ) : plan ? (
              <RunPlan 
                plan={plan} 
                formValues={formValues} 
                onReset={handleReset} 
              />
            ) : (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500/20 to-cyan-400/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🏃</span>
                  </div>
                  <h2 className="text-xl font-medium text-white">The Future of Running Plans</h2>
                  <p className="text-gray-300 max-w-md">Get a dynamic, AI-powered plan that adapts to your progress.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}