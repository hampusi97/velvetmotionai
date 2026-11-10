import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LocalImage } from "@/components/local-image";
import { companions, type CompanionId } from "@/data/companions";
import { readStore } from "@/lib/threads";

export const Route = createFileRoute("/")({ component: Salon });

function Salon() {
  const [active, setActive] = useState(0);
  const [openIds, setOpenIds] = useState<Partial<Record<CompanionId, true>>>({});
  const featured = companions[active] ?? companions[0];
  const featuredOpen = openIds[featured.id] === true;

  useEffect(() => {
    const store = readStore();
    const next: Partial<Record<CompanionId, true>> = {};
    for (const companion of companions) {
      const thread = store[companion.id];
      if (thread?.messages.some((message) => message.role === "user")) {
        next[companion.id] = true;
      }
    }
    setOpenIds(next);
  }, []);

  return (
    <main className="device grid grid-rows-[minmax(0,1fr)_auto] bg-bg md:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] md:grid-rows-1 xl:grid-cols-[24rem_minmax(0,1fr)]">
      <section className="relative min-h-0 md:col-start-2 md:row-start-1">
        <LocalImage
          key={featured.id}
          id={featured.id}
          remote={featured.portrait}
          className="plate-in absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-bg/80 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-bg via-bg/75 to-transparent" />
        <div className="px-safe pt-safe absolute inset-x-0 top-0 flex items-center justify-between md:hidden">
          <p className="font-display text-2xl text-fg">Vesper</p>
          <Link to="/studio" className="text-xs tracking-widest text-gold uppercase">
            Studio
          </Link>
        </div>
        <div className="px-safe absolute inset-x-0 bottom-0 pt-24 pb-5">
          <p className="text-xs tracking-widest text-gold uppercase">{featured.craft}</p>
          <h2 className="mt-1 text-4xl text-fg md:text-5xl xl:text-6xl">{featured.name}</h2>
          <p className="mt-2 line-clamp-3 max-w-md text-sm leading-relaxed text-muted">{featured.line}</p>
          <Link
            to="/letters/$id"
            params={{ id: featured.id }}
            aria-label={
              featuredOpen ? `Continue ${featured.given}'s letter` : `Open ${featured.given}'s letter`
            }
            className="tap mt-4 inline-flex h-11 items-center rounded-full bg-rose px-5 text-sm font-medium text-fg outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {featuredOpen ? "Continue the chat" : "Chat with her"}
          </Link>
        </div>
      </section>

      <aside className="z-10 min-h-0 border-t border-line bg-bg md:col-start-1 md:row-start-1 md:flex md:flex-col md:border-t-0 md:border-r md:border-line">
        <div className="px-safe hidden pt-8 md:block xl:pt-10">
          <p className="text-xs tracking-widest text-gold uppercase">After dark</p>
          <h1 className="mt-3 text-5xl leading-none text-fg xl:text-6xl">Vesper</h1>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted xl:text-base">
            A private correspondence. They remember your name, and the last thing you said.
          </p>
          <Link to="/studio" className="mt-4 inline-flex h-11 items-center text-sm text-gold">
            Photo studio
          </Link>
        </div>
        <nav
          aria-label="Correspondents"
          className="max-h-72 min-h-0 overflow-y-auto overscroll-contain pb-safe md:mt-6 md:max-h-none md:flex-1 md:pb-0 xl:mt-8"
        >
          {companions.map((companion, index) => {
            const open = openIds[companion.id] === true;
            const selected = index === active;
            return (
              <Link
                key={companion.id}
                to="/letters/$id"
                params={{ id: companion.id }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(index);
                }}
                onFocus={() => setActive(index)}
                className={`tap px-safe flex min-h-14 items-center gap-4 border-b border-line outline-none focus-visible:bg-surface md:min-h-16 ${selected ? "text-fg" : "text-muted"}`}
              >
                <span className={`w-6 text-xs tabular-nums ${selected ? "text-gold" : "text-muted"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <LocalImage
                  id={companion.id}
                  remote={companion.portrait}
                  className="size-10 shrink-0 rounded-full object-cover object-top"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg leading-tight md:text-xl">{companion.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {companion.city}
                    {open ? " · in progress" : ""}
                  </span>
                </span>
                <span className="hidden text-xs tracking-widest text-gold uppercase lg:block">
                  {companion.craft}
                </span>
              </Link>
            );
          })}
        </nav>
        <p className="px-safe hidden py-5 text-xs leading-relaxed text-muted md:block">
          Fictional adults. Warm company — affectionate, never explicit. Letters, her voice, and her
          pictures stay on this device.
        </p>
      </aside>
    </main>
  );
}
