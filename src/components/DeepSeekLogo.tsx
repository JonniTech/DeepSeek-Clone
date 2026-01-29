interface DeepSeekLogoProps {
    className?: string;
}

export function DeepSeekLogo({ className = "w-6 h-6" }: DeepSeekLogoProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="url(#deepseek-gradient)"
            />
            <path
                d="M8 12.5c0-2.5 2-4 4-4s4 1.5 4 4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
            <path
                d="M7 15.5c0-3.5 2.5-5.5 5-5.5s5 2 5 5.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
            />
            <circle cx="12" cy="8" r="1.5" fill="white" />
            <defs>
                <linearGradient id="deepseek-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#7C3AED" />
                </linearGradient>
            </defs>
        </svg>
    );
}
