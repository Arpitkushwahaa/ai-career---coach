import { Suspense } from "react";
import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { DashboardSkeleton } from "./_component/dashboard-skeleton";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

async function DashboardContent() {
  const insights = await getIndustryInsights();
  return <DashboardView insights={insights} />;
}

export default async function DashboardPage() {
  const onboardingStatus = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  // Skip this check if already on the onboarding page
  if (!onboardingStatus.isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
