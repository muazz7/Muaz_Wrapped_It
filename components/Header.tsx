"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

export default function Header() {
    const router = useRouter();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogoClick = () => {
        window.location.reload();
    };

    const handleNavClick = (label: string, e: React.MouseEvent) => {
        e.preventDefault();

        switch (label) {
            case "Home":
                router.push("/");
                break;
            case "About":
                setShowAboutModal(true);
                break;
            case "Pricing":
                router.push("/pricing");
                break;
            case "Sign In":
                setShowSignInModal(true);
                break;
        }
    };

    const navItems = [
        { label: "Home" },
        { label: "About" },
        { label: "Pricing" },
        { label: "Sign In" },
    ];

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                <div className="glass-dark mx-4 mt-4 rounded-2xl px-6 py-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Logo */}
                        <motion.button
                            onClick={handleLogoClick}
                            className="flex flex-col items-start cursor-pointer group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ width: 'fit-content' }}
                        >
                            <span className="text-2xl md:text-3xl font-bold text-star-white tracking-wider group-hover:text-glow transition-all duration-300">
                                MUAZ
                            </span>
                            <span
                                className="font-semibold text-cosmic-gold uppercase leading-none block text-[0.35rem] tracking-[0.78em] md:text-[0.45rem] md:tracking-[0.78em]"
                            >
                                WRAPPED IT
                            </span>
                        </motion.button>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                                    className="nav-item-glow"
                                >
                                    <button
                                        onClick={(e) => handleNavClick(item.label, e)}
                                        className="text-nebula-gray hover:text-cosmic-gold transition-all duration-300 text-sm font-medium relative group"
                                    >
                                        {item.label}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-star-white transition-all duration-300 group-hover:w-full" />
                                    </button>
                                </motion.div>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden text-star-white p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {showMobileMenu && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:hidden overflow-hidden"
                            >
                                <nav className="flex flex-col gap-2 pt-4 pb-2">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={(e) => {
                                                handleNavClick(item.label, e);
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-nebula-gray hover:text-cosmic-gold transition-colors duration-300 text-sm font-medium py-2 text-left"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.header>

            {/* About Modal */}
            <Modal
                isOpen={showAboutModal}
                onClose={() => setShowAboutModal(false)}
                title="About"
            >
                <div className="space-y-4">
                    {/* Top section - Photo on left, Description on right */}
                    <div className="flex items-center gap-4">
                        {/* Profile Photo */}
                        <a
                            href="https://muaz.pro"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group flex-shrink-0"
                        >
                            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-r from-cosmic-gold to-cosmic-gold-light glow-gold">
                                <img
                                    src="/muaz-photo.jpg"
                                    alt="MUAZ"
                                    className="w-full h-full rounded-full object-cover md:grayscale md:group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                        </a>

                        {/* Description text */}
                        <p className="text-star-white leading-relaxed text-sm">
                            This is a project developed by{" "}
                            <a
                                href="https://muaz.pro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cosmic-gold hover:text-cosmic-gold-light transition-colors duration-300 font-medium"
                            >
                                MUAZ
                            </a>{" "}
                            who is a software engineering undergrad at Daffodil International University.
                        </p>
                    </div>

                    {/* Bottom text - stays centered */}
                    <p className="text-nebula-gray leading-relaxed text-center text-sm">
                        The project is currently in its initial stage and many more features
                        and upgrades are coming soon. Stay tuned.
                    </p>
                    <div className="pt-2 flex justify-center">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cosmic-gold/50 to-transparent" />
                    </div>
                </div>
            </Modal>

            {/* Sign In Modal */}
            <Modal
                isOpen={showSignInModal}
                onClose={() => setShowSignInModal(false)}
                title="Sign In"
            >
                <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cosmic-gold/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-cosmic-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-star-white text-lg font-medium mb-2">
                        Coming Soon
                    </p>
                    <p className="text-nebula-gray">
                        Account and History options are coming soon.
                    </p>
                </div>
            </Modal>
        </>
    );
}
