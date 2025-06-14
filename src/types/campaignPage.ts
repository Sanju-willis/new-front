// src\types\campaignPage.ts
export interface Campaign {
  _id: string;
  name: string;
  objective: string;
  itemId?: string;
}

export interface AdSet {
  _id: string;
  name: string;
  campaignId: string;
}

export interface Ad {
  _id: string;
  name: string;
  adSetId: string;
}

export interface AdCreative {
  _id: string;
  title: string;
  adId: string;
}

export interface Insight {
  _id: string;
  adId: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach?: number;
  ctr?: number;
  cpm?: number;
  date?: string;
}

export interface Item {
  _id: string;
  name: string;
  type: string;
}
