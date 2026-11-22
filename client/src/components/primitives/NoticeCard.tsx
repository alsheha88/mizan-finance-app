import { cn } from "@/lib/cn";
import { noticeColors } from "@/lib/paletteColors";

type NoticeCardProps = {
	message: string;
	noticeType: "warning" | "info" | "error" | "success";
};

function NoticeCard({ message, noticeType }: NoticeCardProps) {
	const Icon = noticeColors[noticeType].icon;
	return (
		<div
			className={cn(
				"px-4 py-3 flex items-center gap-3 rounded-md text-caption-md",
				noticeColors[noticeType].style,
			)}>
			<Icon size={18} />
			{message}
		</div>
	);
}

export default NoticeCard;
