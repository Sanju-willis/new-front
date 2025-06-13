// src\helpers\apiPages.ts
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiPage = {

    // Company Page
updateCompany: async (payload: Record<string, any>) => {
  const res = await fetch(`${BASE_URL}/patch/company`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('❌ Failed to update company');
  return res.json();
},
// Items Page

  createItem: async (payload: any) => {
    return fetch(`${BASE_URL}/sync/items`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },
  updateItem: async (_id: string, payload: any) => {
    return fetch(`${BASE_URL}/sync/items`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id, ...payload }),
    });
  },

  deleteItem: async (id: string) => {
    return fetch(`${BASE_URL}/sync/items/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },


  // Campaigns Page
 fetchCampaignOverview: async () => {
    const res = await fetch(`${BASE_URL}/campaigns/overview`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('❌ Failed to fetch campaigns');
    return res.json();
  },

  fetchItems: async () => {
    const res = await fetch(`${BASE_URL}/sync/items`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('❌ Failed to fetch items');
    return res.json();
  },

  attachItemToCampaign: async (campaignId: string, itemId: string) => {
    const res = await fetch(`${BASE_URL}/campaigns/${campaignId}/item`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });
    if (!res.ok) throw new Error('❌ Failed to attach item');
    return res.json();
  },
}