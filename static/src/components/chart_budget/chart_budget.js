/** @odoo-module */
const  { Component, onWillStart, useSubEnv, useState, onMounted, useRef, useEffect, onWillUnmount} = owl
import { loadJS, loadCSS } from "@web/core/assets"

export class ChartBudget extends Component {

    setup(){
        this.chartRef = useRef("chart")

        this.state = useState({
            deptnm:"",
            labele:"",
            budgetReportDetail: ""
        })

        onWillStart(async ()=>{
            await loadJS("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js")
            await loadJS("https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js")
        })

        useEffect(() => {
            this.chartRenderer()
        }, () => [this.props.config])

        onWillUnmount(() => {
            if (this.chart) {
                this.chart.destroy()
            }
        })

        onMounted(async ()=> this.chartRenderer())
    }

    chartRenderer(){
        if (this.chart) {
            this.chart.destroy()
        }
        this.chart = new Chart(
        this.chartRef.el,
        {
          type: 'line',
          data: this.props.config.data,
            options: this.props.option.data

        }
      );
    }
}

ChartBudget.template = "ChartBudget"