// src\types\item.ts
// src/types/item.ts

export type ItemType = 'product' | 'service';

export interface RawItem {
  _id?: string;
  name: string;
  type: ItemType;
  category: string;
  description: string;
  painPoints: string[];
  mainBenefits: string[];
  features: string[];
  useCases: string[];
  targetAudience: string[];
  dailyUsers: string[];
  topCompetitors: string[];
  pricePositioning: string;
  price: number;
  uniqueSellingPoints: string[];
  image?: string;
  featurePainMap?: {
    feature: string;
    solves: string;
  }[];
}
