import axios from "axios";

// Types for Iconscout API response
export interface IconscoutIcon {
  id: string;
  name: string;
  download_url: string;
  preview_url?: string;
  category?: string;
  tags?: string[];
}

export interface IconscoutResponse {
  icons: IconscoutIcon[];
  total: number;
  page: number;
  per_page: number;
}

const API_KEY = (import.meta as any).env.VITE_ICONSCOUT_API_KEY;

export const fetchIcons = async (query: string): Promise<IconscoutIcon[]> => {
  if (!API_KEY) {
    console.error("VITE_ICONSCOUT_API_KEY is not defined in environment variables");
    return [];
  }

  try {
    const response = await axios.get<IconscoutResponse>("https://api.iconscout.com/v3/search", {
      params: {
        query,
        type: "icon",
        format: "svg",
        per_page: 50,
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response.data.icons || [];
  } catch (error) {
    console.error("Error fetching icons from Iconscout:", error);
    return [];
  }
};