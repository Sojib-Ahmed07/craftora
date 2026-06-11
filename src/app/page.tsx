import Hero from "@/components/home/Hero";
import CategoryTabsFilter from "@/components/home/CategoryTabsFilter";
import RecentArrivals from "@/components/home/RecentArrivals";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* 1. Viewport-Bound Interactive Hero Component Section */}
      <Hero />

      {/* 2. On-Demand Dynamic Tab Selection Filter Grid Section */}
      <CategoryTabsFilter />

      {/* 3. Isolated Recent Global Catalog Additions Feed */}
      <RecentArrivals />
    </div>
  );
}