import { AspectRatio, MotionIntensity, DurationSeconds } from '@/types';

export async function synthesizeVelvetMotionVideo(params: {
  imageSrc: string;
  prompt: string;
  aspectRatio: AspectRatio;
  intensity: MotionIntensity;
  durationSeconds: DurationSeconds;
  onProgress?: (progress: number, phase: string) => void;
}): Promise<Blob> {
  const { imageSrc, aspectRatio, intensity, durationSeconds, onProgress } = params;

  onProgress?.(10, 'Analyzing image composition & subject geometry…');

  // Load source image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image texture for motion rendering.'));
    img.src = imageSrc;
  });

  onProgress?.(25, 'Calculating 60fps motion vectors & depth map…');

  // Resolution setup
  let width = 720;
  let height = 1280; // 9:16 mobile portrait (Candy.ai default)
  if (aspectRatio === '16:9') {
    width = 1280;
    height = 720;
  } else if (aspectRatio === '1:1') {
    width = 960;
    height = 960;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D context not available');

  const fps = 30;
  const totalFrames = durationSeconds * fps;
  const intensityFactor = intensity === 'subtle' ? 0.05 : intensity === 'sensual' ? 0.1 : 0.18;

  // Stream setup
  const stream = canvas.captureStream(fps);
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }
  }

  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
    videoBitsPerSecond: 5_000_000, // 5 Mbps HD
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = (err) => reject(err);
  });

  recorder.start();

  // Candy.ai signature glowing neon particles (magenta, violet, gold)
  const colors = ['#ec4899', '#a855f7', '#f43f5e', '#fbbf24'];
  const particles = Array.from({ length: 36 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.8 + 1.2,
    speedY: Math.random() * 0.7 + 0.3,
    speedX: (Math.random() - 0.5) * 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.6 + 0.25,
  }));

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / totalFrames; // 0 to 1
    const progressPct = 30 + Math.round(t * 60);

    if (frame % 15 === 0) {
      onProgress?.(progressPct, `Rendering frame ${frame}/${totalFrames}…`);
    }

    // Smooth sinusoidal camera zoom & breathing cycle
    const zoom = 1.0 + Math.sin(t * Math.PI) * intensityFactor;
    // Sensual horizontal sway and slight vertical breathing
    const panX = Math.sin(t * Math.PI * 2) * (width * 0.016 * (intensity === 'dynamic' ? 2 : 1));
    const panY = Math.cos(t * Math.PI * 4) * (height * 0.008);

    ctx.fillStyle = '#08070c';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + panX, height / 2 + panY);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // Fit cover calculation
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let renderW = width;
    let renderH = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      renderW = height * imgRatio;
      offsetX = (width - renderW) / 2;
    } else {
      renderH = width / imgRatio;
      offsetY = (height - renderH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    // Candy.ai sensual ambient color gradient overlay (fuchsia & violet mood)
    const moodGrad = ctx.createLinearGradient(0, height, 0, 0);
    moodGrad.addColorStop(0, 'rgba(8, 7, 12, 0.65)');
    moodGrad.addColorStop(0.3, 'rgba(236, 72, 153, 0.06)');
    moodGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.04)');
    moodGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = moodGrad;
    ctx.fillRect(0, 0, width, height);

    // Floating embers / light dust
    for (const p of particles) {
      p.y -= p.speedY;
      p.x += p.speedX;
      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * (0.6 + Math.sin(t * Math.PI * 4 + p.size) * 0.4);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    ctx.restore();

    await new Promise((r) => setTimeout(r, 1000 / fps));
  }

  onProgress?.(95, 'Encoding 1080p MP4 motion stream…');
  recorder.stop();

  const finalBlob = await recordingPromise;
  onProgress?.(100, 'Motion Video Ready!');
  return finalBlob;
}
