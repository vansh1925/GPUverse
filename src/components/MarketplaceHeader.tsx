
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, HelpCircle, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

interface MarketplaceHeaderProps {
  currentTab: string;
  onTabChange: (value: string) => void;
}

export function MarketplaceHeader({ currentTab, onTabChange }: MarketplaceHeaderProps) {
  const { isConnected } = useWallet();

  return (
    <div className="marketplace-header py-6 px-4 md:px-6">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <Cpu className="h-8 w-8 mr-2 text-marketplace-primary" />
              GPU Marketplace
            </h1>
            <p className="text-muted-foreground mt-1">
              Rent or provide GPU compute power for AI model training
            </p>
          </div>
          
          {isConnected ? (
            <Link to="/profile">
              <Button className="gap-2">
                <Zap className="h-4 w-4" />
                List Your GPU
              </Button>
            </Link>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button disabled className="gap-2">
                      <Zap className="h-4 w-4" />
                      List Your GPU
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Connect your wallet to list GPUs
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="mt-6">
          <Tabs 
            defaultValue={currentTab} 
            onValueChange={onTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="all">All GPUs</TabsTrigger>
              <TabsTrigger value="available">Available Now</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
