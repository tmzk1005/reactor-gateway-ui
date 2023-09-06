<template>
  <div ref="echartsDom" class="chart" style="width: 100%; height: 100%; padding: 18px;"></div>
</template>

<script setup>
import * as echarts from 'echarts'

import { onMounted, ref, watch } from 'vue'

const echartsDom = ref(null)

const props = defineProps({
  title: String,
  xAxisType: String,
  xAxisName: String,
  xAxisData: Array,
  yAxisName: String,
  series: Array,
  color: Array,
})

const initOption = () => {
  let xAxisType = props.xAxisType ? props.xAxisType : "category"
  let option = {
    title: {
      text: props.title,
      left: 'left'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    legend: {
      data: [],
      // orient: 'vertical',
      x: 'right',
      y: 'top',
      padding: [10, 40, 0, 0]
    },

    xAxis: {
      name: props.xAxisName,
      type: xAxisType,
      data: props.xAxisData
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    series: []
  }
  for (let index in props.series) {
    option.series.push({
      type: 'line',
      smooth: false,
      symbol: 'none',
      name: props.series[index].name,
      data: props.series[index].data,
    })
    option.legend.data.push(props.series[index].name)
  }
  if (props.color) {
    option.color = props.color
  }
  return option
}

const initChart = () => {
  echarts.init(echartsDom.value).setOption(initOption())
}

onMounted(initChart)

watch(
  () => props.series,
  () => initChart()
)

</script>
