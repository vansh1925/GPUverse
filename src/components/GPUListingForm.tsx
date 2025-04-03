
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { listResource } from "@/lib/web3";
import { useWallet } from "@/contexts/WalletContext";
import { useState } from "react";

export function GPUListingForm() {
  const [gpuModel, setGpuModel] = useState("");
  const [gpuMemory, setGpuMemory] = useState("");
  const [gpuCores, setGpuCores] = useState("");
  const [gpuBenchmark, setGpuBenchmark] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { signer, isConnected } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to list a GPU",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form
    if (!gpuModel || !gpuMemory || !gpuCores || !gpuBenchmark || !pricePerHour) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate price
    if (isNaN(parseFloat(pricePerHour)) || parseFloat(pricePerHour) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }
    
    const specs = {
      model: gpuModel,
      memory: gpuMemory,
      cores: gpuCores,
      benchmark: gpuBenchmark,
    };
    
    try {
      setIsSubmitting(true);
      console.log("Submitting GPU listing...", { specs, pricePerHour, signer });
      
      const result = await listResource(specs, pricePerHour, signer);
      console.log("Listing result:", result);
      
      toast({
        title: "GPU Listed Successfully",
        description: "Your GPU has been listed on the marketplace",
      });
      
      // Reset form
      setGpuModel("");
      setGpuMemory("");
      setGpuCores("");
      setGpuBenchmark("");
      setPricePerHour("");
    } catch (error: any) {
      console.error("Error listing GPU:", error);
      toast({
        title: "Failed to List GPU",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>List Your GPU</CardTitle>
        <CardDescription>
          Make your GPU available for AI model training
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">GPU Model</Label>
            <Input
              id="model"
              placeholder="e.g. NVIDIA RTX 4090"
              value={gpuModel}
              onChange={(e) => setGpuModel(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memory">Memory</Label>
              <Input
                id="memory"
                placeholder="e.g. 24GB GDDR6X"
                value={gpuMemory}
                onChange={(e) => setGpuMemory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cores">Cores</Label>
              <Input
                id="cores"
                placeholder="e.g. 16384"
                value={gpuCores}
                onChange={(e) => setGpuCores(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="benchmark">Benchmark</Label>
            <Input
              id="benchmark"
              placeholder="e.g. Compute: 82.58 TFLOPS"
              value={gpuBenchmark}
              onChange={(e) => setGpuBenchmark(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price per Hour (ETH)</Label>
            <Input
              id="price"
              type="number"
              step="0.0001"
              min="0"
              placeholder="e.g. 0.05"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Listing..." : "List GPU"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
