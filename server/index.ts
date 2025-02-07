import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  () => console.log("Server is running on http://localhost:4000")
);
