
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress, parseGPUSpecs } from "@/lib/web3";
import { Cpu, Zap } from "lucide-react";
import { useState } from "react";
import GPURentModal from "./GPURentModal";

interface GPUCardProps {
  id: number;
  provider: string;
  specs: string;
  pricePerHour: string;
  available: boolean;
  isUserProvider?: boolean;
}

const GPUCard = ({ id, provider, specs, pricePerHour, available, isUserProvider = false }: GPUCardProps) => {
  const [showRentModal, setShowRentModal] = useState(false);
  const parsedSpecs = parseGPUSpecs(specs);

  return (
    <>
      <Card className="gpu-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-marketplace-primary" />
            {parsedSpecs.model}
          </CardTitle>
          <CardDescription>
            Provided by {formatAddress(provider)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="gpu-specs mb-4">
            <div>
              <span className="font-medium">Memory:</span> {parsedSpecs.memory}
            </div>
            <div>
              <span className="font-medium">Cores:</span> {parsedSpecs.cores}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Benchmark:</span> {parsedSpecs.benchmark}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-marketplace-accent" />
              <span className="font-bold text-lg">{pricePerHour} ETH</span>
              <span className="text-xs text-muted-foreground">/hour</span>
            </div>
            
            <div className="flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${available ? 'bg-marketplace-accent' : 'bg-destructive'}`}></span>
              <span className="text-sm font-medium">
                {available ? 'Available' : 'In Use'}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {!isUserProvider && (
            <Button 
              className="w-full" 
              onClick={() => setShowRentModal(true)}
              disabled={!available}
            >
              Rent GPU
            </Button>
          )}
          
          {isUserProvider && (
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!available}
            >
              Manage Listing
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {showRentModal && (
        <GPURentModal
          open={showRentModal}
          onClose={() => setShowRentModal(false)}
          gpuId={id}
          model={parsedSpecs.model}
          pricePerHour={pricePerHour}
        />
      )}
    </>
  );
};

export default GPUCard;
