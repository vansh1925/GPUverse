
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2, DollarSign, Users } from "lucide-react";

export function AdminPanel() {
  // These would be fetched from the contract in a real implementation
  const platformStats = {
    totalUsers: 142,
    activeRentals: 26,
    totalGPUs: 78,
    totalEarnings: "12.45 ETH",
    platformFees: "0.62 ETH"
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Registered wallet addresses
          </p>
        </CardContent>
      </Card>
      
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.activeRentals}</div>
          <p className="text-xs text-muted-foreground">
            Currently in progress
          </p>
        </CardContent>
      </Card>
      
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Listed GPUs</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.totalGPUs}</div>
          <p className="text-xs text-muted-foreground">
            Total resources on marketplace
          </p>
        </CardContent>
      </Card>
      
      <Card className="stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.platformFees}</div>
          <p className="text-xs text-muted-foreground">
            5% of {platformStats.totalEarnings} total volume
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
