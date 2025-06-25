import {confirmUserPayload, createUserPayload, updateUserPayload} from "@/types/user.types";
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {userService} from "@/services/user.service";
import {useState} from "react";
import {useAuth} from "./useAuth";
import {useAlertStore} from "@/stores/useAlert";

export const useUser = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)
    const {profile} = useAuth();

    const {data: users, isLoading: isLoadingUsers} = useQuery({
        queryKey: ['users'],
        queryFn: () => userService.getUsers(),
        enabled: !!profile?.organisation?.organisation_id,
    });

    const {data: userOrganisations, isLoading: isLoadingUserOrganisations} = useQuery({
        queryKey: ['userOrganisations'],
        queryFn: () => userService.getOrganisationsOfUser(profile?.user?.id),
        enabled: !!profile?.user?.id,
    });

    const {mutate: createUser, isPending: isCreatingUser} = useMutation({
        mutationFn: (payload: createUserPayload) => userService.createUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']});
            showAlert("Utilisateur crée avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible de crée l'utilisateur", "error")
        }
    });
    const {mutate: confirmUser, isPending: isConfirmingUser} = useMutation({
        mutationFn: (payload: confirmUserPayload) => userService.confirmUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']});
            showAlert("Utilisateur confirmé avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible de confirmer l'utilisateur", "error")
        }
    });
    const {mutate: updateUser, isPending: isUpdatingUser} = useMutation({
        mutationFn: (payload: updateUserPayload) => userService.updateUser(payload.userId, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['users']});
            showAlert("Utilisateur mis à jour avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible de mettre à jour l'utilisateur", "error")
        }
    });

    return {
        users,
        isLoadingUsers,
        userOrganisations,
        isLoadingUserOrganisations,
        createUser,
        confirmUser,
        isConfirmingUser,
        isCreatingUser,
        updateUser,
        isUpdatingUser,
    }
}