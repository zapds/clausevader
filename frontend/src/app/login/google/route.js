import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";
import { google } from "@/lib/server/oauth";

export async function GET() {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);

	const cookieStore = await cookies();
	cookieStore.set("google_oauth_state", state, {
		path: "/",
		// httpOnly: true,
		// secure: process.env.NODE_ENV === "production",
		// maxAge: 60 * 10, // 10 minutes
		// sameSite: "lax"
	});
	cookieStore.set("google_code_verifier", codeVerifier, {
		path: "/",
		// httpOnly: true,
		// secure: process.env.NODE_ENV === "production",
		// maxAge: 60 * 10, // 10 minutes
		// sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
