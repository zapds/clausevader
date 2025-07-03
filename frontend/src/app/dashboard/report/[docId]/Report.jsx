'use client';

import ChatWidget from "./ChatWidget";

export default function Report({ document, user }) {
	return (
        <div className="flex h-screen">
            <ChatWidget user={user} documentId={document.id} userId={document.user_id} />
        </div>
    )
}
