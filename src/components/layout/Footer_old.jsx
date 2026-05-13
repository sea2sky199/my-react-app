import React from 'react'
import AppIcon from '../utility-components/AppIcon'
import './layout.css'
import { version, getChemDWProprietary, siteName } from '../../utilities'
import { ic_block } from 'react-icons-kit/md/ic_block'
function Footer() {
  const [open, setOpen] = React.useState(false);

  const classNamesArr = [
            'footer',
            'flex',
            'space-between',
            'align-center',
            'h8',
            'letter-spacing-large'
        ]
        if (open) {
            classNamesArr.push('footer-extended')
        }
        return (
            <div className={classNamesArr.join(' ')}>
                <div className="flex align-center justify-center nowrap">
                    {`${siteName} ${version} | `}
                    <AppIcon
                        icon={ic_block}
                        size={10}
                        style={{ color: '#cb4154', padding: '0 3px' }}
                    />
                </div>
                <div
                    className="flex-column justify-center"
                    style={{ maxWidth: '28rem' }}
                >
                    <div
                        className="pointer nowrap"
                        onClick={() =>
                            setOpen(!open)
                        }
                    >
                        {`ChemDW Proprietary - Data`}
                        <div
                            className={
                                open
                                    ? 'nav-user-dropdown upside-down nav-clickable'
                                    : 'nav-user-dropdown nav-clickable'
                            }
                            style={{ padding: '0 0.5rem' }}
                        >
                            <span>&#9660;</span>
                        </div>
                    </div>
                    {open && (
                        <div
                            style={{
                                textAlign: 'justify',
                                paddingTop: '0.5rem'
                            }}
                        >
                            {getChemDWProprietary(false, true)}
                        </div>
                    )}
                </div>
            </div>
        );
}

export default Footer
