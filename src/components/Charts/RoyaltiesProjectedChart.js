import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Spinner } from "react-bootstrap";
import Moment from "moment";

const RoyaltiesProjected = () => {
  const [chartData, setChartData] = useState({
    options: {},
    series: [],
  });
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
            dateRanges: {
              dateRange: "custom",
              startDate: startDateFilter,
              endDate: endDateFilter,
            },
            marketPlaces: ["AU"],
            name: "LineChart",
            metricName: "RoyaltiesProjected",
          }),
        }
      );
      const responseChartData = await responseBudget.json();
      console.log("ProjectedresponseChartData==", responseChartData.result);

      // var ress=responseChartData.result;
      // var cat=ress.categories;
      // console.log(ress.seriesData[0].name);
      // console.log(ress.seriesData[0].data);
      // setCategories(cat)
      // var nam=ress.seriesData[0].name;
      // var dat=ress.seriesData[0].data;
      // setData(ress.seriesData[0].data);
      // setName(ress.seriesData[0].name)

      // const categories = ress.map((item) => item.categories);
      // const seriesData = ress.map((item) => item.seriesData[0].name);
      const chartData = {
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
            categories: categories,
            // "2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023"
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
            data: data,
          },
        ],
      };
      setChartData(chartData);
      console.log("option=" + chartData.options);
      console.log("option=" + chartData.series.name);
      console.log("name=" + name + " data=" + data);
      // getChartData();
    } catch (error) {
      console.error(error); // You might send an exception to your error tracker like AppSignal
      return error;
    }
  };
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="area"
              width="100%"
              height="140px"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoyaltiesProjected;
