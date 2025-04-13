"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { GOAL_OPTIONS, TIMELINE_OPTIONS, DAYS_PER_WEEK_OPTIONS, LONG_RUN_DAY_OPTIONS, INJURY_OPTIONS } from "../app/lib/constants";

// Form constants
const FITNESS_LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner (new to running)" },
  { value: "intermediate", label: "Intermediate (some running experience)" },
  { value: "advanced", label: "Advanced (regular runner with race experience)" }
];

interface PlanCreateFormProps {
  isLoading: boolean;
  error: string | null;
  onSubmit: (values: any) => void;
}

export default function PlanCreateForm({ isLoading, error, onSubmit }: PlanCreateFormProps) {
  const [fitnessLevel, setFitnessLevel] = useState("beginner");
  
  const handleFitnessLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFitnessLevel(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData);
    onSubmit(values);
  };

  return (
    <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 sticky top-20">
      <CardHeader className="border-b border-gray-700/50 pb-4">
        <h2 className="text-lg font-medium text-white">Build your plan in 30 seconds!</h2>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form id="planForm" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* General Fitness Level - Always visible */}
            <div>
              <Label htmlFor="fitnessLevel" className="text-sm font-medium text-white">
                Fitness Level
              </Label>
              <select 
                name="fitnessLevel" 
                value={fitnessLevel}
                onChange={handleFitnessLevelChange}
                className="mt-1 w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-500" 
                required
              >
                {FITNESS_LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          
            {/* Running Experience Section - Only for intermediate/advanced */}
            {(fitnessLevel === "intermediate" || fitnessLevel === "advanced") && (
              <div className="space-y-3 pt-2 pb-1">
                <div className="text-sm font-medium text-teal-400 border-b border-gray-700/50 pb-2">
                  Running Experience
                </div>
                
                <div>
                  <Label htmlFor="currentWeeklyMileage" className="text-sm font-medium text-white">
                    Current Weekly Mileage
                  </Label>
                  <Input 
                    name="currentWeeklyMileage" 
                    type="number" 
                    min="0" 
                    required 
                    className="mt-1 bg-gray-900 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="easyPace" className="text-sm font-medium text-white">
                    Recent Easy Pace (min:sec per mile)
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      name="easyPaceMin" 
                      type="number" 
                      min="4"
                      max="20" 
                      placeholder="min" 
                      className="mt-1 bg-gray-900 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500" 
                    />
                    <Input 
                      name="easyPaceSec" 
                      type="number" 
                      min="0"
                      max="59" 
                      placeholder="sec" 
                      className="mt-1 bg-gray-900 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500" 
                    />
                  </div>
                </div>
                
                {fitnessLevel === "advanced" && (
                  <>
                    <div>
                      <Label htmlFor="recentRaceDistance" className="text-sm font-medium text-white">
                        Recent Race Distance
                      </Label>
                      <select 
                        name="recentRaceDistance" 
                        className="mt-1 w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-500"
                      >
                        <option value="">Select a distance (optional)</option>
                        <option value="5k">5K</option>
                        <option value="10k">10K</option>
                        <option value="half_marathon">Half Marathon</option>
                        <option value="marathon">Marathon</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="racePace" className="text-sm font-medium text-white">
                        Recent Race Pace (min:sec per mile)
                      </Label>
                      <div className="flex gap-2">
                        <Input 
                          name="racePaceMin" 
                          type="number" 
                          min="4"
                          max="15" 
                          placeholder="min" 
                          className="mt-1 bg-gray-900 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500" 
                        />
                        <Input 
                          name="racePaceSec" 
                          type="number" 
                          min="0"
                          max="59" 
                          placeholder="sec" 
                          className="mt-1 bg-gray-900 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500" 
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Plan Configuration - Always visible */}
            <div className="space-y-3 pt-2 pb-1">
              <div className="text-sm font-medium text-teal-400 border-b border-gray-700/50 pb-2">
                Plan Configuration
              </div>
              
              {fitnessLevel === "beginner" && (
                <div>
                  <Label htmlFor="currentWeeklyMileage" className="text-sm font-medium text-white">
                    Current Weekly Mileage (if any)
                  </Label>
                  <Input 
                    name="currentWeeklyMileage" 
                    type="number" 
                    min="0" 
                    className="mt-1 bg-gray-900 border-gray-600 text-white focus:border-teal-500 focus:ring-teal-500" 
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave at 0 if you're completely new to running</p>
                </div>
              )}

              <div>
                <Label htmlFor="goal" className="text-sm font-medium text-white">Primary Goal</Label>
                <select 
                  name="goal" 
                  className="mt-1 w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-500" 
                  required
                >
                  {GOAL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="daysPerWeek" className="text-sm font-medium text-white">Days Per Week</Label>
                <select 
                  name="daysPerWeek" 
                  className="mt-1 w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-500" 
                  required
                >
                  {DAYS_PER_WEEK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="timelineWeeks" className="text-sm font-medium text-white">Timeline (Weeks)</Label>
                <select 
                  name="timelineWeeks" 
                  className="mt-1 w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-500" 
                  required
                >
                  {TIMELINE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="longRunDay" className="text-sm font-medium text-white">Preferred Long Run Day</Label>
                <select 
                  name="longRunDay" 
                  className="mt-1 w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-500" 
                  required
                >
                  {LONG_RUN_DAY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="injuries" className="text-sm font-medium text-white">Injury Considerations</Label>
                <select 
                  name="injuries" 
                  className="mt-1 w-full p-2 rounded bg-gray-900 text-white border border-gray-600 focus:border-teal-500"
                >
                  {INJURY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700/50 pt-4 flex flex-col">
        <Button
          type="submit"
          form="planForm"
          disabled={isLoading}
          className={`w-full py-3 font-medium rounded-full transition-all duration-300 ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating plan...
            </div>
          ) : (
            "Create My Plan"
          )}
        </Button>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-md text-sm text-center text-red-300">
            {error}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}