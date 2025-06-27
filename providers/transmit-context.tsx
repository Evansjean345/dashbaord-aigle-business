"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Type pour l'instance Transmit
type TransmitInstance = {
  // Ajoutez ici les méthodes de votre instance Transmit
  // Par exemple: connect, disconnect, subscribe, etc.
} | null;

const TransmitContext = createContext<TransmitInstance>(null);

export const TransmitProvider = ({ children }: { children: ReactNode }) => {
  const [transmit, setTransmit] = useState<TransmitInstance>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const initTransmit = async () => {
      try {
        // Import dynamique avec gestion d'erreur
        const TransmitModule = await import("@adonisjs/transmit-client");

        const baseURL = process.env.NEXT_PUBLIC_TRANSMIT_URL;

        if (!baseURL) {
          throw new Error("NEXT_PUBLIC_TRANSMIT_URL n'est pas défini");
        }

        const transmitInstance = new TransmitModule.Transmit({
          baseUrl: baseURL,
        });

        setTransmit(transmitInstance);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de l'initialisation de Transmit:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    };

    initTransmit();
  }, []);

  // Pendant le chargement, afficher un loader ou retourner null
  if (isLoading) {
    return (
      <div>
        {/* Optionnel: afficher un loader */}
        {children}
      </div>
    );
  }

  // En cas d'erreur, vous pouvez choisir d'afficher les enfants sans Transmit
  if (error) {
    console.warn(
      "TransmitProvider: Fonctionnement en mode dégradé sans Transmit"
    );
    return <>{children}</>;
  }

  return (
    <TransmitContext.Provider value={transmit}>
      {children}
    </TransmitContext.Provider>
  );
};

export const useTransmit = () => {
  const context = useContext(TransmitContext);

  // Ne pas lancer d'erreur si le contexte n'est pas disponible
  // Cela permet un fonctionnement en mode dégradé
  if (context === undefined) {
    throw new Error("useTransmit doit être utilisé dans un TransmitProvider");
  }

  return context;
};

// Hook alternatif qui ne lance pas d'erreur si Transmit n'est pas disponible
export const useTransmitSafe = () => {
  const context = useContext(TransmitContext);
  return context;
};
