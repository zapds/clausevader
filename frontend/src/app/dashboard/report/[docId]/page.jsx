import { fetch, fetchOne } from "@/lib/server/db";
import Report from "./Report";
import ChatWidget from "./ChatWidget";
import Score from "./Score";

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

	const clausesData = await fetch(
		`SELECT * FROM clauses WHERE document_id = $1`,
		[docId]
	)

	console.log(clausesData)

	return (
		<div className="flex flex-col md:flex-row w-screen">
		{/* Left section */}
		<div className="flex-1 h-screen overflow-auto">
			<Report clausesData={clausesData} />
		</div>

		{/* Right sidebar: Score + ChatWidget */}
		<div className="md:w-[400px] overflow-y-clip flex flex-col ml-auto h-screen">
			<div className="p-4">
			<Score favourability_score={document.favourability_score} />
			</div>

			{/* ChatWidget fills remaining height */}
			<div className="flex-1 overflow-hidden">
			<div className="h-full overflow-y-auto p-4">
				<ChatWidget
				className=""
				documentId={docId}
				userId={user.id}
				user={user}
				history={historyMessages}
				/>
			</div>
			</div>
		</div>
		</div>


	);
}
