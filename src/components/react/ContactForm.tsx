import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { actions } from "astro:actions";
import type { TFunction } from "i18next";
import React, { useRef, useState } from "react";

export default function ContactForm({
  translation,
}: {
  translation: TFunction<"translation", undefined>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // Estado de los inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  // Estado de los errores
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    message: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar errores cuando el usuario empieza a escribir
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validar formulario
  const validateForm = () => {
    let valid = true;
    let newErrors = { username: "", email: "", message: "" };

    if (!formData.username.trim()) {
      newErrors.username = translation("contact.form.username.error");
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = translation("contact.form.email.error");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El correo no es válido.";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = translation("contact.form.message.error");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    const formDataObj = new FormData(formRef.current);

    try {
      const response = await actions.send(formDataObj);
      if (response.data?.success) {
        setIsSuccess(true);
        formRef.current.reset();
        setFormData({ username: "", email: "", message: "" }); // Limpiar estado
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full h-fit rounded-none md:rounded-2xl p-4 md:p-8 py-12 md:py-24 lg:py-32 shadow-input shadow-lg"
    >
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {translation("contact.title")}
      </h2>

      <form className="my-8" ref={formRef} onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="username">
            {translation("contact.form.username.label")}
          </Label>

          <Input
            id="username"
            name="username"
            placeholder={translation("contact.form.username.placeholder")}
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">
            {translation("contact.form.email.label")}
          </Label>
          <Input
            id="email"
            name="email"
            placeholder={translation("contact.form.email.placeholder")}
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="message">
            {translation("contact.form.message.label")}
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder={translation("contact.form.message.placeholder")}
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
        </LabelInputContainer>

        <button
          className={`bg-gradient-to-br relative group/btn from-foreground to-background/70 block w-full text-neutral-100 rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "..." : translation("contact.form.submit")}
          <BottomGradient />
        </button>

        {isSuccess && (
          <div className="mt-4 p-2 bg-green-500 text-neutral rounded">
            {translation("contact.form.success")}
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
