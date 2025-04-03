
import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "./WalletConnect";
import { GitHubLogoIcon, HomeIcon } from "@radix-ui/react-icons";
import { Cpu, LayoutDashboard, User } from "lucide-react";
import { Button } from "./ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { isContractOwner } from "@/lib/web3";
import { useEffect, useState } from "react";

export function NavBar() {
  const location = useLocation();
  const { isConnected, address, signer } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (isConnected && address && signer) {
        const ownerStatus = await isContractOwner(address, signer);
        setIsAdmin(ownerStatus);
      }
    };

    checkOwnership();
  }, [isConnected, address, signer]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-marketplace-primary" />
            <span className="font-bold text-lg">AI Compute Nexus</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium ${
                isActive("/")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`flex items-center gap-2 text-sm font-medium ${
                isActive("/marketplace")
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu className="h-4 w-4" />
              Marketplace
            </Link>
            {isConnected && (
              <Link
                to="/profile"
                className={`flex items-center gap-2 text-sm font-medium ${
                  isActive("/profile")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 text-sm font-medium ${
                  isActive("/admin")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <GitHubLogoIcon className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
