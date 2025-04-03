
import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import GPUCard from "@/components/GPUCard";
import { useWallet } from "@/contexts/WalletContext";
import { getAllResources, isResourceProvider } from "@/lib/web3";
import { sampleGPUs } from "@/lib/constants";
import { Loader2 } from "lucide-react";

type Resource = {
  id: number;
  provider: string;
  specs: string;
  pricePerHour: string;
  available: boolean;
};

const Marketplace = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("all");
  const [isUserProvider, setIsUserProvider] = useState(false);
  const { signer, address, isConnected } = useWallet();

  useEffect(() => {
    // Function to fetch GPU resources from blockchain
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        
        let gpuResources;
        if (isConnected && signer) {
          gpuResources = await getAllResources(signer);
          
          // Check if current user is a provider
          if (address) {
            const providerStatus = await isResourceProvider(address, signer);
            setIsUserProvider(providerStatus);
          }
        } else {
          // Use sample data if not connected
          gpuResources = sampleGPUs;
        }
        
        setResources(gpuResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setResources(sampleGPUs); // Fallback to sample data
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [signer, address, isConnected]);

  const filteredResources = currentTab === "available" 
    ? resources.filter(r => r.available)
    : resources;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <MarketplaceHeader currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-marketplace-primary" />
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <GPUCard
                  key={resource.id}
                  id={resource.id}
                  provider={resource.provider}
                  specs={resource.specs}
                  pricePerHour={resource.pricePerHour}
                  available={resource.available}
                  isUserProvider={address?.toLowerCase() === resource.provider.toLowerCase()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No GPUs Found</h3>
              <p className="text-muted-foreground mt-2">
                {currentTab === "available" 
                  ? "There are no available GPUs at the moment. Please check back later."
                  : "No GPUs have been listed yet."}
              </p>
            </div>
          )}
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

export default Marketplace;
