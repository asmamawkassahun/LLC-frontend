import axios from 'axios';
import type { StatsData } from '@/types/Stats';

export const fetchStatsData = async (): Promise<StatsData> => {
  const response = await axios.get<StatsData>('/data/stats.json');
  return response.data;
};

