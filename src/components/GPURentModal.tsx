
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { COMPLETION_PAYMENT_PERCENT, PLATFORM_FEE_PERCENT, UPFRONT_PAYMENT_PERCENT } from "@/lib/constants";
import { rentResource } from "@/lib/web3";
import { useWallet } from "@/contexts/WalletContext";
import { ClockIcon, DollarSign } from "lucide-react";
import { useState } from "react";

interface GPURentModalProps {
  open: boolean;
  onClose: () => void;
  gpuId: number;
  model: string;
  pricePerHour: string;
}

export default function GPURentModal({ open, onClose, gpuId, model, pricePerHour }: GPURentModalProps) {
  const [duration, setDuration] = useState(1);
  const [isRenting, setIsRenting] = useState(false);
  const { toast } = useToast();
  const { signer } = useWallet();

  const totalPrice = parseFloat(pricePerHour) * duration;
  const upfrontPayment = totalPrice * (UPFRONT_PAYMENT_PERCENT / 100);
  const completionPayment = totalPrice * (COMPLETION_PAYMENT_PERCENT / 100);
  const platformFee = totalPrice * (PLATFORM_FEE_PERCENT / 100);

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDuration(value > 0 ? value : 1);
  };

  const handleRent = async () => {
    try {
      setIsRenting(true);
      await rentResource(gpuId, duration, totalPrice.toString(), signer);
      
      toast({
        title: "GPU Rented Successfully",
        description: `You've rented ${model} for ${duration} hours`,
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to Rent GPU",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsRenting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rent GPU Compute</DialogTitle>
          <DialogDescription>
            {model} at {pricePerHour} ETH per hour
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <div className="col-span-3 flex items-center">
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={handleDurationChange}
                className="mr-2"
              />
              <ClockIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
          </div>
          
          <div className="rounded-md border border-border p-4 mt-2">
            <h4 className="font-medium mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-marketplace-primary" />
              Payment Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Upfront Payment ({UPFRONT_PAYMENT_PERCENT}%)</span>
                <span>{upfrontPayment.toFixed(6)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Completion Payment ({COMPLETION_PAYMENT_PERCENT}%)</span>
                <span>{completionPayment.toFixed(6)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee ({PLATFORM_FEE_PERCENT}%)</span>
                <span>{platformFee.toFixed(6)} ETH</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>{totalPrice.toFixed(6)} ETH</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRent} disabled={isRenting}>
            {isRenting ? "Processing..." : "Confirm Rental"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
