import { useState } from "react";
import { showSuccess, showError } from "@/utils/toast";

interface FormData {
  [key: string]: string | number | boolean | undefined;
}

const departementsMapping: { [key: string]: string } = {
    "01": "Ain", "02": "Aisne", "03": "Allier", "04": "Alpes-de-Haute-Provence", "05": "Hautes-Alpes", "06": "Alpes-Maritimes", "07": "Ardèche", "08": "Ardennes", "09": "Ariège", "10": "Aube", "11": "Aude", "12": "Aveyron", "13": "Bouches-du-Rhône", "14": "Calvados", "15": "Cantal", "16": "Charente", "17": "Charente-Maritime", "18": "Cher", "19": "Corrèze", "21": "Côte-d'Or", "22": "Côtes-d'Armor", "23": "Creuse", "24": "Dordogne", "25": "Doubs", "26": "Drôme", "27": "Eure", "28": "Eure-et-Loir", "29": "Finistère", "2A": "Corse-du-Sud", "2B": "Haute-Corse", "30": "Gard", "31": "Haute-Garonne", "32": "Gers", "33": "Gironde", "34": "Hérault", "35": "Ille-et-Vilaine", "36": "Indre", "37": "Indre-et-Loire", "38": "Isère", "39": "Jura", "40": "Landes", "41": "Loir-et-Cher", "42": "Loire", "43": "Haute-Loire", "44": "Loire-Atlantique", "45": "Loiret", "46": "Lot", "47": "Lot-et-Garonne", "48": "Lozère", "49": "Maine-et-Loire", "50": "Manche", "51": "Marne", "52": "Haute-Marne", "53": "Mayenne", "54": "Meurthe-et-Moselle", "55": "Meuse", "56": "Morbihan", "57": "Moselle", "58": "Nièvre", "59": "Nord", "60": "Oise", "61": "Orne", "62": "Pas-de-Calais", "63": "Puy-de-Dôme", "64": "Pyrénées-Atlantiques", "65": "Hautes-Pyrénées", "66": "Pyrénées-Orientales", "67": "Bas-Rhin", "68": "Haut-Rhin", "69": "Rhône", "70": "Haute-Saône", "71": "Saône-et-Loire", "72": "Sarthe", "73": "Savoie", "74": "Haute-Savoie", "75": "Paris", "76": "Seine-Maritime", "77": "Seine-et-Marne", "78": "Yvelines", "79": "Deux-Sèvres", "80": "Somme", "81": "Tarn", "82": "Tarn-et-Garonne", "83": "Var", "84": "Vaucluse", "85": "Vendée", "86": "Vienne", "87": "Haute-Vienne", "88": "Vosges", "89": "Yonne", "90": "Territoire de Belfort", "91": "Essonne", "92": "Hauts-de-Seine", "93": "Seine-Saint-Denis", "94": "Val-de-Marne", "95": "Val-d'Oise", "971": "Guadeloupe", "972": "Martinique", "973": "Guyane", "974": "La Réunion", "976": "Mayotte"
};

export function useDataSender() {
  const [isLoading, setIsLoading] = useState(false);

  const sendData = async (formData: FormData, type: 'contact' | 'quick', calculationData?: FormData) => {
    setIsLoading(true);
    
    // Simulation de l'envoi réseau
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      let title: string;
      let message: string;

      if (type === 'contact') {
        title = 'Nouvelle demande de contact - Climatiseur.pro';
        message = `👤 COORDONNÉES CLIENT
• Nom: ${formData.contactName}
• Email: ${formData.contactEmail}
• Téléphone: ${formData.contactPhone}
• Département: ${departementsMapping[formData.contactDepartment as string] || formData.contactDepartment}
• Message: ${formData.contactMessage || 'Aucun message'}`;
      } else { // type === 'quick'
        title = 'Nouvelle demande rapide - Climatiseur.pro';
        message = `👤 COORDONNÉES CLIENT
• Nom: ${formData.name}
• Téléphone: ${formData.phone}
• Email: ${formData.email}
• Département: ${departementsMapping[formData.department as string] || formData.department}`;

        if (calculationData && Object.keys(calculationData).length > 0) {
          message += `

📋 PROJET ASSOCIÉ
• Type: ${calculationData.selectedInstallationType}
• Surface: ${calculationData.surface} m²
• Pièces: ${calculationData.rooms}
• Logement: ${calculationData.housingType}
• Isolation: ${calculationData.insulation}
• Revenus: ${calculationData.income}€
• Coût final: ${calculationData.finalCost}€`;
        } else {
          message += '\n\n📋 Aucune simulation effectuée - Demande de devis personnalisé';
        }
      }

      message += `\n\n📅 Demande reçue le: ${new Date().toLocaleString('fr-FR')}`;
      
      // Dans un environnement réel, vous feriez ici un fetch vers votre proxy.
      // Pour l'instant, nous affichons juste le succès.
      console.log("--- Simulation d'envoi de données ---");
      console.log("Titre:", title);
      console.log("Message:", message);
      console.log("------------------------------------");

      showSuccess(type === 'contact' ? 'Votre demande a été envoyée avec succès ! Nos experts vous contacteront sous 24h.' : 'Merci ! Nos experts vous contacteront sous 24h.');
      return true;

    } catch (error) {
      showError('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendData, isLoading };
}