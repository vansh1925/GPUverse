
import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { isContractOwner } from "@/lib/web3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, Lock, Wallet } from "lucide-react";

const Admin = () => {
  const { isConnected, address, signer } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isConnected || !address || !signer) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const ownerStatus = await isContractOwner(address, signer);
        setIsAdmin(ownerStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [isConnected, address, signer]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </main>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Connect your wallet to access the admin panel</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => window.location.href = "/"} className="gap-2">
                <Wallet className="h-4 w-4" />
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Unauthorized Access
              </CardTitle>
              <CardDescription>
                You don't have permission to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => window.location.href = "/"}>
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage the AI Compute Nexus platform
            </p>
          </div>
          
          <AdminPanel />
          
          <div className="mt-8">
            <Tabs defaultValue="transactions">
              <TabsList>
                <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="settings">Platform Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions" className="py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Transactions
                    </CardTitle>
                    <CardDescription>
                      Most recent platform activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 font-medium">Event</th>
                            <th className="text-left p-3 font-medium">User</th>
                            <th className="text-left p-3 font-medium">Resource</th>
                            <th className="text-left p-3 font-medium">Value</th>
                            <th className="text-left p-3 font-medium">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="border-t">
                              <td className="p-3">
                                {i % 3 === 0 && "Resource Listed"}
                                {i % 3 === 1 && "Resource Rented"}
                                {i % 3 === 2 && "Rental Completed"}
                              </td>
                              <td className="p-3 font-mono text-sm">0x1a2b...3c4d</td>
                              <td className="p-3">
                                {i % 2 === 0 ? "NVIDIA RTX 4090" : "AMD Radeon RX 7900 XTX"}
                              </td>
                              <td className="p-3">{(Math.random() * 0.2).toFixed(4)} ETH</td>
                              <td className="p-3 text-muted-foreground">
                                {new Date(Date.now() - i * 3600000).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Users</CardTitle>
                    <CardDescription>
                      All users who have interacted with the marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        User management is under development. Check back soon!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>
                      Configure the marketplace parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Platform settings are under development. Check back soon!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 AI Compute Nexus
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
