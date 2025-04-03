
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { connectWallet, isMetaMaskInstalled } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

// Add ethereum property to the Window interface
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  address: string | null;
  signer: any;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check if a wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled() && window.ethereum?.selectedAddress) {
        try {
          const { address, signer } = await connectWallet();
          setAddress(address);
          setSigner(signer);
          setIsConnected(true);
        } catch (error) {
          console.error("Failed to reconnect wallet:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== address) {
          // User switched accounts
          setAddress(accounts[0]);
          try {
            const { signer } = await connectWallet();
            setSigner(signer);
          } catch (error) {
            console.error("Failed to update signer:", error);
          }
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [address]);

  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      const { address, signer } = await connectWallet();
      setAddress(address);
      setSigner(signer);
      setIsConnected(true);
      toast({
        title: "Wallet connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setSigner(null);
    setIsConnected(false);
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        signer,
        isConnected,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
