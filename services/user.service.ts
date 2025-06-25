import {api} from "@/lib/axios";
import {
  User,
  createUserPayload,
  confirmUserPayload,
  createUserResponse,
  updateUserPayload,
  updateUserResponse,
  userOrganisation
} from "@/types/user.types";
import { useAuthStore } from "@/stores/authStore";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const user = useAuthStore.getState().user;
      const response = await api.get(`/organisations/${user?.organisation.organisation_id}/users`);
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || "Impossible de récupérer les utilisateurs");
    }
  },
  getOrganisationsOfUser: async (userId: string): Promise<userOrganisation> => {
    try {
      const user = useAuthStore.getState().user;
      const response = await api.get(`/users/${userId}/organisations`);
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || "Impossible de récupérer le compte professionnel de l'utilisateur");
    }
  },
  createUser: async (payload: createUserPayload): Promise<createUserResponse> => {
    try {
      const response = await api.post(`/users`, payload);
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || "Impossible de créer l'utilisateur");
    }
  },
  confirmUser: async (payload: confirmUserPayload): Promise<createUserResponse> => {
    try {
      const response = await api.post(`/users/otp/confirmation`, payload);
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || "Impossible de confirmer l'utilisateur");
    }
  },
  updateUser: async (userId: string, payload: updateUserPayload): Promise<updateUserResponse> => {
    try {
      const user = useAuthStore.getState().user;
      const response = await api.put(`/users/${userId}`, payload);
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || "Impossible de mettre à jour l'utilisateur");
    }
  },
}