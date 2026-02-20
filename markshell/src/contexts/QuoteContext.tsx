"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type PreFillType = "product" | "category" | "general";

interface QuotePrefillData {
    type: PreFillType;
    name: string;
}

interface QuoteContextType {
    isQuoteOpen: boolean;
    quoteData: QuotePrefillData | null;
    openQuote: (type: PreFillType, name: string) => void;
    closeQuote: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [quoteData, setQuoteData] = useState<QuotePrefillData | null>(null);

    const openQuote = (type: PreFillType, name: string) => {
        setQuoteData({ type, name });
        setIsQuoteOpen(true);
    };

    const closeQuote = () => {
        setIsQuoteOpen(false);
    };

    return (
        <QuoteContext.Provider value={{ isQuoteOpen, quoteData, openQuote, closeQuote }}>
            {children}
        </QuoteContext.Provider>
    );
}

export function useQuote() {
    const context = useContext(QuoteContext);
    if (!context) {
        throw new Error("useQuote must be used within a QuoteProvider");
    }
    return context;
}
