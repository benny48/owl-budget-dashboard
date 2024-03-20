/** @odoo-module */
const  { Component, onWillStart, useSubEnv, useState, onMounted, useRef, useEffect, onWillUnmount} = owl
import { loadJS, loadCSS } from "@web/core/assets"

export class TableBudget extends Component {

    setup(){
        this.gridRef = useRef("grid")
        onWillStart(async ()=>{
            await loadJS("https://unpkg.com/gridjs/dist/gridjs.umd.js")
            await loadCSS("https://unpkg.com/gridjs/dist/theme/mermaid.min.css")
            // await loadJS("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js")
            // await loadJS("https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js")
        })

        useEffect(() => {
            this.renderGrid()
        }, () => [this.props.config])

        onWillUnmount(() => {
            if (this.grid) {
                this.grid.destroy()

            }
        })

        onMounted(async ()=> this.renderGrid())

    }

    renderGrid(){
        if (this.grid) {
            this.grid.destroy()

        }

        const columns = [
                    {id:'AccountCode',
                    name: 'Account Code'},
                    {id:'AccountName',
                    name:'Account Name'},
                    {id:'Budget',
                    name:'Budget',
                    formatter: (cell, row) => {
                        return parseFloat(cell).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }},
                    {id:'BudgetActual',
                    name:'Budget Actual',
                    formatter: (cell, row) => {
                        return parseFloat(cell).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }},
                    {id:'Difference',
                    name:'Difference',
                    formatter: (cell, row) => {
                        return parseFloat(cell).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }},
                    {id:'DiffPercent',
                    name:'%',
                    formatter: (cell, row) => {
                        return parseFloat(cell).toFixed(2);
                    }}];

                   this.grid = new gridjs.Grid({
                        columns: columns,
                       data:() => {
                                return new Promise(resolve => {
                                  setTimeout(() =>
                                    resolve(this.props.config.data), 1000);
                                });
                              },
                        search: true,
                        // width: 500,
                        resizable: true,
                       pagination: {
                            limit: 8,
                            summary: true
                          },
                        style: {
                    table: {
                      // border: '3px solid #ccc'
                    },
                    th: {
                      'background-color': '#71639e',
                      color: '#FFF',
                      'border-bottom': '3px solid #ccc',
                      'text-align': 'center'
                    },
                    td: {
                      'text-align': 'left'
                    }
                  }
                    }).render(this.gridRef.el);

                   this.grid.on('cellClick', async (...args) => {
                    const jsonString = args; // Convert args to JSON string
                    var sour = JSON.stringify(jsonString[1])
                    var objk = JSON.parse(sour)
                    const dataValue = objk.data;

                    // await this.getDataDetail(tanggalAwalString, tanggalAkhirString, deptcode, dataValue);
                       console.log(dataValue)
                });
    }

}

TableBudget.template = "TableBudgetReport"