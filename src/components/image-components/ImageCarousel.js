import React, { Component } from 'react'

import { baseImageURL } from '../../utilities'

import { Icon } from 'react-icons-kit'
import { angleLeft } from 'react-icons-kit/fa/angleLeft'
import { angleRight } from 'react-icons-kit/fa/angleRight'

import './image-components.css'

function ImageCarousel({imageError, compoundNumberClean}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  React.useEffect(() => {
    let timerHandle;
    timerHandle = setInterval(() => {
            imageError()
        }, 3000) //3 second timeout
    
    return () => {
      stopTimeout()
    };
  }, []);

  const stopTimeout = () => {
        if (timerHandle) {
            clearTimeout(timerHandle)
        }
    };

  imagesURLs = [
        `${baseImageURL}${compoundNumberClean}_Isometric.jpg`,
        `${baseImageURL}${compoundNumberClean}_Front.jpg`,
        `${baseImageURL}${compoundNumberClean}_Left.jpg`,
        `${baseImageURL}${compoundNumberClean}_Top.jpg`
    ]

  const renderArrow = (direction, clickFunction, glyph) => {
        return (
            <div className={`slide-arrow ${direction}`} onClick={clickFunction}>
                {glyph}
            </div>
        )
    };

  const nextSlide = () => {
        const lastIndex = imagesURLs.length - 1
        const { currentImageIndex } = this.state
        const shouldResetIndex = currentImageIndex === lastIndex
        const index = shouldResetIndex ? 0 : currentImageIndex + 1

        setCurrentImageIndex(index)
    };

  const previousSlide = () => {
        const firstIndex = 0
        const { currentImageIndex } = this.state
        const shouldResetIndex = currentImageIndex === firstIndex
        const index = shouldResetIndex
            ? imagesURLs.length - 1
            : currentImageIndex - 1

        setCurrentImageIndex(index)
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
                    <Icon
                        className="carousel-arrow-icon"
                        icon={angleLeft}
                        size={'70'}
                    />
                )}
                {renderImageSlide(
                    imagesURLs[currentImageIndex]
                )}
                {renderArrow(
                    'right',
                    nextSlide,
                    <Icon
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
