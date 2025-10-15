import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", variant = 'default', disabled, isLoading, ...props }) => {
    let baseClasses = "px-4 py-2 rounded-lg font-semibold transition duration-300 flex items-center justify-center";
    let variantClasses = "";

    switch (variant) {
        case 'secondary':
            variantClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300";
            break;
        case 'outline':
            variantClasses = "bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100";
            break;
        case 'ghost':
            variantClasses = "bg-transparent text-gray-800 hover:bg-gray-100 shadow-none";
            break;
        case 'default':
        default:
            // Note: Les classes spécifiques (comme bg-blue-600) sont souvent passées via className dans l'usage
            if (!className.includes('bg-')) {
                variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
            }
            break;
    }

    return (
        <button
            onClick={onClick}
            className={cn(baseClasses, variantClasses, className, (disabled || isLoading) && "opacity-50 cursor-not-allowed")}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                </span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;