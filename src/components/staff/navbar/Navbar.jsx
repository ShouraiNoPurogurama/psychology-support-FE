
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../../../styles/Web/Navigation.module.css";

const App = () => {
    const location = useLocation();

    const links = [
        { to: "home", label: "Home" },
        { to: "dashboard", label: "Dashboard" },
        { to: "customer", label: "List Of Customer" },
        { to: "message", label: "Message" },
        { to: "doctor", label: "List Of Doctor" },
        { to: "blog", label: "Blog" },
        { to: "regit", label: "Regit" },
    ];

    return (
        <nav className="w-full bg-white px-10 py-3 rounded-4xl shadow-md">
            <div className="flex justify-between items-center w-full">
                {/* Logo */}
                <motion.div
                    initial={{ x: "300%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className={`${styles.knewave} text-[#9553f2] font-light text-5xl tracking-widest`}
                >
                    EMOEASE
                </motion.div>

                {/* Navigation */}
                <div className="flex gap-x-10 text-gray-600 font-medium">
                    {links.map((link) => {
                        const isActive = location.pathname.includes(link.to);
                        return (
                            <div key={link.to} className="relative">
                                {/* Hiệu ứng nền */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-b from-[#C45AB3] to-[#DD789A] rounded-md scale-110 z-0 opacity-80"
                                        layoutId="activeIndicator"
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                )}
                                {/* Link */}
                                <Link
                                    to={link.to}
                                    className={`relative z-10 px-4 py-1 transition-all ${isActive ? "text-white font-bold" : "hover:text-purple-500"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Take the test button */}
                <div className="flex gap-x-10 text-gray-600 font-medium">
                    <span className="text-blue-800 text-lg font-medium">
                        Staff Name
                    </span>
                    <Link to="/staff/profile">
                        <img
                            src="https://i.pravatar.cc/150?img=4"
                            alt="Avatar"
                            className="w-7 h-7 rounded-full border-4 border-blue-500"
                        />
                    </Link>

                </div>
            </div>
        </nav>
    );
};

export default App;
