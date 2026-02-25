import { getPosters } from "@/lib/posters";

export async function GET() {
  const posters = await getPosters();
  return Response.json({ posters });
}
