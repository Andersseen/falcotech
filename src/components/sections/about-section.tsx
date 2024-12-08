import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Us</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              We're a team of passionate individuals dedicated to creating
              exceptional digital experiences. With years of experience and
              a commitment to innovation, we help businesses transform their
              digital presence.
            </p>
            <Button size="lg" className="w-full sm:w-auto">Learn Our Story</Button>
          </div>
          <div className="order-1 lg:order-2 relative aspect-video rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
              alt="Team working together"
              className="object-cover w-full h-full transform transition-transform hover:scale-105 duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}