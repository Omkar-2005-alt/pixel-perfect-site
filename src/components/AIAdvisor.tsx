import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Loader2, Lightbulb, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const LOVABLE_API_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export default function AIAdvisor() {
  const [landSize, setLandSize] = useState("3.5");
  const [location, setLocation] = useState("Punjab");
  const [season, setSeason] = useState("Kharif");
  const [budget, setBudget] = useState("80000");
  const [crop, setCrop] = useState("Wheat");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ suggestedPrice: string; recommendations: string[] } | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const prompt = `You are an agricultural equipment advisor for Indian farmers. 
Given:
- Land size: ${landSize} acres
- Location: ${location}
- Season: ${season}
- Budget: ₹${budget}
- Crop: ${crop}

Provide:
1. A suggested tractor/machinery rental price per hour (in ₹)
2. Top 3 equipment recommendations with brief reasons

Respond in JSON format:
{
  "suggestedPrice": "850/hour",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

      const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(LOVABLE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        setResult(parsed);
      }
    } catch {
      toast.error("AI advisor is temporarily unavailable");
    }
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* AI Advisor */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Bot className="h-5 w-5 text-secondary" />
            AI Equipment Advisor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Land Size (Acres)</Label>
              <Input value={landSize} onChange={(e) => setLandSize(e.target.value)} placeholder="3.5" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Punjab", "Haryana", "UP", "Maharashtra", "Bihar", "MP", "Rajasthan", "Gujarat"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kharif">Kharif</SelectItem>
                  <SelectItem value="Rabi">Rabi</SelectItem>
                  <SelectItem value="Zaid">Zaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Crop</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Wheat", "Paddy", "Cotton", "Sugarcane", "Maize", "Soybean"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Budget (₹)</Label>
            <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="80000" className="mt-1" />
          </div>
          <Button onClick={handlePredict} className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Bot className="h-4 w-4 mr-2" />Get AI Recommendation</>}
          </Button>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Rental Price Predictor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Suggested Rental Price</p>
                <p className="text-3xl font-bold text-primary">₹{result.suggestedPrice}</p>
                <p className="text-xs text-muted-foreground mt-1">Based on your inputs</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-secondary" />
                  Recommended Equipment
                </p>
                <div className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground bg-muted rounded-lg p-3">
                      <span className="bg-secondary text-secondary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Bot className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Fill in your details and click<br />"Get AI Recommendation"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
