import { useEffect, useState } from "react";
import { localPicture } from "@/lib/local-media";

export function LocalImage({
  id,
  remote,
  className,
  alt = "",
}: {
  id: string;
  remote: string;
  className?: string;
  alt?: string;
}) {
  const [src, setSrc] = useState(remote);

  useEffect(() => {
    let gone = false;
    localPicture(id, remote).then((url) => {
      if (!gone) setSrc(url);
    });
    return () => {
      gone = true;
    };
  }, [id, remote]);

  return <img src={src} alt={alt} className={className} />;
}
