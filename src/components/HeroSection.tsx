import { Search, Zap, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearch: () => void;
  userName?: string;
}

export default function HeroSection({ searchQuery, onSearchChange, onSearch, userName }: HeroSectionProps) {
  return (
    <section className="hero-gradient text-primary-foreground py-16 px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "hsl(var(--agri-orange))", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5" style={{ background: "hsl(var(--agri-orange))", transform: "translate(-30%, 30%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Zap className="h-3 w-3" /> Subsidy Available
          </span>
          <span className="bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Truck className="h-3 w-3" /> Free Delivery
          </span>
        </div>

        {/* Welcome */}
        {userName && (
          <p className="text-primary-foreground/80 text-sm mb-2">Welcome back, <span className="text-secondary font-semibold">{userName}</span> 👋</p>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 max-w-2xl">
          Find & Rent Machinery<br />
          <span className="text-secondary">at Best Price</span>
        </h1>
        <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl">
          India's largest digital marketplace for farmers — buy, rent, and manage all your agricultural equipment in one place.
        </p>

        {/* Search */}
        <div className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tractors, seeds, fertilizers..."
              className="pl-10 h-12 bg-card text-foreground border-0 shadow-lg"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>
          <Button onClick={onSearch} className="h-12 px-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-lg">
            Search
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-primary-foreground/10">
          {[
            { icon: Shield, label: "Trusted Sellers" },
            { icon: Shield, label: "Secure Payment" },
            { icon: Shield, label: "24/7 Support" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-primary-foreground/70 text-sm">
              <Icon className="h-4 w-4 text-secondary" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
