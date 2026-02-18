import { Tractor, Wheat, Wrench, Leaf, Droplets, Sprout } from "lucide-react";

const categories = [
  { name: "Tractors", icon: Tractor, color: "bg-primary/10 text-primary", count: 45 },
  { name: "Harvesters", icon: Wheat, color: "bg-secondary/10 text-secondary", count: 18 },
  { name: "Tools", icon: Wrench, color: "bg-blue-100 text-blue-700", count: 120 },
  { name: "Fertilizers", icon: Droplets, color: "bg-purple-100 text-purple-700", count: 85 },
  { name: "Seeds", icon: Sprout, color: "bg-emerald-100 text-emerald-700", count: 200 },
  { name: "Organic", icon: Leaf, color: "bg-lime-100 text-lime-700", count: 60 },
];

interface CategoryGridProps {
  onSelect: (cat: string) => void;
  selected: string;
}

export default function CategoryGrid({ onSelect, selected }: CategoryGridProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Categories</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelect(selected === cat.name ? "" : cat.name)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
              selected === cat.name
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <div className={`p-3 rounded-full ${cat.color}`}>
              <cat.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.count}+</span>
          </button>
        ))}
      </div>
    </section>
  );
}
