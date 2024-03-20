/** @odoo-module */
const  { Component, onWillStart, useSubEnv, useState, onMounted, useRef, useEffect, onWillUnmount} = owl
import { loadJS, loadCSS } from "@web/core/assets"

export class TableBudgetReportDetail extends Component {

    setup(){
        this.gridRef2 = useRef("grid2")
        onWillStart(async ()=>{
            await loadJS("https://unpkg.com/gridjs/dist/gridjs.umd.js")
            await loadCSS("https://unpkg.com/gridjs/dist/theme/mermaid.min.css")
        })

        useEffect(() => {
            this.renderGrid2()
        }, () => [this.props.config])

        onWillUnmount(() => {
            if (this.grid2) {
                this.grid2.destroy()

            }
        })

        onMounted(async ()=> this.renderGrid2())

    }

    renderGrid2(){
        if (this.grid2) {
            this.grid2.destroy()

        }
        const columns = [
                        {id:'Account',
                        name: 'Account'},
                        {id:'LineMemo',
                        name:'LineMemo'},
                        {id:'Debit',
                        name:'Debit',
                        formatter: (cell, row) => {
                        return parseFloat(cell).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }},
                        {id:'Credit',
                        name:'Credit',
                        formatter: (cell, row) => {
                        return parseFloat(cell).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }},
                        {id:'ProfitCode',
                        name:'ProfitCode'},
                        {id:'Posting Date',
                        name:'Posting Date',
                        formatter: (cell, row) => {
                                const date = new Date(cell);
                                const year = date.getFullYear();
                                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                const day = date.getDate().toString().padStart(2, '0');
                                return `${year}-${month}-${day}`;
                            }
                        }];

                   this.grid2 = new gridjs.Grid({
                        columns: columns,
                           data:() => {
                                return new Promise(resolve => {
                                  setTimeout(() =>
                                    resolve(this.props.config), 1000);
                                });
                              },
                        // search: true,
                        // width: 500,
                       fixedHeader: true,
                        // height: '400px',
                        resizable: true,
                       pagination: {
                            limit: 5,
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
                    }).render(this.gridRef2.el);
    }

}

TableBudgetReportDetail.template = "TableBudgetReportDetail"