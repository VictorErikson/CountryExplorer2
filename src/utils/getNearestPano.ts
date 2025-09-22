export async function getNearestPano(lat: number, lng: number, key: string) {
  const url = new URL("https://maps.googleapis.com/maps/api/streetview/metadata");
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", "50000");    // up to 50,000
  url.searchParams.set("source", "outdoor");
  url.searchParams.set("key", key);

  const meta = await fetch(url.toString()).then(r => r.json());
  return meta.status === "OK" ? meta : null;  // meta has pano_id, location, etc.
}