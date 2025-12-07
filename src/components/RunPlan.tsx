import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface RunPlanProps {
  plan: any;
  formValues: any;
  onReset: () => void;
}

export default function RunPlan({ plan, formValues, onReset }: RunPlanProps) {
  return (
    <div className="space-y-6">
      {/* Create New Plan Button */}
      <div className="flex justify-end">
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="cursor-pointer bg-transparent border border-gray-600 text-white hover:bg-gray-700"
        >
          Create New Plan
        </Button>
      </div>
      
      {/* Plan Parameters Summary */}
      <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50">
        <CardHeader className="border-b border-gray-700/50 pb-2">
          <h2 className="text-lg font-medium text-white">Your Parameters</h2>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div>
              <div className="text-xs text-gray-400">Current Mileage</div>
              <div className="text-white font-medium">{formValues?.currentWeeklyMileage} miles/week</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Goal</div>
              <div className="text-white font-medium">{formValues?.goal}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Duration</div>
              <div className="text-white font-medium">{formValues?.timelineWeeks} weeks</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Running Days</div>
              <div className="text-white font-medium">{formValues?.daysPerWeek} days/week</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Long Run Day</div>
              <div className="text-white font-medium">{formValues?.longRunDay}</div>
            </div>
            {formValues?.injuries && formValues.injuries !== "none" && (
              <div className="col-span-full">
                <div className="text-xs text-gray-400">Injury Considerations</div>
                <div className="text-white font-medium">{formValues?.injuries}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Description */}
      <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50">
        <CardHeader className="border-b border-gray-700/50">
          <h2 className="text-lg font-medium text-white">Plan Overview</h2>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-white">{plan.description || "No description available."}</p>
        </CardContent>
      </Card>

      {/* Weekly Plans */}
      <div className="space-y-4">
        {plan.weeks?.map((week: any) => (
          <Card key={week.week} className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50">
            <CardHeader className="border-b border-gray-700/50 pb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-white">Week {week.week}</h3>
                <div className="px-3 py-1 bg-teal-500/20 rounded-full text-teal-300 text-sm">
                  {week.mileage} miles
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              {/* Mobile-friendly stacked layout for days of the week */}
              <div className="space-y-2 sm:space-y-0">
                {/* Desktop: 7 column grid, Mobile: stacked vertical layout */}
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="bg-gray-900 rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-white">{day}</div>
                        {/* Show badge for workout type on mobile */}
                        {week.workouts[day] && week.workouts[day].includes("Long run") && (
                          <span className="sm:hidden px-2 py-0.5 bg-teal-500/30 rounded-full text-xs text-teal-300">
                            Long Run
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-white">
                        {week.workouts[day] || (
                          <span className="text-gray-400">Rest</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Notes */}
              {week.notes && (
                <div className="mt-4 p-3 bg-gray-900/70 border border-gray-700/70 rounded-md">
                  <div className="text-xs text-gray-300 uppercase font-medium mb-1">Notes</div>
                  <div className="text-sm text-white">{week.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}