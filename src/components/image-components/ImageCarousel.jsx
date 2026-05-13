import React from 'react'
import AppIcon from '../utility-components/AppIcon'

import { baseImageURL } from '../../utilities'

import { angleLeft } from 'react-icons-kit/fa/angleLeft'
import { angleRight } from 'react-icons-kit/fa/angleRight'

import './image-components.css'

function ImageCarousel({imageError, compoundNumberClean}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const timerHandle = React.useRef(null);

  const imagesURLs = [
        `${baseImageURL}${compoundNumberClean}_Isometric.jpg`,
        `${baseImageURL}${compoundNumberClean}_Front.jpg`,
        `${baseImageURL}${compoundNumberClean}_Left.jpg`,
        `${baseImageURL}${compoundNumberClean}_Top.jpg`
    ]

  const stopTimeout = () => {
        if (timerHandle.current) {
            clearInterval(timerHandle.current)
            timerHandle.current = null
        }
    };

  React.useEffect(() => {
    timerHandle.current = setInterval(() => {
            imageError()
        }, 3000)

    return () => {
      stopTimeout()
    };
  }, []);

  const nextSlide = () => {
        const lastIndex = imagesURLs.length - 1
        const shouldResetIndex = currentImageIndex === lastIndex
        const index = shouldResetIndex ? 0 : currentImageIndex + 1
        setCurrentImageIndex(index)
    };

  const previousSlide = () => {
        const firstIndex = 0
        const shouldResetIndex = currentImageIndex === firstIndex
        const index = shouldResetIndex
            ? imagesURLs.length - 1
            : currentImageIndex - 1
        setCurrentImageIndex(index)
    };

  const routeToSlide = (index) => {
        setCurrentImageIndex(index)
    };

  const renderImageSlide = (url) => {
        return (
            <div
                className="carousel-image-container"
                style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            />
        )
    };

  const renderArrow = (direction, clickFunction, glyph) => {
        return (
            <div className={`slide-arrow ${direction}`} onClick={clickFunction}>
                {glyph}
            </div>
        )
    };

  const renderCarouselRoutingButtons = () => {
        const buttons = imagesURLs.map((url, i) => {
            let classNames = ['carousel-routing-button', 'pointer']
            let isCurrentImage = false
            if (i === currentImageIndex) {
                isCurrentImage = true
            }
            const styles = {
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }
            return (
                <button
                    className={classNames.join(' ')}
                    key={i}
                    onClick={() => routeToSlide(i)}
                    style={styles}
                >
                    {!isCurrentImage && (
                        <div className={'carousel-routing-button-layer'} />
                    )}
                </button>
            )
        })
        return (
            <div className="carousel-routing-buttons-container">{buttons}</div>
        )
    };

  return (
            <div className="carousel flex justify-center">
                {renderArrow(
                    'left',
                    previousSlide,
                    <AppIcon
                        className="carousel-arrow-icon"
                        icon={angleLeft}
                        size={'70'}
                    />
                )}
                {renderImageSlide(imagesURLs[currentImageIndex])}
                {renderArrow(
                    'right',
                    nextSlide,
                    <AppIcon
                        className="carousel-arrow-icon"
                        icon={angleRight}
                        size="70"
                    />
                )}
                {renderCarouselRoutingButtons()}
            </div>
        );
}

export default ImageCarousel
