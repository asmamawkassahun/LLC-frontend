import axios from 'axios';
import type { GetToKnowData } from '@/types/GetToKnow';

export const fetchGetToKnowData = async (): Promise<GetToKnowData> => {
  const response = await axios.get<GetToKnowData>('/data/getToKnow.json');
  return response.data;
};

