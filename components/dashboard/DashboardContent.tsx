'use client';

import ApartmentSummary from './ApartmentSummary';
import FinancialSummary from './FinancialSummary';
import SalesTimeline from './SalesTimeline';

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <ApartmentSummary />
      <FinancialSummary />
      <SalesTimeline />
    </div>
  );
}
