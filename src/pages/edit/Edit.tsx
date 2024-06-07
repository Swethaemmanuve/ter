import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import arrowIcon from '../../assets/images/arrow-left.svg'
import refreshIcon from '../../assets/images/ic_refresh.svg'
import './Edit.scss'
import { Dropdown, Input, Modal, Spin, message } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { LoadingOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import templates from '../../api/services/templates'
import axios from 'axios'

function Edit() {
    const location = useLocation()
    const navigate = useNavigate()
    const state = location.state
    const iframeRef = useRef<HTMLIFrameElement | null>(null)
    const [modal, setModal] = useState(false)
    const [htmlDoc, setHtmlDoc]: any = useState(null)
    const [editContent, setEditContent]: any = useState({
        id: '',
        value: '',
    })
    const [changesArr, setChangeArr] = useState([])
    const [canDownload, setCanDownload] = useState(true)
    const [textAreaValue, setTextAreaValue] = useState('')
    const [vDom, setVDom]: any = useState(null)
    const [ailoading, setAiloading] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [isWithSite, setIsWithSite] = useState(false)
    const [deployModal, setDeployModal] = useState(false)
    const [netlifyCred, setNetlifyCred] = useState({
        accessToken: '',
        siteId: '',
    })

    const getHtmlFileFromServer = (id: string) => {
        templates
            .getPage(id)
            .then((res) => {
                if (res.data.apiStatus) {
                    const response = res.data.result[0]
                    if (response) {
                        loadPage1(response.attr_html)
                    } else {
                        message.error('Something went wrong')
                    }
                } else {
                    message.error(res.data.message)
                    setHtmlDoc('<p>Something went wrong</p>')
                }
            })
            .catch((err) => {
                message.error(err)
            })
    }

    function loadPage1(page: any) {
        axios
            .get(page)
            .then((response) => {
                let data = response.data
                let documents = document.getElementById('content')
                var parser = new DOMParser()
                var doc = parser.parseFromString(data, 'text/html')
                setVDom(doc)

                // Get doc as HTML string
                const elements = doc.querySelectorAll('[data-ca]')
                elements.forEach((element: any) => {
                    element.style.cursor = 'pointer'
                })
                const htmlString = new XMLSerializer().serializeToString(doc)
                setHtmlDoc(htmlString)
            })
            .catch((error) => console.error('Error loading page:', error))
    }

    useEffect(() => {
        getHtmlFileFromServer(state.key)
    }, [])

    const getTextNodes = (element: HTMLElement): string => {
        let textContent = ''
        element.childNodes.forEach((childNode) => {
            if (childNode.nodeType === Node.TEXT_NODE) {
                textContent += childNode.textContent?.trim() || ''
            }
        })
        return textContent
    }

    const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        const iframeDoc = e.currentTarget.contentDocument || e.currentTarget.contentWindow?.document

        if (iframeDoc) {
            const elements = iframeDoc.querySelectorAll('[data-ca]')
            elements.forEach((element) => {
                element.addEventListener('click', (e: any) => {
                    e.stopPropagation()
                    e.preventDefault()

                    e.target.style.setProperty('border', '2px solid #6A35FF', 'important')

                    e.target.style.setProperty(
                        'box-shadow',
                        '4px 4px 16px 0px #6A35FFA1',
                        'important',
                    )
                    const innerHTML = e.target.innerHTML
                    const textNodesContent = getTextNodes(element as HTMLElement)

                    const customAttributeValue = e.target.getAttribute('data-ca')
                    setEditContent({
                        id: customAttributeValue,
                        value: textNodesContent,
                    })
                    setModal(true)
                })
            })
        }
    }

    const clearHighlights = () => {
        const iframe = document.getElementById('webFrame') as HTMLIFrameElement | null
        if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
            if (iframeDoc) {
                const elementToUpdate: any = iframeDoc.querySelector(
                    `[data-ca="${editContent.id}"]`,
                )
                if (elementToUpdate) {
                    let vDomDoc = vDom
                    let vDomElement = vDom.querySelector(`[data-ca="${editContent.id}"]`)
                    const existingBorderStyle = vDomElement.style.getPropertyValue('border')
                    elementToUpdate.style.setProperty(
                        'border',
                        existingBorderStyle ? existingBorderStyle : 'none',
                    )
                    elementToUpdate.style.setProperty('box-shadow', 'none')
                    setTextAreaValue('')
                } else {
                    console.error('Element not found')
                }
            } else {
                console.error('Failed to access iframe document')
            }
        } else {
            console.error('Iframe not found')
        }
    }

    function updateFirstTextNode(element: any, newTextContent: any) {
        for (let i = 0; i < element.childNodes.length; i++) {
            const childNode = element.childNodes[i]

            if (childNode.nodeType === Node.TEXT_NODE) {
                childNode.textContent = newTextContent
                break
            }
        }
    }

    const submitAns = () => {
        if (editContent.id) {
            const iframe = document.getElementById('webFrame') as HTMLIFrameElement | null
            if (iframe) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                if (iframeDoc) {
                    const elementToUpdate: any = iframeDoc.querySelector(
                        `[data-ca="${editContent.id}"]`,
                    )
                    if (elementToUpdate) {
                        updateFirstTextNode(elementToUpdate, textAreaValue)

                        let vDomDoc = vDom
                        let vDomElement = vDom.querySelector(`[data-ca="${editContent.id}"]`)
                        const existingBorderStyle = vDomElement.style.getPropertyValue('border')
                        elementToUpdate.style.setProperty(
                            'border',
                            existingBorderStyle ? existingBorderStyle : 'none',
                        )
                        elementToUpdate.style.setProperty('box-shadow', 'none')
                        const oldTextNodesContent = getTextNodes(vDomElement as HTMLElement)
                        let obj = {
                            id: editContent.id,
                            oldContent: oldTextNodesContent,
                            newContent: textAreaValue,
                        }

                        let temp: any = [...changesArr]
                        temp.push(obj)
                        setCanDownload(false)
                        setChangeArr(temp)

                        setTextAreaValue('')
                    } else {
                        console.error('Element not found')
                    }
                } else {
                    console.error('Failed to access iframe document')
                }
            } else {
                console.error('Iframe not found')
            }
        }
    }

    const fetchFileFromLink = (page: any, callBack: any, preview: any) => {
        axios.get(page).then((response: any) => {
            let data = response.data
            const blob = new Blob([data], { type: 'text/html' })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url

            if (preview) {
                a.target = '_blank'
            } else {
                a.download = 'index.html'
            }

            document.body.appendChild(a)
            a.click()
            callBack()
            // Cleanup
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        })
    }

    const downloadFile = (preview: any) => {
        if (canDownload && state.key) {
            setModalLoading(true)

            templates
                .downloadFile(state.key)
                .then((res) => {
                    if (res.data.apiStatus) {
                        //link
                        fetchFileFromLink(
                            res.data.result,
                            () => {
                                setModalLoading(false)
                            },
                            preview,
                        )
                    } else {
                        setModalLoading(false)
                        console.log('res', res)
                        message.error(res.data.message)
                    }
                })
                .catch((err) => {
                    setModalLoading(false)
                    message.error(err?.message ? err.message : 'Something went wrong')
                })

            // axios
            //     .get(`http://192.168.0.177:3001/api/downloadPage?projectRef=${state.key}`)
            //     .then((res) => {
            //         if (!res.data.apiStatus) {
            //             console.log('res', res)

            //             //link
            //             fetchFileFromLink(
            //                 'https://content-crafter-demo.s3.ap-south-1.amazonaws.com/Content/Website931804.html',
            //                 () => {
            //                     setModalLoading(false)
            //                 },
            //                 preview,
            //             )
            //         } else {
            //             setModalLoading(false)
            //             console.log('res', res)
            //             message.error(res.data.message)
            //         }
            //     })
            //     .catch((err: any) => {
            //         message.error(err?.message ? err.message : 'Something went wrong')
            //         console.log('err', err)
            //     })
        }
    }

    const regenerateText = (text: string) => {
        let body = {
            line: text,
        }

        setAiloading(true)

        templates
            .regenerateContent(body)
            .then((res) => {
                if (res.data.apiStatus) {
                    setAiloading(false)
                    setTextAreaValue(res.data.result)
                } else {
                    setAiloading(false)
                    message.error(res.data.message)
                }
            })
            .catch((err) => {
                setAiloading(false)
                message.error(err?.message ? err.message : 'Something went wrong')
                console.log('err', err)
            })

        // axios
        //     .post('http://192.168.0.177:3001/api/regenerateContent', body)
        //     .then((res) => {
        //         setAiloading(false)
        //         console.log(res.data.result)
        //         setTextAreaValue(res.data.result)
        //     })
        //     .catch((err) => {
        //         setAiloading(false)
        //         message.error(err?.message ? err.message : 'Something went wrong')
        //         console.log('err', err)
        //     })
    }

    const saveFile = () => {
        if (changesArr.length > 0) {
            let body = {
                projectRef: state.key,
                updatedContent: changesArr,
            }

            setModalLoading(true)

            templates
                .saveEditFile(body)
                .then((res) => {
                    if (res.data.apiStatus) {
                        setModalLoading(false)
                        setCanDownload(true)
                    } else {
                        message.error(res.data.message)
                        setModalLoading(false)
                    }
                })
                .catch((err) => {
                    setModalLoading(false)
                    message.error(err?.message ? err.message : 'Something went wrong')
                })

            // axios
            //     .post('http://192.168.0.177:3001/api/savePages', body)
            //     .then((res) => {
            //         if (res.data.apiStatus) {
            //             setModalLoading(false)
            //             setCanDownload(true)
            //         } else {
            //             message.error(res.data.message)
            //             setModalLoading(false)
            //         }
            //     })
            //     .catch((err) => {
            //         setModalLoading(false)
            //         message.error(err?.message ? err.message : 'Something went wrong')
            //     })
        } else {
            console.log('file not changed')
        }
    }

    const onClick = ({ key }: any) => {
        if (key == 'withSite') {
            setIsWithSite(true)
        } else {
            setIsWithSite(false)
        }
        setDeployModal(true)
    }

    const deploySite = (callBack: any) => {
        let body = {}
        if (isWithSite) {
            body = {
                //
            }
        } else {
            //
        }
        setModalLoading(true)

        setTimeout(() => {
            callBack()
            setModalLoading(false)
        }, 1000)

        // templates.deploy(body).then((res) => {
        //     if(res.data.apiStatus){
        //         message.success(res.data.message);
        //         setNetlifyCred({accessToken: '', siteId: ''})
        //         setModalLoading(false)
        // callBack()
        //     }else{
        //         message.error(res.data.message);
        //         setNetlifyCred({accessToken: '', siteId: ''})
        //         setModalLoading(false)
        // callBack()
        //     }
        // }).catch((err:any) => {
        //     message.error(err?.message ? err.message : 'Something went wrong');
        //     setNetlifyCred({accessToken: '', siteId: ''})
        //     setModalLoading(false)
        // callBack()
        // })
    }

    const items = [
        {
            key: '1',
            label: 'Netlify',
            children: [
                {
                    key: 'withSite',
                    label: 'Deploy with site',
                },
                {
                    key: 'withoutSite',
                    label: 'Deploy without site',
                },
            ],
        },
        {
            key: '2',
            label: 'Go Daddy',
            disabled: true,
        },
        {
            key: '3',
            label: 'Digital ocean',
            disabled: true,
        },
    ]

    return (
        <div className='editor-main'>
            <nav className='nav'>
                <button
                    className='nav-goback btn'
                    onClick={() => {
                        navigate(-1)
                    }}
                >
                    <img src={arrowIcon} alt='arrow' />
                </button>
                <Dropdown
                    disabled={!canDownload}
                    rootClassName='deploy-dropdown'
                    menu={{
                        items,
                        onClick,
                    }}
                    // placement='bottomLeft'
                    // trigger={['click']}
                >
                    <button
                        style={{ cursor: canDownload ? 'pointer' : 'not-allowed' }}
                        className='textBtn btn'
                    >
                        <span>Deploy &gt;</span>
                    </button>
                </Dropdown>

                <button
                    style={{ cursor: canDownload ? 'pointer' : 'not-allowed' }}
                    onClick={canDownload ? () => downloadFile(false) : () => {}}
                    className='textBtn btn'
                >
                    <span>Download</span>
                </button>
                <button
                    style={{ cursor: canDownload ? 'pointer' : 'not-allowed' }}
                    onClick={canDownload ? () => downloadFile(true) : () => {}}
                    className='textBtn btn'
                >
                    <span>Preview</span>
                </button>

                <button
                    style={{
                        cursor: !canDownload ? 'pointer' : 'not-allowed',
                        background: canDownload ? '#bfbdbd' : '#222',
                    }}
                    onClick={!canDownload ? saveFile : () => {}}
                    className='textBtn btn'
                >
                    <span>Save</span>
                </button>
            </nav>

            <div className='content'>
                {htmlDoc ? (
                    <>
                        <iframe
                            onLoad={(e) => {
                                handleIframeLoad(e)
                            }}
                            id='webFrame'
                            srcDoc={htmlDoc}
                            style={{ height: '75vh', minHeight: '500px' }}
                            width='100%'
                        />
                    </>
                ) : (
                    <div
                        style={{
                            borderRadius: '10px',
                            border: '2px solid #e5e5e5',
                            width: '100%',
                            height: '75vh',
                            minHeight: '500px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Spin
                            size='default'
                            wrapperClassName='fetchloading'
                            className='fetchloading'
                        />
                    </div>
                )}
            </div>

            <Modal
                wrapClassName='editbox-modal'
                open={modal}
                onCancel={() => {
                    clearHighlights()
                    setModal(false)
                }}
                onOk={() => {
                    submitAns()
                    setModal(false)
                }}
                footer={[
                    <button
                        disabled={!textAreaValue}
                        className='updateBtn'
                        key='Update'
                        onClick={() => {
                            submitAns()
                            setModal(false)
                        }}
                    >
                        Update
                    </button>,
                ]}
                centered
            >
                <p className='heading'>Editor</p>
                <div className='nav'>
                    <span>Text</span>
                    <span className='active'>Image/video</span>
                    <span className='active'>Layout</span>
                </div>

                <div className='labelContainer'>
                    <label htmlFor='text'>Select text to edit from the page</label>
                    <div
                        className='regenerateContent'
                        onClick={() =>
                            regenerateText(textAreaValue ? textAreaValue : editContent.value)
                        }
                    >
                        <img
                            src={refreshIcon}
                            alt='refresh icon'
                            className={ailoading ? 'rotateIcon' : ''}
                        />
                        <span style={{ fontSize: '13px', marginLeft: '5px' }}>Regenerate</span>
                    </div>
                </div>

                <div className='selected-text-cont'>
                    <span>Selected text:</span>
                    <div>{editContent.value}</div>
                </div>
                <textarea
                    onChange={(e) => {
                        setTextAreaValue(e.target.value)
                    }}
                    value={textAreaValue}
                    className='text-area'
                    name='text'
                    placeholder='Type here'
                />
            </Modal>
            <Modal wrapClassName='loading-modal' open={modalLoading} centered footer={null}>
                <Spin size='large' style={{ color: '#fff' }} />
            </Modal>

            <Modal
                wrapClassName='deploy-modal'
                open={deployModal}
                title={'Deploy'}
                onCancel={() => {
                    setDeployModal(false)
                }}
                onOk={() => {
                    // submitAns()
                    setDeployModal(false)
                }}
                footer={[
                    <button
                        className='updateBtn secondary'
                        key='cancel'
                        style={{ padding: '7px 15px', margin: 0 }}
                        onClick={() => {
                            setDeployModal(false)
                            setNetlifyCred({ accessToken: '', siteId: '' })
                        }}
                    >
                        Cancel
                    </button>,
                    <button
                        className='updateBtn'
                        key='Update'
                        style={{
                            padding: '7px 15px',
                            margin: 0,
                            marginLeft: '15px',
                            fontSize: '13px',
                            cursor:
                                isWithSite && netlifyCred.accessToken && netlifyCred.siteId
                                    ? 'pointer'
                                    : isWithSite
                                      ? 'not-allowed'
                                      : 'pointer',
                            background:
                                isWithSite && netlifyCred.accessToken && netlifyCred.siteId
                                    ? '#7cb845'
                                    : isWithSite
                                      ? '#bfbdbd'
                                      : '#7cb845',
                        }}
                        onClick={() => {
                            if (isWithSite && netlifyCred.accessToken && netlifyCred.siteId) {
                                deploySite(() => {
                                    setDeployModal(false)
                                    setNetlifyCred({ accessToken: '', siteId: '' })
                                })
                            } else if (isWithSite) {
                                //
                            } else {
                                deploySite(() => {
                                    setDeployModal(false)
                                })
                            }
                        }}
                    >
                        Deploy
                    </button>,
                ]}
            >
                {isWithSite ? (
                    <div style={{ marginBlock: '3rem' }}>
                        <h5 className='confirmText' style={{ marginBlock: '1rem' }}>
                            Netlify Credentials Form
                        </h5>
                        <p
                            className='instructions'
                            style={{ marginBottom: '1rem', fontSize: '11px' }}
                        >
                            Enter your Access Token and Site ID from your Netlify account. Find the
                            Access Token under User Settings &gt; 'Personal Access Tokens' and the
                            Site ID in Site Settings &gt; 'General'.
                        </p>
                        <label htmlFor='accessToken' className='input-lable'>
                            Access token *
                        </label>
                        <Input
                            value={netlifyCred.accessToken}
                            placeholder='Enter'
                            name='accessToken'
                            style={{ marginTop: '8px', marginBottom: '1.5rem' }}
                            onChange={(e) =>
                                setNetlifyCred((pre) => {
                                    return { ...pre, accessToken: e.target.value }
                                })
                            }
                        />
                        <label htmlFor='siteId' className='input-lable'>
                            Site ID *
                        </label>
                        <Input
                            placeholder='Enter'
                            value={netlifyCred.siteId}
                            name='siteId'
                            style={{ marginTop: '8px' }}
                            onChange={(e) =>
                                setNetlifyCred((pre) => {
                                    return { ...pre, siteId: e.target.value }
                                })
                            }
                        />
                        <div>
                            <img src='' alt='' />
                            <span></span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className='confirmText'>Proceeding with deployment. Please confirm.</p>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Edit
