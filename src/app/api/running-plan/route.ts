import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const SAMPLE_DATA = {
  description: "This is a sample running plan.",
  weeks: [
    {
      week: 1,
      mileage: 20,
      workouts: {
        Monday: "Rest",
        Tuesday: "3 miles easy",
        Wednesday: "4 miles tempo",
        Thursday: "Rest",
        Friday: "3 miles easy",
        Saturday: "5 miles long run",
        Sunday: "Rest",
      },
      notes: "Focus on building consistency.",
    },
    {
      week: 2,
      mileage: 22,
      workouts: {
        Monday: "Rest",
        Tuesday: "3 miles easy",
        Wednesday: "5 miles tempo",
        Thursday: "Rest",
        Friday: "4 miles easy",
        Saturday: "6 miles long run",
        Sunday: "Rest",
      },
      notes: "Increase mileage gradually.",
    },
  ],
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  // Check if API limit is reached
  if (process.env.NEXT_PUBLIC_API_LIMIT_REACHED === "TRUE") {
    return NextResponse.json({ plan: SAMPLE_DATA });
  }

  const { 
    currentWeeklyMileage, 
    fitnessLevel, 
    mileageGoal, 
    easyPaceMin,
    easyPaceSec,
    recentRunDistance,
    runTimeMin,
    runTimeSec,
    goal, 
    daysPerWeek, 
    timelineWeeks, 
    longRunDay, 
    injuries 
  } = await req.json();
  
  // Format paces and times if provided
  const easyPaceFormatted = easyPaceMin && easyPaceSec 
    ? `${easyPaceMin}:${easyPaceSec.toString().padStart(2, '0')}/mile` 
    : null;
    
  const runTimeFormatted = runTimeMin && runTimeSec
    ? `${runTimeMin}:${runTimeSec.toString().padStart(2, '0')}` 
    : null;

  const prompt = `
  # RUNNING PLAN CREATION TASK

  You are a professional running coach. Create a personalized training plan tailored to the runner's specific needs, experience level, and goals. Use a motivating and supportive tone to inspire the runner while providing expert guidance.

  ## RUNNER PROFILE
  - Fitness Level: ${fitnessLevel || 'beginner'}
  - Current Weekly Mileage: ${currentWeeklyMileage} miles
  - Goal: ${goal}
  - Running Days Per Week: ${daysPerWeek}
  - Long Run Day: ${longRunDay}
  - Injury Considerations: ${injuries || 'none'}
  ${fitnessLevel !== 'beginner' ? `- Mileage Goal: ${mileageGoal || 'increase'}` : ''}
  ${easyPaceFormatted ? `- Easy Pace: ${easyPaceFormatted}` : ''}
  ${recentRunDistance && runTimeFormatted ? `- Recent ${recentRunDistance} Time: ${runTimeFormatted}` : ''}

  ## KEY REQUIREMENTS
  1. Create a ${timelineWeeks}-week personalized running plan.
  2. EXACTLY ${daysPerWeek} running days per week (no more, no less).
  3. The long run MUST always be scheduled on ${longRunDay}.
  4. For mileage progression:
    - Start with ${currentWeeklyMileage} miles in Week 1.
    - Gradually increase weekly mileage by no more than 10% per week.
    - Include a recovery week (reduced mileage) every 3-4 weeks.
  5. For workout types:
    - Include a mix of easy runs, long runs, tempo runs, intervals, strides, and recovery runs.
    - Every run MUST include a description (e.g., "5 miles easy run" or "6 miles tempo").
    - Ensure the long run is appropriately scaled to the runner's experience and weekly mileage.

  ## REST DAY PLACEMENT - CRITICAL
  1. Rest days MUST be spaced logically throughout the week:
    - Include a rest day **before** and **after** the long run to allow for recovery.
    - Avoid scheduling runs immediately after the long run.
    - Distribute the remaining rest days evenly across the week to balance effort and recovery.
  2. Example for 3 running days per week with a Sunday long run:
    - Monday: Rest day
    - Tuesday: 3 miles easy run
    - Wednesday: Rest day
    - Thursday: 3 miles tempo run
    - Friday: Rest day
    - Saturday: Rest day
    - Sunday: 4 miles long run

  ## MILEAGE CALCULATION - CRITICAL
  1. The sum of daily workout mileage MUST EQUAL the weekly mileage total.
  2. Distribute the weekly mileage across exactly ${daysPerWeek} running days.
  3. VERIFY: If the weekly mileage is 10 miles and the user runs 3 days per week:
    - Example:
      - Tuesday: 3 miles easy run
      - Thursday: 3 miles tempo run
      - Sunday: 4 miles long run
      - Total: 3 + 3 + 4 = 10 miles ✓

  ## CONTINUITY REQUIREMENTS
  - Ensure a logical progression between weeks that builds toward the final week.
  - Gradually increase workout intensity and complexity as the plan progresses.
  - Maintain consistent workout patterns (e.g., long runs on the same day each week) while varying specific workouts.
  - Each week should prepare the runner for the following week's challenges.

  ## OUTPUT FORMAT
  Return a JSON object with the following structure:
  {
    "description": "A motivational overview of the plan tailored to the runner.",
    "weeks": [
      {
        "week": 1,
        "mileage": "10",
        "workouts": {
          "Monday": "Rest day",
          "Tuesday": "3 miles easy run",
          "Wednesday": "Rest day",
          "Thursday": "3 miles easy run with strides",
          "Friday": "Rest day",
          "Saturday": "Rest day",
          "Sunday": "4 miles long run"
        },
        "notes": "Focus on building a consistent running habit this week."
      }
    ]
  }

  ## IMPORTANT CHECKS
  - Each week MUST have EXACTLY ${daysPerWeek} running days.
  - The sum of daily workout mileage MUST equal the weekly mileage total.
  - The long run MUST always be scheduled on ${longRunDay}.
  - Rest days MUST follow the rules outlined in the "REST DAY PLACEMENT" section.
  - Every running workout MUST include a description (e.g., "easy run", "tempo run").
  - Include all seven days of the week in the output (with rest days explicitly labeled).
  - Use original workouts tailored to the runner’s profile—do NOT copy the example workouts verbatim.
  - Mileage values should be numbers only (e.g., "5", not "5 miles").

  Return only the raw JSON without markdown formatting or additional text.
`;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
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