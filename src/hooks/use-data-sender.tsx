import React, { useState } from 'react';
import { showSuccess, showError } from '@/utils/toast';

interface DataSenderHook {
    isLoading: boolean;
    sendData: (data: any, type: 'contact' | 'quick', calculationData?: any) => Promise<boolean>;
}

export function useDataSender(): DataSenderHook {
    const [isLoading, setIsLoading] = useState(false);

    const sendData = async (data: any, type: 'contact' | 'quick', calculationData?: any): Promise<boolean> => {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            console.log(`Sending data (${type}):`, data);
            if (calculationData) {
                console.log("Associated calculation data:", calculationData);
            }

            // Simulate success 90% of the time
            if (Math.random() > 0.1) {
                showSuccess("Votre demande a été envoyée avec succès ! Un expert vous contactera sous 24h.");
                return true;
            } else {
                throw new Error("Erreur de connexion au serveur.");
            }
        } catch (error) {
            console.error("Send data error:", error);
            showError("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, sendData };
}