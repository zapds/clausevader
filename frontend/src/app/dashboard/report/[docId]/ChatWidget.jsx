'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ChatWidget({ documentId, userId }) {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Auto scroll to bottom on new message
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = async () => {
		if (!input.trim()) return;
		const userMessage = input.trim();
		setInput('');
		setIsLoading(true);

		// Add user message to history
		setMessages(prev => [...prev, { from: 'user', text: userMessage }]);

		let fullReply = '';
		const evtSource = new EventSource(`http://localhost:8000/api/chat/stream?document_id=${documentId}&message=${encodeURIComponent(userMessage)}&user_id=${userId}`);

		evtSource.onmessage = (event) => {
			if (event.data.startsWith('[Error]')) {
				setMessages(prev => [...prev, { from: 'ai', text: event.data }]);
				evtSource.close();
				setIsLoading(false);
				return;
			}

			fullReply += event.data;
			setMessages(prev => {
				// Append or update last AI message
				const last = prev[prev.length - 1];
				if (last && last.from === 'ai_streaming') {
					return [...prev.slice(0, -1), { from: 'ai_streaming', text: fullReply }];
				} else {
					return [...prev, { from: 'ai_streaming', text: fullReply }];
				}
			});
		};

		evtSource.onerror = () => {
			evtSource.close();
			setIsLoading(false);
		};

		evtSource.addEventListener("end", () => {
			setMessages(prev => {
				// finalize AI message
				return prev.map(m => m.from === 'ai_streaming' ? { from: 'ai', text: m.text } : m);
			});
			setIsLoading(false);
		});
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen ? (
				<div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col border border-gray-200">
					<div className="p-3 bg-gray-800 text-white flex justify-between items-center rounded-t-lg">
						<span>Chat Assistant</span>
						<button onClick={() => setIsOpen(false)} className="text-white font-bold">&times;</button>
					</div>

					<div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
						{messages.map((msg, idx) => (
							<div
								key={idx}
								className={`whitespace-pre-wrap px-3 py-2 rounded-md max-w-full ${
									msg.from === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start'
								}`}
							>
								{msg.text}
							</div>
						))}
						<div ref={messagesEndRef}></div>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							sendMessage();
						}}
						className="flex border-t border-gray-300 p-2"
					>
						<input
							className="flex-1 text-sm px-2 py-1 border rounded mr-2"
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask a question..."
							disabled={isLoading}
						/>
						<button
							className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
							type="submit"
							disabled={isLoading}
						>
							Send
						</button>
					</form>
				</div>
			) : (
				<Button
                    variant="primary"
					onClick={() => setIsOpen(true)}
					className="px-4 py-2 rounded-full shadow-lg"
				>
					Open Chat
				</Button>
			)}
		</div>
	);
}
