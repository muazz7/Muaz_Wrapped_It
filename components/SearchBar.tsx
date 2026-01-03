"use client";

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Send, Loader2 } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const wasLoadingRef = useRef(false);

    // Auto-focus input when loading completes
    useEffect(() => {
        if (wasLoadingRef.current && !isLoading) {
            textareaRef.current?.focus();
        }
        wasLoadingRef.current = isLoading;
    }, [isLoading]);

    // Auto-grow textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [query]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) {
            onSearch(query.trim());
            setQuery("");
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleBoxClick = () => {
        textareaRef.current?.focus();
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-3xl mx-auto"
        >
            <div
                onClick={handleBoxClick}
                className={`
          relative flex items-end
          glass rounded-2xl
          px-6 py-4
          transition-all duration-500 ease-out
          cursor-text
          ${isFocused ? "glow-gold shadow-2xl" : "shadow-lg"}
        `}
            >
                {/* Search Icon */}
                <Search
                    className={`
            w-5 h-5 mr-4 flex-shrink-0 pointer-events-none mb-1
            transition-colors duration-300
            ${isFocused ? "text-cosmic-gold" : "text-nebula-gray"}
          `}
                />

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Your Precious Prompt..."
                    disabled={isLoading}
                    rows={1}
                    className="
            flex-1 bg-transparent 
            text-star-white placeholder-nebula-gray
            text-lg outline-none
            disabled:opacity-50
            resize-none
            overflow-y-auto
            max-h-[200px]
            leading-relaxed
          "
                    style={{ minHeight: "28px" }}
                    aria-label="Search prompt"
                />

                {/* Send Button */}
                <motion.button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
            ml-4 p-2 rounded-full flex-shrink-0
            transition-all duration-300
            ${query.trim() && !isLoading
                            ? "bg-cosmic-gold text-void-black hover:bg-cosmic-gold-light"
                            : "bg-midnight-blue text-nebula-gray cursor-not-allowed"
                        }
          `}
                    aria-label="Send prompt"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </motion.button>
            </div>
        </motion.form>
    );
}
