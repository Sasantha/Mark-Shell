import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    container?: boolean;
}

const Section = ({
    children,
    className,
    container = true,
    ...props
}: SectionProps) => {
    return (
        <section className={cn("py-16 md:py-24", className)} {...props}>
            {container ? (
                <div className="container mx-auto px-4">{children}</div>
            ) : (
                children
            )}
        </section>
    );
};

export default Section;
