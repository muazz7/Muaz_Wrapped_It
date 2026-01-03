"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import StarBackground from "@/components/StarBackground";
import Header from "@/components/Header";
import Link from "next/link";
import { Check, Clock, Sparkles } from "lucide-react";

const tiers = [
    {
        name: "Free",
        price: "$0",
        description: "Get started with basic AI assistance",
        features: [
            "Up to 20 prompts per day",
            "Basic AI responses",
            "Standard response time",
            "Community support",
            "Access to core features",
        ],
        cta: "Get Started",
        available: true,
        highlight: false,
    },
    {
        name: "Pro",
        price: "$9.99",
        period: "/month",
        description: "Enhanced capabilities for power users",
        features: [
            "Unlimited prompts",
            "Priority AI processing",
            "Advanced context memory",
            "Faster response times",
            "Email support",
            "Custom prompts library",
        ],
        cta: "Coming Soon",
        available: false,
        highlight: true,
        badge: "Under Development",
    },
    {
        name: "Max",
        price: "$24.99",
        period: "/month",
        description: "Ultimate AI experience for professionals",
        features: [
            "Everything in Pro",
            "API access",
            "Team collaboration",
            "Priority support 24/7",
            "Custom AI fine-tuning",
            "Advanced analytics",
            "White-label options",
        ],
        cta: "After Pro Launch",
        available: false,
        highlight: false,
        badge: "Coming After Pro",
    },
];

export default function PricingPage() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push("/");
    };

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Starfield Background */}
            <StarBackground />

            {/* Vignette Overlay */}
            <div className="vignette" />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center min-h-screen px-4 pt-32 pb-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-star-white mb-4 tracking-tight">
                        Choose Your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-gold to-cosmic-gold-light text-glow">
                            Plan
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-nebula-gray max-w-xl mx-auto">
                        Start free and upgrade as you grow
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`
                                relative rounded-2xl p-6
                                ${tier.highlight
                                    ? "glass border-2 border-cosmic-gold/50 glow-gold"
                                    : "glass border border-white/10"
                                }
                            `}
                        >
                            {/* Badge */}
                            {tier.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 text-xs font-medium bg-cosmic-gold text-void-black rounded-full flex items-center gap-1">
                                        {tier.highlight ? <Sparkles className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {tier.badge}
                                    </span>
                                </div>
                            )}

                            {/* Tier Name */}
                            <h3 className={`text-xl font-bold mb-2 ${tier.highlight ? "text-cosmic-gold" : "text-star-white"}`}>
                                {tier.name}
                            </h3>

                            {/* Price */}
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-star-white">{tier.price}</span>
                                {tier.period && (
                                    <span className="text-nebula-gray">{tier.period}</span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-nebula-gray text-sm mb-6">
                                {tier.description}
                            </p>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-nebula-gray">
                                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? "text-cosmic-gold" : "text-cosmic-gold/60"}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                onClick={tier.available ? handleGetStarted : undefined}
                                disabled={!tier.available}
                                className={`
                                    w-full py-3 px-4 rounded-xl font-medium transition-all duration-300
                                    ${tier.available
                                        ? "bg-cosmic-gold text-void-black hover:bg-cosmic-gold-light"
                                        : "bg-midnight-blue text-nebula-gray cursor-not-allowed"
                                    }
                                `}
                            >
                                {tier.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12"
                >
                    <Link
                        href="/"
                        className="text-nebula-gray hover:text-cosmic-gold transition-colors duration-300"
                    >
                        ← Back to Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
