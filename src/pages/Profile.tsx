
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { GPUListingForm } from "@/components/GPUListingForm";
import { useWallet } from "@/contexts/WalletContext";
import { getAllResources, isResourceProvider } from "@/lib/web3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/web3";
import { ArrowUpRight, Copy, FileText, Wallet } from "lucide-react";
import GPUCard from "@/components/GPUCard";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { address, isConnected, signer } = useWallet();
  const [activeTab, setActiveTab] = useState("myGPUs");
  const [userResources, setUserResources] = useState<any[]>([]);
  const [isProvider, setIsProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isConnected || !address || !signer) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching user data for address:", address);
        
        // Check if user is a provider
        const providerStatus = await isResourceProvider(address, signer);
        console.log("Provider status:", providerStatus);
        setIsProvider(providerStatus);
        
        // Get all resources and filter user's resources
        const allResources = await getAllResources(signer);
        console.log("All resources:", allResources);
        
        const userOwnedResources = allResources.filter(
          r => r.provider.toLowerCase() === address.toLowerCase()
        );
        console.log("User owned resources:", userOwnedResources);
        
        setUserResources(userOwnedResources);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [address, isConnected, signer]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Your wallet address has been copied to clipboard",
      });
    }
  };

  const handleListFirstGPUClick = () => {
    setActiveTab("listNew");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {isConnected && address ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">
                  Manage your GPU listings and rentals
                </p>
              </div>

              {/* Wallet Info */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Connected Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md">
                      <div className="h-2 w-2 rounded-full bg-marketplace-accent"></div>
                      <span className="font-mono">{formatAddress(address)}</span>
                      <Button variant="ghost" size="icon" onClick={copyAddress}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`https://etherscan.io/address/${address}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sm text-marketplace-primary hover:underline"
                      >
                        View on Etherscan
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                      <Separator orientation="vertical" className="h-4 my-auto" />
                      <a 
                        href="#" 
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <FileText className="h-3 w-3" />
                        Transaction History
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                <TabsList className="grid w-full md:w-auto grid-cols-2">
                  <TabsTrigger value="myGPUs">My GPUs</TabsTrigger>
                  <TabsTrigger value="listNew">List New GPU</TabsTrigger>
                </TabsList>
                
                <TabsContent value="myGPUs" className="pt-6">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <p>Loading your GPU listings...</p>
                    </div>
                  ) : userResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userResources.map((resource) => (
                        <GPUCard
                          key={resource.id}
                          id={resource.id}
                          provider={resource.provider}
                          specs={resource.specs}
                          pricePerHour={resource.pricePerHour}
                          available={resource.available}
                          isUserProvider={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                      <h3 className="text-lg font-medium">No GPUs Listed</h3>
                      <p className="text-muted-foreground mt-2">
                        You haven't listed any GPUs yet. Start listing your hardware to earn ETH.
                      </p>
                      <Button 
                        className="mt-4"
                        onClick={handleListFirstGPUClick}
                      >
                        List Your First GPU
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="listNew" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <GPUListingForm />
                    <Card>
                      <CardHeader>
                        <CardTitle>Listing Guide</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">GPU Model</h4>
                          <p className="text-sm text-muted-foreground">
                            Specify the exact model of your GPU (e.g., NVIDIA RTX 4090, AMD Radeon RX 7900 XTX).
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Memory</h4>
                          <p className="text-sm text-muted-foreground">
                            Include the memory size and type (e.g., 24GB GDDR6X).
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Cores</h4>
                          <p className="text-sm text-muted-foreground">
                            Specify the number of CUDA cores, Stream Processors, or Tensor cores.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Benchmark</h4>
                          <p className="text-sm text-muted-foreground">
                            Include performance metrics like TFLOPS or benchmark scores.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">Pricing</h4>
                          <p className="text-sm text-muted-foreground">
                            Set a competitive hourly rate in ETH. You'll receive 95% of the rental fee (5% platform fee).
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6">
                  Please connect your Ethereum wallet to access your profile and manage your GPU listings.
                </p>
                <Button onClick={() => window.location.href = "/"}>
                  Return to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 GPUverse
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
