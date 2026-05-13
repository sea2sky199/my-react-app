import React from 'react'
import AppIcon from '../utility-components/AppIcon'
import './layout.css'
import { version, getChemDWProprietary, siteName } from '../../utilities'
import { ic_block } from 'react-icons-kit/md/ic_block'
function Footer() {
  const classNamesArr = [
            'footer',
            'flex',
            'space-between',
            'align-center',
            'h6',
            'semi-thin',
            'letter-spacing-large',
            'footer-extended'
        ]

        return (
            <div className={classNamesArr.join(' ')}>
                <div
                    className="flex-column justify-center"
                    style={{ maxWidth: '38rem' }}
                >
                    <div
                        className="pointer nowrap bold"
                        style={{textAlign: 'left'}}
                    >
                        {`ChemDW Proprietary - Limited Data`}
                    </div>
                    <div
                        style={{
                            textAlign: 'justify',
                            paddingTop: '0.2rem'
                        }}
                        className="h8"
                    >
                        {getChemDWProprietary(false, true)}
                    </div>
                </div>
                <div>
                    <div
                        className="bold"
                        style={{marginBottom: '0.5rem'}}
                    >
                        {`${siteName} ${version}`}
                    </div>
                    <AppIcon
                        icon={ic_block}
                        size={16}
                        style={{ color: '#cb4154', padding: '0 3px' }}
                    />
                </div>
            </div>
        );
}

export default Footer
