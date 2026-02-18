import { Leaf, Phone, Mail, MapPin, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hero-gradient text-primary-foreground mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-secondary rounded-full p-2">
                <Leaf className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span className="font-bold text-lg">Smart AgriMart</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              India's trusted digital marketplace for farmers. Buy, rent, and manage agricultural equipment with ease.
            </p>
            <div className="flex gap-3 mt-4">
              <button className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-full transition"><Facebook className="h-4 w-4" /></button>
              <button className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-full transition"><Twitter className="h-4 w-4" /></button>
              <button className="bg-primary-foreground/10 hover:bg-primary-foreground/20 p-2 rounded-full transition"><Youtube className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {["Browse Products", "Rent Equipment", "AI Advisor", "Subsidies", "Become a Seller"].map((link) => (
                <li key={link}><a href="#" className="hover:text-secondary transition">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Categories</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {["Tractors", "Harvesters", "Sprayers", "Fertilizers", "Seeds"].map((cat) => (
                <li key={cat}><a href="#" className="hover:text-secondary transition">{cat}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">Contact Us</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-secondary" />1800-123-4567 (Free)</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-secondary" />support@agrimart.in</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" />New Delhi, India</div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>© 2024 Smart AgriMart. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-secondary transition">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
