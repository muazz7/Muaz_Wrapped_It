"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <div className="text-center mb-12">
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-2xl md:text-3xl font-sans font-medium tracking-wide text-star-white max-w-xl mx-auto text-glow-subtle"
            >
                Ask Anything, Get Instant Answers.
            </motion.p>
        </div>
    );
}
