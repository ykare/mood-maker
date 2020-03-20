<template>
  <div class="small">
    <doughnut-chart :chart-data="datacollection" :options="options"></doughnut-chart>
  </div>
</template>

<script>
import DoughnutChart from "./DoughnutChart.js";

export default {
  components: {
    DoughnutChart
  },
  props: {
    good: {
      type: Number,
      required: true
    },
    boo: {
      type: Number,
      required: true
    }
  },
  watch: {
    good: function() {
      this.fillData();
    },
    boo: function() {
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
      this.datacollection = {
        labels: [`Good(${this.good})`, `Boo(${this.boo})`],
        datasets: [
          {
            backgroundColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
            data: [this.good, this.boo]
          }
        ]
      };
    }
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 15px auto;
}
</style>