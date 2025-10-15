"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, ArrowRight, ArrowLeft, Calculator, Bolt, Info, Euro, Gift, Download, Shield, Phone, Mail, MapPin, Clock, Home, Building, Wind, Ruler, Volume2, Wifi, Percent, University, MapPin as MapPinIcon, Ticket, Leaf, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDataSender } from "@/hooks/use-data-sender";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

// --- Constantes et Mappings ---

const DEPARTEMENTS_OPTIONS = [
    { value: "placeholder", label: "Sélectionnez votre département" },
    { value: "01", label: "01 - Ain" }, { value: "02", label: "02 - Aisne" }, { value: "03", label: "03 - Allier" }, { value: "04", label: "04 - Alpes-de-Haute-Provence" }, { value: "05", label: "05 - Hautes-Alpes" }, { value: "06", label: "06 - Alpes-Maritimes" }, { value: "07", label: "07 - Ardèche" }, { value: "08", label: "08 - Ardennes" }, { value: "09", label: "09 - Ariège" }, { value: "10", label: "10 - Aube" }, { value: "11", label: "11 - Aude" }, { value: "12", label: "12 - Aveyron" }, { value: "13", label: "13 - Bouches-du-Rhône" }, { value: "14", label: "14 - Calvados" }, { value: "15", label: "15 - Cantal" }, { value: "16", label: "16 - Charente" }, { value: "17", label: "17 - Charente-Maritime" }, { value: "18", label: "18 - Cher" }, { value: "19", label: "19 - Corrèze" }, { value: "21", label: "21 - Côte-d'Or" }, { value: "22", label: "22 - Côtes-d'Armor" }, { value: "23", label: "23 - Creuse" }, { value: "24", label: "24 - Dordogne" }, { value: "25", label: "25 - Doubs" }, { value: "26", label: "26 - Drôme" }, { value: "27", label: "27 - Eure" }, { value: "28", label: "28 - Eure-et-Loir" }, { value: "29", label: "29 - Finistère" }, { value: "2A", label: "2A - Corse-du-Sud" }, { value: "2B", label: "2B - Haute-Corse" }, { value: "30", label: "30 - Gard" }, { value: "31", label: "31 - Haute-Garonne" }, { value: "32", label: "32 - Gers" }, { value: "33", label: "33 - Gironde" }, { value: "34", label: "34 - Hérault" }, { value: "35", label: "35 - Ille-et-Vilaine" }, { value: "36", label: "36 - Indre" }, { value: "37", label: "37 - Indre-et-Loire" }, { value: "38", label: "38 - Isère" }, { value: "39", label: "39 - Jura" }, { value: "40", label: "40 - Landes" }, { value: "41", label: "41 - Loir-et-Cher" }, { value: "42", label: "42 - Loire" }, { value: "43", label: "43 - Haute-Loire" }, { value: "44", label: "44 - Loire-Atlantique" }, { value: "45", label: "45 - Loiret" }, { value: "46", label: "46 - Lot" }, { value: "47", label: "47 - Lot-et-Garonne" }, { value: "48", label: "48 - Lozère" }, { value: "49", label: "49 - Maine-et-Loire" }, { value: "50", label: "50 - Manche" }, { value: "51", label: "51 - Marne" }, { value: "52", label: "52 - Haute-Marne" }, { value: "53", label: "53 - Mayenne" }, { value: "54", label: "54 - Meurthe-et-Moselle" }, { value: "55", label: "55 - Meuse" }, { value: "56", label: "56 - Morbihan" }, { value: "57", label: "57 - Moselle" }, { value: "58", label: "58 - Nièvre" }, { value: "59", label: "59 - Nord" }, { value: "60", label: "60 - Oise" }, { value: "61", label: "61 - Orne" }, { value: "62", label: "62 - Pas-de-Calais" }, { value: "63", label: "63 - Puy-de-Dôme" }, { value: "64", label: "64 - Pyrénées-Atlantiques" }, { value: "65", label: "65 - Hautes-Pyrénées" }, { value: "66", label: "66 - Pyrénées-Orientales" }, { value: "67", label: "67 - Bas-Rhin" }, { value: "68", label: "68 - Haut-Rhin" }, { value: "69", label: "69 - Rhône" }, { value: "70", label: "70 - Haute-Saône" }, { value: "71", label: "71 - Saône-et-Loire" }, { value: "72", label: "72 - Sarthe" }, { value: "73", label: "73 - Savoie" }, { value: "74", label: "74 - Haute-Savoie" }, { value: "75", label: "75 - Paris" }, { value: "76", label: "76 - Seine-Maritime" }, { value: "77", label: "77 - Seine-et-Marne" }, { value: "78", label: "78 - Yvelines" }, { value: "79", label: "79 - Deux-Sèvres" }, { value: "80", label: "80 - Somme" }, { value: "81", label: "81 - Tarn" }, { value: "82", label: "82 - Tarn-et-Garonne" }, { value: "83", label: "83 - Var" }, { value: "84", label: "84 - Vaucluse" }, { value: "85", label: "85 - Vendée" }, { value: "86", label: "86 - Vienne" }, { value: "87", label: "87 - Haute-Vienne" }, { value: "88", label: "88 - Vosges" }, { value: "89", label: "89 - Yonne" }, { value: "90", label: "90 - Territoire de Belfort" }, { value: "91", label: "91 - Essonne" }, { value: "92", label: "92 - Hauts-de-Seine" }, { value: "93", label: "93 - Seine-Saint-Denis" }, { value: "94", label: "94 - Val-de-Marne" }, { value: "95", label: "95 - Val-d'Oise" }, { value: "971", label: "971 - Guadeloupe" }, { value: "972", label: "972 - Martinique" }, { value: "973", label: "973 - Guyane" }, { value: "974", label: "974 - La Réunion" }, { value: "976", label: "976 - Mayotte" }
];

const FAQ_DATA = [
    {
        question: "Quelle est la durée d'installation moyenne ?",
        answer: "L'installation d'un climatiseur monosplit prend généralement 1 journée. Pour un multisplit, comptez 1 à 2 jours selon le nombre d'unités. Les systèmes gainables nécessitent 2 à 3 jours de travail.",
    },
    {
        question: "Les aides sont-elles cumulables ?",
        answer: "Oui, la plupart des aides sont cumulables : MaPrimeRénov' + Prime CEE + TVA réduite. L'Éco-PTZ peut également être combiné avec les autres aides pour financer le reste à charge.",
    },
    {
        question: "Faut-il une autorisation pour installer un climatiseur ?",
        answer: "En maison individuelle, aucune autorisation n'est nécessaire. En copropriété, il faut vérifier le règlement et parfois obtenir l'accord du syndic. Nous vous accompagnons dans ces démarches.",
    },
    {
        question: "Quelles sont les conditions exactes pour l'éco-PTZ ?",
        answer: "L'éco-PTZ est accessible pour les logements construits avant 1990, en résidence principale, pour les propriétaires occupants ou bailleurs. Il faut réaliser un bouquet de travaux (au moins 2 actions) et faire appel à un professionnel RGE.",
    },
];

// --- Types ---

interface CalculationData {
    selectedInstallationType: string;
    surface: number;
    rooms: number;
    housingType: string;
    constructionYear: string;
    insulation: string;
    department: string;
    reversible: boolean;
    wifi: boolean;
    inverter: boolean;
    installation: boolean;
    income: number;
    householdSize: number;
    houseAge: string;
    propertyStatus: string;
    ownerType: string;
    
