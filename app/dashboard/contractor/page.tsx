import { redirect } from "next/navigation";

// This route has been consolidated into the redesigned dashboard.
export default function ContractorDashboardRedirect() {
  redirect("/contractor");
}
