import React from 'react';
import Breadcrumb from '../components/SuperAdmin/components/Breadcrumbs/Breadcrumb';
import ChartOne from '../components/SuperAdmin/components/Charts/ChartOne';
import ChartThree from '../components/SuperAdmin/components/Charts/ChartThree';
import ChartTwo from '../components/SuperAdmin/components/Charts/ChartTwo';

const Chart = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
