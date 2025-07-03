'use client';

import ChatWidget from "./ChatWidget";

export default function Report({ document }) {
	return (
        <div className="flex h-screen">
            <ChatWidget documentId={document.id} userId={document.user_id} />
        </div>
    )
}
