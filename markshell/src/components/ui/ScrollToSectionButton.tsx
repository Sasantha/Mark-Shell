"use client";

import React from "react";
import { Button } from "@/components/ui/button";

/** Button that smooth-scrolls to the element with the given id. */
const ScrollToSectionButton = ({ targetId, className, children }: { targetId: string; className?: string; children: React.ReactNode }) => (
    <Button
        onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })}
        className={className}
    >
        {children}
    </Button>
);

export default ScrollToSectionButton;
