import { Country } from "@/types/country.types";
import {api} from "@/lib/axios";

export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await api.get("/countries");
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Impossible de récuperer les pays");
  }
};