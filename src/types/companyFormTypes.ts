// src\types\companyFormTypes.ts
// src/types/companyFormTypes.ts

export type CompanyItem = {
  name: string;
  type: 'product' | 'service';
};

export type CompanyFormType = {
  name: string;
  size: string;
  industry: string;
  type: string;
  targetMarket: string;
  address: string;
  website: string;
  socialLinks: string[];
  brandGuideUrl: string;
  logoAssetsUrl: string;
  pressKitUrl: string;
  portfolioUrl: string;
  contentLibraryUrl: string;
  productPages: string[];
  userRole: string;
  description: string;
  targetAudience: string;
  items: CompanyItem[];
};
