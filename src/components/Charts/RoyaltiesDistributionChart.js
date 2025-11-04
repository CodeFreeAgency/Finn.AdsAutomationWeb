import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Spinner } from "react-bootstrap";
import Moment from "moment";

const RoyaltiesDistributionChart = () => {
  const [chartData, setChartData] = useState({
    options: {},
    series: [],
  });
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set the default date range here
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const startDateFilter =
      Moment(startDate).format("YYYY-MM-DD") + "T00:00:01.064Z";
    const endDateFilter =
      Moment(endDate).format("YYYY-MM-DD") + "T23:50:59.064Z";

    getChartData(startDateFilter, endDateFilter);
  }, [startDate, endDate]);

  const getChartData = async (startDateFilter, endDateFilter) => {
    try {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;

      const responseBudget = await fetch(
        "https://api.aimosa.io/Dashboard/ChartData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            name: "LineChart",
            metricName: "RoyaltiesDistribution",
            marketPlaces: ["AU"],
            dateRanges: {
              dateRange: "Custom",
              startDate: startDateFilter,
              endDate: endDateFilter,
            },
          }),
        }
      );

      const responseChartData = await responseBudget.json();

      console.log(
        "RoyaltiesDistributionResponseChartData==",
        responseChartData.result
      );

      var ress = responseChartData.result;
      var cat = ress.categories;

      console.log("name=" + ress.seriesData[0].name);
      console.log(ress.seriesData[0].data);

      setCategories(cat);

      var nam = ress.seriesData[0].name;
      var dat = ress.seriesData[0].data;

      setData(ress.seriesData[0].data);
      setName(ress.seriesData[0].name);

      const updatedChartData = {
        options: {
          chart: {
            id: "basic-bar",
            toolbar: {
              show: false,
            },
          },
          xaxis: {
            labels: {
              show: false,
            },
            categories: categories, // Update with the state
          },
          grid: {
            borderColor: "#00D26E",
            strokeDashArray: 2,
          },
          colors: ["#00D26E"],
          fill: {
            type: "gradient",
          },
          stroke: {
            curve: "straight",
            width: 1,
          },
          yaxis: {
            labels: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            name: name,
            data: data, // Update with the state
          },
        ],
      };

      setChartData(updatedChartData);

      console.log("option=" + updatedChartData.options);
      console.log("option=" + updatedChartData.series.name);
      console.log("name=" + name + " data=" + data);
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          {/* Render the chart with updated data */}
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            width="100%"
            height="140px"
          />
        </div>
      </div>
    </div>
  );
};

export default RoyaltiesDistributionChart;
