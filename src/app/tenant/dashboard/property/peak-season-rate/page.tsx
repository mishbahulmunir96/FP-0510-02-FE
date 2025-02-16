
import DashboardLayout from '@/features/dashboard/dashboardLayout';
import PeakSeasonRatePage from '@/features/dashboard/property/peak-season-rate';
import React from 'react';

const PeakSeasonRate = ({ params }: { params: { id: number } }) => {
  return(

    <div>
<DashboardLayout>

        <PeakSeasonRatePage roomId={params.id} />;
</DashboardLayout>
    </div>
  

  )
};

export default PeakSeasonRate;