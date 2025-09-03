"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Cache for AI insights to avoid repeated API calls
const insightsCache = new Map();

export const generateAIInsights = async (industry) => {
  // Check cache first
  const cacheKey = `insights_${industry}`;
  if (insightsCache.has(cacheKey)) {
    return insightsCache.get(cacheKey);
  }

  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const insights = JSON.parse(cleanedText);

    // Cache the result for 1 hour
    insightsCache.set(cacheKey, insights);
    setTimeout(() => insightsCache.delete(cacheKey), 60 * 60 * 1000);

    return insights;
  } catch (error) {
    console.error("Error generating AI insights:", error);
    // Return fallback data if AI generation fails
    return {
      salaryRanges: [
        { role: "Entry Level", min: 50000, max: 80000, median: 65000, location: "Remote" },
        { role: "Mid Level", min: 80000, max: 120000, median: 100000, location: "Remote" },
        { role: "Senior Level", min: 120000, max: 180000, median: 150000, location: "Remote" },
      ],
      growthRate: 8.5,
      demandLevel: "High",
      topSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
      marketOutlook: "Positive",
      keyTrends: ["Remote work adoption", "AI integration", "Cloud migration"],
      recommendedSkills: ["TypeScript", "Docker", "Kubernetes", "GraphQL", "Machine Learning"]
    };
  }
};

export async function getIndustryInsights() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // First get the user to check their industry
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true, id: true }
    });

    if (!user) throw new Error("User not found");

    // If user has no industry, return default insights
    if (!user.industry) {
      return {
        salaryRanges: [
          { role: "Entry Level", min: 50000, max: 80000, median: 65000, location: "Remote" },
          { role: "Mid Level", min: 80000, max: 120000, median: 100000, location: "Remote" },
          { role: "Senior Level", min: 120000, max: 180000, median: 150000, location: "Remote" },
        ],
        growthRate: 8.5,
        demandLevel: "High",
        topSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
        marketOutlook: "Positive",
        keyTrends: ["Remote work adoption", "AI integration", "Cloud migration"],
        recommendedSkills: ["TypeScript", "Docker", "Kubernetes", "GraphQL", "Machine Learning"],
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    }

    // Check for existing insights for this specific industry
    const existingInsight = await db.industryInsight.findUnique({
      where: { industry: user.industry }
    });

    // Check if insights exist and are recent (less than 6 days old)
    if (existingInsight) {
      const daysSinceUpdate = (Date.now() - existingInsight.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 6) {
        return existingInsight;
      }
    }

    // Generate new insights in the background
    const insightsPromise = generateAIInsights(user.industry);
    
    // Return existing insights immediately if available, otherwise wait for new ones
    if (existingInsight) {
      // Start background update
      insightsPromise.then(async (newInsights) => {
        try {
          await db.industryInsight.update({
            where: { industry: user.industry },
            data: {
              ...newInsights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
          revalidatePath("/dashboard");
        } catch (error) {
          console.error("Background insight update failed:", error);
        }
      });
      
      return existingInsight;
    }

    // No existing insights, generate new ones
    const insights = await insightsPromise;

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  } catch (error) {
    console.error("Error getting industry insights:", error);
    // Return fallback data
    return {
      salaryRanges: [
        { role: "Entry Level", min: 50000, max: 80000, median: 65000, location: "Remote" },
        { role: "Mid Level", min: 80000, max: 120000, median: 100000, location: "Remote" },
        { role: "Senior Level", min: 120000, max: 180000, median: 150000, location: "Remote" },
      ],
      growthRate: 8.5,
      demandLevel: "High",
      topSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
      marketOutlook: "Positive",
      keyTrends: ["Remote work adoption", "AI integration", "Cloud migration"],
      recommendedSkills: ["TypeScript", "Docker", "Kubernetes", "GraphQL", "Machine Learning"],
      lastUpdated: new Date(),
      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }
}
