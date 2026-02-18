import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, Wallet, TrendingUp, Package, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  orders: number;
  rentals: number;
  walletBalance: number;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ orders: 0, rentals: 0, walletBalance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [ordersRes, rentalsRes, walletRes] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("rentals").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("wallets").select("balance").eq("user_id", user.id).single(),
      ]);
      setStats({
        orders: ordersRes.count ?? 0,
        rentals: rentalsRes.count ?? 0,
        walletBalance: walletRes.data?.balance ?? 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  const statCards = [
    {
      label: "Orders",
      value: loading ? "..." : String(stats.orders),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-700",
      bgAccent: "border-blue-200",
    },
    {
      label: "Rentals",
      value: loading ? "..." : String(stats.rentals),
      icon: Clock,
      color: "bg-secondary/10 text-secondary",
      bgAccent: "border-secondary/30",
    },
    {
      label: "Wallet",
      value: loading ? "..." : formatCurrency(stats.walletBalance),
      icon: Wallet,
      color: "bg-primary/10 text-primary",
      bgAccent: "border-primary/20",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Your Dashboard
        </h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className={`border ${stat.bgAccent}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
