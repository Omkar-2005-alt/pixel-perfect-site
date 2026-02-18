import { Leaf, LogOut, User, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

interface NavbarProps {
  onAuthClick: () => void;
}

export default function Navbar({ onAuthClick }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-1.5">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-primary text-lg">Smart AgriMart</span>
            <span className="hidden sm:block text-xs text-muted-foreground leading-none">Digital Marketplace</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#products" className="hover:text-primary transition font-medium">Products</a>
          <a href="#rentals" className="hover:text-primary transition font-medium">Rentals</a>
          <a href="#ai-advisor" className="hover:text-secondary transition font-medium text-secondary">AI Advisor</a>
          <a href="#dashboard" className="hover:text-primary transition font-medium">Dashboard</a>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-primary/5 rounded-full px-3 py-1.5">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary truncate max-w-32">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button onClick={onAuthClick} size="sm" className="bg-primary hover:bg-primary/90 gap-2">
              <ShoppingBag className="h-4 w-4" />
              Login / Sign Up
            </Button>
          )}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          {["Products", "Rentals", "AI Advisor", "Dashboard"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="block text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
