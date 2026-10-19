import React from 'react';
import { getIndicatorsWithFallback } from '@/lib/db/indicators';
import IndicatorDetailView from '@/components/IndicatorDetailView';

export const dynamicParams = true;

// Next.js 15 dynamic route params
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const indicators = await getIndicatorsWithFallback();
  return indicators.map(item => ({
    id: item.id,
  }));
}

export default async function IndicatorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const allIndicators = await getIndicatorsWithFallback();
  const indicator = allIndicators.find(item => item.id.toLowerCase() === id.toLowerCase());

  return (
    <IndicatorDetailView
      initialIndicator={indicator}
      targetId={id}
      allIndicators={allIndicators}
    />
  );
}
