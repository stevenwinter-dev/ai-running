"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GOAL_OPTIONS, TIMELINE_OPTIONS, DAYS_PER_WEEK_OPTIONS, LONG_RUN_DAY_OPTIONS, INJURY_OPTIONS } from "../lib/constants";

export default function RunningPlanForm() {
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/running-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (!response.ok) {
        throw new Error("Failed to generate the plan.");
      }

      const data = await response.json();
      const { plan } = data;
      setPlan(plan);
    } catch (err) {
      console.error("Error fetching plan:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Plan state updated:", plan);
  }, [plan]);

  return (
    <div className="max-w-6xl mx-auto my-8 bg-slate-950 text-gray-100 p-6 rounded-lg">
      {/* Card for Form */}
      <Card className="max-w-xl mx-auto bg-stone-950 text-gray-100">
        <CardHeader>
          <h1 className="text-2xl font-bold">🏃‍♂️ Running Plan Generator</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Weekly Mileage */}
            <div className="grid gap-2">
              <Label htmlFor="currentWeeklyMileage">Current Weekly Mileage</Label>
              <Input name="currentWeeklyMileage" type="number" min="0" required className="bg-gray-700 text-gray-100" />
            </div>

            {/* Goal */}
            <div className="grid gap-2">
              <Label htmlFor="goal">Primary Goal</Label>
              <select name="goal" className="border p-2 rounded w-full bg-gray-700 text-gray-100" required>
                {GOAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Days Per Week */}
            <div className="grid gap-2">
              <Label htmlFor="daysPerWeek">Days Per Week</Label>
              <select name="daysPerWeek" className="border p-2 rounded w-full bg-gray-700 text-gray-100" required>
                {DAYS_PER_WEEK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeline Weeks */}
            <div className="grid gap-2">
              <Label htmlFor="timelineWeeks">Timeline (Weeks)</Label>
              <select name="timelineWeeks" className="border p-2 rounded w-full bg-gray-700 text-gray-100" required>
                {TIMELINE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Long Run Day */}
            <div className="grid gap-2">
              <Label htmlFor="longRunDay">Preferred Long Run Day</Label>
              <select name="longRunDay" className="border p-2 rounded w-full bg-gray-700 text-gray-100" required>
                {LONG_RUN_DAY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Injuries */}
            <div className="grid gap-2">
              <Label htmlFor="injuries">Injury Considerations</Label>
              <select name="injuries" className="border p-2 rounded w-full bg-gray-700 text-gray-100">
                {INJURY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 cursor-pointer ${
                    isLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                }`}
                >
                {isLoading ? "Generating..." : "Create My Plan"}
                </Button>
          </form>

          {/* Error Message */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Loading Message */}
          {isLoading && <p className="text-center text-gray-400">Generating your plan...</p>}
        </CardContent>
      </Card>

      {/* Table for Plan */}
      {plan && (
        <div className="mt-8">
            {/* Plan Description */}
            <div className="mb-6 p-4 bg-gray-800 text-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Plan Description</h2>
            <p>{plan.description || "No description available."}</p>
            </div>

            {/* Calendar Table */}
            <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-700 rounded-lg shadow-md bg-gray-800 text-gray-100">
                <thead className="bg-gray-700">
                <tr>
                    <th className="border border-gray-600 px-4 py-2 text-left">Week</th>
                    <th className="border border-gray-600 px-4 py-2 text-left">Mileage</th>
                    <th className="border border-gray-600 px-4 py-2 text-left">Workouts</th>
                </tr>
                </thead>
                <tbody>
                {plan.weeks?.length > 0 ? (
                    plan.weeks.map((week: any) => (
                    <tr key={week.week} className="hover:bg-gray-700">
                        {/* Week Number and Mileage */}
                        <td className="border border-gray-600 px-4 py-2 font-bold">{`Week ${week.week}`}</td>
                        <td className="border border-gray-600 px-4 py-2">{week.mileage}</td>
                        <td className="border border-gray-600 px-4 py-2">
                        <div className="grid grid-cols-7 gap-2">
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div key={day} className="text-center">
                                <div className="font-semibold">{day}</div>
                                <div className="mt-1">{week.workouts[day] || "Rest"}</div>
                            </div>
                            ))}
                        </div>
                        {/* Notes for the Week */}
                        <div className="mt-4 p-2 bg-gray-700 text-gray-300 rounded">
                            <strong>Notes:</strong> {week.notes || "No notes for this week."}
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-4">
                        No weeks available in the plan.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
        )}
    </div>
  );
}