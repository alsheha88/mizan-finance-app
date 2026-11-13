import { Button } from "@/components/primitives/Button";
import { Card } from "@/components/primitives/Card";
import PageHeader from "@/components/primitives/PageHeader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
	useGetConversation,
	useListConversations,
	useSendMessage,
} from "@/hooks/assistant";
import { cn } from "@/lib/cn";
import { getDateGroup } from "@/lib/helpers";
import { MessageCircle, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { NavLink, useNavigate, useParams } from "react-router-dom";

function Assistant() {
	const formRef = useRef<HTMLFormElement>(null);
	const endRef = useRef<HTMLDivElement>(null);
	const [input, setInput] = useState("");
	const [pendingMessage, setPendingMessage] = useState<string | null>(null);
	const navigate = useNavigate();
	const { conversationId } = useParams();

	const { mutate, isPending: isSending } = useSendMessage();
	const { data: conversation, isPending: isLoadingConversation } =
		useGetConversation(conversationId);
	const {
		data: conversationList,
		isPending: isLoadingList,
		isError: isListError,
	} = useListConversations();

	// Scroll to the newest message whenever one is added or the pending bubble changes
	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [pendingMessage, conversation?.messages.length]);

	const groupedConversations = Object.entries(
		Object.groupBy(conversationList ?? [], (item) =>
			getDateGroup(item.updatedAt),
		),
	);

	const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = input.trim();
		if (!text || isSending) return;

		setPendingMessage(text);
		setInput("");

		mutate(
			{ message: text, conversationId },
			{
				onSuccess: (data) => {
					if (!conversationId) navigate(`/assistant/${data.conversationId}`);
					setPendingMessage(null);
				},
				onError: () => {
					setInput(text);
					setPendingMessage(null);
				},
			},
		);
	};

	const showEmptyState = !conversationId && !pendingMessage;

	return (
		<div className="flex flex-col gap-8 h-dvh min-h-0">
			<PageHeader
				title="AI Financial Assistant"
				subTitle="Ask about your spending, transactions and debts"
			/>

			<div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 flex-1 min-h-0">
				{/* ---- History column ---- */}
				<nav
					aria-label="Conversation history"
					className="hidden md:flex flex-col gap-4 p-4 border border-border-default bg-card-default rounded-md h-full min-h-0 overflow-y-auto">
					{isLoadingList && (
						<p className="text-caption-lg text-text-tertiary">Loading…</p>
					)}
					{isListError && (
						<p className="text-caption-lg text-text-tertiary">
							Couldn't load your conversations.
						</p>
					)}
					{!isLoadingList &&
						!isListError &&
						groupedConversations.length === 0 && (
							<p className="text-caption-lg text-text-tertiary">
								No conversations yet.
							</p>
						)}

					{groupedConversations.map(([label, list]) => (
						<div className="grid gap-2" key={label}>
							<p className="text-label-md text-text-tertiary">{label}</p>
							{(list ?? []).map((item) => (
								<NavLink
									key={item.id}
									to={`/assistant/${item.id}`}
									className={({ isActive }) =>
										cn(
											"flex items-center gap-2 p-2 rounded-sm min-w-0",
											isActive
												? "bg-card-dark border border-border-default text-text-primary"
												: "text-sidebar-foreground hover:bg-sidebar-hover",
										)
									}>
									{({ isActive }) => (
										<>
											<MessageCircle
												size={16}
												className={cn(
													"shrink-0",
													isActive
														? "stroke-interactive-primary"
														: "stroke-text-secondary",
												)}
											/>
											<p className="text-caption-lg truncate">
												{item.title ?? "New conversation"}
											</p>
										</>
									)}
								</NavLink>
							))}
						</div>
					))}
				</nav>

				{/* ---- Chat column ---- */}
				<section
					aria-label="Chat"
					className="flex flex-col gap-4 p-6 border border-border-default bg-card-default rounded-md h-full min-h-0">
					{/* Messages: the only part that scrolls */}
					<div
						role="log"
						aria-label="Conversation"
						className="flex-1 min-h-0 overflow-y-auto grid content-start gap-6 scrollbar-track-transparent scrollbar-thumb-accent-foreground scrollbar-gutter-stable">
						{showEmptyState && (
							<p className="text-body-sm text-text-tertiary place-self-center">
								Ask me about your spending, transactions or debts.
							</p>
						)}

						{conversationId && isLoadingConversation && (
							<p className="text-body-sm text-text-tertiary">Loading…</p>
						)}

						{conversation?.messages.map((msg, i) =>
							msg.role === "user" ? (
								<Card
									key={i}
									dir="auto"
									className="max-w-[75%] place-self-end p-3 text-label-lg bg-interactive-primary text-interactive-primary-foreground whitespace-pre-wrap">
									{msg.text}
								</Card>
							) : (
								<Card
									key={i}
									dir="auto"
									className="place-self-start p-3 text-label-lg prose prose-invert prose-sm prose-strong:text-text-primary prose-headings:text-text-primary prose-a:text-text-link prose-th:text-text-secondary prose-td:border-border-subtle max-w-none">
									<Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
								</Card>
							),
						)}

						{pendingMessage && (
							<>
								<Card
									dir="auto"
									className="max-w-[75%] place-self-end p-3 text-label-lg bg-interactive-primary text-interactive-primary-foreground whitespace-pre-wrap">
									{pendingMessage}
								</Card>
								<Card
									role="status"
									aria-label="Assistant is thinking"
									className="place-self-start p-3">
									<ThreeDots color="#ff6b3d" width={20} height={20} />
								</Card>
							</>
						)}

						<div ref={endRef} />
					</div>

					{/* Input: always at the bottom */}
					<form
						ref={formRef}
						onSubmit={handleSend}
						className="shrink-0 flex items-center gap-3 px-3 py-2.5 bg-input-background border border-border-default rounded-sm focus-within:ring-2 focus-within:ring-ring-default">
						<textarea
							aria-label="Message"
							rows={1}
							value={input}
							disabled={isSending}
							placeholder="Ask about your spending…"
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									formRef.current?.requestSubmit();
								}
							}}
							className="w-full max-h-40 overflow-y-auto field-sizing-content bg-transparent outline-none resize-none placeholder:text-input-placeholder text-body-sm text-text-primary"
						/>
						<Button
							size="sm"
							type="submit"
							aria-label="Send"
							disabled={isSending || !input.trim()}>
							<SendHorizonal size={20} />
						</Button>
					</form>
				</section>
			</div>
		</div>
	);
}

export default Assistant;
