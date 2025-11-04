import React, { Component } from "react";
import Chart from "react-apexcharts";

class Charts extends Component {
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
          labels: {
            show: false
          },
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997]
        },
        grid: {
          borderColor: '#E5E7EB',
          strokeDashArray: 2,
        },
        colors: ['#00D26E'],
        fill: {
            type: 'gradient'
        },
        stroke:{
            curve: 'straight',
            width: 1
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        }
      },
      series: [
        {
          name: "series-1",
          data: [26,36,30,56,46,76,96]
        }
      ],
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
              height= "140px"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Charts;