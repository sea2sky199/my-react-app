import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './data-visualizations.css'

import { select } from 'd3-selection'
import { axisLeft, axisBottom } from 'd3-axis'
import { Information } from '..'
import {
    getLinearScale,
    getScalePoint,
    formatStringContainingMeasurement,
    camelToHumanCase,
    trackPageView
} from '../../utilities'

import { debounce } from 'lodash'

function ZScoreChart({location, data}) {
  const [margin, setMargin] = React.useState(this.defaultMargin);
  const [boundingRect, setBoundingRect] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const canvas = React.useRef(null);
  React.useEffect(() => {
    let debouncedResize;
    debouncedResize = debounce(handleCanvasResize, 100)
        window.addEventListener('resize', debouncedResize, false)
        debouncedResize()

        // matomo tracking
        let currentUrl = location.pathname
        trackPageView(currentUrl, 'Compound Match - Unique Features')
    
    return () => {
      window.removeEventListener('resize', debouncedResize, false)
    };
  }, []);
  React.useEffect(() => {
    if (loaded) {
            createChart()
        }
  }, [location, data, loaded]);

  function shouldComponentUpdate(nextProps, nextState) {
        const nextRect = nextState.boundingRect
        const didSvgSizeChange =
            boundingRect.width !== nextRect.width ||
            boundingRect.height !== nextRect.height
        const didDataChange = data !== nextProps.data

        return didSvgSizeChange || didDataChange
    }

  const handleCanvasResize = () => {
        const boundingRect = {
            height: canvas.current.clientHeight,
            width: canvas.current.clientWidth
        }
        this.setState({ boundingRect, loaded: true })
    };

  const cleanOldSvg = () => {
        select('.canvas')
            .selectAll('svg')
            .remove()
    };

  const createChart = () => {
        cleanOldSvg()

        const width = boundingRect.width
        const height = boundingRect.height

        const svg = select('.canvas')
            .append('svg')
            .attr('viewBox', [0, 0, width, height])

        const yScaleFullDomain = data
            .map(obj => obj.zScore)
            .sort((a, b) => b - a)

        const yAxisRange = [
            height - margin.bottom,
            margin.top
        ]
        const yScale = getLinearScale(
            yScaleFullDomain[0] > 1 ? [0, ...yScaleFullDomain] : [0, 1],
            yAxisRange
        )
        const yAxis = axisLeft(yScale).ticks(5)

        const xAxisRange = [
            margin.left,
            width - margin.right
        ]
        const xScale = getScalePoint(
            data.map(obj => obj.accessor),
            xAxisRange,
            0.6
        )
        const xAxis = axisBottom(xScale)

        const chart = svg.append('g')
        const graph = chart.append('g')
        const datum = graph
            .selectAll('circle')
            .data(data)
            .enter()

        datum
            .append('circle')
            .attr('cx', d => xScale(d.accessor))
            .attr('cy', d => yScale(d.zScore))
            .attr('r', '5px')
            .attr('fill', '#8978ce')

        datum
            .append('line')
            .attr('x1', d => xScale(d.accessor))
            .attr('x2', d => xScale(d.accessor))
            .attr('y1', d => yScale(d.zScore))
            .attr('y2', d => yScale(0))
            .attr('stroke-width', '5px')
            .attr('stroke', '#8978ce')

        const xAxisGroup = svg
            .append('g')
            .attr(
                'transform',
                `translate(0, ${height - margin.bottom})`
            )

        xAxisGroup
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)')
            .text(d => formatAccessorLabel(d))

        const yAxisGroup = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
        yAxisGroup.call(yAxis)

        const yAxisGridlines = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
        yAxisGridlines
            .attr('class', 'grid-lines')
            .call(
                yAxis
                    .tickSize(
                        -(
                            width -
                            margin.left -
                            margin.right
                        )
                    )
                    .tickFormat('')
            )
    };

  return (
            <div
                style={{ position: 'relative', height: '100%', width: '100%' }}
            >
                <div className="canvas" ref={canvas}></div>
                <div className="z-score-y-axis-label">
                    Z-Score
                    <Information
                        header="Z-Score Definition"
                        eventName="showZScoreDefinition"
                    >
                        <div className="h6 z-score-description-container">
                            Z Score is a measurement of how unique a particular
                            compound attribute is versus a specified group of compounds
                            (ex. versus entire compound library, or similar part
                            library). The higher the value, the more unique the
                            compound attribute is compared to the group. For a given
                            compound attribute the Z-Score is calculated by taking
                            the absolute value of the compound minus the mean of the
                            group which is divided by the standard deviation of
                            the group.
                        </div>
                    </Information>
                </div>
            </div>
        );
}

export default withRouter(ZScoreChart)
