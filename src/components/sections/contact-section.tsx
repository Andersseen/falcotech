import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Have questions? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="transform transition-transform hover:-translate-y-1 duration-300">
            <CardHeader>
              <Mail className="h-6 w-6 mb-4 text-primary" />
              <CardTitle>Email</CardTitle>
              <CardDescription>contact@company.com</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="transform transition-transform hover:-translate-y-1 duration-300">
            <CardHeader>
              <Phone className="h-6 w-6 mb-4 text-primary" />
              <CardTitle>Phone</CardTitle>
              <CardDescription>+1 (555) 000-0000</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="transform transition-transform hover:-translate-y-1 duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <MapPin className="h-6 w-6 mb-4 text-primary" />
              <CardTitle>Office</CardTitle>
              <CardDescription>123 Business Ave, Suite 100</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto mt-12 md:mt-16">
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input type="email" placeholder="Email" />
              <Textarea placeholder="Your message" className="min-h-[150px]" />
              <Button type="submit" className="w-full sm:w-auto">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}