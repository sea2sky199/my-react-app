import React from 'react'
import { useLocation } from 'react-router-dom'
import './data-visualizations.css'

import {
    camelToHumanCase,
    formatStringContainingMeasurement,
    getLinearScale,
    getColorScaleOrdinal,
    getBandScale,
    trackPageView
} from '../../utilities'

import { select } from 'd3-selection'
import { interpolateInferno } from 'd3-scale-chromatic'

import { debounce } from 'lodash'

function DistributionChart({data}) {
  const location = useLocation();
  const [boundingRect, setBoundingRect] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [windowHeight, setWindowHeight] = React.useState(null);
  const canvas = React.useRef(null);

  const handleCanvasResize = () => {
        if (canvas.current) {
            const rect = {
                height: canvas.current.clientHeight,
                width: canvas.current.clientWidth
            }
            setBoundingRect(rect)
            setLoaded(true)
            setWindowHeight(window.innerHeight)
        }
    };

  React.useEffect(() => {
    const debouncedResize = debounce(handleCanvasResize, 100)
        window.addEventListener('resize', debouncedResize, false)
        debouncedResize()
        trackPageView(location.pathname, 'Compound Match - Distribution')

    return () => {
      window.removeEventListener('resize', debouncedResize, false)
    };
  }, []);

  React.useEffect(() => {
    if (loaded) {
            createChart()
        }
  }, [loaded, data]);

  const formatChartTitle = (columnHeader) => {
        return formatStringContainingMeasurement
            ? formatStringContainingMeasurement(camelToHumanCase(columnHeader))
            : camelToHumanCase(columnHeader)
    };

  const cleanOldSvg = () => {
        select('.canvas-scrollable')
            .selectAll('svg')
            .remove()
    };

  const getOrderedColumnAccessors = () => {
        const headerOrder = [
            'finishedLengthInches',
            'finishedWidthInches',
            'finishedHeightInches',
            'finishedVolumeInches3',
            'finishedSurfaceAreaInches2',
            'stockLengthInches',
            'stockWidthInches',
            'stockSurfaceAreaInches2'
        ]

        const headerOrderConfig = headerOrder.reduce((headerMap, header, i) => {
            headerMap[header] = i + 1
            return headerMap
        }, {})

        return Object.keys(data.distribution).sort((a, b) => {
            let aVal = headerOrderConfig[a] || Infinity
            let bVal = headerOrderConfig[b] || Infinity
            return aVal - bVal
        })
    };

  const appendLine = (
        svgObject,
        x1,
        y1,
        x2,
        y2,
        stroke = '#000',
        strokeWidth = 1
    ) => {
        return svgObject
            .append('line')
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2)
            .attr('stroke', stroke)
            .attr('stroke-width', strokeWidth)
    };

  const appendYAxis = (svgObject, columnHeader, singleChartHeight, margin) => {
        const chartTitle = svgObject.append('g')

        chartTitle
            .append('text')
            .attr('x', margin.left - 10)
            .attr('y', 5 + singleChartHeight / 2)
            .attr('text-anchor', 'end')
            .attr('class', 'h5')
            .append('tspan')
            .text(formatChartTitle(columnHeader))

        appendLine(
            chartTitle,
            margin.left,
            0,
            margin.left,
            singleChartHeight,
            '#D8D8D8'
        )

        appendLine(
            chartTitle,
            margin.left - 5,
            singleChartHeight / 2,
            margin.left,
            singleChartHeight / 2,
            '#D8D8D8'
        )
    };

  const appendHistogram = (
        svgObject,
        histData,
        xScale,
        yScale,
        yScaleMin,
        frequencyMax,
        left_bin,
        chartYMargin,
        fillColor
    ) => {
        const fillOpacityScale = getLinearScale([0, frequencyMax], [0.2, 1])

        const histogram = svgObject
            .append('g')
            .attr('transform', `translate(0,${chartYMargin})`)

        histogram
            .selectAll('rect')
            .data(histData.frequency)
            .enter()
            .append('rect')
            .attr('transform', (d, i) => {
                return `translate(${xScale(i)},${yScale(
                    (frequencyMax - d) / 2
                ) - yScaleMin})`
            })
            .attr('width', xScale.bandwidth())
            .attr('height', function(d) {
                return yScale(d)
            })
            .style('fill', (d, i) => {
                if (i === left_bin) {
                    return 'gold'
                } else {
                    return fillColor
                }
            })
            .style('opacity', (d, i) => {
                if (i === left_bin) {
                    return 1
                } else {
                    return fillOpacityScale(d)
                }
            })

        const dashedMarker = appendLine(
            histogram,
            xScale(left_bin) + xScale.bandwidth() / 2,
            0,
            xScale(left_bin) + xScale.bandwidth() / 2,
            yScale(frequencyMax),
            'gold'
        )
        dashedMarker.attr('stroke-dasharray', 5).style('opacity', 0.8)
    };

  const appendBoxAndWhiskers = (
        svgObject,
        histData,
        xScale,
        yScale,
        frequencyMax,
        singleChartHeight
    ) => {
        const xScaleBox = getLinearScale(histData.log_range, [
            xScale(0),
            xScale(99) + xScale.bandwidth()
        ])

        const boxAndWhiskers = svgObject
            .append('g')
            .attr('transform', `translate(0,${singleChartHeight / 2})`)

        boxAndWhiskers
            .append('rect')
            .attr(
                'width',
                xScaleBox(histData.quartiles[2]) - xScaleBox(histData.quartiles[0])
            )
            .attr('x', xScaleBox(histData.quartiles[0]))
            .attr('y', -yScale(frequencyMax / 4))
            .attr('height', yScale(frequencyMax / 2))
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '1')

        appendLine(
            boxAndWhiskers,
            xScaleBox(histData.log_range[0]),
            0,
            xScaleBox(histData.quartiles[0]),
            0
        )

        appendLine(
            boxAndWhiskers,
            xScaleBox(histData.quartiles[2]),
            0,
            xScaleBox(histData.log_range[1]),
            0
        )

        appendLine(
            boxAndWhiskers,
            xScaleBox(histData.quartiles[1]),
            -yScale(frequencyMax / 4),
            xScaleBox(histData.quartiles[1]),
            yScale(frequencyMax / 4)
        )
    };

  const createHistogramChart = (
        svg,
        columnHeader,
        histData,
        partProfile,
        singleChartHeight,
        xScale,
        fillColor,
        margin,
        index
    ) => {
        const frequencyMax = Math.max(...histData.frequency)
        const chartYMargin = 10
        const yScaleMin = 1

        const yScale = getLinearScale(
            [0, frequencyMax],
            [yScaleMin, singleChartHeight - 2 * chartYMargin]
        )

        const accessorChart = svg
            .append('g')
            .attr('transform', `translate(0,${index * singleChartHeight})`)

        appendYAxis(accessorChart, columnHeader, singleChartHeight, margin)

        appendHistogram(
            accessorChart,
            histData,
            xScale,
            yScale,
            yScaleMin,
            frequencyMax,
            Math.min(partProfile.left_bin, 99),
            chartYMargin,
            fillColor
        )

        appendBoxAndWhiskers(
            accessorChart,
            histData,
            xScale,
            yScale,
            frequencyMax,
            singleChartHeight
        )
    };

  const createChart = () => {
        cleanOldSvg()

        const columnAccessors = getOrderedColumnAccessors()

        const margin = { left: 195 }
        const width = boundingRect.width
        const boundingRectHeight = (windowHeight * 15) / 100
        const svgHeight = boundingRectHeight * columnAccessors.length

        const svg = select('.canvas-scrollable')
            .append('svg')
            .attr('viewBox', [0, 0, width, svgHeight])
            .attr('height', svgHeight)

        const xScale = getBandScale(
            [...Array(100).keys()],
            [margin.left, width]
        )

        const colorOrdinal = getColorScaleOrdinal(
            interpolateInferno,
            columnAccessors.length + 5
        )

        columnAccessors.forEach((accessor, i) => {
            createHistogramChart(
                svg,
                accessor,
                data.distribution[accessor],
                data['compound_profile'][accessor],
                boundingRectHeight,
                xScale,
                colorOrdinal(accessor),
                margin,
                i
            )
        })
    };

  return <div className="canvas-scrollable" ref={canvas}></div>;
}

export default DistributionChart
