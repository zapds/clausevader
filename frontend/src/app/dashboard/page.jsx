import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/session";
import { UploadForm } from "./UploadForm";


export default async function Page() {
	const { user } = await getCurrentSession();
	if (user === null) {
		return redirect("/login");
	}

	return <UploadForm userId={user.id} />;
}
