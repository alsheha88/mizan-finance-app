import { Card } from "@/components/primitives/Card";
import { formatKWD } from "@/lib/helpers";
import type { ReactNode } from "react";

type StatCardProps = {
    title: string;
    subTitle?: string | number;
    children?: ReactNode;
};

function StatCard({ title, subTitle, children }: StatCardProps) {
    return (
        <Card className="flex flex-col gap-2">
            <p className="text-label-md text-text-secondary">{title}</p>
            <h2 className="text-h2 text-text-primary">{typeof subTitle === "number" ? formatKWD(subTitle) : subTitle}</h2>
            {children}
        </Card>
    );
}

export default StatCard;