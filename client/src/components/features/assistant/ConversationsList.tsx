import { cn } from "@/lib/cn";
import { MessageCircle, MessageCircleText } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

type GroupedConversation = [
	string,
	(
		| {
				id: string;
				title: string | null;
				updatedAt: string;
		  }[]
		| undefined
	),
][];
type ConversationsListProps = {
	isLoadingList: boolean;
	isListError: boolean;
	groupedConversations: GroupedConversation;
	onNavigate?: () => void;
};

function ConversationsList({
	isListError,
	isLoadingList,
	groupedConversations,
	onNavigate,
}: ConversationsListProps) {
	return (
		<>
			<Link
				to={"/assistant"}
				className={
					"flex items-center gap-2 px-3 py-2 text-body-sm border border-interactive-secondary-border text-text-primary hover:bg-interactive-secondary-hover rounded-sm place-self-start"
				}
				onClick={onNavigate}>
				<MessageCircleText size={16} aria-hidden />
				New chat
			</Link>
			{isLoadingList && (
				<p className="text-caption-lg text-text-tertiary">Loading…</p>
			)}
			{isListError && (
				<p className="text-caption-lg text-text-tertiary">
					Couldn't load your conversations.
				</p>
			)}
			{!isLoadingList && !isListError && groupedConversations.length === 0 && (
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
							onClick={onNavigate}
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
		</>
	);
}

export default ConversationsList;
