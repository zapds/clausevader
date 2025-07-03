

import { getCurrentSession, invalidateSession, deleteSessionTokenCookie } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
	return (
		<form action={logout}>
			<button>Sign out</button>
		</form>
	);
}

async function logout() {
	"use server";
	const { session } = await getCurrentSession();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}
	const cookieStore = await cookies()
	await invalidateSession(session.id);
	await deleteSessionTokenCookie(cookieStore);
	return redirect("/login");
}
