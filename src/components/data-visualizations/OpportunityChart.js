import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './data-visualizations.css'
import placeholder from '../../images/compoundPlaceholderListView.svg'
import {
    partIsometricImage,
    opportunityChartAccessorConfig,
    trackPageView
} from '../../utilities'

import { select } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'

import { debounce } from 'lodash'

function OpportunityChart({location, data, yAxis, xAxis}) {
  const [margin, setMargin] = React.useState(this.defaultMargin);
  const [boundingRect, setBoundingRect] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const canvas = React.useRef(null);
  React.useEffect(() => {
    let debouncedResize;
    let tooltipBoundingRect;
    debouncedResize = debounce(handleCanvasResize, 100)
        window.addEventListener('resize', debouncedResize, false)
        debouncedResize()
        tooltipBoundingRect = document
            .getElementById('opportunity-tooltip')
            .getBoundingClientRect()

        // matomo tracking
        let currentUrl = location.pathname
        trackPageView(currentUrl, 'Compound Match - Opportunity Exploration')
    
    return () => {
      window.removeEventListener('resize', debouncedResize, false)
    };
  }, []);
  React.useEffect(() => {
    if (loaded) {
            createChart()
            updateLeftMargin()
        }
  }, [location, data, yAxis, xAxis, loaded]);

  function shouldComponentUpdate(nextProps, nextState) {
        const nextRect = nextState.boundingRect
        const didSvgSizeChange =
            boundingRect.width !== nextRect.width ||
            boundingRect.height !== nextRect.height
        const didDataChange = data !== nextProps.data
        const didLeftMarginChange =
            margin.left !== nextState.margin.left

        return didSvgSizeChange || didDataChange || didLeftMarginChange
    }

  const handleCanvasResize = () => {
        const boundingRect = {
            height: canvas.current.clientHeight,
            width: canvas.current.clientWidth
        }
        this.setState({ boundingRect, loaded: true })
    };

  const cleanOldSvg = () => {
        select('.opportunity-canvas')
            .selectAll('svg')
            .remove()
    };

  const updateLeftMargin = () => {
        const yAxisGroup = select('#opportunity-y-axis-group')
        let maxLabelWidth = 0
        yAxisGroup.selectAll('.tick').each((d, i, m) => {
            const yAxisLabelDimensions =
                m[i].getBBox() || m[i].getBoundingClientRect()
            if (yAxisLabelDimensions.width > maxLabelWidth) {
                maxLabelWidth = yAxisLabelDimensions.width
            }
        })
        setMargin({ ...margin, left: maxLabelWidth + 35 })
    };

  function yAxisFullDomain() {
        return opportunityChartAccessorConfig[yAxis].order
            ? opportunityChartAccessorConfig[yAxis].order
            : data.map(datum => datum.yAxis)
    }

  function xAxisFullDomain() {
        return opportunityChartAccessorConfig[xAxis].order
            ? opportunityChartAccessorConfig[xAxis].order
            : data.map(datum => datum.xAxis)
    }

  const createChart = () => {
        cleanOldSvg()

        const width = boundingRect.width
        const height = boundingRect.height

        const svg = select('.opportunity-canvas')
            .append('svg')
            .attr('viewBox', [0, 0, width, height])

        const yAxisRange = [
            height - margin.bottom,
            margin.top
        ]
        const yScale = opportunityChartAccessorConfig[
            yAxis
        ].getScale(yAxisFullDomain, yAxisRange)
        const yAxis = axisLeft(yScale).ticks(10)

        const xAxisRange = [
            margin.left,
            width - margin.right
        ]
        const xScale = opportunityChartAccessorConfig[
            xAxis
        ].getScale(xAxisFullDomain, xAxisRange)
        const xAxis = axisBottom(xScale).ticks(10)

        const chart = svg.append('g')
        const graph = chart.append('g')
        graph
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.xAxis))
            .attr('cy', d => yScale(d.yAxis))
            .attr('r', '3px')
            .attr('stroke', '#000')
            .attr('class', 'pointer')
            .attr('name', d => `opportunity-point-${d.compoundNumber}`)
            .on('mouseenter', handleMouseOver)
            .on('mouseout', handleMouseOut)
            .on('click', handleClick)

        const xAxisGroup = svg
            .append('g')
            .attr(
                'transform',
                `translate(0, ${height - margin.bottom})`
            )
            .attr('class', 'pointer-events-none')
            .attr('id', 'opportunity-x-axis-group')

        xAxisGroup
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-50)')

        const yAxisGroup = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .attr('class', 'pointer-events-none')
            .attr('id', 'opportunity-y-axis-group')
        yAxisGroup.call(yAxis)
    };

  const handleMouseOver = (d, i, m) => {
        const currentSelection = select(m[i])

        currentSelection
            .transition()
            .duration(200)
            .attr('stroke', '#ea3796')
            .attr('fill', '#ea3796')
            .attr('r', '5px')

        const intendedLocation = [
            parseInt(currentSelection.attr('cx')) + 7,
            parseInt(currentSelection.attr('cy')) + 7
        ]
        const shift = [0, 0]

        if (
            intendedLocation[0] + tooltipBoundingRect.height >
            boundingRect.width
        ) {
            shift[0] =
                intendedLocation[0] +
                tooltipBoundingRect.width +
                5 -
                boundingRect.width
        }

        if (
            intendedLocation[1] + tooltipBoundingRect.height >
            boundingRect.height
        ) {
            shift[1] =
                intendedLocation[1] +
                tooltipBoundingRect.height +
                5 -
                boundingRect.height
        }

        select('#opportunity-tooltip-img').attr(
            'src',
            partIsometricImage(d.compoundNumberClean)
        )
        select('#opportunity-tooltip-compoundNumber').text(d.compoundNumber)
        select('#opportunity-tooltip').attr(
            'style',
            `left: ${intendedLocation[0] - shift[0]}px; 
            top: ${intendedLocation[1] - shift[1]}px;
            opacity: 1`
        )
    };

  function handleMouseOut() {
        select(this)
            .transition()
            .duration(200)
            .attr('stroke', '#000')
            .attr('fill', '#000')
            .attr('r', '3px')

        const currentTooltipStyleString = select('#opportunity-tooltip').attr(
            'style'
        )
        select('#opportunity-tooltip').attr(
            'style',
            currentTooltipStyleString.replace('opacity: 1', 'opacity: 0')
        )
    }

  return (
            <div className="opportunity-canvas" ref={canvas}>
                <div
                    id="opportunity-tooltip"
                    className="flex-column pointer-events-none"
                    style={{ opacity: 0 }}
                >
                    <img
                        id="opportunity-tooltip-img"
                        src=""
                        alt=" "
                        style={{
                            backgroundImage: `url(${placeholder})`
                        }}
                    />
                    <div
                        id="opportunity-tooltip-compoundNumber"
                        className="h7 semi-bold flex justify-center align-center"
                    ></div>
                </div>
            </div>
        );
}

export default withRouter(OpportunityChart)
