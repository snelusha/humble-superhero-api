import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import { createNodeWebSocket } from "@hono/node-ws";

import { z } from "zod";

import { superheroSchema, Superhero } from "./schema/superhero";

import type { WSContext } from "hono/ws";

const clients = new Set<WSContext>();

const superheroes: Superhero[] = [];

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.use("*", cors());

app.get("/superheroes", (c) => {
  const sortedSuperheroes = [...superheroes].sort(
    (a, b) => b.humility - a.humility
  );

  return c.json(sortedSuperheroes);
});

app.post("/superheroes", async (c) => {
  try {
    const superhero = superheroSchema.parse(await c.req.json());

    if (superheroes.some((s) => s.name === superhero.name)) {
      return c.json({ error: "Superhero already exists" }, 400);
    }

    superheroes.push(superhero);

    clients.forEach((ws) =>
      ws.send(JSON.stringify({ type: "create", superhero }))
    );

    return c.json(superhero, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid superhero data" }, 400);
    }

    return c.json({ error: "Internal server error" }, 500);
  }
});

app.patch("/superheroes/:name", async (c) => {
  const name = decodeURI(c.req.param("name"));

  try {
    const superhero = superheroSchema.partial().parse(await c.req.json());

    const index = superheroes.findIndex((s) => s.name === name);

    if (index === -1) {
      return c.json({ error: "Superhero not found" }, 404);
    }

    superheroes[index] = { ...superheroes[index], ...superhero };

    clients.forEach((ws) =>
      ws.send(JSON.stringify({ type: "update", superhero: superheroes[index] }))
    );

    return c.json(superheroes[index]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid superhero data" }, 400);
    }

    return c.json({ error: "Internal server error" }, 500);
  }
});

app.delete("/superheroes/:name", async (c) => {
  const name = c.req.param("name");

  const index = superheroes.findIndex((s) => s.name === name);

  if (index === -1) {
    return c.json({ error: "Superhero not found" }, 404);
  }

  const [superhero] = superheroes.splice(index, 1);

  clients.forEach((ws) =>
    ws.send(JSON.stringify({ type: "remove", superhero }))
  );

  return c.json(superhero);
});

app.get(
  "/superheroes/ws",
  upgradeWebSocket(() => ({
    onOpen: async (_, ws) => {
      clients.add(ws);
      ws.send(
        JSON.stringify({
          type: "init",
          superheroes,
        })
      );
    },
    onClose: (_, ws) => clients.delete(ws),
  }))
);

const server = serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 4000,
  },
  () =>
    process.env.NODE_ENV !== "test" &&
    console.log("Server is running on http://localhost:4000")
);
injectWebSocket(server);

export { app, server };
