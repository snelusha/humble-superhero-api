import { app, server } from "../";

import { Superhero } from "../schema/superhero";

describe("humble-superhero-api", () => {
  it("should add a superhero with valid input", async () => {
    const superhero: Superhero = {
      name: "Captain Humble",
      superpower: "Invisibility",
      humility: 9,
    };

    const request = new Request("http://localhost:4000/api/superheroes", {
      method: "POST",
      body: JSON.stringify(superhero),
    });

    const response = await app.fetch(request);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(superhero);
  });

  it("should reject a superhero with an invalid humility score", async () => {
    const superhero: Superhero = {
      name: "Captain Humble",
      superpower: "Invisibility",
      humility: 11,
    };

    const request = new Request("http://localhost:4000/api/superheroes", {
      method: "POST",
      body: JSON.stringify(superhero),
    });

    const response = await app.fetch(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Invalid superhero data",
    });
  });

  it("should reject a superhero with missing fields", async () => {
    const superhero = {
      name: "Captain Humble",
    };

    const request = new Request("http://localhost:4000/api/superheroes", {
      method: "POST",
      body: JSON.stringify(superhero),
    });

    const response = await app.fetch(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Invalid superhero data",
    });
  });

  it("should reject a superhero already in the list", async () => {
    const superhero: Superhero = {
      name: "Captain Humble",
      superpower: "Invisibility",
      humility: 9,
    };

    const request = new Request("http://localhost:4000/api/superheroes", {
      method: "POST",
      body: JSON.stringify(superhero),
    });

    const response = await app.fetch(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Superhero already exists",
    });
  });

  it("should return superhero sorted by humility in descending order", async () => {
    await app.fetch(
      new Request("http://localhost:4000/api/superheroes", {
        method: "POST",
        body: JSON.stringify({
          name: "Hum",
          superpower: "Invisibility",
          humility: 2,
        }),
      })
    );

    const request = new Request("http://localhost:4000/api/superheroes", {
      method: "GET",
    });

    const response = await app.fetch(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      {
        name: "Captain Humble",
        superpower: "Invisibility",
        humility: 9,
      },
      {
        name: "Hum",
        superpower: "Invisibility",
        humility: 2,
      },
    ]);
  });
});

afterAll(() => server.close());
