import React, { useState } from "react";
import { Bolt, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
    scrollToSection: (id: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ scrollToSection }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Bolt className="text-blue-600 w-6 h-6 mr-2" />
                        <span className="text-xl font-extrabold text-gray-900">Climatiseur.<span className="text-blue-600">pro</span></span>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        {["calculateur", "primes", "guide", "avis", "faq", "contact"].map(id => (
                            <a key={id} href={`#${id}`} onClick={() => scrollToSection(id)} className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium capitalize text-sm">
                                {id === 'primes' ? 'Aides & Primes' : id === 'guide' ? "Guide d'achat" : id === 'avis' ? "Avis Clients" : id}
                            </a>
                        ))}
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 transition duration-300">
                            <Phone className="w-4 h-4 mr-2" />
                            01 23 45 67 89
                        </Button>
                    </div>
                    <div className="flex items-center space-x-4 md:hidden">
                        <Button variant="ghost" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
                        </Button>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div id="mobile-menu" className="md:hidden bg-white shadow-lg w-full top-16 z-40">
                    <div className="px-4 py-4 space-y-4">
                        {["calculateur", "primes", "guide", "avis", "faq", "contact"].map(id => (
                            <a key={id} href={`#${id}`} onClick={() => { scrollToSection(id); setIsMobileMenuOpen(false); }} className="block text-gray-700 hover:text-blue-600 transition duration-300 font-medium py-2 border-b border-gray-100 capitalize">
                                {id === 'primes' ? 'Aides & Primes' : id === 'guide' ? "Guide d'achat" : id === 'avis' ? "Avis Clients" : id}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center text-gray-700">
                                <Phone className="text-blue-500 w-4 h-4 mr-2" />
                                <span className="font-medium">01 23 45 67 89</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};