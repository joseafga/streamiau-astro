import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface ConfirmFormValues {
  code: string;
}

export default function ConfirmationDialog({ open, setOpen }: Props) {
  const form = useForm<ConfirmFormValues>();

  async function onSubmit(data: ConfirmFormValues) {
    // keep parameters for `redirect_to`
    const params = new URLSearchParams(window.location.search);
    if (data.code) params.set("code", data.code);

    const confirmUrl = `/login/confirm?${params.toString()}`;

    window.location.href = confirmUrl;
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Código de confirmação</DialogTitle>
          <DialogDescription>
            Enviamos um código para o seu e-mail. Digite-o abaixo para confirmar o login.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 pt-2">
          <Field>
            <Controller
              name="code"
              control={form.control}
              render={({ field }) => (
                <InputOTP {...field} id="code" maxLength={8} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} required>
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl uppercase gap-2">
                    <InputOTPSlot index={0} className="rounded-md border border-input" />
                    <InputOTPSlot index={1} className="rounded-md border border-input" />
                    <InputOTPSlot index={2} className="rounded-md border border-input" />
                    <InputOTPSlot index={3} className="rounded-md border border-input" />
                    <InputOTPSlot index={4} className="rounded-md border border-input" />
                    <InputOTPSlot index={5} className="rounded-md border border-input" />
                    <InputOTPSlot index={6} className="rounded-md border border-input" />
                    <InputOTPSlot index={7} className="rounded-md border border-input" />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost">Cancelar</Button>} />
            <Button type="submit">Confirmar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
