import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
};

interface chartData{
    datas:any
    tabname:any
}

const NewChart: React.FunctionComponent<chartData> = (props) => {
    const transformedData = {
        id: props.datas.id,
        parentAsin: props.datas.parentAsin,
        title: props.datas.title,
        reports: Object.keys(props.datas)
          .filter(key => key !== 'id' && key !== 'parentAsin' && key !== 'title')
          .map(date => ({ date, value: props.datas[date] }))
      };
      
console.log(transformedData);

    
    const activeSubscription = {
        // labels: transformedData.reports.map(session => session.date),
        labels:["6 week ago","5 week ago" ,"4 week ago" , "3 week ago", "2 week ago" , "1 week ago"],
        dataUnit: "USD",
        stacked: true,
        datasets: [
          {
            label: props.tabname,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
            backgroundColor: [
              "#FFF2E1",
              "#FFF2E1",
              "#FFF2E1",
              "#FFF2E1",
              "#FFF2E1",
              "#FFF2E1",
            ],
            data:  transformedData.reports.map(session => session.value),
          },
        ],
      };
  return (
    <div>
      <Line
        options={options}
        data={activeSubscription}
        height={40}
        width={120}
      />
    </div>
  );
};

export default NewChart;
