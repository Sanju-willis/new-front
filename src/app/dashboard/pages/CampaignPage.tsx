'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointerClick, DollarSign } from 'lucide-react';

interface Campaign { _id: string; name: string; objective: string; }
interface AdSet { _id: string; name: string; campaignId: string; }
interface Ad { _id: string; name: string; adSetId: string; }
interface AdCreative { _id: string; title: string; adId: string; }
interface Insight { _id: string; adId: string; impressions: number; clicks: number; spend: number; }

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adSets, setAdSets] = useState<AdSet[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/campaigns/overview`, {
          credentials: 'include',
        });
        const { campaigns: c, adSets: aS, ads: a, creatives: cr, insights: i } = await res.json();
        setCampaigns(c);
        setAdSets(aS);
        setAds(a);
        setCreatives(cr);
        setInsights(i);
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

  if (loading) return <div className="p-4">Loading campaign data...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Campaign Overview</h1>

      {/* Summary Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-2"><Eye /> <div><strong>Impressions</strong><br />{total.impressions}</div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><MousePointerClick /> <div><strong>Clicks</strong><br />{total.clicks}</div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-2"><DollarSign /> <div><strong>Spend</strong><br />${total.spend.toFixed(2)}</div></CardContent></Card>
      </div>

      {/* Campaigns */}
      {campaigns.map(camp => (
        <Card key={camp._id}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{camp.name}</h2>
              <Badge variant="secondary">{camp.objective}</Badge>
            </div>

            {adSets.filter(set => set.campaignId === camp._id).map(set => (
              <div key={set._id} className="pl-4 border-l border-gray-200 space-y-1">
                <div><strong>Ad Set:</strong> {set.name}</div>

                {ads.filter(ad => ad.adSetId === set._id).map(ad => {
                  const creative = creatives.find(c => c.adId === ad._id);
                  const insight = insights.find(i => i.adId === ad._id);

                  return (
                    <div key={ad._id} className="ml-4 p-2 bg-gray-50 rounded">
                      <div className="font-medium">🟣 {ad.name}</div>
                      <div className="text-sm text-gray-600">
                        Creative: {creative?.title || '—'}<br />
                        {insight
                          ? <>Insights: Impressions {insight.impressions}, Clicks {insight.clicks}, Spend ${insight.spend}</>
                          : 'No insights available'}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
