"use client";

import { motion } from "framer-motion";
import { Sparkles, Plane, Atom, Code, Music, BookOpen } from "lucide-react";

interface PromptSuggestionsProps {
    onSelect: (prompt: string) => void;
    disabled: boolean;
}

const suggestions = [
    {
        icon: Plane,
        text: "Generate a travel itinerary",
    },
    {
        icon: Atom,
        text: "Explain quantum computing",
    },
    {
        icon: Code,
        text: "Write a Python script",
    },
    {
        icon: Music,
        text: "Suggest music playlists",
    },
    {
        icon: BookOpen,
        text: "Summarize a research paper",
    },
    {
        icon: Sparkles,
        text: "Creative writing prompts",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
        },
    },
};

export default function PromptSuggestions({
    onSelect,
    disabled,
}: PromptSuggestionsProps) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3 mt-8 max-w-4xl mx-auto px-4"
        >
            {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                    <motion.button
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(suggestion.text)}
                        disabled={disabled}
                        className="
              glass-light rounded-full
              px-3 py-2 md:px-4 md:py-2.5
              flex items-center gap-1.5 md:gap-2
              text-xs md:text-sm text-nebula-gray
              hover:text-star-white hover:border-cosmic-gold/30
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            "
                    >
                        <Icon className="w-4 h-4 text-cosmic-gold group-hover:scale-110 transition-transform" />
                        <span>{suggestion.text}</span>
                    </motion.button>
                );
            })}
        </motion.div>
    );
}
