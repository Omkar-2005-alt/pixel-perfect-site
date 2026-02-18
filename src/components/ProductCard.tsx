import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Clock, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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

interface ProductCardProps {
  product: Product;
  onAuthRequired: () => void;
}

export default function ProductCard({ product, onAuthRequired }: ProductCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleBuy = async () => {
    if (!user) { onAuthRequired(); return; }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      product_id: product.id,
      quantity: 1,
      total_amount: product.price,
      status: "pending",
    });
    if (error) toast.error("Failed to place order");
    else toast.success(`Order placed for ${product.name}!`);
    setLoading(false);
  };

  const handleRent = async () => {
    if (!user) { onAuthRequired(); return; }
    setLoading(true);
    const start = new Date();
    const end = new Date(start.getTime() + 8 * 60 * 60 * 1000);
    const { error } = await supabase.from("rentals").insert({
      user_id: user.id,
      product_id: product.id,
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      total_amount: (product.rental_price_per_hour || 0) * 8,
      status: "pending",
    });
    if (error) toast.error("Failed to book rental");
    else toast.success(`Rental booked for ${product.name}!`);
    setLoading(false);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group border border-border">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"; }}
        />
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-2 right-2 bg-card/90 rounded-full p-1.5 shadow"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
        </button>
        <Badge className={`absolute top-2 left-2 text-xs ${product.is_rental ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"}`}>
          {product.is_rental ? "For Rent" : "For Sale"}
        </Badge>
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-bold text-primary">{formatPrice(product.price)}</div>
            {product.is_rental && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatPrice(product.rental_price_per_hour)}/hr
              </div>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock > 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
            {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
          </span>
        </div>

        <div className="flex gap-2">
          {product.is_rental ? (
            <Button onClick={handleRent} size="sm" className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-xs" disabled={loading || product.stock === 0}>
              <Clock className="h-3 w-3 mr-1" />
              {loading ? "Booking..." : "Book Now"}
            </Button>
          ) : (
            <Button onClick={handleBuy} size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-xs" disabled={loading || product.stock === 0}>
              <ShoppingCart className="h-3 w-3 mr-1" />
              {loading ? "Ordering..." : "Buy Now"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
