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

// --- Composants réutilisables ---

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