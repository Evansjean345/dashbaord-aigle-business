import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Country} from "@/types/country.types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Finds a country object by its ID within an array of countries.
 *
 * @param {Country[]} countries - The array of country objects to search through.
 * @param {string} searchCountry_id - The ID of the country to find.
 * @return {Country | null} The country object with the matching ID, or undefined if not found.
 */
export function findCountry(countries: Country[], searchCountry_id: string): Country | null {
    const country_id = parseInt(searchCountry_id)
    if (typeof country_id !== "number") {
        throw new Error("An error while converting country id to type number")
    }

    return countries.find(item => item.id === country_id)
}

/**
 * Returns a nested value from an object based on the provided path string
 *
 * @param {any} obj - The object from which to retrieve the nested value
 * @param {string} path - The path to the nested value, using dot notation
 * @returns {any} The nested value if found, undefined otherwise
 */
export const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

export const formatISODate = (date: Date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} word - The input string to capitalize the first letter.
 * @returns {string} The input string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (word: string): string => {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}