import { defineAction } from "astro:actions";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { z } from "astro:schema";
import { SampleEmail } from "@/emails/sampleEmail";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  send: defineAction({
    accept: "form",
    input: z.object({
      username: z.string(),
      email: z.string().email(),
      message: z.string(),
    }),
    handler: async ({ username, email, message }) => {
      // create the email
      const emailContent = SampleEmail({ username, email, message });
      const html = await render(emailContent);

      // send an email
      const { error } = await resend.emails.send({
        from: "hello@andersseen.dev",
        to: ["info@falcotech.es"],
        subject: "Correo electrónico desde la web",
        html,
      });

      if (error) {
        return { success: false };
      }

      return { success: true };
    },
  }),
};
