
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, LogOut } from "lucide-react";
import { formatAddress } from "@/lib/web3";

export function WalletConnect() {
  const { isConnected, isConnecting, address, connect, disconnect } = useWallet();

  return (
    <div>
      {isConnected && address ? (
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-marketplace-primary/10 rounded-md border border-marketplace-primary/20">
            <div className="h-2 w-2 rounded-full bg-marketplace-accent animate-pulse"></div>
            <span className="text-sm font-medium">{formatAddress(address)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={disconnect} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Disconnect</span>
          </Button>
        </div>
      ) : (
        <Button onClick={connect} disabled={isConnecting} className="gap-2">
          <Wallet className="h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  );
}
