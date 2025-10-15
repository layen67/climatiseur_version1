import { Button } from "@/components/ui/button";
import { Calculator, Bolt } from "lucide-react";
import React from "react";

interface FloatingSimulatorButtonProps {
    onClick: () => void;
}

export const FloatingSimulatorButton: React.FC<FloatingSimulatorButtonProps> = ({ onClick }) => (
    <Button
        id="floatingSimulatorBtn"
        onClick={onClick}
        className="floating-simulator-btn bg-blue-600 text-white rounded-full px-6 py-4 shadow-lg hover:bg-blue-700 transition duration-300 flex items-center fixed bottom-8 left-8 z-50 animate-pulse"
    >
        <Calculator className="text-xl" />
        <span className="ml-2 font-semibold hidden sm:inline">Simuler mon projet</span>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            <Bolt size={12} />
        </div>
    </Button>
);