    // Results
    equipmentCost: number;
    installationCost: number;
    optionsCost: number;
    totalCost: number;
    vatCost: number;
    totalTTC: number;
    maprime: number;
    cee: number;
    tvaReduced: number;
    ecoPTZ: number;
    totalAides: number;
    finalCost: number;
    savings: number;
    eligibleEcoPTZ: boolean;
}

// --- Composants réutilisables (Doivent être définis en premier) ---

const FloatingButton = ({ onClick }: { onClick: () => void }) => (
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

const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => (
    <span className="tooltip ml-1 relative inline-block cursor-pointer">
        <Info className="text-blue-500 w-4 h-4 inline-block" />
        <span className="tooltiptext absolute bottom-[125%] left-1/2 -ml-[100px] w-[200px] bg-gray-800 text-white text-sm text-center rounded-md p-2 opacity-0 transition-opacity duration-300 invisible hover:visible">
            {text}
        </span>
        {children}
    </span>
);

const Marquee = () => (
    <div className="bg-blue-900 text-white py-2 overflow-hidden">
        <div className="marquee whitespace-nowrap overflow-hidden box-border">
            <span className="font-semibold inline-block pr-full animate-[marquee_20s_linear_infinite]">
                🎯 <strong>SPECIAL ÉTÉ 2025</strong> | Installation express sous 48h | 
                💰 <strong>Jusqu'à 70% d'économies</strong> avec les aides de l'État | 
                🌟 <strong>4.8/5</strong> basé sur 1 247 avis clients |
                ⚡ <strong>Financement 0%</strong> disponible |
                🏆 <strong>Certifié RGE</strong> - Installation garantie 5 ans
            </span>
        </div>
    </div>
);

const StepIndicator = ({ step, label, currentStep }: { step: number, label: string, currentStep: number }) => {
    const isActive = currentStep === step;
    const isCompleted = currentStep > step;
    
    return (
        <div className="flex flex-col items-center">
            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white transition-all duration-300",
                isCompleted ? "bg-green-500 text-white" : isActive ? "bg-blue-500 text-white animate-pulse-strong" : "bg-gray-300 text-gray-600"
            )}>
                {isCompleted ? <Check className="w-6 h-6" /> : step}
            </div>
            <span className="text-xs mt-2 text-gray-600 font-medium">{label}</span>
        </div>
    );
};

const InstallationCard = ({ type, icon: Icon, title, description, price, details, selectedInstallationType, setSelectedInstallationType }: { type: string, icon: React.ElementType, title: string, description: string, price: string, details: string[], selectedInstallationType: string, setSelectedInstallationType: (type: string) => void }) => (
    <div 
        className={cn(
            "installation-type border-2 border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white relative overflow-hidden group",
            selectedInstallationType === type && "type-selected border-blue-600 shadow-2xl shadow-blue-200/50"
        )}
        onClick={() => setSelectedInstallationType(type)}
    >
        <div className="text-center relative z-10">
            <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md transition-colors duration-300",
                type === 'monosplit' ? 'bg-blue-100 group-hover:bg-blue-200' :
                type === 'multisplit' ? 'bg-green-100 group-hover:bg-green-200' :
                'bg-purple-100 group-hover:bg-purple-200'
            )}>
                <Icon className={cn("text-2xl", type === 'monosplit' ? 'text-blue-600' : type === 'multisplit' ? 'text-green-600' : 'text-purple-600')} />
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-3">{description}</p>
            <div className={cn(
                "text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-2",
                type === 'monosplit' ? 'bg-blue-600' : type === 'multisplit' ? 'bg-green-600' : 'bg-purple-600'
            )}>{price}</div>
            <div className="mt-2 text-xs text-gray-500 flex flex-col space-y-1">
                {details.map((detail, index) => <div key={index}>{detail}</div>)}
            </div>
        </div>
        {(type === 'monosplit' || type === 'gainable') && (
            <div className={cn(
                "absolute top-4 left-4 text-white text-xs px-2 py-1 rounded-full font-semibold",
                type === 'monosplit' ? 'bg-blue-500' : 'bg-purple-500'
            )}>
                {type === 'monosplit' ? 'Le plus choisi' : 'Premium'}
            </div>
        )}
    </div>
);

// --- Composants de Section ---

const Header = ({ scrollToSection }: { scrollToSection: (id: string) => void }) => {
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

const HeroSection = ({ scrollToSection }: { scrollToSection: (id: string) => void }) => {
    const [stats, setStats] = useState({ calculated: 0, satisfied: 0 });

    useEffect(() => {
        const targetCalculated = 15247;
        const targetSatisfied = 1247;
        const duration = 1500;
        let start: number | null = null;

        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);

            setStats({
                calculated: Math.floor(percentage * targetCalculated),
                satisfied: Math.floor(percentage * targetSatisfied),
            });

            if (percentage < 1) {
                window.requestAnimationFrame(step);
            } else {
                setStats({ calculated: targetCalculated, satisfied: targetSatisfied });
            }
        };

        window.requestAnimationFrame(step);
    }, []);

    return (
        <section className="bg-gray-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Colonne de gauche: Titre et CTA */}
                    <div>
                        <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-1 mb-4 text-sm font-medium">
                            <Star className="w-4 h-4 mr-2 fill-blue-600 text-blue-600" />
                            Aides 2025 mises à jour
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Simulez vos aides pour l'installation de votre <span className="text-blue-600">Climatisation Réversible</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-xl">
                            Obtenez une estimation précise du coût de votre projet après déduction des primes de l'État (MaPrimeRénov', CEE, TVA réduite).
                        </p>
                        
                        <Button 
                            onClick={() => scrollToSection('calculateur')} 
                            className="bg-blue-600 text-white px-8 py-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] shadow-xl shadow-blue-200/50"
                        >
                            <Calculator className="mr-2 w-5 h-5" />
                            Lancer ma simulation gratuite
                        </Button>
                        
                        <div className="mt-8 flex flex-wrap gap-6 text-gray-600 text-sm">
                            <div className="flex items-center">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                <span>Devis gratuit & sans engagement</span>
                            </div>
                            <div className="flex items-center">
                                <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                <span>Installation par Expert RGE</span>
                            </div>
                        </div>
                    </div>

                    {/* Colonne de droite: Statistiques et visuel (simplifié) */}
                    <div className="hidden lg:block relative">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Nos garanties</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <Bolt className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Intervention Rapide</p>
                                        <p className="text-gray-600 text-sm">Installation possible sous 48h selon disponibilité.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Euro className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Aides Maximisées</p>
                                        <p className="text-gray-600 text-sm">Jusqu'à 70% d'économies sur le coût total du projet.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <User className="w-6 h-6 text-purple-600 mr-4 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Expertise RGE</p>
                                        <p className="text-gray-600 text-sm">Seuls les professionnels RGE garantissent l'accès aux aides.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const AvantagesSection = () => (
    <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Euro className="text-blue-600 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Économies garanties</h3>
                    <p className="text-gray-600 text-sm">Jusqu'à 70% d'économies grâce aux aides de l'État</p>
                </div>
                <div className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bolt className="text-green-600 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Installation rapide</h3>
                    <p className="text-gray-600 text-sm">Intervention sous 48h partout en France</p>
                </div>
                <div className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                    <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-purple-600 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Garantie 5 ans</h3>
                    <p className="text-gray-600 text-sm">Maintenance et SAV inclus pendant 5 ans</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyChooseUsSection = () => (
    <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nos engagements qualité</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calculator className="text-blue-600 w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Simulateur précis</h3>
                    <p className="text-gray-600 text-sm">Notre algorithme calcule précisément vos aides et économies</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gift className="text-green-600 w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Aides optimisées</h3>
                    <p className="text-gray-600 text-sm">Nous maximisons vos aides jusqu'à 70% d'économies</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-purple-600 w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Expert dédié</h3>
                    <p className="text-gray-600 text-sm">Un conseiller vous accompagne de A à Z</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-orange-600 w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Garantie totale</h3>
                    <p className="text-gray-600 text-sm">Installation et matériel garantis 5 ans</p>
                </div>
            </div>
        </div>
    </section>
);

