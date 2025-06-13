// src\helpers\apiForm.ts
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const apiForm = {
  submitCompanyForm: async (form: any) => {
    const cleanedItems = form.items?.filter((item: any) => item.name.trim() !== '');
    const payload = { ...form, items: cleanedItems };

    const res = await fetch(`${BASE_URL}/onboard/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('❌ Submit failed');
    return res.json();
  },
};
