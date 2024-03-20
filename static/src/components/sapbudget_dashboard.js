/** @odoo-module */

import { registry } from "@web/core/registry"
import { TableBudget } from "./table_budget/table_budget";
import { ChartBudget } from "./chart_budget/chart_budget";
import { TableBudgetReportDetail } from "./table_budget_detail/table_budget_detail";

const  { Component, onWillStart, useSubEnv, useState, onMounted, useRef, useEffect} = owl

export class SapBudgetDashboard extends Component {

    async getBudgetReport(tanggalAwalString,tanggalAkhirString){
        const response  = await fetch('https://sap.persadaapp.my.id/getBudgetReports', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        datefroms: tanggalAwalString,
                        datetos: tanggalAkhirString,
                        instdepts: this.state.deptNames,
                        lineiddepts: this.state.sapPeriod,
                        deptcodes: this.state.deptnm
                    })
                });

        var datas = await response.json();

        this.state.budgetReport = datas

        var atad = datas.data
        var result =[]
        atad.forEach(function(item) {
            var obj = {};
            obj["AccountCode"] = item["AccountCode"];
            obj["DiffPercent"] = parseFloat(item["DiffPercent"]).toFixed(2);
            result.push(obj);
        })

        //passing data chart parameters config
        this.state.budgetChart = {
            data : {
            labels: result.map(row => row.AccountCode),
            datasets: [
              {
                label: '%',
                data: result.map(row => row.DiffPercent)
              }
            ]

            }
        }

        //passing chart parameters option
        this.state.optionChart = {
            data: {
              onClick: async (e) => {
                  const active = e.chart.getActiveElements()
                  if (active.length > 0) {
                      const label = e.chart.data.labels[active[0].index]
                      // const dataset = e.chart.data.datasets[active[ 0 ].datasetIndex].label
                      this.state.labele = label

                      await this.getBudgetReportDetail(tanggalAwalString,tanggalAkhirString)
                  }

              }
            }
        }

        //passing table parameters event
        this.state.eventRow = {
            data: {
            }
        }

    }

        async getBudgetReportDetail(tanggalAwalString,tanggalAkhirString){

        try {
            const response  = await fetch('https://sap.persadaapp.my.id/getBudgetReportDetail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        datefroms: tanggalAwalString,
                        datetos: tanggalAkhirString,
                        deptcodes: this.state.deptnm,
                        acctcodes: this.state.labele
                    })
                });

        var datas = await response.json();
        this.state.budgetReportDetail = datas.data
        console.log(datas)

        }catch (error) {
            console.error('Error:', error);
        }
    }


    setup(){
        this.state = useState({
            dept:"",
            period:"0",
            perioda: "",
            tahun:"0",
            deptName:"",
            deptNames:"0",
            sapPeriod:"0",
            deptnm:"",
            labele:"",
            budgetReportDetail: []
        })

        onWillStart(async ()=>{
            const user = this.env.services.user
            console.log(user.userId)
            
            var deptName
            if (user.userId === 2){ //admin
                deptName = [{id: 82, name: "MAIN"},
                            {id: 84, name: "EXIM"},
                            {id: 85, name: "FAT"},
                            {id: 86, name: "HO"},
                            {id: 87, name: "HRD"},
                            {id: 88, name: "PP"},
                            {id: 89, name: "ASMB"},
                            {id: 90, name: "FINH"},
                            {id: 91, name: "PBHN"},
                            {id: 92, name: "VAF"},
                            {id: 93, name: "SIND"},
                            {id: 94, name: "QC"},
                            {id: 95, name: "PURC"},
                            {id: 96, name: "TEKN"},
                            {id: 97, name: "WHS"}]
            }else if(user.userId === 5){
                 deptName = [{id: 93, name: "SIND"}]
            }else if(user.userId === 30) { //mba tan
                        deptName = [{id: 82, name: "MAIN"},
                            {id: 84, name: "EXIM"},
                            {id: 85, name: "FAT"},
                            {id: 86, name: "HO"},
                            {id: 87, name: "HRD"},
                            {id: 88, name: "PP"},
                            {id: 89, name: "ASMB"},
                            {id: 90, name: "FINH"},
                            {id: 91, name: "PBHN"},
                            {id: 92, name: "VAF"},
                            {id: 93, name: "SIND"},
                            {id: 94, name: "QC"},
                            {id: 95, name: "PURC"},
                            {id: 96, name: "TEKN"},
                            {id: 97, name: "WHS"}]
            }else{

                }

            this.state.deptName = deptName


            await this.getBudgetReport()

        })
    }

    async onChangeDept(){
        // console.log("jalan ok!")
        this.state.period = "0"
    }

    async onChangePeriod(){
            const tahun = this.state.tahun;
            const tanggalAwal = moment({ year: tahun, month: this.state.period - 1, day: 1 });
            const tanggalAkhir = moment(tanggalAwal).endOf('month')
            const tanggalAwalString = tanggalAwal.format('YYYYMMDD');
            const tanggalAkhirString = tanggalAkhir.format('YYYYMMDD');

            var deptcodes = this.state.deptNames

            var deptcode

            switch (deptcodes) {
                case '82' :
                    deptcode = "Main";
                    break
                case '84' :
                    deptcode = "EXIM";
                    break
                case '85':
                    deptcode = "FAT";
                    break
                case '86':
                    deptcode = "HO";
                    break
                case '87':
                    deptcode = "HRD";
                    break
                case '88':
                    deptcode = "PP";
                    break
                case '89':
                    deptcode = "ASMB";
                    break
                case '90':
                    deptcode = "FINH";
                    break
                case '91':
                    deptcode = "PBHN";
                    break
                case '92':
                    deptcode = "VAF";
                    break
                case '93':
                    deptcode = "SIND";
                    break
                case '94':
                    deptcode = "QC";
                    break
                case '95':
                    deptcode = "PURC";
                    break
                case '96':
                    deptcode = "TEKN";
                    break
                case '97' :
                    deptcode = "WHS";

                default:
                    console.log('tidak ada dalam daftar ');
            }

            var monthPeriod = this.state.period
            var perioda
            var sapPeriod
            switch (monthPeriod) {
                case '1' :
                    perioda = "Januari";
                    sapPeriod = '0'
                    break
                case '2' :
                    perioda = "February";
                    sapPeriod = '1'
                    break
                case '3' :
                    perioda = "Maret";
                    sapPeriod = '2'
                    break
                case '4' :
                    perioda = "April";
                    sapPeriod = '3'
                    break
                case '5' :
                    perioda = "Mei";
                    sapPeriod = '4'
                    break
                case '6' :
                    perioda = "Juni";
                    sapPeriod = '5'
                    break
                case '7' :
                    perioda = "Juli";
                    sapPeriod = '6'
                    break
                case '8' :
                    perioda = "Agustus";
                    sapPeriod = '7'
                    break
                case '9' :
                    perioda = "September";
                    sapPeriod = '8'
                    break
                case '10' :
                    perioda = "Oktober";
                    sapPeriod = '9'
                    break
                case '11' :
                    perioda = "November";
                    sapPeriod = '10'
                    break
                case '12' :
                    perioda = "Desember";
                    sapPeriod = '11'
                    break
            }
            this.state.sapPeriod = sapPeriod
            this.state.perioda = perioda
            this.state.deptnm = deptcode

        await this.getBudgetReport(tanggalAwalString, tanggalAkhirString)
    }

    // async exportExcel(){
    //     var test = "export excel"
    //     console.log(test)
    // }
}

SapBudgetDashboard.template = "bbp.BudgetDashboard"
SapBudgetDashboard.components = { TableBudget, ChartBudget, TableBudgetReportDetail }

registry.category("actions").add("bbp.BudgetDashboard", SapBudgetDashboard)