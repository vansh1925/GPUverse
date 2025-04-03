
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Cpu, Wallet, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";

const Index = () => {
  const { connect, isConnected } = useWallet();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Decentralized AI Compute Marketplace
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Rent or provide GPU compute power for AI model training using blockchain technology.
                    Pay only for what you use, earn from your idle hardware.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/marketplace">
                    <Button size="lg" className="gap-2">
                      <Cpu className="h-5 w-5" />
                      Explore Marketplace
                    </Button>
                  </Link>
                  {!isConnected && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={connect}
                      className="gap-2"
                    >
                      <Wallet className="h-5 w-5" />
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="bg-gradient-to-br from-marketplace-primary to-marketplace-secondary p-1 rounded-lg">
                    <div className="bg-card rounded-md p-6 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-marketplace-accent" />
                        <h3 className="font-bold">Latest GPUs Available Now</h3>
                      </div>
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-md bg-background/50">
                            <div>
                              <p className="font-medium">
                                {i === 0 && "NVIDIA RTX 4090"}
                                {i === 1 && "NVIDIA A100"}
                                {i === 2 && "AMD Radeon RX 7900 XTX"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {i === 0 && "24GB GDDR6X • 82.58 TFLOPS"}
                                {i === 1 && "80GB HBM2e • 19.5 TFLOPS"}
                                {i === 2 && "24GB GDDR6 • 61.42 TFLOPS"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">
                                {i === 0 && "0.05 ETH"}
                                {i === 1 && "0.12 ETH"}
                                {i === 2 && "0.04 ETH"}
                              </p>
                              <p className="text-xs text-muted-foreground">/hour</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link to="/marketplace" className="mt-4 block">
                        <Button variant="ghost" className="w-full">View All GPUs</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="absolute -z-10 top-0 left-0 right-0 bottom-0 bg-marketplace-primary/20 blur-3xl rounded-full transform translate-x-10 translate-y-10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-marketplace-primary/10 px-3 py-1 text-sm">
                  Built on Ethereum
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why AI Compute Nexus?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our decentralized marketplace connects AI developers with GPU providers, enabling cost-effective access to compute resources.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="bg-marketplace-primary/10 p-3 rounded-full">
                  <Wallet className="h-6 w-6 text-marketplace-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Payments</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Two-phase payment system with 30% upfront and 65% after completion, secured by smart contracts.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="bg-marketplace-secondary/10 p-3 rounded-full">
                  <Cpu className="h-6 w-6 text-marketplace-secondary" />
                </div>
                <h3 className="text-xl font-bold">Verified Performance</h3>
                <p className="text-sm text-muted-foreground text-center">
                  All GPUs include verified benchmark metrics so you know exactly what you're renting.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="bg-marketplace-accent/10 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-marketplace-accent" />
                </div>
                <h3 className="text-xl font-bold">Monetize Idle GPUs</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Providers can earn passive income by renting out their idle graphics processing power.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 AI Compute Nexus. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="font-medium underline underline-offset-4">Home</Link>
            <Link to="/marketplace" className="font-medium underline underline-offset-4">Marketplace</Link>
            <a href="#" className="font-medium underline underline-offset-4">Terms</a>
            <a href="#" className="font-medium underline underline-offset-4">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
