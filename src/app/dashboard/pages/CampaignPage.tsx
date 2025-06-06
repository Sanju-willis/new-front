// src\app\dashboard\pages\CampaignPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, MousePointerClick, DollarSign } from 'lucide-react';
import { BarChart } from '@/components/BarChart';

interface Campaign {
  _id: string;
  name: string;
  objective: string;
  itemId?: string;
}
interface AdSet { _id: string; name: string; campaignId: string; }
interface Ad { _id: string; name: string; adSetId: string; }
interface AdCreative { _id: string; title: string; adId: string; }
interface Insight { _id: string; adId: string; impressions: number; clicks: number; spend: number; }
interface Item { _id: string; name: string; type: string; }

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/overview`, {
          credentials: 'include',
        });
        const { campaigns: c, adSets: aS, ads: a, creatives: cr, insights: i } = await res.json();

        const itemsRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sync/items`, {
          credentials: 'include',
        });
        const itemsJson = await itemsRes.json();

        setCampaigns(c);
        setAdSets(aS);
        setAds(a);
        setCreatives(cr);
        setInsights(i);
        setItems(itemsJson);
      } catch (err) {
        console.error('Error fetching campaign data:', err);
      }
      setLoading(false);
    }

    fetchAll();
  }, []);

  const total = insights.reduce(
    (acc, i) => ({
      impressions: acc.impressions + i.impressions,
      clicks: acc.clicks + i.clicks,
      spend: acc.spend + i.spend,
    }),
    { impressions: 0, clicks: 0, spend: 0 }
  );

  const filteredCampaigns =
    filter === 'all' ? campaigns : campaigns.filter((c) => c.objective === filter);

  const chartData = insights.map((i) => ({
    adId: i.adId,
    impressions: i.impressions,
    clicks: i.clicks,
    spend: i.spend,
  }));

  if (loading) return <div className="p-4">Loading campaign data...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Campaign Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Eye />
            <div>
              <strong>Impressions</strong>
              <br />
              {total.impressions}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <MousePointerClick />
            <div>
              <strong>Clicks</strong>
              <br />
              {total.clicks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <DollarSign />
            <div>
              <strong>Spend</strong>
              <br />${total.spend.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spend">Spend</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex gap-3 flex-wrap">
            <button
              className={`px-3 py-1 rounded border ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {[...new Set(campaigns.map((c) => c.objective))].map((obj) => (
              <button
                key={obj}
                className={`px-3 py-1 rounded border ${
                  filter === obj ? 'bg-blue-600 text-white' : 'bg-white'
                }`}
                onClick={() => setFilter(obj)}
              >
                {obj}
              </button>
            ))}
          </div>

          {filteredCampaigns.map((camp) => {
            const item = items.find((it) => it._id === camp.itemId);
            return (
              <Card key={camp._id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{camp.name}</h2>
                    <Badge variant="secondary">{camp.objective}</Badge>
                  </div>

                  {item && (
                    <div className="text-sm text-blue-700">
                      🔗 Linked Item: {item.name} ({item.type})
                    </div>
                  )}

                  <div className="mt-2">
                    <label className="text-sm text-gray-700 mr-2">Attach Item:</label>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={camp.itemId || ''}
                      onChange={async (e) => {
                        const itemId = e.target.value;
                        try {
                          const res = await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/${camp._id}/item`,
                            {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({ itemId }),
                            }
                          );
                          if (!res.ok) throw new Error('Update failed');
                          const updated = await res.json();
                          setCampaigns((prev) =>
                            prev.map((c) =>
                              c._id === updated._id ? { ...c, itemId: updated.itemId } : c
                            )
                          );
                        } catch (err) {
                          console.error('Failed to attach item:', err);
                        }
                      }}
                    >
                      <option value="">— Select Item —</option>
                      {items.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} ({item.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {adSets
                    .filter((set) => set.campaignId === camp._id)
                    .map((set) => (
                      <div key={set._id} className="pl-4 border-l border-gray-200 space-y-1">
                        <div>
                          <strong>Ad Set:</strong> {set.name}
                        </div>
                        {ads
                          .filter((ad) => ad.adSetId === set._id)
                          .map((ad) => {
                            const creative = creatives.find((c) => c.adId === ad._id);
                            const insight = insights.find((i) => i.adId === ad._id);
                            return (
                              <div key={ad._id} className="ml-4 p-2 bg-gray-50 rounded">
                                <div className="font-medium">🟣 {ad.name}</div>
                                <div className="text-sm text-gray-600">
                                  Creative: {creative?.title || '—'}
                                  <br />
                                  {insight ? (
                                    <>
                                      Insights: Impressions {insight.impressions}, Clicks{' '}
                                      {insight.clicks}, Spend ${insight.spend}
                                    </>
                                  ) : (
                                    'No insights'
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="spend">
          <BarChart data={chartData} metric="spend" />
        </TabsContent>

        <TabsContent value="engagement">
          <BarChart data={chartData} metric="clicks" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
