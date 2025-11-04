import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from "chart.js";
import { Bar,Line } from "react-chartjs-2";
 
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
const BasicChart: React.FunctionComponent<chartData> = (props) => {
    const transformedData = {
        id: props.datas.id,
        parentAsin: props.datas.parentAsin,
        title: props.datas.title,
        sessions: Object.keys(props.datas)
          .filter(key => key !== 'id' && key !== 'parentAsin' && key !== 'title')
          .map(date => ({ date, value: props.datas[date] }))
      };
    
      const activeSubscription = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        dataUnit: "USD",
        stacked: true,
        datasets: [
          {
            label: "Active User",
            barPercentage: 0.7,
            categoryPercentage: 0.7,
            backgroundColor: [
              "#FFF2E1",
              "#FFF2E1",
              "#FFF2E1",
              "#FFF2E1",
              "#FFF2E1",
              "#FAAB35",
            ],
            data: [8200, 7800, 9500, 5500, 9200, 9690],
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

export default BasicChart;
