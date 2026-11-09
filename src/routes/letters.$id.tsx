import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bookmark, SendHorizontal, Volume2 } from "lucide-react";
import { LocalImage } from "@/components/local-image";
import { getCompanion, type Companion } from "@/data/companions";
import {
  clearThread,
  makeId,
  readThread,
  writeThread,
  type ChatMessage,
  type ThreadState,
} from "@/lib/threads";
import { speakLine, writeBack } from "@/lib/vesper.functions";
import { blobFromBase64, deleteMediaPrefix, readMedia, voiceKey, writeMedia } from "@/lib/local-media";

export const Route = createFileRoute("/letters/$id")({
  component: LetterPage,
});

function LetterPage() {
  const { id } = Route.useParams();
  const companion = getCompanion(id);
  if (!companion) return <Missing />;
  return <Letter companion={companion} />;
}

function Missing() {
  return (
    <main className="device flex flex-col justify-center px-safe">
      <h1 className="text-4xl text-fg">No one by that name</h1>
      <Link to="/" className="mt-6 text-sm font-medium text-rose">
        Back to the salon
      </Link>
    </main>
  );
}

function clock(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Letter({ companion }: { companion: Companion }) {
  const [ready, setReady] = useState(false);
  const [thread, setThread] = useState<ThreadState | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = useRef<string | null>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const inflight = useRef(false);
  const threadRef = useRef<ThreadState | null>(null);
  threadRef.current = thread;

  useEffect(() => {
    const existing = readThread(companion.id);
    if (existing && existing.messages.length > 0) {
      setThread(existing);
    } else {
      const fresh: ThreadState = {
        userName: existing?.userName ?? "",
        note: existing?.note ?? "",
        facts: existing?.facts ?? [],
        startedAt: existing?.startedAt ?? Date.now(),
        messages: [
          {
            id: makeId(),
            role: "assistant",
            content: companion.opener,
            at: Date.now(),
          },
        ],
      };
      writeThread(companion.id, fresh);
      setThread(fresh);
    }
    setReady(true);
    setError("");
    setDraft("");
  }, [companion.id, companion.opener]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread?.messages.length, pending, ready, error]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    };
  }, []);

  function persist(next: ThreadState) {
    threadRef.current = next;
    setThread(next);
    writeThread(companion.id, next);
  }

  function growField(node: HTMLTextAreaElement) {
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 128)}px`;
  }

  function mergeFact(facts: string[], fact: string) {
    const next = fact.trim().slice(0, 90);
    if (next.length < 3) return facts;
    if (facts.some((item) => item.toLowerCase() === next.toLowerCase())) return facts;
    return [...facts, next].slice(-8);
  }

  function closenessLine(current: ThreadState) {
    const count = current.messages.filter((message) => message.role === "user").length;
    if (count >= 12) return "A real correspondence. Be familiar and specific. Still never explicit.";
    if (count >= 4) return "Past introductions. Be warm and particular.";
    return "Still early. Be curious, not intense.";
  }

  function bondLabel(current: ThreadState | null) {
    const count = current?.messages.filter((message) => message.role === "user").length ?? 0;
    if (count >= 12) return "she keeps you";
    if (count >= 4) return "in correspondence";
    if (count >= 1) return "warming";
    return "just met";
  }

  async function complete(userMessage: ChatMessage, base: ThreadState, quiet = false) {
    const history = base.messages
      .filter((message) => message.id !== userMessage.id)
      .slice(-12)
      .map((message) => ({ role: message.role, content: message.content }));
    const result = await writeBack({
      data: {
        companionId: companion.id,
        message: userMessage.content,
        userName: base.userName,
        note: base.note,
        facts: base.facts ?? [],
        closeness: closenessLine(base),
        history,
      },
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const reply: ChatMessage = {
      id: makeId(),
      role: "assistant",
      content: result.text,
      at: Date.now(),
    };
    const latest = threadRef.current ?? base;
    const messages = quiet
      ? latest.messages
      : latest.messages.some((message) => message.id === userMessage.id)
        ? latest.messages
        : [...latest.messages, userMessage];
    persist({
      ...latest,
      facts: mergeFact(latest.facts ?? [], result.fact),
      messages: messages.some((message) => message.id === reply.id) ? messages : [...messages, reply],
    });
  }

  async function send(text: string) {
    const message = text.trim();
    const current = threadRef.current;
    if (!message || pending || inflight.current || !current) return;
    inflight.current = true;
    setError("");
    setDraft("");
    if (fieldRef.current) fieldRef.current.style.height = "auto";
    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: message.slice(0, 600),
      at: Date.now(),
    };
    const optimistic: ThreadState = {
      ...current,
      messages: [...current.messages, userMessage],
    };
    persist(optimistic);
    setPending(true);
    try {
      await complete(userMessage, optimistic);
    } catch {
      setError("The letter didn’t go through. Try once more.");
    } finally {
      inflight.current = false;
      setPending(false);
    }
  }

  async function sheWrites() {
    const current = threadRef.current;
    if (!current || pending || inflight.current) return;
    inflight.current = true;
    setError("");
    setPending(true);
    const nudge: ChatMessage = {
      id: "nudge",
      role: "user",
      content:
        "Write me a short letter first, about where you are right now. If you remember something true about me, use it once. Do not say that I asked.",
      at: Date.now(),
    };
    try {
      await complete(nudge, current, true);
    } catch {
      setError("The letter didn’t go through. Try once more.");
    } finally {
      inflight.current = false;
      setPending(false);
    }
  }

  async function retry() {
    const current = threadRef.current;
    const last = current?.messages[current.messages.length - 1];
    if (!current || !last || last.role !== "user" || inflight.current) return;
    inflight.current = true;
    setError("");
    setPending(true);
    try {
      await complete(last, current);
    } catch {
      setError("The letter didn’t go through. Try once more.");
    } finally {
      inflight.current = false;
      setPending(false);
    }
  }

  function playBlob(blob: Blob, messageId: string) {
    if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    const url = URL.createObjectURL(blob);
    audioUrl.current = url;
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setSpeakingId((id) => (id === messageId ? null : id));
    audio.onerror = () => {
      setSpeakingId((id) => (id === messageId ? null : id));
      setError("Her voice didn’t carry. Try again.");
    };
    return audio.play();
  }

  async function hear(message: ChatMessage) {
    if (speakingId) return;
    setSpeakingId(message.id);
    setError("");
    const key = voiceKey(companion.id, message.content);
    try {
      const saved = await readMedia(key);
      if (saved) {
        await playBlob(saved.blob, message.id);
        return;
      }
      const result = await speakLine({
        data: { companionId: companion.id, text: message.content },
      });
      if (!result.ok) {
        setSpeakingId(null);
        setError(result.error);
        return;
      }
      const blob = blobFromBase64(result.audio, result.mime);
      try {
        await writeMedia(key, blob, result.mime);
      } catch {
        /* still play if the device refuses the extra file */
      }
      await playBlob(blob, message.id);
    } catch {
      setSpeakingId(null);
      setError("Her voice didn’t carry. Try again.");
    }
  }

  const kept = Boolean(thread?.userName || thread?.note || (thread?.facts.length ?? 0) > 0);
  const last = thread?.messages[thread.messages.length - 1];
  const canRetry = Boolean(error && last?.role === "user" && !pending);

  return (
    <div className="device flex md:grid md:grid-cols-[minmax(15rem,30vw)_minmax(0,1fr)] xl:grid-cols-[minmax(18rem,34vw)_minmax(0,1fr)]">
      <aside className="relative hidden h-full min-h-0 md:block">
        <LocalImage
          id={companion.id}
          remote={companion.portrait}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent p-5 pt-24">
          <p className="text-xs tracking-widest text-gold uppercase">{companion.craft}</p>
          <p className="mt-2 font-display text-3xl text-fg">{companion.name}</p>
          <p className="mt-1 text-sm text-muted">
            {companion.city} · {companion.age}
          </p>
        </div>
      </aside>

      <section className="flex h-full min-h-0 flex-col">
        <header className="px-safe pt-safe flex items-center gap-3 border-b border-line pb-2">
          <Link
            to="/"
            aria-label="Back to the salon"
            className="grid size-11 place-items-center rounded-full text-fg tap hover:bg-surface-2"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <LocalImage
            id={companion.id}
            remote={companion.portrait}
            className="size-11 rounded-full object-cover object-top md:hidden"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg leading-tight text-fg">{companion.given}</p>
            <p className="truncate text-xs text-muted">
              {companion.city} · {bondLabel(thread)}
              {thread?.userName ? ` · ${thread.userName}` : ""}
            </p>
          </div>
          <Link
            to="/studio"
            className="tap inline-flex h-11 items-center px-2 text-xs font-medium text-gold"
          >
            Studio
          </Link>
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className={`tap grid size-11 place-items-center rounded-full hover:bg-surface-2 ${kept ? "text-gold" : "text-muted"}`}
            aria-label="What she keeps"
          >
            <Bookmark className="size-5" />
          </button>
        </header>

        <div ref={scroller} className="mx-auto min-h-0 w-full max-w-2xl flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 md:px-6 xl:max-w-3xl xl:py-8">
          {!ready || !thread ? (
            <div className="mr-12 max-w-sm rounded-2xl rounded-bl-md bg-surface-2 px-4 py-4">
              <div className="h-3 w-16 rounded-full bg-line" />
              <div className="mt-3 h-3 w-full rounded-full bg-line" />
              <div className="mt-2 h-3 w-4/5 rounded-full bg-line" />
            </div>
          ) : (
            thread.messages.map((message) => (
              <article
                key={message.id}
                className={`letter-in ${message.role === "user" ? "ml-8 flex justify-end" : "mr-4 flex justify-start sm:mr-10"}`}
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-xl rounded-2xl rounded-br-md bg-rose px-4 py-3 text-fg"
                      : "max-w-xl border-l border-gold px-4 py-1 text-fg"
                  }
                >
                  {message.role === "assistant" ? (
                    <p className="mb-1 text-xs tracking-wide text-gold">{companion.given}</p>
                  ) : null}
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p
                      className={`text-xs tabular-nums ${message.role === "user" ? "text-fg/80" : "text-muted"}`}
                    >
                      {clock(message.at)}
                    </p>
                    {message.role === "assistant" ? (
                      <button
                        type="button"
                        onClick={() => hear(message)}
                        disabled={speakingId !== null}
                        className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-gold disabled:opacity-50"
                      >
                        <Volume2 className="size-3.5" />
                        {speakingId === message.id ? "Speaking…" : "Hear her"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))
          )}
          {pending ? (
            <div className="mr-6 flex justify-start">
              <p className="letter-in inline-flex items-center gap-2 px-1 py-3 text-sm text-muted">
                <span className="inline-flex gap-1" aria-hidden="true">
                  <span className="vesper-dot size-1.5 rounded-full bg-gold" />
                  <span className="vesper-dot size-1.5 rounded-full bg-gold" />
                  <span className="vesper-dot size-1.5 rounded-full bg-gold" />
                </span>
                {companion.given} is writing
              </p>
            </div>
          ) : null}
          {error ? (
            <div className="flex items-center justify-between gap-3" role="alert">
              <p className="text-sm text-rose">{error}</p>
              {canRetry ? (
                <button type="button" onClick={() => void retry()} className="min-h-11 shrink-0 text-sm font-medium text-gold">
                  Try again
                </button>
              ) : null}
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        {ready && thread && thread.messages.length < 3 ? (
          <div className="mx-auto flex w-full max-w-2xl flex-wrap gap-2 px-4 pb-2 xl:max-w-3xl">
            {companion.prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={pending}
                onClick={() => void send(prompt)}
                className="min-h-11 rounded-full border border-line bg-surface px-4 text-left text-xs text-fg tap hover:border-gold disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : null}

        {ready && thread ? (
          <div className="mx-auto flex w-full max-w-2xl justify-end px-4 pb-1 xl:max-w-3xl">
            <button
              type="button"
              disabled={pending}
              onClick={() => void sheWrites()}
              className="min-h-11 text-xs font-medium text-gold disabled:opacity-50"
            >
              Let her write first
            </button>
          </div>
        ) : null}

        <form
          className="pb-safe px-safe pt-2"
          onSubmit={(event) => {
            event.preventDefault();
            void send(draft);
          }}
        >
          <div className="mx-auto flex w-full max-w-2xl items-end gap-2 rounded-3xl border border-line bg-surface p-2 xl:max-w-3xl">
            <label className="sr-only" htmlFor="letter">
              Your letter
            </label>
            <textarea
              id="letter"
              ref={fieldRef}
              value={draft}
              rows={1}
              maxLength={600}
              enterKeyHint="send"
              placeholder={`Write to ${companion.given}`}
              onChange={(event) => {
                setDraft(event.target.value);
                growField(event.target);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
              className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-base text-fg outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={pending || !draft.trim()}
              aria-label="Send"
              className="tap grid size-11 shrink-0 place-items-center rounded-full bg-rose text-fg disabled:opacity-40"
            >
              <SendHorizontal className="size-5" />
            </button>
          </div>
        </form>
      </section>

      {notesOpen && thread ? (
        <Notes
          companionName={companion.given}
          userName={thread.userName}
          note={thread.note}
          facts={thread.facts ?? []}
          onClose={() => setNotesOpen(false)}
          onSave={(userName, note, facts) => {
            persist({ ...thread, userName, note, facts });
            setNotesOpen(false);
          }}
          onForget={() => {
            audioRef.current?.pause();
            setSpeakingId(null);
            clearThread(companion.id);
            void deleteMediaPrefix(`voice:${companion.id}:`);
            const fresh: ThreadState = {
              userName: "",
              note: "",
              facts: [],
              startedAt: Date.now(),
              messages: [
                {
                  id: makeId(),
                  role: "assistant",
                  content: companion.opener,
                  at: Date.now(),
                },
              ],
            };
            persist(fresh);
            setNotesOpen(false);
            setError("");
            setDraft("");
          }}
        />
      ) : null}
    </div>
  );
}

function Notes({
  companionName,
  userName,
  note,
  facts,
  onClose,
  onSave,
  onForget,
}: {
  companionName: string;
  userName: string;
  note: string;
  facts: string[];
  onClose: () => void;
  onSave: (userName: string, note: string, facts: string[]) => void;
  onForget: () => void;
}) {
  const [name, setName] = useState(userName);
  const [kept, setKept] = useState(note);
  const [keptFacts, setKeptFacts] = useState(facts);
  const [adding, setAdding] = useState("");
  const [sure, setSure] = useState(false);

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-bg/70 sm:items-center">
      <button type="button" className="absolute inset-0" aria-label="Close notes" onClick={onClose} />
      <div className="relative z-10 max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-card border border-line bg-surface p-5 pb-safe sm:rounded-card">
        <p className="text-xs tracking-widest text-gold uppercase">What she keeps</p>
        <h2 className="mt-2 text-3xl text-fg">{companionName}’s margin</h2>
        <label className="mt-5 block text-sm text-muted" htmlFor="your-name">
          Your name
        </label>
        <input
          id="your-name"
          value={name}
          maxLength={40}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none focus:border-gold"
          placeholder="What should she call you?"
        />
        <label className="mt-4 block text-sm text-muted" htmlFor="kept-note">
          A note to remember
        </label>
        <textarea
          id="kept-note"
          value={kept}
          maxLength={280}
          rows={3}
          onChange={(event) => setKept(event.target.value)}
          className="mt-2 w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 text-base text-fg outline-none focus:border-gold"
          placeholder="Your city, the dog’s name, how you take coffee."
        />
        <p className="mt-4 text-sm text-muted">Facts she kept</p>
        {keptFacts.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Nothing yet. Tell her something true, or add it here.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {keptFacts.map((fact) => (
              <li key={fact} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 text-sm text-fg">{fact}</span>
                <button
                  type="button"
                  className="min-h-11 shrink-0 text-xs text-muted"
                  onClick={() => setKeptFacts((current) => current.filter((item) => item !== fact))}
                >
                  Drop
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex gap-2">
          <input
            value={adding}
            maxLength={90}
            onChange={(event) => setAdding(event.target.value)}
            placeholder="Add a fact"
            className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none focus:border-gold"
          />
          <button
            type="button"
            className="h-11 rounded-full border border-line px-4 text-sm text-fg"
            onClick={() => {
              const next = adding.trim().slice(0, 90);
              if (next.length < 3 || keptFacts.some((item) => item.toLowerCase() === next.toLowerCase())) return;
              setKeptFacts((current) => [...current, next].slice(-8));
              setAdding("");
            }}
          >
            Add
          </button>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (sure) onForget();
              else setSure(true);
            }}
            className="min-h-11 text-sm text-muted hover:text-rose"
          >
            {sure ? "Yes, forget it" : "Forget this letter"}
          </button>
          <button
            type="button"
            onClick={() => onSave(name.trim().slice(0, 40), kept.trim().slice(0, 280), keptFacts)}
            className="tap h-11 rounded-full bg-rose px-5 text-sm font-medium text-fg"
          >
            Keep it
          </button>
        </div>
      </div>
    </div>
  );
}
