import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const form = React.useRef();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs
      .sendForm("service_in3qixn", "template_pk82xif", form.current, {
        publicKey: "eZy8swFvRZujRvAdv",
      })
      .then(
        () => {
          setIsSuccess(true);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (form.current) (form.current as any).reset();

          setTimeout(() => setIsSuccess(false), 5000);
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <section className="w-full h-fit rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-transparent/5 dark:bg-transparent/40">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Contacte con FalcoTech
      </h2>

      <form className="my-8" ref={form} onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="user_name">Nombre y apellido</Label>
          <Input
            id="user_name"
            name="user_name"
            placeholder="Escriba aquí su nombre"
            type="text"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="user_email">Email</Label>
          <Input
            id="user_email"
            name="user_email"
            placeholder="su.correo.electronico@mail.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Escriba su mensaje"
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Enviar &rarr;
          <BottomGradient />
        </button>

        {isSuccess && (
          <div className="mt-4 p-2 bg-green-500 text-white rounded">
            ¡Mensaje enviado con éxito!
          </div>
        )}
      </form>
    </section>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-secondary to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
