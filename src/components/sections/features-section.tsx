import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    title: "Lightning Fast",
    description: "Optimized for speed and performance",
    icon: Zap,
  },
  {
    title: "Secure",
    description: "Enterprise-grade security built-in",
    icon: Shield,
  },
  {
    title: "Modern Tech",
    description: "Built with the latest technologies",
    icon: Laptop,
  },
  {
    title: "Team Friendly",
    description: "Collaborative features for your team",
    icon: Users,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-12 w-12 mb-4 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}