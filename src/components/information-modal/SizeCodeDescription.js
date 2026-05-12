import React, { Component } from 'react'
import { ClickableDiv } from '..'
import { sizeCodeOrder, sizeCodeRanges, hasClass } from '../../utilities'

function SizeCodeDescription() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
            <div className="flex">
                <div className="size-code-description-container h6 semi-thin wrap-normal">
                    <p>
                        Compound size groups have been assigned to all compounds
                        available in the CompoundMatch. These size groups rank a
                        compound relative to all other compounds. The ranking is based
                        on a value derived from finished height, width and
                        length. This ranking is split into roughly five equal
                        segments and assigned a letter code A through E. With
                        the 'A' group being the smallest compounds and the 'E' group
                        being the largest. Furthermore each letter group is
                        similarly split into five segments using extra small
                        (XS), small (S), medium (M), large (Lg) and extra-large
                        (XLg).
                    </p>
                </div>
                <div
                    className="flex-column h6 semi-thin wrap-normal"
                    style={{ width: '20rem' }}
                >
                    <div className="size-code-buttons-container h6-5 flex">
                        {sizeCodeConfig.map(([sizeCode], i) => {
                            return (
                                <ClickableDiv
                                    classNameArr={[
                                        'size-code-description-button',
                                        'flex',
                                        'justify-center',
                                        'align-center',
                                        hasClass([
                                            'size-code-description-button-active',
                                            i === activeIndex
                                        ])
                                    ]}
                                    clickAction={() =>
                                        setActiveIndex(i)
                                    }
                                    key={`${sizeCode}-description-item`}
                                    name={`${sizeCode}-description-item`}
                                >
                                    <div>{sizeCode}</div>
                                </ClickableDiv>
                            )
                        })}
                    </div>
                    <div className="size-code-individual-description">
                        {`The cuboidal volume dimension range for ${
                            sizeCodeConfig[activeIndex][0]
                        } is ${sizeCodeConfig[
                            activeIndex
                        ][1].join(' - ')} in`}
                        <sup>3</sup>
                    </div>
                </div>
            </div>
        );
}

export default SizeCodeDescription
