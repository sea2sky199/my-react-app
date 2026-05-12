import React, { Component } from 'react'
import './file-upload.css'

import Resumablejs from 'resumablejs'

import { Icon } from 'react-icons-kit'
import { ic_clear } from 'react-icons-kit/md/ic_clear'

import { hasClass } from '../../utilities'

function FileUpload({service, query, filetypes, maxFiles, maxFileSize, headerObject, withCredentials, chunkSize, simultaneousUploads, fileParameterName, generateUniqueIdentifier, forceChunkSize, promiseCallback, onUploadSuccessCallback, onUploadErrorCallback, updateFileNamesForUpload, uploaderID, showFileList, dropTargetID}) {
  const [progressBar, setProgressBar] = React.useState(0);
  const [files, setFiles] = React.useState([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const prevFilesRef = React.useRef();
  React.useEffect(() => {
    const didFilesChange = prevFilesRef.current && prevFilesRef.current !== files

        if (didFilesChange) {
            if (updateFileNamesForUpload) {
                updateFileNamesForUpload(
                    files.map(file => file.fileName)
                )
            }
        }
    prevFilesRef.current = files;
  }, [service, query, filetypes, maxFiles, maxFileSize, headerObject, withCredentials, chunkSize, simultaneousUploads, fileParameterName, generateUniqueIdentifier, forceChunkSize, promiseCallback, onUploadSuccessCallback, onUploadErrorCallback, updateFileNamesForUpload, uploaderID, showFileList, dropTargetID, files]);

  const componentDidMount = () => {
        let ResumableField = new Resumablejs({
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

        ResumableField.assignBrowse(uploader)
        ResumableField.assignDrop(dropZone)

        ResumableField.on('fileAdded', (file, event) => {
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


        resumable = ResumableField
    };

  const upload = () => {
        resumable.upload()
    };

  const removeFileLocally = (event, file, index) => {
        event.preventDefault()

        const currentFiles = [...files]
        currentFiles.splice(index, 1)

        setFiles(currentFiles)

        resumable.removeFile(file)
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
                    ref={node => (dropZone = node)}
                >
                    <button
                        ref={node => (uploader = node)}
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
