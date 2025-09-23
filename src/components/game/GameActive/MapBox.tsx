// MapBox.tsx
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type MapBoxProps = {
  panoId: string; // required
  heading?: number; // 0–360 (default 0)
  pitch?: number; // -90–90 (default 0)
  zoom?: number; // Street View zoom (default 1)
  height?: number | string; // container height (default 360)
  className?: string; // optional styling hook
};

export default function MapBox({
  panoId,
  heading = 0,
  pitch = 0,
  zoom = 1,
  height = 360,
  className,
}: MapBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const loaderRef = useRef<Loader | null>(null);

  useEffect(() => {
    // init loader once
    if (!loaderRef.current) {
      loaderRef.current = new Loader({
        apiKey: import.meta.env.VITE_GMAPS_KEY!,
        version: "weekly",
      });
    }

    let cancelled = false;

    loaderRef.current.load().then(() => {
      if (cancelled || !containerRef.current) return;

      // create panorama once
      if (!panoRef.current) {
        panoRef.current = new google.maps.StreetViewPanorama(
          containerRef.current,
          {
            addressControl: false,
            showRoadLabels: false,
            fullscreenControl: false,
            linksControl: true,
            motionTracking: false,
            motionTrackingControl: false,
            pov: { heading, pitch },
            zoom,
          }
        );
      }

      // apply current props
      const pano = panoRef.current!;
      if (pano.getPano() !== panoId) pano.setPano(panoId);
      pano.setPov({ heading, pitch });
      pano.setZoom(zoom);
    });

    return () => {
      cancelled = true;
    };
  }, [panoId, heading, pitch, zoom]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: 640, height: 360, borderRadius: 12, overflow: "hidden" }}
    />
  );
}
