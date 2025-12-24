
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Typing effect component for nav items
const NavItemTypewriter = ({
    text,
    delay = 0,
    typingSpeed = 50
}: {
    text: string;
    delay?: number;
    typingSpeed?: number;
}) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayText(text.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsComplete(true);
                    clearInterval(interval);
                }
            }, typingSpeed);

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [text, delay, typingSpeed]);

    return (
        <span>
            {displayText}
            {!isComplete && <span className="animate-pulse">|</span>}
        </span>
    );
};

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#about' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full bg-gray-950 backdrop-blur-md shadow-sm z-50 py-4 px-6"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-xl font-bold text-green-400">
                    &gt;MICHAEL
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex gap-6 text-sm font-medium text-white-600">
                        {navItems.map((item, index) => (
                            <li key={item.label}>
                                <a href={item.href} className="hover:text-green-400 transition-colors">
                                    <NavItemTypewriter
                                        text={item.label}
                                        delay={300 + index * 200}
                                        typingSpeed={50}
                                    />
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    <motion.span
                        animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-white block"
                    />
                    <motion.span
                        animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-6 h-0.5 bg-white block"
                    />
                    <motion.span
                        animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-green-500 block"
                    />
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden"
                    >
                        <ul className="flex flex-col gap-4 pt-4 pb-2 text-sm font-medium text-white-600">
                            {navItems.map((item, index) => (
                                <motion.li
                                    key={item.label}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <a
                                        href={item.href}
                                        className="hover:text-green-400 transition-colors block py-2"
                                        onClick={closeMenu}
                                    >
                                        <NavItemTypewriter
                                            text={item.label}
                                            delay={index * 150}
                                            typingSpeed={40}
                                        />
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
