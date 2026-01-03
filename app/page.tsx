"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import StarBackground from "@/components/StarBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import PromptSuggestions from "@/components/PromptSuggestions";
import ChatHistory, { ChatMessage } from "@/components/ChatHistory";

export default function Home() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Track scroll position to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle search and call the Groq API with chat memory
    const handleSearch = useCallback(async (prompt: string) => {
        // Add user message to chat
        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: prompt,
            timestamp: new Date(),
        };

        // Build the new messages array with the user's message
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Build messages array for API (only role and content, no id/timestamp)
            const apiMessages = updatedMessages.map((msg) => ({
                role: msg.role as "user" | "assistant",
                content: msg.content,
            }));

            // Call the API endpoint with full conversation history
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Add assistant response to chat
            const assistantMessage: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: data.text || "No response received.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error processing request:", error);
            // Add error message
            const errorMessage: ChatMessage = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "Sorry, something went wrong. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    const handleSuggestionSelect = useCallback(
        (prompt: string) => {
            handleSearch(prompt);
        },
        [handleSearch]
    );

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Starfield Background */}
            <StarBackground />

            {/* Vignette Overlay */}
            <div className="vignette" />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className={`relative z-10 flex flex-col min-h-screen px-4 pt-32 pb-32 ${messages.length === 0 ? "items-center justify-center" : ""}`}>
                {/* Hero Section - hide after messages */}
                {messages.length === 0 && <Hero />}

                {/* Search Bar - centered initially, moves to bottom after first prompt */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center w-full max-w-3xl">
                        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

                        {/* Prompt Suggestions (only show when no messages) */}
                        <PromptSuggestions
                            onSelect={handleSuggestionSelect}
                            disabled={isLoading}
                        />
                    </div>
                )}

                {/* Chat History - takes main area when there are messages */}
                {messages.length > 0 && (
                    <div className="flex-1 overflow-y-auto">
                        <ChatHistory messages={messages} isThinking={isLoading} />
                    </div>
                )}
            </div>

            {/* Search Bar at bottom - appears with animation after first prompt */}
            {messages.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-4 bg-gradient-to-t from-void-black via-void-black/90 to-transparent"
                >
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                </motion.div>
            )}

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && messages.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-6 z-30 w-12 h-12 rounded-full glass border border-cosmic-gold/30 glow-gold flex items-center justify-center text-cosmic-gold hover:text-cosmic-gold-light transition-colors duration-300"
                        aria-label="Scroll to top"
                    >
                        <ChevronUp className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Footer - only show when no messages */}
            {messages.length === 0 && (
                <footer className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Left side - Creator credit */}
                        <p className="text-nebula-gray text-sm opacity-80 uppercase tracking-wide">
                            Created By{" "}
                            <a
                                href="https://muaz.pro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cosmic-gold/60 hover:text-cosmic-gold transition-colors duration-300"
                            >
                                @MUAZ
                            </a>
                        </p>

                        {/* Right side - Social media icons */}
                        <div className="flex items-center gap-4">
                            {/* X (Twitter) */}
                            <a
                                href="https://x.com/mdmuaz23?s=21"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-nebula-gray hover:text-cosmic-gold transition-colors duration-300"
                                aria-label="X (Twitter)"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/share/1D9BVWAzaD/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-nebula-gray hover:text-cosmic-gold transition-colors duration-300"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/muazzzzzz7?igsh=MWxqaGtnZTZueHMxbg%3D%3D&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-nebula-gray hover:text-cosmic-gold transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>

                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/+8801741885952"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-nebula-gray hover:text-cosmic-gold transition-colors duration-300"
                                aria-label="WhatsApp"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>
            )}
        </main>
    );
}
