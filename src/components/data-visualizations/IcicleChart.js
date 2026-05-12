import React from 'react'
import { useLocation } from 'react-router-dom'
import './data-visualizations.css'

import {
    numericCompare,
    stringCompare,
    sizeSubCodeOrder,
    getColorScaleOrdinal,
    trackPageView
} from '../../utilities'

import { partition, hierarchy } from 'd3-hierarchy'
import { select } from 'd3-selection'
import { interpolateRainbow } from 'd3-scale-chromatic'
import 'd3-transition'

import { debounce } from 'lodash'

function IcicleChart({data, reroute}) {
  const location = useLocation();
  const [boundingRect, setBoundingRect] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const canvas = React.useRef(null);

  const colorOrdinal = React.useRef(getColorScaleOrdinal(interpolateRainbow, 8)).current;

  const accessorConfig = {
        sizeCode: {
            sort: (a, b) => stringCompare(a.data.name, b.data.name),
            format: d => `SIZE CODE ${d.data.name.toUpperCase()}`
        },
        sizeSubCode: {
            sort: (a, b) =>
                numericCompare(
                    sizeSubCodeOrder.indexOf(a.data.name.toLowerCase()),
                    sizeSubCodeOrder.indexOf(b.data.name.toLowerCase())
                ),
            format: d => `SIZE SUB CODE ${d.data.name.toUpperCase()}`
        }
    }

  const handleCanvasResize = () => {
        if (canvas.current) {
            const rect = canvas.current.getBoundingClientRect()
            setBoundingRect(rect)
            setLoaded(true)
        }
    };

  React.useEffect(() => {
    handleCanvasResize()
        const debouncedResize = debounce(handleCanvasResize, 100)
        window.addEventListener('resize', debouncedResize, false)
        trackPageView(location.pathname, 'Compound Match - Explore')

    return () => {
      window.removeEventListener('resize', debouncedResize, false)
    };
  }, []);

  React.useEffect(() => {
    if (loaded) {
            createChart()
        }
  }, [loaded, data]);

  const getRectHeight = (d) => d.x1 - d.x0;

  const willLabelFit = (d) => getRectHeight(d) > 16;

  const formatCellName = (d) => {
        const config = accessorConfig[d.data.grouping]
        if (config) return config.format(d)
        return d.data.name ? d.data.name.toUpperCase() : ''
    };

  const getFilterQuery = (nodeData) => {
        return nodeData.filterParameterArray || []
    };

  const cleanOldSvg = () => {
        select('.canvas')
            .selectAll('svg')
            .remove()
    };

  const buildRootDataHierarchy = () => {
        const root = hierarchy(data)
            .sum(d => d.total)
            .sort((a, b) => {
                return accessorConfig[a.data.grouping] &&
                    accessorConfig[a.data.grouping].sort
                    ? accessorConfig[a.data.grouping].sort(a, b)
                    : numericCompare(b.value, a.value)
            })

        partition().size([
            boundingRect.height,
            ((root.height + 1) * boundingRect.width) / 3
        ])(root)

        return root
    };

  const shiftAllRectPositionsAndSizesForNewFocus = (root, newFocusRectInfo) => {
        root.each(
            rectInfo =>
                (rectInfo.target = {
                    x0: getUpdatedHeightCoordinate(
                        rectInfo.x0,
                        newFocusRectInfo
                    ),
                    x1: getUpdatedHeightCoordinate(
                        rectInfo.x1,
                        newFocusRectInfo
                    ),
                    y0: rectInfo.y0 - newFocusRectInfo.y0,
                    y1: rectInfo.y1 - newFocusRectInfo.y0
                })
        )
    };

  const getUpdatedHeightCoordinate = (
        previousHeightCoordinate,
        newFocusRectInfo
    ) => {
        const newFocusRectHeight = newFocusRectInfo.x1 - newFocusRectInfo.x0
        const newViewBoxHeightBaseline = newFocusRectInfo.x0
        return (
            ((previousHeightCoordinate - newViewBoxHeightBaseline) /
                newFocusRectHeight) *
            boundingRect.height
        )
    };

  const createChart = () => {
        cleanOldSvg()

        const width = boundingRect.width
        const height = boundingRect.height
        const root = buildRootDataHierarchy()
        let focusedRect = root

        const zoomableClick = (event, rectInfo) => {
            const isFocusSameAsClicked = focusedRect === rectInfo
            const doesSelectedHaveParent = !!rectInfo.parent
            focusedRect =
                isFocusSameAsClicked && doesSelectedHaveParent
                    ? (rectInfo = rectInfo.parent)
                    : rectInfo

            shiftAllRectPositionsAndSizesForNewFocus(root, focusedRect)

            const t = cell
                .transition()
                .duration(750)
                .attr(
                    'transform',
                    d => `translate(${d.target.y0},${d.target.x0})`
                )

            rect.transition(t).attr('height', d => getRectHeight(d.target))
            title
                .transition(t)
                .attr('fill-opacity', d => +willLabelFit(d.target))
                .attr('pointer-events', d =>
                    willLabelFit(d.target) ? 'auto' : 'none'
                )
            titleValue
                .transition(t)
                .attr('fill-opacity', d => willLabelFit(d.target) * 0.7)
                .attr('pointer-events', d =>
                    willLabelFit(d.target) ? 'auto' : 'none'
                )
        }

        const svg = select('.canvas')
            .append('svg')
            .attr('class', 'icicle')
            .attr('viewBox', [0, 0, width, height])

        const cell = svg
            .selectAll('g')
            .data(root.descendants())
            .join('g')
            .attr('transform', d => `translate(${d.y0},${d.x0})`)

        const rect = cell
            .append('rect')
            .attr('width', d => d.y1 - d.y0 - 1)
            .attr('height', d => getRectHeight(d))
            .attr('fill-opacity', d => (!d.depth ? 1 : 0.6))
            .attr('fill', d => {
                if (!d.depth) return '#ea3796'
                while (d.depth > 1) d = d.parent
                return colorOrdinal(d.data.name)
            })
            .style('cursor', 'pointer')
            .on('click', zoomableClick)

        const titleGroup = cell
            .append('g')
            .attr('class', 'icicle-title-group pointer')

        const title = titleGroup
            .append('text')
            .style('user-select', 'none')
            .attr('x', '15')
            .attr('y', '21')
            .attr('fill-opacity', d => +willLabelFit(d))
            .attr('pointer-events', d =>
                willLabelFit(d) ? 'auto' : 'none'
            )
            .attr('class', 'h5 semi-bold')
            .on('click', clickTitleFilter)

        title.append('tspan').text(formatCellName)

        const titleValue = title
            .append('tspan')
            .style('user-select', 'none')
            .attr('fill-opacity', d => willLabelFit(d) * 0.7)
            .attr('pointer-events', d =>
                willLabelFit(d) ? 'auto' : 'none'
            )
            .attr('dx', 8)
            .attr('class', 'h4-5 semi-thin')
            .on('click', clickTitleFilter)
            .text(d => d.value.toLocaleString())
    };

  const clickTitleFilter = (event, d) => {
        const filterQuery = getFilterQuery(d.data)
        const queryString = filterQuery.length ? `?${filterQuery.join('&')}` : ''
        reroute(`/compounds${queryString}`)
    };

  return <div className="canvas" ref={canvas}></div>;
}

export default IcicleChart
