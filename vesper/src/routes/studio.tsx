import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, RotateCw, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { listMedia, writeMedia } from "@/lib/local-media";

export const Route = createFileRoute("/studio")({ component: Studio });

const looks = [
  { id: "original", label: "True", css: "" },
  { id: "warm", label: "Warm", css: "sepia(0.28) saturate(1.12)" },
  { id: "cool", label: "Cool", css: "saturate(0.8) hue-rotate(14deg)" },
  { id: "noir", label: "Noir", css: "grayscale(1) contrast(1.12)" },
  { id: "soft", label: "Soft", css: "contrast(0.92) saturate(0.88) brightness(1.06)" },
  { id: "fade", label: "Fade", css: "contrast(0.82) saturate(0.72) brightness(1.08)" },
] as const;

type LookId = (typeof looks)[number]["id"];

function paint(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  look: string,
  brightness: number,
  contrast: number,
  saturation: number,
  rotation: number,
) {
  const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.round(image.naturalWidth * scale);
  const height = Math.round(image.naturalHeight * scale);
  const swapped = rotation % 180 !== 0;
  canvas.width = swapped ? height : width;
  canvas.height = swapped ? width : height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${look}`.trim();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
}

function Studio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [look, setLook] = useState<LookId>("original");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState<{ key: string; url: string }[]>([]);

  function redraw(
    next: Partial<{
      look: LookId;
      brightness: number;
      contrast: number;
      saturation: number;
      rotation: number;
    }> = {},
  ) {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;
    const chosen = looks.find((item) => item.id === (next.look ?? look)) ?? looks[0];
    paint(
      image,
      canvas,
      chosen.css,
      next.brightness ?? brightness,
      next.contrast ?? contrast,
      next.saturation ?? saturation,
      next.rotation ?? rotation,
    );
  }

  useEffect(() => {
    let gone = false;
    void listMedia("edit:").then((rows) => {
      if (gone) return;
      setSaved(
        rows.slice(0, 12).map((row) => ({
          key: row.key,
          url: URL.createObjectURL(row.blob),
        })),
      );
    });
    return () => {
      gone = true;
    };
  }, []);

  function openFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setNote("Choose a photo.");
      return;
    }
    if (file.size > 12_000_000) {
      setNote("That file is too large. Try one under 12 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      imageRef.current = image;
      setReady(true);
      setNote("");
      setLook("original");
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setRotation(0);
      const canvas = canvasRef.current;
      if (!canvas) return;
      paint(image, canvas, "", 100, 100, 100, 0);
    };
    image.src = url;
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.download = "vesper-edit.jpg";
    link.click();
  }

  async function keep() {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) return;
    const key = `edit:${Date.now()}`;
    await writeMedia(key, blob, "image/jpeg");
    setSaved((current) => [{ key, url: URL.createObjectURL(blob) }, ...current].slice(0, 12));
    setNote("Saved on this device.");
  }

  return (
    <main className="device flex flex-col bg-bg">
      <header className="px-safe pt-safe flex items-center gap-3 border-b border-line pb-3">
        <Link
          to="/"
          aria-label="Back to the salon"
          className="grid size-11 place-items-center rounded-full text-fg tap hover:bg-surface-2"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl leading-none text-fg">Studio</p>
          <p className="mt-1 text-xs text-muted">Edits stay on this device. Nothing is uploaded.</p>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-6">
        <div className="relative grid min-h-64 flex-1 place-items-center overflow-hidden rounded-card border border-line bg-surface">
          <canvas ref={canvasRef} className={ready ? "max-h-[52dvh] max-w-full" : "hidden"} />
          {!ready ? (
            <div className="px-6 text-center">
              <p className="font-display text-3xl text-fg">A photo, quietly.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Warm it, cool it, turn it. The original never leaves the phone.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="tap h-11 rounded-full bg-rose px-5 text-sm font-medium text-fg"
          >
            {ready ? "Choose another" : "Choose a photo"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => openFile(event.target.files?.[0])}
          />
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              const next = (rotation + 90) % 360;
              setRotation(next);
              redraw({ rotation: next });
            }}
            className="tap grid size-11 place-items-center rounded-full border border-line text-fg disabled:opacity-40"
            aria-label="Rotate"
          >
            <RotateCw className="size-5" />
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() => void keep()}
            className="tap grid size-11 place-items-center rounded-full border border-line text-fg disabled:opacity-40"
            aria-label="Save on this device"
          >
            <Save className="size-5" />
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={download}
            className="tap grid size-11 place-items-center rounded-full border border-line text-fg disabled:opacity-40"
            aria-label="Download"
          >
            <Download className="size-5" />
          </button>
          {note ? <p className="text-sm text-gold">{note}</p> : null}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {looks.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!ready}
              onClick={() => {
                setLook(item.id);
                redraw({ look: item.id });
              }}
              className={`tap h-11 shrink-0 rounded-full border px-4 text-sm disabled:opacity-40 ${
                look === item.id ? "border-gold text-gold" : "border-line text-fg"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Slider
            label="Light"
            value={brightness}
            disabled={!ready}
            onChange={(value) => {
              setBrightness(value);
              redraw({ brightness: value });
            }}
          />
          <Slider
            label="Contrast"
            value={contrast}
            disabled={!ready}
            onChange={(value) => {
              setContrast(value);
              redraw({ contrast: value });
            }}
          />
          <Slider
            label="Color"
            value={saturation}
            disabled={!ready}
            onChange={(value) => {
              setSaturation(value);
              redraw({ saturation: value });
            }}
          />
        </div>

        {saved.length > 0 ? (
          <div>
            <p className="text-xs tracking-widest text-gold uppercase">Kept here</p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              {saved.map((item) => (
                <img
                  key={item.key}
                  src={item.url}
                  alt=""
                  className="h-24 w-16 shrink-0 rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Slider({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <input
        type="range"
        min={60}
        max={140}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-11 w-full accent-rose"
      />
    </label>
  );
}
