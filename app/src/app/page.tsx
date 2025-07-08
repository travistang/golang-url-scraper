import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function Home() {
  redirect(routes.pages.taskList);
}
