import axiosInstance from '@/utils/axiosInstance';

export interface CalculateShippingData {
  store_id: string;
  address_id: string;
  weight: number;
  courier: 'jne' | 'tiki' | 'pos';
}

export interface ShippingOption {
  courier: string;
  service: string;
  description: string;
  cost: [{
    value: number;
    etd: string;
    note: string;
  }];
}

export interface CalculateShippingResponse {
  distance_km: number;
  options: ShippingOption[];
}

export const calculateShippingCostApi = async (data: CalculateShippingData) => {
  const response = await axiosInstance.post<{ data: CalculateShippingResponse, message: string, success: boolean }>('/shipping/costs', data);
  return response.data.data;
};
