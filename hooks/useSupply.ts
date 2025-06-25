import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {supplyService} from '@/services/supply.service';
import {useAlertStore} from "@/stores/useAlert";
import {useOrganisationStore} from "@/stores/organisationStore";

export const useSupply = (type: string) => {
    const showAlert = useAlertStore(state => state.showAlert)
    const {organisation} = useOrganisationStore()
    const queryClient = useQueryClient();

    const {data: providers, isLoading: isLoadingProviders} = useQuery({
        queryKey: ['providers', type],
        queryFn: () => supplyService.getProviders({type}),
    });

    const {data: supplies, isLoading: isLoadingSupplies} = useQuery({
        queryKey: ['supplies'],
        queryFn: () => supplyService.getSupplies(organisation.organisation_id),
    });

    const {mutate: createSupply, isPending: isCreatingSupply} = useMutation({
        mutationFn: (formData: FormData) => supplyService.createSupply(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['supplies']});
            showAlert("Demande d'approvisionnement crée avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible d'effectuer la demande d'approvisionnement", "error")
        }
    });

    return {
        supplies,
        isLoadingSupplies,
        providers,
        isLoadingProviders,
        createSupply,
        isCreatingSupply,
    };
};
