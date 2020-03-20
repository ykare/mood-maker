<template>
  <div class="small">
    <bar-chart :chart-data="datacollection" :options="options"></bar-chart>
  </div>
</template>

<script>
import BarChart from "./BarChart.js";

export default {
  components: {
    BarChart
  },
  props: {
    goods: {
      type: Array,
      require: true
    },
    boos: {
      type: Array,
      required: true
    }
  },
  watch: {
    goods: function() {
      this.fillData();
    },
    boos: function() {
      this.fillData();
    }
  },
  data() {
    return {
      datacollection: null,
      options: null
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      let all = [...this.goods, ...this.boos];
      let labels = getLabels(all);
      let goods_data = convertToChartData(this.goods);
      let boos_data = convertToChartData(this.boos);
      this.datacollection = {
        labels: [...labels],
        datasets: [
          {
            label: "Good",
            data: goods_data,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(54, 162, 235, 0.8)"
          },
          {
            label: "Boo",
            data: boos_data,
            borderColor: "rgb(54, 162, 235)",
            backgroundColor: "rgba(255, 99, 132, 0.8)"
          }
        ],
        options: {
          elements: {
            line: {
              tension: 0
            }
          },
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  parser: "mm:ss", //<- use 'parser'
                  unit: "minute",
                  unitStepSize: 1,
                  displayFormats: {
                    minute: "mm"
                  }
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  min: 0,
                  max: 10,
                  stepSize: 10
                }
              }
            ]
          }
        }
      };
      this.options = {
        elements: {
          line: {
            tension: 0
          }
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                parser: "YYYY/M/D h:mm", //<- use 'parser'
                unit: "minute",
                unitStepSize: 1,
                displayFormats: {
                  minute: "hh:mm"
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      };
    }
  }
};

function convertToChartData(data) {
  return Object.entries(
    data.reduce((a, c) => {
      let key = dateToLabel(c.date.toDate());
      if (a[key]) {
        a[key]++;
      } else {
        a[key] = 1;
      }
      return a;
    }, {})
  ).map(([key, value]) => {
    return { x: key, y: value };
  });
}
function getLabels(data) {
  return Array.from(
    new Set(
      data.map(e => {
        return dateToLabel(e.date.toDate());
      })
    )
  );
}

function dateToLabel(date) {
  let d = new Date(Math.floor(date.getTime() / (60 * 1000)) * 60 * 1000);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}
</script>

<style>
.small {
  max-width: 600px;
  margin: 15px auto;
}
</style>