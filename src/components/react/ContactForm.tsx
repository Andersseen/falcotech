import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { actions } from "astro:actions";

export default function ContactForm() {
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
      newErrors.username = "El nombre es obligatorio.";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El correo no es válido.";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje no puede estar vacío.";
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
    <section className="w-full h-fit rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-transparent/5 dark:bg-transparent/40">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Contacte con FalcoTech
      </h2>

      <form className="my-8" ref={formRef} onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="username">Nombre y apellido</Label>
          <Input
            id="username"
            name="username"
            placeholder="Escriba aquí su nombre"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="su.correo.electronico@mail.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Escriba su mensaje"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}
        </LabelInputContainer>

        <button
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar →"}
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
