
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Cpu, ArrowDown } from "lucide-react";
import lottie from "lottie-web";
import aiAnimationData from "@/assets/ai-animation.json";

export function HeroSection() {
  const { connect, isConnected } = useWallet();
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: aiAnimationData,
      });

      return () => anim.destroy();
    }
  }, []);

  const scrollToMarketplace = () => {
    const marketplaceSection = document.getElementById('marketplace-section');
    if (marketplaceSection) {
      marketplaceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      
      {/* Animated blobs */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-marketplace-primary/10 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-marketplace-secondary/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-marketplace-accent/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="container relative z-10">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
              <Cpu className="h-4 w-4 mr-2" />
              <span>Powered by Blockchain Technology</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-marketplace-primary to-marketplace-secondary">
                Rent & List Powerful GPUs
              </span>
              <br />
              for AI Training — Decentralized, Fast, and Fair.
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              GP Uverse connects compute providers with AI developers for secure, blockchain-based rentals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group gap-2 text-base shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-marketplace-primary to-marketplace-secondary hover:scale-105"
                onClick={scrollToMarketplace}
              >
                Get Started
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
              </Button>
              
              {!isConnected && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={connect}
                  className="text-base border-muted-foreground/30 hover:border-primary/50"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
            
            <div className="pt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-background">
                    <Cpu className="h-4 w-4" />
                  </div>
                ))}
              </div>
              <span>Join <span className="text-foreground font-medium">500+</span> users already on the platform</span>
            </div>
          </div>
          
          {/* Right side - Animation */}
          <div className="relative order-first lg:order-last">
            <div className="aspect-square max-w-[500px] mx-auto relative bg-card/30 rounded-3xl backdrop-blur-sm p-6 border border-muted shadow-2xl">
              <div 
                ref={animationContainer} 
                className="w-full h-full"
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-card/20 rounded-3xl pointer-events-none"></div>
            </div>
            <div className="absolute -z-10 inset-0 bg-marketplace-secondary/10 filter blur-3xl rounded-full transform scale-75 translate-x-[5%] translate-y-[10%]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
