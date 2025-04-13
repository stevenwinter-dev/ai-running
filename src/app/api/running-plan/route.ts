import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { currentWeeklyMileage, goal, daysPerWeek, timelineWeeks, longRunDay, injuries } = await req.json();

  const prompt = `
  As a professional running coach, create a personalized ${timelineWeeks}-week training plan for:
  - Current mileage: ${currentWeeklyMileage} mpw
  - Goal: ${goal}
  - ${daysPerWeek} running days/week
  - Long run day: ${longRunDay}
  - Injury considerations: ${injuries || 'none'}

  IMPORTANT: The plan MUST have EXACTLY ${daysPerWeek} running days per week, no more and no less. Count carefully to ensure there are exactly ${daysPerWeek} non-rest days in each week. The remaining days should be rest days.

  Include:
  1. A brief description of the plan in a conversational tone, as if you are speaking directly to the runner. For example:
      - If the runner has a high weekly mileage (e.g., 40+ miles), acknowledge their experience and suggest how the plan will help them improve further.
      - If the runner has a low weekly mileage (e.g., 10-20 miles), encourage them and explain how the plan will help them build a strong foundation.
      - Tailor the description to the number of running days per week. For example, if they run 6 days a week, acknowledge their dedication and suggest how the plan will balance intensity and recovery.
      - Avoid simply repeating the input values; instead, provide meaningful and motivational feedback.
  2. A table with weekly details, including:
      - Week number
      - Weekly mileage target as a number only (do not include the word "miles")
      - Key workouts for each day of the week (Monday through Sunday). Days without workouts should be explicitly labeled as "Rest" or "Rest day".
      - Notes (e.g., taper weeks or injury considerations)
      
  CRITICAL: For each week, ensure that the sum of miles in each daily workout EXACTLY matches the total weekly mileage. Every running workout should specify a distance in miles (e.g., "5 miles easy run", "8 miles long run").

  Guidelines for distributing workouts and rest days:
  - Rest days should follow the highest-intensity workouts (e.g., speed workouts, long runs).
  - Avoid consecutive rest days unless absolutely necessary.
  - Spread the running days evenly throughout the week to maintain consistency.
  - Ensure that the long run day (${longRunDay}) is always included as one of the running days.
  - Double-check that your plan includes EXACTLY ${daysPerWeek} running days per week.
  - VERIFY that the sum of miles in all workouts equals the weekly mileage total for each week.

  Format the response as a JSON object with the following structure:
  {
      "description": "A brief overview of the plan",
      "weeks": [
      {
          "week": 1,
          "mileage": "25", // Just the number, no "miles" text
          "workouts": {
              "Monday": "5 miles easy run",
              "Tuesday": "Rest day",
              "Wednesday": "4 miles with strides",
              "Thursday": "3 miles recovery",
              "Sunday": "8 miles long run"
          },
          "notes": "Any special notes for the week"
      },
      ...
      ]
  }

  Before submitting your response, check that:
  1. Each week has exactly ${daysPerWeek} running days
  2. The sum of miles in each week's workouts equals the weekly mileage total
  3. All mileage values are numbers only, without the word "miles"

  **Return only the raw JSON without markdown formatting or additional text.**
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;

    // Parse the JSON string (even if it's already an object due to response_format)
    const parsedPlan = typeof content === "string" ? JSON.parse(content) : content;

    return NextResponse.json({ plan: parsedPlan });
  } catch (err) {
    console.error("Error generating plan:", err);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}