import { routes } from "@/constants/route";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect(routes.pages.taskList);
}
