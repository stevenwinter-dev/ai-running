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

  Include:
  1. A brief description of the plan in a conversational tone, as if you are speaking directly to the runner. For example:
      - If the runner has a high weekly mileage (e.g., 40+ miles), acknowledge their experience and suggest how the plan will help them improve further.
      - If the runner has a low weekly mileage (e.g., 10-20 miles), encourage them and explain how the plan will help them build a strong foundation.
      - Tailor the description to the number of running days per week. For example, if they run 6 days a week, acknowledge their dedication and suggest how the plan will balance intensity and recovery.
      - Avoid simply repeating the input values; instead, provide meaningful and motivational feedback.
  2. A table with weekly details, including:
      - Week number
      - Weekly mileage target
      - Key workouts for each day of the week (Monday through Sunday). If there is no workout for a specific day, include an empty string for that day.
      - Notes (e.g., taper weeks or injury considerations)

  Guidelines for distributing workouts and rest days:
  - Rest days should follow the highest-intensity workouts (e.g., speed workouts, long runs).
  - Avoid consecutive rest days unless absolutely necessary.
  - Spread the running days evenly throughout the week to maintain consistency.
  - Ensure that the long run day (${longRunDay}) is always included as one of the running days.

  Format the response as a JSON object with the following structure:
  {
      "description": "A brief overview of the plan",
      "weeks": [
      {
          "week": 1,
          "mileage": "X miles",
          "workouts": {
              "Monday": "Speed workout",
              "Tuesday": "Tempo run",
              "Wednesday": "Long run",
              "Thursday": "",
              "Friday": "",
              "Saturday": "",
              "Sunday": ""
          },
          "notes": "Any special notes for the week"
      },
      ...
      ]
  }

  **Return only the raw JSON without markdown formatting or additional text.**
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.6,
      response_format: { type: "json_object" }, // Force JSON output
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