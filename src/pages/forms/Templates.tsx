import React, { useState } from 'react'
import { Button, Input, Modal, Upload, UploadProps, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import './Template.scss'
import templates from '../../api/services/templates'
import xCricle from '../../assets/icons/ic_xCricle.png'

function Templates({ isOpenUpload, setShowModalUpload, setTrigger }: any) {
    const [fileList, setFileList]: any = useState([])
    const [urlValue, setUrlValue] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [messageApi, contextHolder] = message.useMessage()
    const [loading, setLoading] = useState(false)

    const handleOk = async () => {
        const obj = {
            url: urlValue,
        }

        if (urlValue.length > 0 || fileList.length > 0) {
            try {
                if (urlValue) {
                    setLoading(true)
                    const response = await templates.scrapeTemplate(obj)
                    if (response.data.statusCode === 200) {
                        setUrlValue('')
                        message.success(response.data.message)
                    } else {
                        message.error(response.data.message)
                        setFileList([])
                    }
                } else {
                    setLoading(true)
                    const bodyFormData = new FormData()
                    bodyFormData.append('file', fileList[0]?.originFileObj)

                    const response = await templates.createTemplate(bodyFormData)
                    if (response.data.statusCode === 200) {
                        message.success(response.data.message)
                    } else {
                        message.error(response.data.message)
                        setFileList([])
                    }
                }
            } catch (error: any) {
                message.error(error.message || 'An error occurred')
            } finally {
                setUrlValue('')
                setLoading(false)
                setFileList([])
                setShowModalUpload(false)
                setTrigger((pre: any) => {
                    return !pre
                })
            }
        } else {
            messageApi.open({
                type: 'warning',
                content: 'Please provide a URL or upload a file',
            })
        }
    }

    const handleCancel = () => {
        setUrlValue('')
        setErrorMessage('')
        setFileList([])
        setShowModalUpload(false)
    }

    const handleUrlChange = (e: any) => {
        const urlRegex = /^(http|https):\/\/[^ "]+$/

        if (e.target.value) {
            const isValidURL = urlRegex.test(e.target.value)
            if (!isValidURL) {
                setErrorMessage('Please enter a valid URL')
                return
            } else {
                setErrorMessage('')
            }
            setUrlValue(e.target.value)
        } else {
            setErrorMessage('')
        }
    }

    const handleUploadChange = ({ fileList }: any) => {
        setFileList(fileList)
    }

    const props: UploadProps = {
        beforeUpload: (file) => {
            const htmlFile = file.type === 'text/html'
            if (!htmlFile) {
                message.error(`${file.name} is not a html file`)
            }
            return false
        },
        onChange: handleUploadChange,
    }

    const handleClear = () => {
        setUrlValue('')
        setErrorMessage('')
    }

    return (
        <>
            {contextHolder}
            <Modal
                width={'35%'}
                onCancel={handleCancel}
                style={{ height: '80vh' }}
                cancelButtonProps={{ style: { display: 'none' } }}
                open={isOpenUpload}
                footer={[
                    <Button
                        key='submit'
                        type='primary'
                        style={{
                            background: '#7CB845',
                            borderRadius: '20px',
                            fontWeight: '600',
                            width: '13rem',
                        }}
                        loading={loading}
                        onClick={handleOk}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <p className='templateHeader'>Create Your Templates</p>
                <div className='templateConatiner'>
                    <div className='urlInput'>
                        <Input
                            disabled={fileList.length > 0 ? true : false}
                            id='urlInput'
                            style={{ width: '90%' }}
                            placeholder='Enter your URL'
                            allowClear={{
                                clearIcon: (
                                    <span style={{ display: 'flex' }} onClick={() => handleClear()}>
                                        <img
                                            className='button-icon'
                                            style={{ width: '14px', height: '14px' }}
                                            src={xCricle}
                                            alt='Icon'
                                        />
                                    </span>
                                ),
                            }}
                            value={urlValue}
                            onChange={handleUrlChange}
                        />
                        {errorMessage && (
                            <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>
                        )}
                    </div>
                    <div className='optionContainer'>
                        <div className='line'></div>
                        <p>OR</p>

                        <div className='line'></div>
                    </div>

                    <Upload fileList={fileList} className='uploadBtn' {...props}>
                        <Button
                            disabled={urlValue.length > 0 ? true : false}
                            icon={<UploadOutlined />}
                        >
                            Click to Upload
                        </Button>
                    </Upload>
                </div>
            </Modal>
        </>
    )
}

export default Templates
