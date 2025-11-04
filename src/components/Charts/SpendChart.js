import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Spinner } from "react-bootstrap";
import Moment from "moment";

function SpendChart(props) {
  const [chartData, setChartData] = useState({
    options: {},
    series: [],
  });
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [datas, setData] = useState([]);
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

    getChartDatas(startDateFilter, endDateFilter);
  }, [startDate, endDate]);

  // const getChartDatas = async (startDateFilter, endDateFilter) => {
  //   try {
  //     console.log("aaa=" + name);
  //     console.log("bbb=" + datas);
  //     // setLoading(true)
  //     let userToken = localStorage.getItem("userToken");
  //     let AuthToken = "Bearer " + userToken;
  //     const responseBudget = await fetch(
  //       "https://api.aimosa.io/Dashboard/ChartData",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: AuthToken,
  //         },
  //         body: JSON.stringify({
  //           dateRanges: {
  //             dateRange: "Custom",
  //             startDate: startDateFilter,
  //             endDate: endDateFilter,
  //           },
  //           marketPlaces: ["AU"],
  //           name: "LineChart",
  //           metricName: "Sales",
  //         }),
  //       }
  //     );
  //     const responseChartData = await responseBudget.json();
  //     console.log("SpendresponseChartData==", responseChartData.result);

  //     var ress = responseChartData.result;

  //     var cat = ress.categories;
  //     console.log("nn=" + ress.seriesData[0].name);
  //     console.log(ress.seriesData[0].data);
  //     setData(ress.seriesData[0].data);
  //     setName(ress.seriesData[0].name);
  //     setCategories(cat);
  //     // const categories = ress.map((item) => item.categories);
  //     // const seriesData = ress.map((item) => item.seriesData[0].name);
  //     const chartData = {
  //       options: {
  //         chart: {
  //           id: "basic-bar",
  //           toolbar: {
  //             show: false,
  //           },
  //         },
  //         xaxis: {
  //           labels: {
  //             show: false,
  //           },
  //           categories: categories,
  //           // "2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023","2023-07-023"
  //         },
  //         grid: {
  //           borderColor: "#ED787F",
  //           strokeDashArray: 2,
  //         },
  //         colors: ["#ff0000"],
  //         fill: {
  //           type: "gradient",
  //         },
  //         stroke: {
  //           curve: "straight",
  //           width: 1,
  //         },
  //         yaxis: {
  //           labels: {
  //             show: false,
  //           },
  //         },
  //         dataLabels: {
  //           enabled: false,
  //         },
  //       },
  //       series: [
  //         {
  //           name: name,
  //           data: datas,
  //         },
  //       ],
  //     };
  //     setChartData(chartData);

  //     console.log("option=" + chartData.options);
  //     console.log("seris=" + chartData.series.name);
  //     console.log("name=spend=" + name + " data=" + datas);
  //     setData(ress.seriesData[0].data);
  //     setName(ress.seriesData[0].name);
  //     setCategories(cat);
  //     // getChart();
  //     // console.log("nn="+props.data.seriesData[0].name);
  //     // console.log(props.data.seriesData[0].data);
  //     // setLoading(false)
  //     // getChartData();
  //   } catch (error) {
  //     console.error(error); // You might send an exception to your error tracker like AppSignal
  //     return error;
  //   }
  // };
  const getChartDatas = async (startDateFilter, endDateFilter, dateRangeLabel) => {
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
            globalFilters: {
              searchText: "",
              authors: [],
              bookFormats: [],
              dateRanges: {
                dateRange: dateRangeLabel,
                startDate: startDateFilter,
                endDate: endDateFilter,
              },
              titles: [],
              campaigns: [],
              platforms: [],
              marketPlaces: [],
              adTypes: [],
              advancedFilters: [],
            },
            name: "LineChart",
            metricName: "Spend",
          }),
        }
      );
  
      console.log(dateRangeLabel); // Corrected placement
  
      const responseChartData = await responseBudget.json();
      console.log("SpendresponseChartData==", responseChartData.result);
  
      var ress = responseChartData.result;
  
      var cat = ress.categories;
      setData(ress.seriesData[0].data);
      setName(ress.seriesData[0].name);
      setCategories(cat);
  
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
            categories: cat,
          },
          grid: {
            borderColor: "#ED787F",
            strokeDashArray: 2,
          },
          colors: ["#ff0000"],
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
            name: ress.seriesData[0].name,
            data: ress.seriesData[0].data,
          },
        ],
      };
      setChartData(chartData);
    } catch (error) {
      console.error(error);
    }
  };
  

  const getChart = async () => {
    try {
      console.log("aaa=" + name);
      console.log("bbb=" + datas);
      // setLoading(true)
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
            metricName: "Sales",
          }),
        }
      );
      const responseChartData = await responseBudget.json();
      console.log("SpendresponseChartData==", responseChartData.result);

      var ress = responseChartData.result;

      var cat = ress.categories;
      console.log("nn=" + ress.seriesData[0].name);
      console.log(ress.seriesData[0].data);
      setData(ress.seriesData[0].data);
      setName(ress.seriesData[0].name);
      setCategories(cat);
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
            borderColor: "#ED787F",
            strokeDashArray: 2,
          },
          colors: ["#ff0000"],
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
            data: datas,
          },
        ],
      };
      setChartData(chartData);

      console.log("option=" + chartData.options);
      console.log("seris=" + chartData.series.name);
      console.log("name=spend=" + name + " data=" + datas);
      setData(ress.seriesData[0].data);
      setName(ress.seriesData[0].name);
      setCategories(cat);
      // console.log("nn="+props.data.seriesData[0].name);
      // console.log(props.data.seriesData[0].data);
      // setLoading(false)
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
          {/* {loading ?  <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>:
                  */}
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            width="100%"
            height="140px"
          />
          {/* }       */}
        </div>
      </div>
    </div>
  );
}

export default SpendChart;
