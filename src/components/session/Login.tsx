import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { getCsrfToken } from "@/helpers/use-csrf-token";
import ConfirmationDialog from "@/components/session/ConfirmationDialog";

const formSchema = z.object({
  username: z.string().min(3, "Nome de usuário é inválido"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    const toastId = toast.loading("Entrando…");

    try {
      const formData = new FormData();
      formData.append("authenticity_token", getCsrfToken());
      formData.append("username", data.username);

      const res = await fetch("/login", {
        method: "POST",
        body: formData,
      });
      const message = await res.text();

      if (!res.ok) throw new Error(message);

      toast.success("Código de acesso enviado com sucesso.", { id: toastId });
      setIsLoading(false);
      setOpenConfirmation(true);
    } catch (err) {
      toast.error(`Falha - ${err}`, { id: toastId });
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-100 p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <div className="mb-4">
          <h1 className="font-heading mb-2 text-xl leading-none font-semibold tracking-tight">Login</h1>
          <p className="text-muted-foreground">
            Entre com o seu nome de usuário, um email será enviado com o código de acesso.
          </p>
        </div>
        <Field>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input {...field} id="username" placeholder="Nome de Usuário" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </Field>
        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Spinner data-icon="inline-start" className={isLoading ? "" : "hidden"} />
            Login
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Ainda não tem conta?{" "}
            <a
              className="text-primary-accent whitespace-nowrap hover:underline"
              href="mailto:streamiau@joseafga.com.br?subject=Pedido de acesso ao Streamiau!"
            >
              streamiau@joseafga.com.br
            </a>
          </p>
        </Field>
      </form>
      <ConfirmationDialog open={openConfirmation} setOpen={setOpenConfirmation} />
    </div>
  );
}
