// src\constants\defaultCompanyForm.ts
import { CompanyFormType } from '@/types/companyFormTypes';

export const defaultCompanyForm: CompanyFormType = {
  companyName: '',
  size: '',
  industry: '',
  type: '',
  targetMarket: '',
  address: '',
  website: '',
  socialLinks: [''],
  brandGuideUrl: '',
  logoAssetsUrl: '',
  pressKitUrl: '',
  portfolioUrl: '',
  contentLibraryUrl: '',
  productPages: [''],
  userRole: '',
  description: '',
  targetAudience: '',
  items: [{ name: '', type: 'product' }],
};
