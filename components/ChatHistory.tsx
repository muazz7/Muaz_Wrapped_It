"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatHistoryProps {
    messages: ChatMessage[];
    isThinking: boolean;
}

export default function ChatHistory({ messages, isThinking }: ChatHistoryProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages update or thinking state changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    if (messages.length === 0 && !isThinking) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl mx-auto mt-12 space-y-6 pb-32"
        >
            {messages.map((message, index) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    {/* Message row: Avatar Column + Bubble */}
                    <div
                        className={`
                            flex gap-4 items-start max-w-[85%]
                            ${message.role === "user" ? "flex-row-reverse" : ""}
                        `}
                    >
                        {/* Avatar Column: Label + Icon */}
                        <div className="flex flex-col items-center flex-shrink-0 mt-1">
                            <span className="text-[10px] text-nebula-gray/70 mb-1">
                                {message.role === "user" ? "You" : "MUAZ"}
                            </span>
                            <div
                                className={`
                                    w-8 h-8 rounded-full
                                    flex items-center justify-center
                                    ${message.role === "user"
                                        ? "bg-cosmic-gold/20 text-cosmic-gold"
                                        : "bg-midnight-blue/80 text-star-white border border-white/10"
                                    }
                                `}
                            >
                                {message.role === "user" ? (
                                    <User className="w-4 h-4" />
                                ) : (
                                    <Bot className="w-4 h-4" />
                                )}
                            </div>
                        </div>

                        {/* Message bubble */}
                        <div
                            className={`
                                px-4 py-3 rounded-2xl flex-shrink mt-4
                                ${message.role === "user"
                                    ? "glass-light"
                                    : "glass"
                                }
                            `}
                            style={message.role === "user" ? { minWidth: "min-content" } : undefined}
                        >
                            {message.role === "user" ? (
                                <p
                                    className="text-star-white text-[15px]"
                                    style={{ textWrap: "balance", overflowWrap: "break-word" }}
                                >
                                    {message.content}
                                </p>
                            ) : (
                                <div className="text-star-white prose prose-invert max-w-none prose-sm prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-cosmic-gold prose-code:text-cosmic-gold-light prose-code:bg-midnight-blue prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-midnight-blue prose-pre:border prose-pre:border-white/10">
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                >
                    <div className="flex gap-4 items-start">
                        {/* Avatar Column: Label + Icon */}
                        <div className="flex flex-col items-center flex-shrink-0 mt-1">
                            <span className="text-[10px] text-nebula-gray/70 mb-1">MUAZ</span>
                            <div className="w-8 h-8 rounded-full bg-midnight-blue/80 text-star-white border border-white/10 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                            </div>
                        </div>
                        <div className="glass px-4 py-3 rounded-2xl mt-4">
                            <div className="flex items-center gap-2">
                                <span className="text-nebula-gray text-sm">Thinking</span>
                                <span className="flex gap-1">
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                        className="w-1.5 h-1.5 bg-cosmic-gold rounded-full"
                                    />
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                        className="w-1.5 h-1.5 bg-cosmic-gold rounded-full"
                                    />
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                        className="w-1.5 h-1.5 bg-cosmic-gold rounded-full"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
        </motion.div>
    );
}
