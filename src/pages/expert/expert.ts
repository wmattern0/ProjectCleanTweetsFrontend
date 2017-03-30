import { Component } from '@angular/core';
import { TweetService } from '../..//services/tweet-service';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { OnInit, OnChanges, ViewChild, ElementRef} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'page-expert',
  templateUrl: 'expert.html'
})


export class ExpertPage implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;
  private data:any = [["Overall",0],["Positive",0],["Negative",0]];
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any = null;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  public twitterHandle:string = "";
  public showWinnerTitle:boolean = false;
  public results:any = [null,null,null,null];
  private newData:any = [[1,0],[2,3],[3,3],[4,4]];
  public tweets:any = [{},{}];
  private selectedGraph:string = "lastTwoHundred";
  private lastTwentyFive:boolean = false;
  private lastFifty:boolean = false;
  private lastOneHundred:boolean = false;
  private lastTwoHundred:boolean = false;
  private mostRecentTweet:string = "";


  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public tweetService:TweetService, public alertCtrl:AlertController) {
  }

  callService(){
    this.tweetService.getTweets().subscribe(response => {
      this.tweets = response.json();
    });
  }

  onInput(){
    if(this.selectedGraph == "lastTwentyFive" && this.showWinnerTitle){
    this.graphLastTwentyFive();
  } else if(this.selectedGraph == "lastFifty" && this.showWinnerTitle){
    this.graphLastFifty();
  } else if(this.selectedGraph == "lastOneHundred" && this.showWinnerTitle){
    this.graphLastOneHundred();
  } else if(this.selectedGraph == "lastTwoHundred" && this.showWinnerTitle){
    this.graphLastTwoHundred();
  }
}

  graphLastTwentyFive() {
    this.newData = [["Overall",Number(this.results.tot25)],["Positive",Number(this.results.pos25)],
    ["Negative",Number(this.results.neg25)]];
    this.showWinnerTitle = true;
    if(this.chart == null) {
    this.createChart();
    this.updateChart();
  } else this.newData = [["Overall",Number(this.results.tot25)],["Positive",Number(this.results.pos25)],
  ["Negative",Number(this.results.neg25)]];
  this.updateChart();
}

graphLastFifty() {
  this.newData = [["Overall",Number(this.results.tot50)],["Positive",Number(this.results.pos50)],
  ["Negative",Number(this.results.neg50)]];
  this.showWinnerTitle = true;
  if(this.chart == null) {
  this.createChart();
  this.updateChart();
} else this.newData = [["Overall",Number(this.results.tot50)],["Positive",Number(this.results.pos50)],
["Negative",Number(this.results.neg50)]];
this.updateChart();
}

graphLastOneHundred() {
  this.newData = [["Overall",Number(this.results.tot100)],["Positive",Number(this.results.pos100)],
  ["Negative",Number(this.results.neg100)]];
  this.showWinnerTitle = true;
  if(this.chart == null) {
  this.createChart();
  this.updateChart();
} else this.newData = [["Overall",Number(this.results.tot100)],["Positive",Number(this.results.pos100)],
["Negative",Number(this.results.neg100)]];
this.updateChart();
}

graphLastTwoHundred() {
  this.newData = [["Overall",Number(this.results.tot200)],["Positive",Number(this.results.pos200)],
  ["Negative",Number(this.results.neg200)]];
  this.showWinnerTitle = true;
  if(this.chart == null) {
  this.createChart();
  this.updateChart();
} else this.newData = [["Overall",Number(this.results.tot200)],["Positive",Number(this.results.pos200)],
["Negative",Number(this.results.neg200)]];
this.updateChart();
}

callExpertService(){

  let loader = this.loadingCtrl.create({
      content: 'Getting latest entries...',
    });

    loader.present().then(() => {
         this.tweetService.getExpertResult(this.twitterHandle).subscribe(response => {
       this.results = response.json();

      loader.dismiss();
      console.log(this.results.mostRecentTweet);
      this.mostRecentTweet = this.results.mostRecentTweet.unmodifiedText;
      if(this.selectedGraph == "lastTwentyFive"){
      this.graphLastTwentyFive();
    } else if(this.selectedGraph == "lastFifty"){
      this.graphLastFifty();
    } else if(this.selectedGraph == "lastOneHundred"){
      this.graphLastOneHundred();
    } else if(this.selectedGraph == "lastTwoHundred"){
      this.graphLastTwoHundred();
    }
  }, err => {
      console.log("No such twitter handle");
      loader.dismiss();
  });
  });
  }








  ngOnInit() {
    this.createChart();

  }


  // ionViewLoaded() {
  //   let loader = this.loadingCtrl.create({
  //     content: 'Getting latest entries...',
  //   });
  //
  //   loader.present().then(() => {
  //     this.someService.getLatestEntries()
  //       .subscribe(res => {
  //         this.latestEntries = res;
  //       });
  //     loader.dismiss();
  //   });
  // }







  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }



  createChart() {
    let element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    let xDomain = this.data.map(d => d[0]);
    let yDomain = [0, d3.max(this.data, d => d[1])];

    // create scales
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // bar colors
    this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));
  }

  updateChart() {
    // update scales & axis
    this.xScale.domain(this.newData.map(d => d[0]));
    this.yScale.domain([0, d3.max(this.newData, d => d[1])]);
    this.colors.domain([0, this.newData.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    let update = this.chart.selectAll('.bar')
      .data(this.newData);

    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));

    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .transition()
      .delay((d, i) => i * 300)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => this.height - this.yScale(d[1]));
  }
}




// graphTotal() {
//   // this.newData = [[1,0],[2,Number(this.results.tweetScore1)],[3,Number(this.results.tweetScore2)], [4,100]];
//   this.newData = [[1,0],[2,2],[3,3], [4,100]];
//   this.showWinnerTitle = true;
//   console.log(this.results);
//   console.log(this.newData);
//   if(this.chart == null) {
//   this.createChart();
//   this.updateChart();
// } else this.newData = [[1,0],[2,Number(this.results.tweetScore1)],[3,Number(this.results.tweetScore2)], [4,100]];
// this.updateChart();
// }
// }
// graphTotal() {
//   console.log(this.results);
//   this.newData = [[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10]];
//   this.createChart();
//   this.updateChart();
// }
