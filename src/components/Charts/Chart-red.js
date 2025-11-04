import React, { Component } from "react";
import Chart from "react-apexcharts";

class ChartsRed extends Component {
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
          borderColor: '#ED787F',
          strokeDashArray: 2,
        },
        colors: ['#ff0000'],
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

export default ChartsRed;