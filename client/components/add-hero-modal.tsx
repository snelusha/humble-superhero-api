"use client";

import * as React from "react";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn } from "@/styles/utils";

const superheroSchemaForm = z.object({
  name: z.string().nonempty(),
  superpower: z.string().nonempty(),
  humilityScore: z.coerce.number().min(1).max(10),
});

type SuperheroForm = z.infer<typeof superheroSchemaForm>;

interface AddHeroModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddHeroModal({ open, onClose }: AddHeroModalProps) {
  const form = useForm<SuperheroForm>({
    resolver: zodResolver(superheroSchemaForm),
    mode: "all",
    defaultValues: {
      name: "",
      superpower: "",
      humilityScore: 0,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await fetch("http://localhost:4000/superheroes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const json = await response.json();
        toast.error(json.error);
        return;
      }

      toast.success("Hero added successfully");

      form.reset();
      handleClose(false);
    } catch {}
  });

  const handleClose = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new hero</DialogTitle>
          <DialogDescription>
            This is where you can add a new hero to the list.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="mt-2 flex flex-col gap-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        fieldState.error &&
                          "border-destructive focus-visible:ring-destructive",
                        "mt-2",
                      )}
                      placeholder="Captain Humble"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="superpower"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Superpower</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        fieldState.error &&
                          "border-destructive focus-visible:ring-destructive",
                        "mt-2",
                      )}
                      placeholder="Invisibility"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="humilityScore"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Humility Score</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        fieldState.error &&
                          "border-destructive focus-visible:ring-destructive",
                        "mt-2",
                      )}
                      type="number"
                      placeholder="5"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
