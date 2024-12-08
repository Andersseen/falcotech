import { World } from "@/components/ui/globe";
import { globeConfig, sampleArcs } from "@/data/globe";
import ContactForm from "./ContactForm";

export default function GlobeWithForm() {
  return (
    <div
      id="contact"
      className="flex flex-row items-center justify-center py-20 h-screen md:h-auto  relative w-full"
    >
      <div className="w-full h-full md:h-[40rem] flex flex-col lg:flex-row align-middle items-center justify-around overflow-hidden px-4">
        <ContactForm />

        <div className="hidden lg:block w-full md:w-1/2 h-72 md:h-full">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}
