import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

const defaultMargin = { top: 20, right: 20, bottom: 120, left: 60 }

function OpportunityChart({data, yAxis, xAxis}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [margin, setMargin] = React.useState(defaultMargin);
  const [boundingRect, setBoundingRect] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const canvas = React.useRef(null);
  const tooltipBoundingRect = React.useRef({});

  const handleCanvasResize = () => {
        if (canvas.current) {
            const rect = {
                height: canvas.current.clientHeight,
                width: canvas.current.clientWidth
            }
            setBoundingRect(rect)
            setLoaded(true)
        }
    };

  React.useEffect(() => {
    const debouncedResize = debounce(handleCanvasResize, 100)
        window.addEventListener('resize', debouncedResize, false)
        debouncedResize()

        const tooltipEl = document.getElementById('opportunity-tooltip')
        if (tooltipEl) {
            tooltipBoundingRect.current = tooltipEl.getBoundingClientRect()
        }

        trackPageView(location.pathname, 'Compound Match - Opportunity Exploration')

    return () => {
      window.removeEventListener('resize', debouncedResize, false)
    };
  }, []);

  React.useEffect(() => {
    if (loaded) {
            createChart()
            updateLeftMargin()
        }
  }, [loaded, data, yAxis, xAxis]);

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
        setMargin(prev => ({ ...prev, left: maxLabelWidth + 35 }))
    };

  const yAxisFullDomain = () => {
        return opportunityChartAccessorConfig[yAxis].order
            ? opportunityChartAccessorConfig[yAxis].order
            : data.map(datum => datum.yAxis)
    }

  const xAxisFullDomain = () => {
        return opportunityChartAccessorConfig[xAxis].order
            ? opportunityChartAccessorConfig[xAxis].order
            : data.map(datum => datum.xAxis)
    }

  const handleMouseOver = (event, d) => {
        const currentSelection = select(event.currentTarget)

        currentSelection
            .transition()
            .duration(200)
            .attr('stroke', '#ea3796')
            .attr('fill', '#ea3796')
            .attr('r', '5px')

        const cx = parseInt(currentSelection.attr('cx'))
        const cy = parseInt(currentSelection.attr('cy'))
        const intendedLocation = [cx + 7, cy + 7]
        const shift = [0, 0]
        const tbr = tooltipBoundingRect.current

        if (intendedLocation[0] + tbr.height > boundingRect.width) {
            shift[0] = intendedLocation[0] + tbr.width + 5 - boundingRect.width
        }

        if (intendedLocation[1] + tbr.height > boundingRect.height) {
            shift[1] = intendedLocation[1] + tbr.height + 5 - boundingRect.height
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

  const handleMouseOut = (event) => {
        select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('stroke', '#000')
            .attr('fill', '#000')
            .attr('r', '3px')

        const currentTooltipStyleString = select('#opportunity-tooltip').attr('style')
        select('#opportunity-tooltip').attr(
            'style',
            currentTooltipStyleString.replace('opacity: 1', 'opacity: 0')
        )
    };

  const handleClick = (event, d) => {
        navigate(`/compound/${d.compoundNumber}`)
    };

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
        ].getScale(yAxisFullDomain(), yAxisRange)
        const yAxisD3 = axisLeft(yScale).ticks(10)

        const xAxisRange = [
            margin.left,
            width - margin.right
        ]
        const xScale = opportunityChartAccessorConfig[
            xAxis
        ].getScale(xAxisFullDomain(), xAxisRange)
        const xAxisD3 = axisBottom(xScale).ticks(10)

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
            .call(xAxisD3)
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
        yAxisGroup.call(yAxisD3)
    };

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

export default OpportunityChart
