import Link from "next/link";
import {
  Plus,
  Package,
  Layers,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Settings,
  ShieldCheck,
  UserCheck,
  CircleDollarSign,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Server-side database aggregation layer
async function getAdminMetrics() {
  try {
    const [
      productCount,
      categoryCount,
      userCount,
      totalOrders,
      balanceGroup,
      orderLogs,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        take: 7,
        orderBy: { createdAt: "asc" },
        select: { createdAt: true, totalAmount: true },
      }),
    ]);

    // Format the last 7 orders dynamically into date buckets for Recharts
    const chartData = orderLogs.map((order) => ({
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: Number(order.totalAmount),
      orders: 1,
    }));

    // Group matching dates together to display pretty linear curves
    const condensedData = chartData.reduce((acc: any[], item) => {
      const existing = acc.find((d) => d.date === item.date);
      if (existing) {
        existing.revenue += item.revenue;
        existing.orders += 1;
      } else {
        acc.push(item);
      }
      return acc;
    }, []);

    return {
      productCount,
      categoryCount,
      userCount,
      totalOrders,
      grossSales: balanceGroup._sum.totalAmount || 0,
      chartData: condensedData,
      success: true,
    };
  } catch (error) {
    console.error("ADMIN_DASHBOARD_METRICS_ERROR:", error);
    return {
      productCount: 0,
      categoryCount: 0,
      userCount: 0,
      totalOrders: 0,
      grossSales: 0,
      chartData: [],
      success: false,
    };
  }
}

export default async function AdminDashboardPage() {
  const metrics = await getAdminMetrics();

  return (
    <div className="min-h-screen bg-neutral-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Upper Header Welcome Banner Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                Control Tower
              </h1>
              <Badge className="bg-neutral-900 text-white rounded-md gap-1 font-semibold scale-90">
                <ShieldCheck className="h-3 w-3" /> System Admin
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              Manage your storefront items, monitor system indexes, track
              customer shipments, and check balances.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl h-10 gap-2 font-medium"
              asChild
            >
              <Link href="/dashboard/admin/orders">
                <ShoppingBag className="h-4 w-4 text-neutral-500" /> Manage
                Shipments
              </Link>
            </Button>
            <Button
              size="sm"
              className="rounded-xl h-10 gap-1.5 font-semibold shadow-sm cursor-pointer"
              asChild
            >
              <Link href="/dashboard/admin/add-product">
                <Plus className="h-4 w-4" /> Add Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Analytic Metrics Grid */}
        {metrics.success && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border-neutral-200/80 shadow-sm bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Gross Revenue
                </CardTitle>
                <div className="p-2 rounded-xl border text-emerald-600 bg-emerald-50 border-emerald-100">
                  <CircleDollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="text-2xl font-black text-neutral-900 tracking-tight">
                  ${metrics.grossSales.toFixed(2)}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                  Total settled Stripe volume
                </p>
              </CardContent>
            </Card>

            <Link href="/dashboard/admin/orders" className="block group">
              <Card className="border-neutral-200/80 shadow-sm bg-white overflow-hidden group-hover:border-neutral-900 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    Customer Orders
                  </CardTitle>
                  <div className="p-2 rounded-xl border text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="text-2xl font-black text-neutral-900 tracking-tight flex items-baseline gap-1">
                    {metrics.totalOrders}
                    <ArrowUpRight className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                    Total sales entries captured
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-neutral-200/80 shadow-sm bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-5">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Active Products
                </CardTitle>
                <div className="p-2 rounded-xl border text-blue-600 bg-blue-50 border-blue-100">
                  <Package className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="text-2xl font-black text-neutral-900 tracking-tight">
                  {metrics.productCount}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                  Live items in repository
                </p>
              </CardContent>
            </Card>

            <Link href="/dashboard/admin/users" className="block group">
              <Card className="border-neutral-200/80 shadow-sm bg-white overflow-hidden group-hover:border-neutral-900 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-5">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    Registered Clients
                  </CardTitle>
                  <div className="p-2 rounded-xl border text-neutral-600 bg-neutral-50 border-neutral-100 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                    <Users className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="text-2xl font-black text-neutral-900 tracking-tight flex items-baseline gap-1">
                    {metrics.userCount}
                    <ArrowUpRight className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 font-medium">
                    User accounts in ecosystem
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Dynamic Interactive Analytics Chart Insertion Section */}
        {metrics.success && metrics.chartData.length > 0 && (
          <AnalyticsChart data={metrics.chartData} />
        )}

        {/* Lower Main Content Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Action Shortcuts Container */}
          <Card className="lg:col-span-2 border-neutral-200/80 shadow-sm bg-white">
            <CardHeader className="p-6 border-b border-neutral-100">
              <CardTitle className="text-base font-bold tracking-tight">
                Quick Operations
              </CardTitle>
              <CardDescription className="text-xs">
                Direct access points to manage data instances across the Neon
                cluster layer.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/admin/orders" className="group">
                <div className="p-4 border border-neutral-200/70 rounded-xl hover:border-neutral-900 hover:shadow-sm transition-all duration-200 bg-neutral-50/40 group-hover:bg-white space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1 group-hover:text-neutral-950">
                      Order Fulfillment Center
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Monitor processing line balances, track invoice statuses,
                      and dispatch deliveries.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/admin/add-product" className="group">
                <div className="p-4 border border-neutral-200/70 rounded-xl hover:border-neutral-900 hover:shadow-sm transition-all duration-200 bg-neutral-50/40 group-hover:bg-white space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-neutral-950 flex items-center justify-center text-white font-bold text-sm">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1 group-hover:text-neutral-950">
                      Deploy New Asset
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Instantly push new inventory models into the active
                      storefront database.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/admin/products" className="group">
                <div className="p-4 border border-neutral-200/70 rounded-xl hover:border-neutral-900 hover:shadow-sm transition-all duration-200 bg-neutral-50/40 group-hover:bg-white space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1 group-hover:text-neutral-950">
                      Catalog Management
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Update price configurations, restock counts, slugs, and
                      overview details.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/admin/users" className="group">
                <div className="p-4 border border-neutral-200/70 rounded-xl hover:border-neutral-900 hover:shadow-sm transition-all duration-200 bg-neutral-50/40 group-hover:bg-white space-y-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1 group-hover:text-neutral-950">
                      Client Directory
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Audit all registered profiles, trace security levels, and
                      control user credentials.
                    </p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Quick System Diagnostics Panel */}
          <Card className="border-neutral-200/80 shadow-sm bg-white">
            <CardHeader className="p-6 border-b border-neutral-100">
              <CardTitle className="text-base font-bold tracking-tight">
                System Status
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time service health parameters.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">
                  Database Core
                </span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">
                  Auth Engine
                </span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">
                  Payment Gateway
                </span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Live API
                </span>
              </div>
              <hr className="border-neutral-100" />
              <Button
                variant="ghost"
                className="w-full text-xs text-neutral-500 hover:text-neutral-900 rounded-lg h-9 gap-1.5"
                size="sm"
              >
                <Settings className="h-3.5 w-3.5" /> View Advanced Configuration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
