import React, { Component } from 'react'
import placeholder from '../../images/compoundPlaceholderListView.svg'
import { baseImageURL } from '../../utilities'

function CompoundImage({compoundNumberClean, className, style}) {
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    let timerHandle;
    timerHandle = setInterval(() => {
            setError(true)
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

  const imageURL = `${baseImageURL}${compoundNumberClean}_Isometric.jpg`

        return (
            <img
                src={error ? placeholder : imageURL}
                className={className}
                onError={() => {
                    stopTimeout()
                    setError(true)
                }}
                onLoad={() => {
                    stopTimeout()
                }}
                alt=""
                style={{
                    ...style,
                    backgroundImage: `url(${placeholder})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    objectFit: 'cover'
                }}
            />
        );
}

export default CompoundImage
