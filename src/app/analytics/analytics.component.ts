import { Component, OnInit, ViewChild, Directive } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitationService } from '../solicitation.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ChartsModule, Color } from 'ng2-charts/ng2-charts';

import {TooltipModule} from "ng2-tooltip";

import * as $ from 'jquery';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})

@Directive({selector: 'baseChart'})

export class AnalyticsComponent implements OnInit {
        
  
    @ViewChild(BaseChartDirective) private baseChart;   
    
    solicitationNumber = 0;
    
    // Filter 
    public selectedGovernment = "Government-wide";
    public selectedPeriod = "All";
    public formPeriod:Date = new Date(1900, 0, 1);
    public toPeriod:Date = new Date(2100, 11, 31);
    public xAxis = "Agency";
    
    ICT = [];
    ICTforDisplay = [];    

    // bar
    public barTitle = "Top 10 Section 508 Compliant Agencies";
    public isGovernomentWide = true;
    // public noData = true;    

    // data
    // public nonCompliantICT = [];
    // public compliantICT = [];
    // public updatedICT = [];
    // public updatedNonCompliantICT = [];
    // public updatedCompliantICT = [];
    // public undeterminedICT = [];




    // redo
    public params = {};
    public ScannedSolicitationChart = null;
    public MachineReadableChart = null;
    public ComplianceRateChart = null;
    public ConversionRateChart = null;
    public TopSRTActionChart = null;
    public TopAgenciesChart = null;       
    public PredictResultChart = null;

    constructor(
        private SolicitationService: SolicitationService,
        private router: Router
    ) { }
  
    public agencyList:string[] = [];         

    onChange(str)
    {
        this.selectedGovernment = str;   
        if (str == "Government-wide")
        {
            this.ICTforDisplay = this.ICT;
            this.isGovernomentWide = true;
            this.xAxis = "Agency";
        } 
        else
        {
            this.ICTforDisplay = this.ICT.filter(d => d.agency == str);
            this.isGovernomentWide = false;
            // Pre select for individaul agency
            if (this.selectedPeriod == "All") {
                this.selectedPeriod = "This Year";
                this.xAxis = "Month"
            }
            else if (this.selectedPeriod == "This Year") {
                this.xAxis = "Month"
            }
            else if (this.selectedPeriod == "This Month")
            {
                this.xAxis = "Date"
            }

        }
        this.GetTotalData();
    }
    
    onPeriodChange(str) {
        this.selectedPeriod = str;

        // Get time period to filter.
        switch(str)
        {
            case "This Year":
                this.formPeriod = new Date(new Date().getFullYear(), 0, 1);
                this.toPeriod = new Date(new Date().getFullYear(), 11, 31);
                this.xAxis = "Month";
                break;
            case "This Month":
                this.formPeriod = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                this.toPeriod = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                this.xAxis = "Date";
                break;
            case "This Week":
                var curr = new Date; // get current date
                var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                var last = first + 6; // last day is the first day + 6
                this.formPeriod = new Date(curr.setDate(first));
                this.toPeriod = new Date(curr.setDate(last));
                break;
            default:
                this.formPeriod = new Date(1900,0,1);
                this.toPeriod = new Date(2100,0,1);
                break;
        }

        if (this.selectedGovernment == "Government-wide") this.xAxis = "Agency";

        
        this.GetTotalData();        
    }

    GetTopAgencies() {
        this.SolicitationService.GetAgencies()
        .subscribe(
            data => {
                this.agencyList = data;
            },
            err => {
                console.log(err);
            }
        )
    }


    GetTotalData() 
    {
        //console.log(this.formPeriod.toLocaleDateString());
        this.params = {
            fromPeriod: this.formPeriod.toLocaleDateString(),
            toPeriod: this.toPeriod.toLocaleDateString(),
            agency: this.selectedGovernment
        }
        this.SolicitationService.getAnalytics(this.params)
        .subscribe(
            data => {
                this.ScannedSolicitationChart = data.ScannedSolicitationChart;
                this.MachineReadableChart = data.MachineReadableChart;
                this.ComplianceRateChart = data.ComplianceRateChart;
                this.ConversionRateChart = data.ConversionRateChart;
                this.TopSRTActionChart = data.TopSRTActionChart;
                this.TopAgenciesChart = data.TopAgenciesChart;
                this.PredictResultChart = data.PredictResultChart;
                console.log(data);
            },
            err => {
                console.log(err);
            }
        )
        // this.SolicitationService.getICT()
        // .subscribe(
        //     solicitation => {   
        //         console.log(solicitation.length)                           
        //        this.ICT = solicitation.filter( d => d.eitLikelihood.value == "Yes" );
        //        // following variable will be affected by filter   
        //        this.ICTforDisplay =  solicitation.filter( d => d.eitLikelihood.value == "Yes" );

        //         // get total agency list
        //        this.agencyList = []; 
        //        var map = new Object();
        //        for (let item of this.ICTforDisplay) 
        //        {
        //            if (!map.hasOwnProperty(item.agency))
        //            {
        //                 map[item.agency] = item.agency;
        //                 this.agencyList.push(item.agency)
        //            }
        //        }               
        //        this.agencyList.sort();    
              

        //        if (this.selectedGovernment != "Government-wide")  
        //        {
        //             this.ICTforDisplay =  this.ICTforDisplay.filter( d => d.agency == this.selectedGovernment );   
        //        }
               
        //        var filteredData = [];
        //         for (let item of this.ICTforDisplay)
        //         {          
        //             if (item.date != null)
        //             {       
        //                 //var dateSpliiter = item.date.split('/');
        //                 var date = new Date(item.date);
        //                 // Filter by time
        //                 if (date > this.formPeriod && date < this.toPeriod)
        //                 {
        //                     filteredData.push(item);
        //                 }   
        //                 else {
        //                     console.log(item.solNum);
        //                 }               
        //             }   
        //             else
        //             {
        //                 console.log(item.solNum);
        //             }      
        //         } 
        //         console.log("All ICT: " + filteredData.length);
        //         this.undeterminedICT = filteredData.filter(d => d.undetermined == true);
        //         debugger
        //         console.log("Undetermined ICT: " + this.undeterminedICT.length);
        //         // get rid of undetermined results.
        //         this.ICTforDisplay = filteredData.filter(d => d.undetermined == false);  
        //         console.log("Determined ICT: " + this.ICTforDisplay.length);
                
        //         this.updatedICT = this.ICTforDisplay.filter(d => d.history.filter(function(e){return e["action"].indexOf('Solicitation Updated on FBO.gov') > -1 }).length > 0)
        //         this.nonCompliantICT = this.ICTforDisplay.filter( d => d.predictions.value=="RED");     
        //         this.compliantICT = this.ICTforDisplay.filter( d => d.predictions.value=="GREEN");
        //         this.updatedNonCompliantICT = this.nonCompliantICT.filter(d => d.history.filter(function(e){return e["action"].indexOf('Solicitation Updated on FBO.gov') > -1 }).length > 0)
        //         this.updatedCompliantICT = this.compliantICT.filter(d => d.history.filter(function(e){return e["action"].indexOf('Solicitation Updated on FBO.gov') > -1 }).length > 0)
                
        //         this.noData = Object.keys(this.ICTforDisplay).length == 0;

        //     },
        //     err => {
        //         console.log(err);
        //     }
        // ); 
    }

    // Analytic get data
    ngOnInit() {    
        this.GetTopAgencies();
        this.GetTotalData();  
    }    
      
    
   
}

