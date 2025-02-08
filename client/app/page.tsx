"use client";

import * as React from "react";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { parseAsBoolean, useQueryState } from "nuqs";

import useWebSocket from "react-use-websocket";
import { ReadyState } from "react-use-websocket";

import { LoaderCircle, Plus, User2Icon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AddHeroModal } from "@/components/add-hero-modal";

interface Superhero {
  name: string;
  superpower: string;
  humilityScore: number;
}

const sortSuperheroes = (a: Superhero, b: Superhero) => b.humilityScore - a.humilityScore;

export default function Page() {
  const [addHeroModalOpen, setAddHeroModalOpen] = useQueryState(
    "add-hero",
    parseAsBoolean.withDefault(false),
  );

  const [superheroes, setSuperheroes] = React.useState<Superhero[]>([]);

  const { readyState, lastJsonMessage } = useWebSocket(
    "ws://localhost:4000/superheroes/ws",
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  React.useEffect(() => {
    switch (lastJsonMessage?.type) {
      case "init":
        setSuperheroes(lastJsonMessage.superheroes.sort(sortSuperheroes));
        break;
      case "create":
        setSuperheroes((superheroes) =>
          [...superheroes, lastJsonMessage.superhero].sort(sortSuperheroes),
        );
        break;
      case "update":
        setSuperheroes((superheroes) =>
          superheroes
            .map((s) =>
              s.name === lastJsonMessage.superhero.name
                ? lastJsonMessage.superhero
                : s,
            )
            .sort(sortSuperheroes),
        );
        break;
      case "remove":
        console.log(lastJsonMessage);
        setSuperheroes((superheroes) =>
          superheroes
            .filter((s) => s.name !== lastJsonMessage.superhero.name)
            .sort(sortSuperheroes),
        );
    }
  }, [lastJsonMessage]);

  return (
    <main className="flex flex-col px-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-medium">Heroes</h1>
          <p className="text-muted-foreground">
            All heroes will be listed here.
          </p>
        </div>
        <Button onClick={() => setAddHeroModalOpen(true)}>
          <Plus /> Add Hero
        </Button>
      </div>
      {readyState !== ReadyState.OPEN ? (
        <div className="flex items-center justify-center py-40">
          <div className="text-muted-foreground inline-flex items-center gap-4">
            <LoaderCircle className="size-6 animate-spin stroke-[1.5px]" />
            <p>Connecting...</p>
          </div>
        </div>
      ) : superheroes.length === 0 ? (
        <div className="flex items-center justify-center py-40">
          <div className="text-muted-foreground flex flex-col items-center gap-4">
            <UsersIcon />
            <p>No heroes found.</p>
          </div>
        </div>
      ) : (
        <div className="border-border mt-10 w-full overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Superpower</TableHead>
                <TableHead>Humility Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {superheroes.map((superhero) => (
                <TableRow key={superhero.name} className="hover:bg-muted/50">
                  <TableCell className="">{superhero.name}</TableCell>
                  <TableCell>{superhero.superpower}</TableCell>
                  <TableCell>{superhero.humilityScore}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddHeroModal
        open={addHeroModalOpen}
        onClose={() => setAddHeroModalOpen(false)}
      />
    </main>
  );
}
