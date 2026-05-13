import React from 'react'
import './file-upload.css'

import Resumablejs from 'resumablejs'

import { Icon } from 'react-icons-kit'
import { ic_clear } from 'react-icons-kit/md/ic_clear'

import { hasClass } from '../../utilities'

function FileUpload({service, query, filetypes, maxFiles, maxFileSize, headerObject, withCredentials, chunkSize, simultaneousUploads, fileParameterName, generateUniqueIdentifier, forceChunkSize, promiseCallback, onUploadSuccessCallback, onUploadErrorCallback, updateFileNamesForUpload, uploaderID, showFileList, dropTargetID}) {
  const [progressBar, setProgressBar] = React.useState(0);
  const [files, setFiles] = React.useState([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const resumable = React.useRef(null);
  const uploaderRef = React.useRef(null);
  const dropZoneRef = React.useRef(null);

  const addFileLocally = (file) => {
        setFiles(prev => [...prev, file])
    };

  React.useEffect(() => {
        if (updateFileNamesForUpload) {
            updateFileNamesForUpload(files.map(file => file.fileName))
        }
  }, [files]);

  React.useEffect(() => {
        const ResumableField = new Resumablejs({
            target: service,
            query: query || {},
            fileType: filetypes,
            maxFiles: maxFiles,
            maxFileSize: maxFileSize,
            fileTypeErrorCallback: (file, errorCount) => {
                console.log('error', file, errorCount)
            },
            maxFileSizeErrorCallback: (file, errorCount) => {
                console.log('error', file, errorCount)
            },
            headers: headerObject || {},
            withCredentials: withCredentials || false,
            chunkSize: chunkSize,
            simultaneousUploads: simultaneousUploads,
            fileParameterName: fileParameterName,
            generateUniqueIdentifier: generateUniqueIdentifier,
            forceChunkSize: forceChunkSize
        })

        if (uploaderRef.current) ResumableField.assignBrowse(uploaderRef.current)
        if (dropZoneRef.current) ResumableField.assignDrop(dropZoneRef.current)

        ResumableField.on('fileAdded', (file) => {
            addFileLocally(file)
        })

        promiseCallback(new Promise((resolve, reject) => {
            ResumableField.on('fileSuccess', (file, fileServer) => {
                onUploadSuccessCallback(file, fileServer)
                resolve([file, fileServer])
            })

            ResumableField.on('fileError', (file, errorCount) => {
                onUploadErrorCallback(file, errorCount)
                reject([file, errorCount])
            })
        }))

        ResumableField.on('progress', () => {
            setIsUploading(ResumableField.isUploading())

            if (ResumableField.progress() * 100 < 100) {
                setProgressBar(ResumableField.progress() * 100)
            } else {
                setTimeout(() => {
                    setProgressBar(0)
                }, 1000)
            }
        })

        resumable.current = ResumableField
  }, []);

  const upload = () => {
        resumable.current.upload()
    };

  const removeFileLocally = (event, file, index) => {
        event.preventDefault()

        const currentFiles = [...files]
        currentFiles.splice(index, 1)

        setFiles(currentFiles)

        resumable.current.removeFile(file)
    };

  const createFileList = () => {
        return (
            <ul id={'items-' + uploaderID}>
                {files.map((file, index) => {
                    let uniqID = uploaderID + '-' + index
                    let originFile = file.file
                    return (
                        <li
                            className="flex align-center pointer"
                            key={uniqID}
                            onClick={event =>
                                removeFileLocally(event, file, index)
                            }
                        >
                            <Icon
                                icon={ic_clear}
                                size={12}
                                style={{ margin: '-2px 5px 0 0' }}
                            />
                            {originFile.name}
                        </li>
                    )
                })}
            </ul>
        )
    };

  let fileList = null
        if (showFileList) {
            fileList = (
                <div className="resumable-list h6">{createFileList()}</div>
            )
        }

        return (
            <div>
                <div className="flex h5" style={{ paddingBottom: '0.5rem' }}>
                    <div>Upload Asset(s)</div>
                    <div
                        className={`semi-thin ${hasClass([
                            'required',
                            !files.length
                        ])}`}
                        style={{ paddingLeft: '0.25rem' }}
                    >
                        (Unreleased Only)
                    </div>
                </div>
                <div
                    id={dropTargetID}
                    ref={dropZoneRef}
                >
                    <button
                        ref={uploaderRef}
                        id="browseButton"
                        className="pointer"
                    >
                        BROWSE
                    </button>
                    <div
                        className="progress"
                        style={{
                            display:
                                progressBar === 0 ? 'none' : 'block'
                        }}
                    >
                        <div
                            className="progress-bar"
                            style={{ width: progressBar + '%' }}
                        ></div>
                    </div>
                    {fileList}
                </div>
            </div>
        );
}

FileUpload.defaultProps = {
    maxFiles: undefined,
    uploaderID: 'default-resumable-uploader',
    dropTargetID: 'dropTarget',
    filetypes: [],
    fileAccept: '*',
    maxFileSize: 500 * 1024 * 1024,
    showFileList: true,
    promiseCallback: complete => {},
    onUploadSuccessCallback: (file, fileServer) => {
        console.log('succuss', file, fileServer)
    },
    onUploadErrorCallback: (file, errorCount) => {
        console.log('error', file, errorCount)
    },
    fileNameServer: '',
    tmpDir: '',
    chunkSize: 1024 * 1024,
    simultaneousUploads: 1,
    fileParameterName: 'file',
    generateUniqueIdentifier: null,
    pause: false,
    previousText: '',
    headerObject: {},
    withCredentials: false,
    forceChunkSize: false
}

export default FileUpload
