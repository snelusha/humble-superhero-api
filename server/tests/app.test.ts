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

  it("should update a superhero with valid input", async () => {
    const superhero: Partial<Superhero> = {
      superpower: "Super Strength",
    };

    const request = new Request(
      "http://localhost:4000/api/superheroes/Captain%20Humble",
      {
        method: "PATCH",
        body: JSON.stringify(superhero),
      }
    );

    const response = await app.fetch(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      name: "Captain Humble",
      superpower: "Super Strength",
      humility: 9,
    });
  });

  it("should reject an update with an invalid humility score", async () => {
    const superhero: Partial<Superhero> = {
      humility: 11,
    };

    const request = new Request(
      "http://localhost:4000/api/superheroes/Captain%20Humble",
      {
        method: "PATCH",
        body: JSON.stringify(superhero),
      }
    );

    const response = await app.fetch(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Invalid superhero data",
    });
  });

  it("should reject an update for a superhero not in the list", async () => {
    const superhero: Partial<Superhero> = {
      superpower: "Super Strength",
    };

    const request = new Request(
      "http://localhost:4000/api/superheroes/Not%20Real",
      {
        method: "PATCH",
        body: JSON.stringify(superhero),
      }
    );

    const response = await app.fetch(request);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Superhero not found",
    });
  });

  it("should delete a superhero", async () => {
    const request = new Request(
      "http://localhost:4000/api/superheroes/Captain%20Humble",
      {
        method: "DELETE",
      }
    );

    const response = await app.fetch(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      name: "Captain Humble",
      superpower: "Super Strength",
      humility: 9,
    });
  });

  it("should reject a delete for a superhero not in the list", async () => {
    const request = new Request(
      "http://localhost:4000/api/superheroes/Not%20Real",
      {
        method: "DELETE",
      }
    );

    const response = await app.fetch(request);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Superhero not found",
    });
  });
});

afterAll(() => server.close());