const CalculatorSection = ({ 
    currentStep, 
    setCurrentStep, 
    selectedInstallationType, 
    setSelectedInstallationType, 
    setCalculationData,
    scrollToSection
}: {
    currentStep: number;
    setCurrentStep: (step: number) => void;
    selectedInstallationType: string;
    setSelectedInstallationType: (type: string) => void;
    setCalculationData: (data: CalculationData) => void;
    scrollToSection: (id: string) => void;
}) => {
    const [formData, setFormData] = useState({
        surface: 50,
        rooms: "2",
        housingType: "maison",
        constructionYear: "moyen",
        insulation: "bonne",
        department: "placeholder",
        reversible: true,
        wifi: false,
        inverter: true,
        installation: true,
        income: 35000,
        householdSize: "3",
        houseAge: "moins15",
        propertyStatus: "residence_principale",
        ownerType: "occupant",
    });
    const [errors, setErrors] = useState({ surface: "", department: "", income: "" });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseInt(value) : value
        }));
        setErrors(prev => ({ ...prev, [id]: "" }));
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [id]: checked
        }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setErrors(prev => ({ ...prev, [id]: "" }));
    };

    const validateStep = useCallback((step: number) => {
        let isValid = true;
        let newErrors = { surface: "", department: "", income: "" };

        if (step === 1) {
            if (!selectedInstallationType) {
                showError('Veuillez sélectionner un type d\'installation.');
                isValid = false;
            }
            if (!formData.surface || formData.surface < 10 || formData.surface > 500) {
                newErrors.surface = 'Veuillez saisir une surface valide entre 10 et 500 m²';
                isValid = false;
            }
        } else if (step === 2) {
            if (!formData.department || formData.department === 'placeholder') {
                newErrors.department = 'Veuillez sélectionner votre département';
                isValid = false;
            }
        } else if (step === 3) {
            if (!formData.income || formData.income <= 0) {
                newErrors.income = 'Veuillez saisir un revenu fiscal de référence valide';
                isValid = false;
            }
        }

        setErrors(newErrors);
        if (!isValid) {
            showError('Veuillez corriger les champs obligatoires.');
        }
        return isValid;
    }, [formData, selectedInstallationType]);

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const calculateEstimate = () => {
        if (!validateStep(3)) {
            return;
        }

        const toastId = showLoading("Calcul de votre estimation en cours...");

        // Simulation de calcul
        setTimeout(() => {
            dismissToast(toastId);
            
            const surface = formData.surface;
            const rooms = parseInt(formData.rooms);
            const income = formData.income;
            const householdSize = parseInt(formData.householdSize);
            const houseAge = formData.houseAge;
            const propertyStatus = formData.propertyStatus;
            const ownerType = formData.ownerType;

            let basePrice = 0;
            let equipmentCost = 0;
            let installationCost = 0;
            
            switch(selectedInstallationType) {
                case 'monosplit':
                    basePrice = 1290;
                    equipmentCost = 800;
                    installationCost = 490;
                    break;
                case 'multisplit':
                    basePrice = 2490 + (rooms - 2) * 500;
                    equipmentCost = 1800 + (rooms - 2) * 400;
                    installationCost = 690;
                    break;
                case 'gainable':
                    basePrice = 3990 + (rooms - 2) * 600;
                    equipmentCost = 2800 + (rooms - 2) * 500;
                    installationCost = 1190;
                    break;
            }
            
            const surfaceMultiplier = 1 + Math.max(0, (surface - 50) * 0.01);
            basePrice = basePrice * surfaceMultiplier;
            equipmentCost = equipmentCost * surfaceMultiplier;
            
            let optionsCost = 0;
            if (formData.reversible) optionsCost += 400;
            if (formData.wifi) optionsCost += 150;
            if (formData.inverter) optionsCost += 200;
            
            const totalHT = basePrice + optionsCost;
            const vat = totalHT * 0.1; 
            const totalTTC = totalHT + vat;
            
            // Aides
            let maprime = 0;
            const incomeThresholds = {
                1: { veryModest: 15677, modest: 21093 },
                2: { veryModest: 22960, modest: 30914 },
                3: { veryModest: 27579, modest: 37121 },
                4: { veryModest: 32206, modest: 43337 },
                5: { veryModest: 36851, modest: 49569 }
            };
            
            const thresholds = incomeThresholds[householdSize] || incomeThresholds[5];
            
            if (income <= thresholds.veryModest) {
                maprime = Math.min(4000, totalTTC * 0.75);
            } else if (income <= thresholds.modest) {
                maprime = Math.min(3000, totalTTC * 0.6);
            } else {
                maprime = Math.min(2000, totalTTC * 0.4);
            }
            
            let cee = 0;
            if (formData.inverter) {
                cee = 350 + (surface * 2);
            } else {
                cee = 200 + (surface * 1.5);
            }
            cee = Math.min(cee, 800);
            
            const tvaReduced = vat;
            
            let ecoPTZ = 0;
            const eligibleForEcoPTZ = (
                houseAge === 'plus15' && 
                propertyStatus === 'residence_principale' &&
                (ownerType === 'occupant' || ownerType === 'bailleur')
            );
            
            if (eligibleForEcoPTZ) {
                ecoPTZ = Math.min(15000, totalTTC * 0.7);
            }
            
            const totalAides = maprime + cee + tvaReduced;
            const finalCost = Math.max(0, totalTTC - totalAides);
            const savings = totalTTC - finalCost;

            const results: CalculationData = {
                ...formData,
                selectedInstallationType,
                surface, rooms, income, householdSize,
                equipmentCost: Math.round(equipmentCost),
                installationCost: Math.round(installationCost),
                optionsCost: Math.round(optionsCost),
                totalCost: Math.round(totalHT),
                vatCost: Math.round(vat),
                totalTTC: Math.round(totalTTC),
                maprime: Math.round(maprime),
                cee: Math.round(cee),
                tvaReduced: Math.round(tvaReduced),
                ecoPTZ: Math.round(ecoPTZ),
                totalAides: Math.round(totalAides),
                finalCost: Math.round(finalCost),
                savings: Math.round(savings),
                eligibleEcoPTZ: eligibleEcoPTZ
            };

            setCalculationData(results);
            scrollToSection('results');
            showSuccess('Estimation calculée avec succès !');
        }, 1500);
    };

    const progressPercentage = ((currentStep - 1) / 2) * 100;

    return (
        <section id="calculateur" className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">
                        <span className="text-red-500">*</span> Champs obligatoires pour le calcul des aides
                    </p>
                </div>

                {/* Indicateur d'étapes amélioré avec progression */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center space-x-4">
                        <StepIndicator step={1} label="Installation" currentStep={currentStep} />
                        <div className="w-20 h-2 bg-gray-200 rounded-full mt-[-20px] relative">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: currentStep > 1 ? '100%' : '0%' }}></div>
                        </div>
                        <StepIndicator step={2} label="Logement" currentStep={currentStep} />
                        <div className="w-20 h-2 bg-gray-200 rounded-full mt-[-20px] relative">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: currentStep > 2 ? '100%' : '0%' }}></div>
                        </div>
                        <StepIndicator step={3} label="Aides" currentStep={currentStep} />
                    </div>
                </div>

                {/* Indicateur de progression globale */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-white rounded-full h-3 shadow-inner">
                        <div id="global-progress" className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>0%</span>
                        <span id="progress-text">Étape {currentStep} sur 3</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden calculator-card">
                    {/* Étape 1: Type d'installation améliorée */}
                    <div id="step1" className={cn("step-content", currentStep !== 1 && "hidden")}>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Étape 1: Type d'installation</h2>
                            <p className="text-gray-600">Sélectionnez le type de climatisation qui correspond à vos besoins</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <InstallationCard 
                                type="monosplit" 
                                icon={Home} 
                                title="Monosplit" 
                                description="Une unité intérieure + une unité extérieure" 
                                price="À partir de 1290€" 
                                details={["⭐ Idéal pour 1 pièce", "⚡ Puissance: 2.5 à 3.5 kW", "🏠 Surface: 10 à 35 m²"]}
                                selectedInstallationType={selectedInstallationType}
                                setSelectedInstallationType={setSelectedInstallationType}
                            />
                            <InstallationCard 
                                type="multisplit" 
                                icon={Building} 
                                title="Multisplit" 
                                description="Plusieurs unités intérieures + une unité extérieure" 
                                price="À partir de 2490€" 
                                details={["🏠 Idéal pour 2-5 pièces", "⚡ Puissance: 5 à 10 kW", "📏 Surface: 35 à 100 m²"]}
                                selectedInstallationType={selectedInstallationType}
                                setSelectedInstallationType={setSelectedInstallationType}
                            />
                            <InstallationCard 
                                type="gainable" 
                                icon={Wind} 
                                title="Gainable" 
                                description="Système discret intégré dans les combles" 
                                price="À partir de 3990€" 
                                details={["✨ Solution haut de gamme", "⚡ Puissance: 8 à 18 kW", "🏰 Surface: 80 à 200 m²"]}
                                selectedInstallationType={selectedInstallationType}
                                setSelectedInstallationType={setSelectedInstallationType}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="surface" className="flex items-center mb-2">
                                    Surface à climatiser (m²) <span className="text-red-500 ml-1">*</span>
                                    <Tooltip text="Surface totale des pièces à climatiser. Pour une estimation précise, mesurez chaque pièce." />
                                </Label>
                                <Input 
                                    type="number" 
                                    id="surface" 
                                    value={formData.surface}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 50" 
                                    min={10} 
                                    max={500} 
                                    required
                                    className={cn(errors.surface && "invalid-field")}
                                />
                                {errors.surface && <p className="error-message">{errors.surface}</p>}
                                <div className="text-xs text-gray-500 mt-1">
                                    <span>10m² minimum</span> - <span>500m² maximum</span>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="rooms" className="block mb-2">Nombre de pièces à climatiser</Label>
                                <Select onValueChange={(value) => handleSelectChange('rooms', value)} value={formData.rooms.toString()}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez le nombre de pièces" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 pièce</SelectItem>
                                        <SelectItem value="2">2 pièces</SelectItem>
                                        <SelectItem value="3">3 pièces</SelectItem>
                                        <SelectItem value="4">4 pièces</SelectItem>
                                        <SelectItem value="5">5 pièces ou plus</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Étape 2: Caractéristiques améliorée */}
                    <div id="step2" className={cn("step-content", currentStep !== 2 && "hidden")}>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Étape 2: Caractéristiques du logement</h2>
                            <p className="text-gray-600">Ces informations nous aident à affiner votre estimation</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="housingType" className="block mb-2">Type de logement</Label>
                                <Select onValueChange={(value) => handleSelectChange('housingType', value)} value={formData.housingType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="appartement">Appartement</SelectItem>
                                        <SelectItem value="maison">Maison individuelle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="constructionYear" className="block mb-2">Année de construction</Label>
                                <Select onValueChange={(value) => handleSelectChange('constructionYear', value)} value={formData.constructionYear}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Après 2012 (RT 2012)</SelectItem>
                                        <SelectItem value="moyen">2000-2012</SelectItem>
                                        <SelectItem value="ancien">Avant 2000</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="insulation" className="flex items-center mb-2">
                                    Isolation
                                    <Tooltip text="Qualité de l'isolation de votre logement. Influence la puissance nécessaire." />
                                </Label>
                                <Select onValueChange={(value) => handleSelectChange('insulation', value)} value={formData.insulation}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="excellente">Excellente (BBC, RT 2012+)</SelectItem>
                                        <SelectItem value="bonne">Bonne</SelectItem>
                                        <SelectItem value="moyenne">Moyenne</SelectItem>
                                        <SelectItem value="faible">Faible</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="department" className="block mb-2">Département <span className="text-red-500">*</span></Label>
                                <Select onValueChange={(value) => handleSelectChange('department', value)} value={formData.department}>
                                    <SelectTrigger className={cn(errors.department && "invalid-field")}>
                                        <SelectValue placeholder="Sélectionnez votre département" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTEMENTS_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value} disabled={opt.value === 'placeholder'}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department && <p className="error-message">{errors.department}</p>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <Label className="block text-sm font-medium text-gray-700 mb-3">Options souhaitées</Label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition duration-300 cursor-pointer">
                                    <Checkbox 
                                        id="reversible" 
                                        checked={formData.reversible} 
                                        onCheckedChange={(checked) => handleCheckboxChange('reversible', !!checked)} 
                                        className="mr-3"
                                    />
                                    <Label htmlFor="reversible">Climatisation réversible (chaud/froid)</Label>
                                </div>
                                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition duration-300 cursor-pointer">
                                    <Checkbox 
                                        id="wifi" 
                                        checked={formData.wifi} 
                                        onCheckedChange={(checked) => handleCheckboxChange('wifi', !!checked)} 
                                        className="mr-3"
                                    />
                                    <Label htmlFor="wifi">Contrôle WiFi</Label>
                                </div>
                                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition duration-300 cursor-pointer">
                                    <Checkbox 
                                        id="inverter" 
                                        checked={formData.inverter} 
                                        onCheckedChange={(checked) => handleCheckboxChange('inverter', !!checked)} 
                                        className="mr-3"
                                    />
                                    <Label htmlFor="inverter">Technologie Inverter</Label>
                                </div>
                                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition duration-300 cursor-pointer">
                                    <Checkbox 
                                        id="installation" 
                                        checked={formData.installation} 
                                        onCheckedChange={(checked) => handleCheckboxChange('installation', !!checked)} 
                                        className="mr-3"
                                    />
                                    <Label htmlFor="installation">Installation par professionnel RGE</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Étape 3: Situation financière améliorée */}
                    <div id="step3" className={cn("step-content", currentStep !== 3 && "hidden")}>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Étape 3: Éligibilité aux aides</h2>
                            <p className="text-gray-600">Ces informations déterminent votre éligibilité aux aides financières</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="income" className="flex items-center mb-2">
                                    Revenu fiscal de référence (€) <span className="text-red-500 ml-1">*</span>
                                    <Tooltip text="Montant indiqué sur votre avis d'imposition. Détermine le montant des aides." />
                                </Label>
                                <Input 
                                    type="number" 
                                    id="income" 
                                    value={formData.income}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 35000" 
                                    required
                                    className={cn(errors.income && "invalid-field")}
                                />
                                {errors.income && <p className="error-message">{errors.income}</p>}
                            </div>
                            <div>
                                <Label htmlFor="householdSize" className="block mb-2">Nombre de personnes dans le foyer</Label>
                                <Select onValueChange={(value) => handleSelectChange('householdSize', value)} value={formData.householdSize}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 personne</SelectItem>
                                        <SelectItem value="2">2 personnes</SelectItem>
                                        <SelectItem value="3">3 personnes</SelectItem>
                                        <SelectItem value="4">4 personnes</SelectItem>
                                        <SelectItem value="5">5+ personnes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <Label htmlFor="houseAge" className="block mb-2">Âge du logement</Label>
                                <Select onValueChange={(value) => handleSelectChange('houseAge', value)} value={formData.houseAge}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="plus15">Plus de 15 ans</SelectItem>
                                        <SelectItem value="moins15">Moins de 15 ans</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="currentHeating" className="block mb-2">Système de chauffage actuel</Label>
                                <Select onValueChange={(value) => handleSelectChange('currentHeating', value)} value={formData.currentHeating}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="electrique">Électrique</SelectItem>
                                        <SelectItem value="gaz">Gaz</SelectItem>
                                        <SelectItem value="fioul">Fioul</SelectItem>
                                        <SelectItem value="autre">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                                <Info className="w-5 h-5 mr-2" />
                                Informations pour l'éco-PTZ
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="propertyStatus" className="block mb-2">Statut du logement</Label>
                                    <Select onValueChange={(value) => handleSelectChange('propertyStatus', value)} value={formData.propertyStatus}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="residence_principale">Résidence principale</SelectItem>
                                            <SelectItem value="residence_secondaire">Résidence secondaire</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="ownerType" className="block mb-2">Type de propriétaire</Label>
                                    <Select onValueChange={(value) => handleSelectChange('ownerType', value)} value={formData.ownerType}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="occupant">Propriétaire occupant</SelectItem>
                                            <SelectItem value="bailleur">Propriétaire bailleur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <Button onClick={calculateEstimate} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg">
                                <Calculator className="w-5 h-5 mr-2" />Calculer mon devis
                            </Button>
                        </div>
                    </div>

                    {/* Navigation entre étapes améliorée */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                        <Button 
                            id="prevBtn" 
                            onClick={previousStep} 
                            variant="secondary"
                            className={cn("px-6 py-3 font-semibold flex items-center", currentStep === 1 && "invisible")}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />Précédent
                        </Button>
                        <div className="flex-1 text-center">
                            <div className="text-sm text-gray-500">Étape {currentStep} sur 3</div>
                        </div>
                        <Button 
                            id="nextBtn" 
                            onClick={currentStep === 3 ? calculateEstimate : nextStep} 
                            className="bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition duration-300 ml-auto flex items-center group"
                        >
                            <span>{currentStep === 3 ? "Calculer mon devis" : "Suivant"}</span>
                            {currentStep !== 3 && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ResultsSection = ({ data, openContactModal }: { data: CalculationData | null, openContactModal: () => void }) => {
    if (!data) return null;

    const savingsPercentage = (data.savings / data.totalTTC) * 100;

    const aides = [
        { name: 'MaPrimeRénov\'', amount: data.maprime, color: 'blue' },
        { name: 'Prime CEE', amount: data.cee, color: 'green' },
        { name: 'TVA réduite 10%', amount: data.tvaReduced, color: 'purple' }
    ];

    const formatCurrency = (amount: number) => `${amount.toLocaleString('fr-FR')}€`;

    return (
        <div id="results" className="py-16 bg-white result-animation">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Votre estimation personnalisée</h2>
                    <p className="text-xl text-gray-600">Basée sur vos informations et les dernières aides 2025</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
                        <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center justify-center">
                            <Euro className="w-6 h-6 mr-2" />Avant aides
                        </h3>
                        <div className="text-4xl font-bold text-red-900 mb-2 line-through">{formatCurrency(data.totalTTC)}</div>
                        <p className="text-red-700">Prix public TTC</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
                        <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center justify-center">
                            <Gift className="w-6 h-6 mr-2" />Après aides
                        </h3>
                        <div className="text-5xl font-bold text-green-900 mb-2">{formatCurrency(data.finalCost)}</div>
                        <p className="text-green-700">Coût final après aides</p>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-md">
                        <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                            <Euro className="w-6 h-6 mr-2" />Détail du coût d'installation
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center">Équipement <Tooltip text="Prix des unités intérieures et extérieures, télécommande" /></span>
                                <span className="font-semibold text-lg">{formatCurrency(data.equipmentCost)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center">Installation <Tooltip text="Main d'œuvre professionnelle RGE, mise en service" /></span>
                                <span className="font-semibold text-lg">{formatCurrency(data.installationCost)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center">Options <Tooltip text="Fonctions supplémentaires sélectionnées" /></span>
                                <span className="font-semibold text-lg">{formatCurrency(data.optionsCost)}</span>
                            </div>
                            <hr className="border-blue-200 my-4" />
                            <div className="flex justify-between text-xl font-bold text-blue-800">
                                <span>Total HT:</span>
                                <span>{formatCurrency(data.totalCost)}</span>
                            </div>
                            <div className="flex justify-between text-lg text-blue-700">
                                <span>TVA réduite (10%):</span>
                                <span>{formatCurrency(data.vatCost)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-blue-900 bg-white rounded-lg p-4 mt-4 border border-blue-200 shadow-sm">
                                <span>Total TTC:</span>
                                <span>{formatCurrency(data.totalTTC)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 shadow-md">
                        <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                            <Gift className="w-6 h-6 mr-2" />Détail des aides disponibles
                        </h3>
                        <div className="space-y-4">
                            {aides.filter(a => a.amount > 0).map(aide => (
                                <div key={aide.name} className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        <div className={cn("w-3 h-3 rounded-full mr-2", aide.color === 'blue' ? 'bg-blue-500' : aide.color === 'green' ? 'bg-green-500' : 'bg-purple-500')}></div>
                                        {aide.name}
                                    </span>
                                    <span className="font-semibold text-green-600">+{formatCurrency(aide.amount)}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="border-green-200 my-6" />
                        <div className="flex justify-between text-2xl font-bold text-green-900 bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                            <span>Total des aides:</span>
                            <span>{formatCurrency(data.totalAides)}</span>
                        </div>
                    </div>
                </div>

                {data.eligibleEcoPTZ && data.ecoPTZ > 0 && (
                    <div id="pretsSection" className="mt-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200 shadow-md">
                        <h3 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                            <University className="w-6 h-6 mr-2" />Solutions de financement
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                                    Éco-PTZ (prêt à taux 0%)
                                </span>
                                <span className="font-semibold text-orange-600">Jusqu'à {formatCurrency(data.ecoPTZ)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl">
                    <h3 className="text-3xl font-bold mb-6 relative z-10">Votre investissement final</h3>
                    <div className="text-6xl font-bold mb-4 relative z-10">{formatCurrency(data.finalCost)}</div>
                    <p className="text-xl opacity-90 mb-6 relative z-10">Soit une économie de <span className="font-bold text-yellow-300">{formatCurrency(data.savings)}</span></p>
                    
                    <div className="max-w-md mx-auto bg-white/20 rounded-full h-4 mb-6 relative z-10">
                        <div className="bg-yellow-400 h-4 rounded-full transition-all duration-500" style={{ width: `${savingsPercentage}%` }}></div>
                    </div>
                    
                    {data.eligibleEcoPTZ && data.ecoPTZ > 0 && (
                        <div className="mt-6 bg-white/20 rounded-lg p-4 relative z-10">
                            <p className="text-lg">
                                Avec l'éco-PTZ, vous pouvez financer jusqu'à {formatCurrency(data.ecoPTZ)} à taux 0% sur 15 ans.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 relative z-10">
                        <Button onClick={openContactModal} className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 flex items-center justify-center">
                            <Mail className="w-5 h-5 mr-2" />Recevoir mon devis personnalisé
                        </Button>
                        <Button variant="outline" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition duration-300 flex items-center justify-center">
                            <Download className="w-5 h-5 mr-2" />Télécharger cette estimation
                        </Button>
                    </div>
                    <p className="text-sm mt-4 opacity-75 relative z-10">
                        <Shield className="w-4 h-4 mr-1 inline-block" />Un expert vous contactera sous 24h - Sans engagement
                    </p>
                </div>
            </div>
        </div>
    );
};

const GuideSection = () => (
    <section id="guide" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Guide d'achat : Choisir le bon climatiseur en 2025</h2>
                
                <div className="space-y-8">
                    <article className="border-b border-gray-200 pb-6">
                        <h3 className="text-2xl font-bold text-blue-600 mb-3">Climatiseur Mobile : La Solution Flexible</h3>
                        <p className="text-gray-700 mb-4">
                            Le <strong>climatiseur mobile</strong> est idéal pour les locations, les petits espaces ou en solution d'appoint. 
                            Nos experts vous conseillent sur les meilleurs modèles de <strong>climatiseur portable</strong> adaptés à vos besoins.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-bold text-blue-800 mb-2">Avantages du climatiseur mobile :</h4>
                            <ul className="list-disc list-inside text-blue-700 space-y-1">
                                <li>Installation facile sans travaux</li>
                                <li>Idéal pour les locations et appartements</li>
                                <li>Solution économique pour une pièce</li>
                                <li>Déplacement facile entre les pièces</li>
                            </ul>
                        </div>
                    </article>

                    <article className="border-b border-gray-200 pb-6">
                        <h3 className="text-2xl font-bold text-green-600 mb-3">Climatiseur Réversible : Chauffage et Rafraîchissement</h3>
                        <p className="text-gray-700 mb-4">
                            Le <strong>climatiseur réversible</strong> offre le confort toute l'année. 
                            Notre simulateur calcule les aides disponibles pour l'installation d'un système réversible.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-bold text-green-800 mb-2 flex items-center"><Check className="w-4 h-4 mr-2" /> Avantages</h4>
                                <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                                    <li>Solution 2-en-1 chauffage/climatisation</li>
                                    <li>Économies d'énergie importantes</li>
                                    <li>Éligible aux aides MaPrimeRénov'</li>
                                    <li>Confort optimal toute l'année</li>
                                </ul>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <h4 className="font-bold text-orange-800 mb-2 flex items-center"><Home className="w-4 h-4 mr-2" /> Idéal pour</h4>
                                <ul className="list-disc list-inside text-orange-700 text-sm space-y-1">
                                    <li>Maisons individuelles</li>
                                    <li>Appartements avec terrasse</li>
                                    <li>Rénovation énergétique</li>
                                    <li>Remplacement chauffage ancien</li>
                                </ul>
                            </div>
                        </div>
                    </article>

                    <article className="border-b border-gray-200 pb-6">
                        <h3 className="text-2xl font-bold text-purple-600 mb-3">Climatiseur Split : Performance et Discrétion</h3>
                        <p className="text-gray-700 mb-4">
                            Les systèmes <strong>climatiseur split</strong> (monosplit et multisplit) offrent les meilleures performances 
                            pour le rafraîchissement de votre habitation. Notre calculateur vous aide à choisir entre monosplit et multisplit.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div className="text-center">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Home className="text-purple-600 w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-purple-800">Monosplit</h4>
                                <p className="text-sm text-gray-600 mt-2">1 unité intérieure + 1 unité extérieure<br/>Parfait pour une pièce</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Building className="text-indigo-600 w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-indigo-800">Multisplit</h4>
                                <p className="text-sm text-gray-600 mt-2">Plusieurs unités intérieures<br/>Idéal pour 2 à 5 pièces</p>
                            </div>
                        </div>
                    </article>

                    <article>
                        <h3 className="text-2xl font-bold text-red-600 mb-4">Comment choisir son climatiseur ?</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-red-100 p-2 rounded-lg mr-3">
                                        <Ruler className="text-red-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Surface à rafraîchir</h4>
                                        <p className="text-sm text-gray-600">10-25m² : 9000 BTU | 25-35m² : 12000 BTU | 35-50m² : 18000 BTU</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                        <Volume2 className="text-blue-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Niveau sonore</h4>
                                        <p className="text-sm text-gray-600">Privilégiez les modèles <strong>climatiseur silencieux</strong> en dessous de 25 dB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                        <Bolt className="text-green-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Technologie Inverter</h4>
                                        <p className="text-sm text-gray-600">Les <strong>climatiseurs inverter</strong> permettent jusqu'à 40% d'économie d'énergie</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                        <Wifi className="text-purple-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Connexion intelligente</h4>
                                        <p className="text-sm text-gray-600">Les <strong>climatiseurs connectés</strong> offrent un contrôle à distance</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};

const PrimesSection = () => (
    <section id="primes" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Toutes les aides disponibles en 2025</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
                    <Home className="text-blue-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">MaPrimeRénov'</h3>
                    <p className="text-gray-600 mb-4">Aide de l'État pour l'installation de pompes à chaleur air-air.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Revenus très modestes:</span><span className="font-semibold text-green-600">Jusqu'à 4000€</span></div>
                        <div className="flex justify-between"><span>Revenus modestes:</span><span className="font-semibold text-green-600">Jusqu'à 3000€</span></div>
                        <div className="flex justify-between"><span>Revenus intermédiaires:</span><span className="font-semibold text-green-600">Jusqu'à 2000€</span></div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
                    <Leaf className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Prime CEE</h3>
                    <p className="text-gray-600 mb-4">Certificats d'Économies d'Énergie versés par les fournisseurs d'énergie.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Montant moyen:</span><span className="font-semibold text-green-600">200€ à 800€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Cumulable avec MaPrimeRénov'</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
                    <Percent className="text-purple-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">TVA à 10%</h3>
                    <p className="text-gray-600 mb-4">Taux de TVA réduit pour les travaux d'amélioration énergétique.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Au lieu de 20%:</span><span className="font-semibold text-green-600">TVA à 10%</span></div>
                        <div className="text-xs text-gray-500 mt-2">Logement de plus de 2 ans</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
                    <University className="text-orange-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Éco-PTZ</h3>
                    <p className="text-gray-600 mb-4">Prêt à taux zéro pour financer vos travaux de rénovation énergétique.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Montant max:</span><span className="font-semibold text-green-600">Jusqu'à 15000€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Remboursement sur 15 ans</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border border-red-200">
                    <MapPinIcon className="text-red-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Aides locales</h3>
                    <p className="text-gray-600 mb-4">Subventions des collectivités territoriales (région, département, commune).</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Variable selon région:</span><span className="font-semibold text-green-600">500€ à 2000€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Consultez votre mairie</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border border-yellow-200">
                    <Ticket className="text-yellow-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Chèque énergie</h3>
                    <p className="text-gray-600 mb-4">Aide pour payer les factures d'énergie ou financer des travaux.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Montant annuel:</span><span className="font-semibold text-green-600">48€ à 277€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Selon revenus du foyer</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Questions fréquentes</h2>
                
                <div className="space-y-6">
                    {FAQ_DATA.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <button className="flex justify-between items-center w-full text-left" onClick={() => toggleFAQ(index)}>
                                <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                                <ChevronDown className={cn("text-blue-600 transition-transform duration-300 w-5 h-5", openIndex === index && "rotate-180")} />
                            </button>
                            <div className={cn("mt-4 text-gray-600 transition-all duration-300 overflow-hidden", openIndex === index ? "max-h-96" : "max-h-0")}>
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ContactSection = () => {
    const { sendData, isLoading } = useDataSender();
    const [formData, setFormData] = useState({
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        contactDepartment: "placeholder",
        contactMessage: "",
        contactConsent: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, contactDepartment: value }));
    };

    const handleConsentChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, contactConsent: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.contactConsent) {
            showError("Veuillez accepter d'être contacté.");
            return;
        }
        if (formData.contactDepartment === 'placeholder') {
            showError("Veuillez sélectionner votre département.");
            return;
        }

        const success = await sendData(formData, 'contact');
        if (success) {
            setFormData({
                contactName: "",
                contactPhone: "",
                contactEmail: "",
                contactDepartment: "placeholder",
                contactMessage: "",
                contactConsent: false,
            });
        }
    };

    return (
        <section id="contact" className="py-16 bg-blue-900 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Contactez nos experts</h2>
                    <p className="text-xl text-blue-200">Une question ? Un projet ? Nos conseillers vous répondent sous 24h</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Contactez nos experts</h2>
                        <p className="text-xl mb-8 text-blue-200">Nos conseillers vous accompagnent dans votre projet et optimisent vos aides financières</p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <Phone className="w-6 h-6 text-yellow-400 mr-4" />
                                <div>
                                    <h3 className="font-bold">Téléphone</h3>
                                    <p className="text-blue-200">01 23 45  67 89</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-6 h-6 text-yellow-400 mr-4" />
                                <div>
                                    <h3 className="font-bold">Email</h3>
                                    <p className="text-blue-200">contact@climatiseur.pro</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-6 h-6 text-yellow-400 mr-4" />
                                <div>
                                    <h3 className="font-bold">Zone d'intervention</h3>
                                    <p className="text-blue-200">France entière</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-6 h-6 text-yellow-400 mr-4" />
                                <div>
                                    <h3 className="font-bold">Horaires</h3>
                                    <p className="text-blue-200">Lun-Ven: 8h-19h • Sam: 9h-17h</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 text-gray-800 shadow-xl">
                        <h3 className="text-2xl font-bold mb-6">Demande d'information</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label htmlFor="contactName" className="block mb-2">Nom *</Label>
                                    <Input type="text" id="contactName" required value={formData.contactName} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="contactPhone" className="block mb-2">Téléphone *</Label>
                                    <Input type="tel" id="contactPhone" required value={formData.contactPhone} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="contactEmail" className="block mb-2">Email *</Label>
                                <Input type="email" id="contactEmail" required value={formData.contactEmail} onChange={handleInputChange} />
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="contactDepartment" className="block mb-2">Département *</Label>
                                <Select onValueChange={handleSelectChange} value={formData.contactDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez votre département" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTEMENTS_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value} disabled={opt.value === 'placeholder'}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="contactMessage" className="block mb-2">Message</Label>
                                <Textarea id="contactMessage" rows={4} placeholder="Décrivez votre projet..." value={formData.contactMessage} onChange={handleInputChange} />
                            </div>
                            <div className="flex items-center mb-6">
                                <Checkbox id="contactConsent" checked={formData.contactConsent} onCheckedChange={handleConsentChange} className="mr-3" />
                                <Label htmlFor="contactConsent" className="text-sm text-gray-600">J'accepte d'être contacté pour recevoir mon devis personnalisé *</Label>
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                                {isLoading ? (
                                    <span className="flex items-center"><span className="loading-spinner mr-2"></span>Envoi en cours...</span>
                                ) : (
                                    <span className="flex items-center justify-center"><Mail className="w-5 h-5 mr-2" />Envoyer ma demande</span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

const PrimesSection = () => (
    <section id="primes" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Toutes les aides disponibles en 2025</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border border-blue-200">
                    <Home className="text-blue-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">MaPrimeRénov'</h3>
                    <p className="text-gray-600 mb-4">Aide de l'État pour l'installation de pompes à chaleur air-air.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Revenus très modestes:</span><span className="font-semibold text-green-600">Jusqu'à 4000€</span></div>
                        <div className="flex justify-between"><span>Revenus modestes:</span><span className="font-semibold text-green-600">Jusqu'à 3000€</span></div>
                        <div className="flex justify-between"><span>Revenus intermédiaires:</span><span className="font-semibold text-green-600">Jusqu'à 2000€</span></div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border border-green-200">
                    <Leaf className="text-green-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Prime CEE</h3>
                    <p className="text-gray-600 mb-4">Certificats d'Économies d'Énergie versés par les fournisseurs d'énergie.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Montant moyen:</span><span className="font-semibold text-green-600">200€ à 800€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Cumulable avec MaPrimeRénov'</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border border-purple-200">
                    <Percent className="text-purple-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">TVA à 10%</h3>
                    <p className="text-gray-600 mb-4">Taux de TVA réduit pour les travaux d'amélioration énergétique.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Au lieu de 20%:</span><span className="font-semibold text-green-600">TVA à 10%</span></div>
                        <div className="text-xs text-gray-500 mt-2">Logement de plus de 2 ans</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 border border-orange-200">
                    <University className="text-orange-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Éco-PTZ</h3>
                    <p className="text-gray-600 mb-4">Prêt à taux zéro pour financer vos travaux de rénovation énergétique.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Montant max:</span><span className="font-semibold text-green-600">Jusqu'à 15000€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Remboursement sur 15 ans</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border border-red-200">
                    <MapPinIcon className="text-red-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Aides locales</h3>
                    <p className="text-gray-600 mb-4">Subventions des collectivités territoriales (région, département, commune).</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Variable selon région:</span><span className="font-semibold text-green-600">500€ à 2000€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Consultez votre mairie</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg p-6 border border-yellow-200">
                    <Ticket className="text-yellow-600 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-3">Chèque énergie</h3>
                    <p className="text-gray-600 mb-4">Aide pour payer les factures d'énergie ou financer des travaux.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Montant annuel:</span><span className="font-semibold text-green-600">48€ à 277€</span></div>
                        <div className="text-xs text-gray-500 mt-2">Selon revenus du foyer</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const QuickContactModal = ({ isOpen, onClose, calculationData }: { isOpen: boolean, onClose: () => void, calculationData: CalculationData | null }) => {
    const { sendData, isLoading } = useDataSender();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        department: calculationData?.department || "placeholder",
        consent: false,
    });

    useEffect(() => {
        if (calculationData?.department && calculationData.department !== 'placeholder') {
            setFormData(prev => ({ ...prev, department: calculationData.department }));
        }
    }, [calculationData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, department: value }));
    };

    const handleConsentChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, consent: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.consent) {
            showError("Veuillez accepter la politique de confidentialité.");
            return;
        }
        if (formData.department === 'placeholder') {
            showError("Veuillez sélectionner votre département.");
            return;
        }

        const success = await sendData(formData, 'quick', calculationData);
        if (success) {
            onClose();
            setFormData({
                name: "",
                phone: "",
                email: "",
                department: calculationData?.department || "placeholder",
                consent: false,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-8 rounded-2xl">
                <DialogHeader className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-blue-600 w-8 h-8" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-blue-600">Vos coordonnées</DialogTitle>
                    <p className="text-gray-600">Pour que nos experts puissent vous contacter</p>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="block mb-2">Nom complet *</Label>
                            <Input type="text" id="name" required value={formData.name} onChange={handleInputChange} placeholder="Votre nom et prénom" />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="block mb-2">Téléphone *</Label>
                            <Input type="tel" id="phone" required value={formData.phone} onChange={handleInputChange} placeholder="01 23 45 67 89" />
                        </div>
                        <div>
                            <Label htmlFor="email" className="block mb-2">Email *</Label>
                            <Input type="email" id="email" required value={formData.email} onChange={handleInputChange} placeholder="votre@email.com" />
                        </div>
                        <div>
                            <Label htmlFor="department" className="block mb-2">Département *</Label>
                            <Select onValueChange={handleSelectChange} value={formData.department}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez votre département" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DEPARTEMENTS_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value} disabled={opt.value === 'placeholder'}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-start">
                            <Checkbox id="consent" checked={formData.consent} onCheckedChange={handleConsentChange} className="mr-3 mt-1" />
                            <Label htmlFor="consent" className="text-sm text-gray-600">J'accepte d'être contacté pour mon projet et j'ai pris connaissance de la <a href="#contact" className="text-blue-600 hover:underline">politique de confidentialité</a> *</Label>
                        </div>
                    </div>
                    
                    <Button type="submit" disabled={isLoading} className="w-full mt-6 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                        {isLoading ? (
                            <span className="flex items-center"><span className="loading-spinner mr-2"></span>Envoi en cours...</span>
                        ) : (
                            <span className="flex items-center justify-center"><Mail className="w-5 h-5 mr-2" />Envoyer mes coordonnées</span>
                        )}
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-4 text-center flex items-center justify-center">
                        <Shield className="w-4 h-4 mr-1" /> Vos informations sont sécurisées et ne seront pas partagées
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const Footer = () => {
    const showLegalMentions = () => alert('Mentions légales - Climatiseur.pro SAS - RCS Paris 123 456 789 - Capital 50 000€ - Siège social : 123 Avenue de la République, 75011 Paris');
    const showPrivacyPolicy = () => alert('Politique de confidentialité - Vos données sont protégées conformément au RGPD - Droit d\'accès, rectification, opposition');
    const showCGV = () => alert('Conditions Générales de Vente - Disponibles sur demande à contact@climatiseur.pro');
    const showCookiesPolicy = () => alert('Politique Cookies - Nous utilisons des cookies essentiels au fonctionnement du site et des statistiques anonymes');

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-5 gap-8 border-b border-gray-700 pb-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-4">
                            <Bolt className="text-blue-400 w-6 h-6 mr-2" />
                            <span className="text-xl font-extrabold">Climatiseur.<span className="text-blue-400">pro</span></span>
                        </div>
                        <p className="text-gray-400 mb-4 text-sm">Votre expert en climatisation et optimisation des aides financières. Certifié RGE.</p>
                        <div className="flex space-x-3">
                            <div className="bg-white rounded-lg px-3 py-1">
                                <div className="text-xs font-bold text-gray-800">RGE</div>
                            </div>
                            <div className="bg-white rounded-lg px-3 py-1">
                                <div className="text-xs font-bold text-gray-800">QUALIBAT</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4 text-lg text-blue-400">Navigation</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            {["calculateur", "primes", "guide", "avis", "faq", "contact"].map(id => (
                                <li key={id}><a href={`#${id}`} className="hover:text-white transition duration-300">{id.charAt(0).toUpperCase() + id.slice(1)}</a></li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4 text-lg text-blue-400">Légal</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#" onClick={showLegalMentions} className="hover:text-white transition duration-300">Mentions légales</a></li>
                            <li><a href="#" onClick={showPrivacyPolicy} className="hover:text-white transition duration-300">Confidentialité</a></li>
                            <li><a href="#" onClick={showCGV} className="hover:text-white transition duration-300">CGV</a></li>
                            <li><a href="#" onClick={showCookiesPolicy} className="hover:text-white transition duration-300">Cookies</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-bold mb-4 text-lg text-blue-400">Contact</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-center">
                                <Phone className="text-blue-400 w-4 h-4 mr-3" />
                                <span>01 23 45 67 89</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="text-blue-400 w-4 h-4 mr-3" />
                                <span>contact@climatiseur.pro</span>
                            </li >
                            <li className="flex items-center">
                                <Clock className="text-blue-400 w-4 h-4 mr-3" />
                                <span>Lun-Ven: 8h-19h<br/>Sam: 9h-17h</span>
                            </li>
                            <li className="flex items-center">
                                <MapPinIcon className="text-blue-400 w-4 h-4 mr-3" />
                                <span>Intervention France entière</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="text-center text-gray-500 text-xs">
                    <p>&copy; 2025 Climatiseur.pro - Tous droits réservés | SIRET: 123 456 789 00000 | RCS Paris</p>
                </div>
            </div>
        </footer>
    );
};


// --- Composant Principal ---

const Index = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedInstallationType, setSelectedInstallationType] = useState('');
    const [calculationData, setCalculationData] = useState<CalculationData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const openContactModal = () => setIsModalOpen(true);
    const closeContactModal = () => setIsModalOpen(false);

    // Placeholder pour les fonctions légales (comme dans le fichier PHP)
    const showLegalMentions = () => alert('Mentions légales - Climatiseur.pro SAS - RCS Paris 123 456 789 - Capital 50 000€ - Siège social : 123 Avenue de la République, 75011 Paris');
    const showPrivacyPolicy = () => alert('Politique de confidentialité - Vos données sont protégées conformément au RGPD - Droit d\'accès, rectification, opposition');
    const showCGV = () => alert('Conditions Générales de Vente - Disponibles sur demande à contact@climatiseur.pro');
    const showCookiesPolicy = () => alert('Politique Cookies - Nous utilisons des cookies essentiels au fonctionnement du site et des statistiques anonymes');


    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Marquee />
            <Header scrollToSection={scrollToSection} />
            
            <main className="flex-grow">
                <HeroSection scrollToSection={scrollToSection} />
                <AvantagesSection />
                <CalculatorSection 
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    selectedInstallationType={selectedInstallationType}
                    setSelectedInstallationType={setSelectedInstallationType}
                    setCalculationData={setCalculationData}
                    scrollToSection={scrollToSection}
                />
                
                {calculationData && <ResultsSection data={calculationData} openContactModal={openContactModal} />}

                <WhyChooseUsSection />
                <GuideSection />
                <PrimesSection />
                <FAQSection />
                <ContactSection />
            </main>

            <Footer />
            <MadeWithDyad />
            <FloatingButton onClick={() => scrollToSection('calculateur')} />
            <QuickContactModal isOpen={isModalOpen} onClose={closeContactModal} calculationData={calculationData} />
        </div>
    );
};

export default Index;