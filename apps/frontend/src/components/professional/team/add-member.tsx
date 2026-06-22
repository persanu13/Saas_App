"use client";
import { sendInvitation } from "@/api/organizations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/axios";
import { emailSchema } from "@/lib/schemas/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export function AddMember() {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: sendInvitation,
    onSuccess: (res) => {
      toast.success("Invitation sended with succes!");
      setOpen(false);
      form.reset();
    },
    onError: (err: ApiError) => {
      toast.error(err.details.message);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <form
        id="form-email"
        onSubmit={form.handleSubmit((data) => mutate(data))}
      >
        <DialogTrigger
          render={<Button size="custom-desktop">Add Member</Button>}
        />
        <DialogContent className="sm:max-w-160 ">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Member</DialogTitle>
            <DialogDescription>
              Send an invitation to an email for a new member you want to add to
              your organization.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="email">New member email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    placeholder="john_smith23@exemple.com"
                    i_size="large"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button size="custom-desktop" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button form="form-email" size="custom-desktop" type="submit">
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
