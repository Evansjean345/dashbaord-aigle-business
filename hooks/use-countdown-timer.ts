import {useCallback, useEffect, useState} from "react";

export const useCountdownTimer = (initialTime: number = 30) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [canResend, setCanResend] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) {
            if (timeLeft <= 0) setCanResend(true); // Activer la possibilité de renvoi
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => Math.max(prevTime - 1, 0)); // Décrémentation du temps
        }, 1000);

        return () => clearInterval(timerId); // Nettoyer l'intervalle
    }, [isActive, timeLeft]);

    const startTimer = useCallback(() => {
        setCanResend(false); // Désactiver la possibilité de renvoi
        setTimeLeft(initialTime); // Réinitialiser le temps
        setIsActive(true); // Activer le timer
    }, [initialTime]);

    const resetTimer = useCallback(() => {
        setTimeLeft(initialTime); // Réinitialiser le temps
        setCanResend(false); // Réinitialiser la possibilité de renvoi
        setIsActive(false); // Désactiver le timer
    }, [initialTime]);

    return {
        timeLeft, // Temps restant
        canResend, // Si le renvoi est autorisé
        isActive, // Si le timer est actif
        startTimer, // Fonction pour démarrer le timer
        resetTimer, // Fonction pour réinitialiser le timer
    };
};