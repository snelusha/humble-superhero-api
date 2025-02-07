import { Hono } from "hono";
import { serve } from "@hono/node-server";

import { z } from "zod";

const superheroSchema = z.object({
  name: z.string(),
  superpower: z.string(),
  humility: z.number().int().min(1).max(10),
});

type SuperPower = z.infer<typeof superheroSchema>;

const superheroes: SuperPower[] = [];

const app = new Hono();

const api = app.basePath("/api");

api.get("/superheroes", (c) => {
  const sortedSuperheroes = [...superheroes].sort(
    (a, b) => b.humility - a.humility
  );

  return c.json(sortedSuperheroes);
});

api.post("/superheroes", async (c) => {
  try {
    const superhero = superheroSchema.parse(await c.req.json());

    if (superheroes.some((s) => s.name === superhero.name)) {
      return c.json({ error: "Superhero already exists" }, 400);
    }

    superheroes.push(superhero);

    return c.json(superhero);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json("Invalid superhero data", 400);
    }
  }
});

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  () => console.log("Server is running on http://localhost:4000")
);
