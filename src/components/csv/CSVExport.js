import React, { Component } from 'react'

import { Icon } from 'react-icons-kit'
import { ic_file_download } from 'react-icons-kit/md/ic_file_download'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { getChemDWProprietary } from '../../utilities'
import { Tooltip, Spinner } from '../../components'

function CSVExport({dataRequest, totalDataLength, exportLimit, headers, classNamesArray, exportType}) {
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [data, setData] = React.useState([]);
  const csvLink = React.useRef(null);
  React.useEffect(() => {
    if (prevProps !== props) {
            setLoading({ loaded: false, loading: false })
        }
  }, [dataRequest, totalDataLength, exportLimit, headers, classNamesArray, exportType, loading, loaded]);

  const onClick = () => {
        setLoading(true)
        const res = await dataRequest(1, totalDataLength)
        if (loading) {
            this.setState({
                data: res.results,
                loading: false,
                loaded: true
            })
            if (csvLink.current) {
                csvLink.current.link.click()
            }
        }
    };

  const isExportLimitExceeded = exportLimit
            ? !totalDataLength ||
              totalDataLength > exportLimit
            : false

        const chemDWProprietaryColumnHeader =
            headers.length &&
            headers[Math.min(3, headers.length)].key
                ? headers[Math.min(3, headers.length)].key
                : headers[Math.min(3, headers.length)]

        return isExportLimitExceeded ? (
            <Tooltip
                data={
                    totalDataLength
                        ? `${exportLimit} Compound Limit Exceeded`
                        : 'Nothing to Export'
                }
            >
                <button
                    disabled
                    className={classNamesArray.join(' ')}
                >
                    Export
                    <Icon
                        style={{
                            marginRight: '-0.25rem',
                            paddingLeft: '0.5rem'
                        }}
                        icon={ic_file_download}
                        size={16}
                    />
                </button>
            </Tooltip>
        ) : loaded ? (
            <CSVLink
                ref={csvLink}
                className={classNamesArray.join(' ')}
                style={{ textDecoration: 'none' }}
                filename={`compoundMatch-${
                    exportType
                }${moment().format()}.csv`}
                data={[
                    {},
                    {
                        [chemDWProprietaryColumnHeader]: getChemDWProprietary(
                            true
                        )
                    },
                    {}
                ].concat(data)}
                headers={headers}
            >
                Export
                <Icon
                    style={{
                        marginRight: '-0.25rem',
                        paddingLeft: '0.5rem'
                    }}
                    icon={ic_file_download}
                    size={16}
                />
            </CSVLink>
        ) : (
            <button
                className={classNamesArray.join(' ')}
                onClick={onClick}
            >
                Export
                {loading ? (
                    <Spinner size="15" style={{ margin: '0 -4px 0 5px' }} />
                ) : (
                    <Icon
                        style={{
                            marginRight: '-0.25rem',
                            paddingLeft: '0.5rem'
                        }}
                        icon={ic_file_download}
                        size={16}
                    />
                )}
            </button>
        );
}

export default CSVExport
