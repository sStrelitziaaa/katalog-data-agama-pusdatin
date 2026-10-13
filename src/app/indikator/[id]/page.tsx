import React from 'react';
import { getAllIndicators, getIndicatorById } from '@/lib/data-loader';
import IndicatorDetailView from '@/components/IndicatorDetailView';

// Next.js 15 dynamic route params
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const indicators = getAllIndicators();
  return indicators.map(item => ({
    id: item.id,
  }));
}

export default async function IndicatorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const indicator = getIndicatorById(id);
  const allIndicators = getAllIndicators();

  return (
    <IndicatorDetailView
      initialIndicator={indicator}
      targetId={id}
      allIndicators={allIndicators}
    />
  );
}
