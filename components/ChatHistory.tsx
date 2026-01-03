"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bot, Sparkles } from "lucide-react";

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
            className="w-full max-w-3xl mx-auto mt-12 space-y-4"
        >
            {messages.map((message, index) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`
            flex gap-4 p-4 rounded-2xl max-w-[85%]
            ${message.role === "user"
                            ? "glass-light ml-auto flex-row-reverse"
                            : "glass mr-auto"
                        }
          `}
                >
                    <div
                        className={`
              flex-shrink-0 w-10 h-10 rounded-full 
              flex items-center justify-center
              ${message.role === "user"
                                ? "bg-cosmic-gold/20 text-cosmic-gold"
                                : "bg-midnight-blue text-star-white"
                            }
            `}
                    >
                        {message.role === "user" ? (
                            <User className="w-5 h-5" />
                        ) : (
                            <Bot className="w-5 h-5" />
                        )}
                    </div>
                    <div className={`flex-1 min-w-0 ${message.role === "user" ? "text-right" : ""}`}>
                        <p className="text-xs text-nebula-gray mb-1">
                            {message.role === "user" ? "You" : "MUAZ WRAPPED IT"}
                        </p>
                        <p className="text-star-white whitespace-pre-wrap break-words">
                            {message.content}
                        </p>
                    </div>
                </motion.div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 rounded-2xl glass"
                >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-midnight-blue text-star-white flex items-center justify-center">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-nebula-gray mb-1">MUAZ WRAPPED IT</p>
                        <div className="flex items-center gap-2">
                            <span className="text-nebula-gray">Thinking</span>
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
                </motion.div>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
        </motion.div>
    );
}
