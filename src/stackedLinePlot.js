import * as d3 from 'd3';

class StackedLinePlot {
  constructor(data, patientId) {
    this.data = data;
    this.patientId=patientId;
  }

  init() {
    var i=0;
    const { data, patientId } = this;
    const margin = { left: 10, right: 20, top: 30, bottom: 30 };
    const width = 300;
    const height = 200;

    var symptoms = ['pain','nausea','fatigue','teethProblem','distress'];
     const periods = ['Baseline', '6M', '12M', '18M', '24M', '> 2 years']; 

    const colors = ['green', 'red', 'blue', 'orange', 'purple'];
    this.svg= d3.select("#stackedLinePlot")
      .append('svg')
      .attr('class', 'plot')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('font-size', 10)
      .attr("font-family", "sans-serif")
      .attr('preserveAspectRatio', "xMidYMid meet");

    this.g = this.svg.append('g')
      .attr('transform', `translate(0,40)`);



    this.xScale = d3.scalePoint()
      .domain(periods)
      .range([margin.left + 45, width - margin.right]);

    this.yScale = d3.scaleLinear()
      .domain([0,5])
      .range([height - margin.bottom, margin.top]);

    this.g.append('g')
      .attr('class', 'axis')
      .attr('color','black')
      .attr('transform', `translate(${0},${height - margin.top})`)
      .call(d3.axisBottom(this.xScale));

    this.yScales = periods.map(period =>
      d3.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain(d3.extent(periods.map(d => d[period])))
    )

    periods.forEach((period,i) => {
      this.g.append('g')
        .attr('class', 'axis')
        .attr('color','black')
        .attr('transform', `translate(${this.xScale(period)},0)`)
        .call(d3.axisLeft(this.yScales[i]))
    })

    this.g.append('g')
      .attr('class', 'axis')
      .attr('color','black')
      .attr('transform', `translate(${margin.left + 45},0)`)
      .call(d3.axisLeft(this.yScale))



    for(i=0;i<5;i++){
      this.g.append('rect')
        .attr('x',margin.left + 46)
        .attr('y',height - 58 - 28 * i)
        .attr('height',28)
        .attr('width',225)
        .attr('fill',colors[i])
        .attr('opacity', '0.2');
    }

    // for(i=0;i<groupsNo;i++){
    //   g.append('rect')
    //     .attr('x',margin.left + 290)
    //     .attr('y',height-58-28*i)
    //     .attr('height',28)
    //     .attr('width',10)
    //     .attr('fill',colors[i])
    //     .attr('opacity', '0.2');
    // }

    for(i=0;i<5;i++){
      this.g.append('text')
        .attr('x',285)
        .attr('y',height-40-28*i)
        .text(symptoms[i])
    }

    this.g.append('text')
      .attr('transform', `translate(${width / 2},${height})`)
      .style('text-anchor', 'middle')
      .text('Time')
      .attr('font-size','10px');

    this.g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 16)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Symptoms Group no.')
      .attr('font-size','10px');


   
    this.drawStackPlot(patientId);
   
  }



  drawStackPlot(patientId){

    const margin = { left: 10, right: 20, top: 30, bottom: 30 };
    const width = 300;
    const height = 200;
    var i=0;
    var groupsNo=5;
    var groupPlots=[];

    var patient = this.data.filter(p => p.patientId == patientId);
    const colors = ['green', 'red', 'blue', 'orange', 'purple'];
    const periods = ['Baseline', '6M', '12M', '18M', '24M', '> 2 years'];  




    function transformPeriod(p){
     return p == 0 ? 'Baseline' :
              p == 6 ? '6M' :
              p == 12 ? '12M' :
              p == 18 ? '18M' :
              p == 24 ? '24M' :
              '> 2 years';
  }

     groupPlots[0]=d3.line()
              .defined(d =>  { return parseInt(d.period) >= 0; })
              .x(d => { return this.xScale(transformPeriod(parseInt(d.period))); })
              .y(d => { return this.yScale((parseInt(d.pain) + 10 * i) / 10); });


     groupPlots[1]=d3.line()
              .defined(d =>  { return parseInt(d.period) >= 0; })
              .x(d =>  { return this.xScale(transformPeriod(parseInt(d.period))); })
              .y(d =>  { return this.yScale((parseInt(d.nausea)+ 10 * i) / 10); });

     groupPlots[2]=d3.line()
              .defined(d =>  { return parseInt(d.period) >= 0; })
              .x(d =>  { return this.xScale(transformPeriod(parseInt(d.period))); })
              .y(d =>  { return this.yScale((parseInt(d.fatigue) + 10 * i) / 10); });

     groupPlots[3]=d3.line()
              .defined(d =>  { return parseInt(d.period) >= 0; })
              .x(d =>  { return this.xScale(transformPeriod(parseInt(d.period))); })
              .y(d =>  { return this.yScale((parseInt(d.teethProblem) + 10 * i) / 10); });

     groupPlots[4]=d3.line()
              .defined(d =>   { return parseInt(d.period) >= 0; })
              .x(d =>   { return this.xScale(transformPeriod(parseInt(d.period))); })
              .y(d =>  { return this.yScale((parseInt(d.distress) + 10 * i) / 10); });


    for(i=0;i<5;i++){
      this.g.append("path")
      .datum(patient)
      .attr("d", groupPlots[i])
      .attr('class','linePlots')
      .attr('fill','none')
      .attr('stroke',colors[i])
      .attr('stroke-width','1px')
    }

    this.g.append('text')
      .attr('class', 'stackTitle')
      .attr('id','stackTitle')
      .attr('font-size','10px')
      .attr('transform', `translate(${width/2 - margin.left},${margin.top/2})`)
      .text("Patient " + this.patientId)

   
 }

   clear() {
    this.svg.selectAll('.linePlots').remove();
    this.svg.selectAll('.stackTitle').remove();
  
  }

  update(patientId) {
    this.patientId = patientId;
    this.drawStackPlot(patientId);
  }

}

export default StackedLinePlot;
