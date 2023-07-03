

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const padding = 50;

async function getCyclistData() {
    let res = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
    let response = await res.json()
   return response
}

getCyclistData().then(response => {
    parseData(response)
});

function parseData(response) {
    const data = response;

    const margin = {top: 60, bottom: 40, left: 40, right: 40}

    svg.append("text")
        .attr("x", (width/2))
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "40px")
        .text("Doping in Professional Bicycle Racing")
    
    svg.append("text")
        .attr("x", (width/2))
        .attr("y", (margin.top * 1.75))
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .text("35 Fastest Times up Alpe d'Huez")

    console.log(data);

    const arrayOfYears = data.map(x => {
        return x['Year'];
    })

    const arrayOfTime = data.map(x => {
        return x['Time']
    })

    console.log(arrayOfYears);

    const specifier = "%M:%S";
    const parsedData = arrayOfTime.map(x => {
        return d3.timeParse(specifier)(x);
    })

    console.log(parsedData);

    const arrayOfAxisTicks = ["37:00", "37:15", "37:30", "37:45", "38:00", "38:15", "38:30", "38:45", "39:00", "39:15", "39:30", "39:45"]

    const parsedAxisTicks = arrayOfAxisTicks.map(x => {
        return d3.timeParse(specifier)(x);
    })

    
    console.log(parsedAxisTicks);

    const xScale = d3.scaleLinear()
        .domain([d3.min(arrayOfYears)-1, d3.max(arrayOfYears)+1])
        .range([0, width - (6 * padding)])

    const yScale = d3.scaleTime()
        .domain(d3.extent(parsedData))
        .range([0, height - (3 * padding)])

    console.log(yScale.domain());
    console.log(yScale.range());

    const yAxis = d3.axisLeft(yScale)
        .tickValues(parsedAxisTicks)
        .tickFormat((d) => {
            return d3.timeFormat(specifier)(d);
        })

    const xAxis = d3.axisBottom(xScale)
        .tickValues([1994, 1996, 1998, 2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016])
        .tickFormat(d3.format("d"))
        
    let gy = svg.append('g')
        .attr("transform", "translate(200,125)")
        .call(yAxis);

    let gx = svg.append('g')
        .attr('transform', 'translate(185, 865)')
        .call(xAxis)

    const keys = ['No doping allegations', 'Riders with doping allegations'];

    var SVG = d3.select('svg')
    var size = 25;

    SVG.selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
            .attr("x", 1150)
            .attr("y", function(d,i){ return 500 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", d => {
                if (d == "No doping allegations"){
                    return "rgb(239, 134, 54)"
                }
                else {
                    return "rgb(59, 117, 175)"
                }
             })

    SVG.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
            .attr("x", 1100 + size*1.2)
            .attr("y", function(d,i){ return 500 + i*(size+5) + (size/2)})
            .text(d => {
                return d;
            })
            .attr("font-size", "20px")
            .attr("text-anchor", "end")
            .style("alignment-baseline", "middle")
    
    var tooltip = d3.select("#svgContainer")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
    

    var mouseover = function(d) {
        console.log(tooltip)
        tooltip
            .style("opacity", 1)
        }
        
    var mousemove = function(event,d) {
        console.log(d);
        tooltip
            .html(function() {
                if (d.Doping.length == 0) {
                    return d.Name + ": " + d.Nationality + "<br>" + "Year: " + d.Year + ", Time: " + d.Time
                }
                else {
                    return d.Name + ": " + d.Nationality + "<br>" + "Year: " + d.Year + ", Time: " + d.Time + "<br><br>" + d.Doping
                }
            })
            .style('position', 'absolute')
            .style("left", event.clientX + 15 + "px") 
            .style("top", event.clientY + 15 + "px")
        }
        
        
    var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }

    svg.selectAll("circle").data(data)
    .enter().append("circle")
            .attr('cx', d => {
                return xScale(d.Year)
            })
            .attr('cy', d => {
                return yScale(d3.timeParse(specifier)(d.Time))
            })
            .attr('r', 7.5)
            .attr('transform', 'translate(200, 115)')
            .style('fill', d => {
                if (d.Doping.length == 0) {
                    return "rgb(242, 158, 94)"
                }
                else {
                    return "rgb(172,190,217)"
                }
            })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
}