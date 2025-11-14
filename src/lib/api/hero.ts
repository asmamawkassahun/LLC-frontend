import axios from 'axios';
import type { HeroData } from '@/types/Hero';

export const fetchHeroData = async (): Promise<HeroData> => {
  const response = await axios.get<HeroData>('/data/hero.json');
  return response.data;
};

