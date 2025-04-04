import { useWallet } from "@/contexts/WalletContext";
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";

const Index = () => {
  const { connect, isConnected } = useWallet();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero section */}
        <HeroSection />
        
        {/* Features section */}
        <section id="marketplace-section" className="w-full py-12 md:py-24 lg:py-32 bg-card">
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
