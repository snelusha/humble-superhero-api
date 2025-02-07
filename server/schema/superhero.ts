import { z } from "zod";

export const superheroSchema = z.object({
  name: z.string(),
  superpower: z.string(),
  humility: z.number().int().min(1).max(10),
});

export type Superhero = z.infer<typeof superheroSchema>;
