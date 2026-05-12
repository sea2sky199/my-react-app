import React from 'react'
import placeholder from '../../images/compoundPlaceholderListView.svg'
import { baseImageURL } from '../../utilities'

function CompoundImage({compoundNumberClean, className, style}) {
  const [error, setError] = React.useState(false);
  const timerHandle = React.useRef(null);

  const stopTimeout = () => {
        if (timerHandle.current) {
            clearInterval(timerHandle.current)
            timerHandle.current = null
        }
    };

  React.useEffect(() => {
    timerHandle.current = setInterval(() => {
            setError(true)
        }, 3000)

    return () => {
      stopTimeout()
    };
  }, []);

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
