
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseGPUSpecs, completeRental } from "@/lib/web3";
import { formatAddress } from "@/lib/web3";
import { Zap } from "lucide-react";
import GPURentModal from "./GPURentModal";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";

interface GPUCardProps {
  id: number;
  provider: string;
  specs: string;
  pricePerHour: string;
  available: boolean;
  isUserProvider?: boolean;
}

const GPUCard = ({ id, provider, specs, pricePerHour, available, isUserProvider = false }: GPUCardProps) => {
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [isCompletingRental, setIsCompletingRental] = useState(false);
  const [rentalExpired, setRentalExpired] = useState(false);
  const [rentalStartTime, setRentalStartTime] = useState<number | null>(null);
  const [rentalDuration, setRentalDuration] = useState<number | null>(null);
  const { address, signer } = useWallet();
  const { toast } = useToast();
  
  const parsedSpecs = parseGPUSpecs(specs);
  const isUserRenter = !available && !isUserProvider;
  
  // For demonstration purposes: 1 hour = 1 minute
  // Check if rental period has expired
  useEffect(() => {
    if (!available && rentalStartTime && rentalDuration) {
      const endTime = rentalStartTime + (rentalDuration * 60 * 1000); // Convert hours to milliseconds (1 hour = 1 minute)
      const checkExpiration = () => {
        const now = Date.now();
        if (now >= endTime) {
          setRentalExpired(true);
        }
      };
      
      // Check immediately
      checkExpiration();
      
      // Then check every 10 seconds
      const interval = setInterval(checkExpiration, 10000);
      return () => clearInterval(interval);
    }
  }, [available, rentalStartTime, rentalDuration]);
  
  // Simulate rental start time and duration for demonstration
  useEffect(() => {
    if (!available && !isUserProvider) {
      // For demo purposes only - in production, this would come from the blockchain
      setRentalStartTime(Date.now() - (30 * 1000)); // Started 30 seconds ago
      setRentalDuration(1); // 1 hour (which we're treating as 1 minute)
    }
  }, [available, isUserProvider]);
  
  const handleCompleteRental = async () => {
    if (!signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to complete this rental",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsCompletingRental(true);
      await completeRental(id, signer);
      
      toast({
        title: "Rental Completed",
        description: "The rental has been successfully completed",
      });
      
      // Refresh the page to update the GPU status
      window.location.reload();
    } catch (error: any) {
      console.error("Error completing rental:", error);
      toast({
        title: "Failed to Complete Rental",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsCompletingRental(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-marketplace-card-header">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-marketplace-accent" />
          {parsedSpecs.model || "GPU"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Provider</span>
            <span className="text-sm font-medium">{formatAddress(provider)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Memory</span>
              <p className="font-medium">{parsedSpecs.memory || "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Cores</span>
              <p className="font-medium">{parsedSpecs.cores || "N/A"}</p>
            </div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Benchmark</span>
            <p className="font-medium">{parsedSpecs.benchmark || "N/A"}</p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-marketplace-primary" />
              <span className="font-bold">{pricePerHour} ETH</span>
              <span className="text-xs text-muted-foreground">/hour</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              available 
                ? "bg-green-500/20 text-green-500" 
                : "bg-red-500/20 text-red-500"
            }`}>
              {available ? "Available" : "In Use"}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-marketplace-card-footer pt-4">
        {isUserProvider ? (
          <Button variant="outline" className="w-full" disabled>
            Your Listed GPU
          </Button>
        ) : available ? (
          <Button 
            className="w-full" 
            onClick={() => setIsRentModalOpen(true)}
          >
            Rent GPU
          </Button>
        ) : isUserRenter && rentalExpired ? (
          <Button 
            className="w-full" 
            variant="secondary" 
            onClick={handleCompleteRental}
            disabled={isCompletingRental}
          >
            {isCompletingRental ? "Processing..." : "Complete Rental"}
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Currently Rented
          </Button>
        )}
      </CardFooter>
      
      <GPURentModal
        open={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        gpuId={id}
        model={parsedSpecs.model || "GPU"}
        pricePerHour={pricePerHour}
      />
    </Card>
  );
};

export default GPUCard;
