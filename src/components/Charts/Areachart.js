import React, { Component } from "react";
import Chart from "react-apexcharts";

class Areachart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "basic-bar",
          toolbar: {
            show: false
          },
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        },
        stroke:{
          curve: 'straight',
          width: 1
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#00D26E', '#374151']
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        },
        {
            name: "series-1",
            data: [45, 70, 95, 20, 49, 68, 78, 81]
          }
      ]
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="area"
              width="100%"
              height= "300px"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Areachart;