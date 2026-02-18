import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import AIAdvisor from "@/components/AIAdvisor";
import UserDashboard from "@/components/UserDashboard";
import Footer from "@/components/Footer";
import AuthPage from "@/pages/Auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_rental: boolean;
  rental_price_per_hour: number;
  stock: number;
  rating: number;
  reviews_count: number;
}

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.full_name) setProfileName(data.full_name);
        });
    }
  }, [user]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (activeCategory) query = query.eq("category", activeCategory);
    if (searchQuery) query = query.ilike("name", `%${searchQuery}%`);
    const { data } = await query;
    setProducts((data as Product[]) || []);
    setProductsLoading(false);
  };

  const handleSearch = () => fetchProducts();

  const filteredProducts = products.filter((p) => {
    if (activeTab === "sale") return !p.is_rental;
    if (activeTab === "rent") return p.is_rental;
    return true;
  });

  const bestSelling = filteredProducts.slice(0, 4);
  const recommended = filteredProducts.slice(4, 8);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => setShowAuth(true)} />

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="p-0 max-w-md border-0 overflow-hidden">
          <AuthPage />
        </DialogContent>
      </Dialog>

      {/* Hero */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        userName={profileName || user?.email?.split("@")[0]}
      />

      {/* Categories */}
      <CategoryGrid onSelect={setActiveCategory} selected={activeCategory} />

      {/* Products Section */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Best Selling Products</h2>
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "All" },
            { key: "sale", label: "For Sale" },
            { key: "rent", label: "For Rent" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bestSelling.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {bestSelling.map((product) => (
              <ProductCard key={product.id} product={product} onAuthRequired={() => setShowAuth(true)} />
            ))}
          </div>
        )}
      </section>

      {/* AI Advisor Section */}
      <section id="ai-advisor" className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">AI Equipment Advisor & Rental Price Predictor</h2>
        <AIAdvisor />
      </section>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <section id="rentals" className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recommended Products</h2>
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} onAuthRequired={() => setShowAuth(true)} />
            ))}
          </div>
        </section>
      )}

      {/* Dashboard */}
      {user && (
        <section id="dashboard" className="max-w-6xl mx-auto px-4 py-8">
          <UserDashboard />
        </section>
      )}

      {/* CTA for non-logged in users */}
      {!user && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="hero-gradient rounded-2xl p-8 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold mb-3">Join 50,000+ Farmers on AgriMart</h2>
            <p className="text-primary-foreground/70 mb-6">Sign up to track orders, manage rentals, and get personalized recommendations</p>
            <Button onClick={() => setShowAuth(true)} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8">
              Get Started Free
            </Button>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
