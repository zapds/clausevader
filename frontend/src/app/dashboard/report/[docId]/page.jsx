import { fetch, fetchOne } from "@/lib/server/db";
import Report from "./Report";
import ChatWidget from "./ChatWidget"; // update the path as needed
import { getCurrentSession } from "@/lib/server/session";

export default async function Page({ params }) {
	const { docId } = await params;
	const { user } = await getCurrentSession();

	const document = await fetchOne(
		`SELECT * FROM documents WHERE id = $1`,
		[docId]
	);

	if (!document) {
		return <div>Document not found</div>;
	}

	const chatHistory = await fetch(
		`
		SELECT user_message, ai_response 
		FROM chats 
		WHERE document_id = $1 AND user_id = $2
		ORDER BY created_at ASC
		`,
		[docId, user.id]
	);

	const historyMessages = chatHistory.flatMap(chat => [
		{ from: 'user', text: chat.user_message },
		{ from: 'ai', text: chat.ai_response }
	]);

	return (
		<>
			<Report document={document} user={user} />
			<ChatWidget documentId={docId} userId={user.id} user={user} history={historyMessages} />
		</>
	);
}
