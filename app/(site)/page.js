import { getPosters } from "@/lib/posters";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const initialPosters = await getPosters();
  return <HomeClient initialPosters={initialPosters} />;
}
