import { Button, Input, Modal, Spin, Typography, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useState } from 'react'
import './Pages.scss'
import TextArea from 'antd/es/input/TextArea'
import Card from '../../components/card/Card'
import templates from '../../api/services/templates'
import website1 from '../../assets/images/website (1).svg'
import website2 from '../../assets/images/webiste2.png'
import website3 from '../../assets/images/website3.png'
import website4 from '../../assets/images/website4.png'
import website5 from '../../assets/images/website5.png'
import website6 from '../../assets/images/website6.png'

function Pages({ isOpenCreate, setShowModalCreate, isOpenUpload, setTrigger }: any) {
    let arr = [website1, website2, website3, website4, website5, website6]

    const [pagesData, setPagesData] = useState([])
    const [cardLoading, setcardLoading] = useState(true)
    const [formValue, setformValue] = useState({
        templateRef: '',
        type: '',
        Title: '',
        mainContent: '',
        CompetitorContent: '',
    })
    const [errorMessage, setErrorMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [messageApi, contextHolder] = message.useMessage()
    const [cardEnable, setCardEnable] = useState(true)
    const { Text } = Typography

    const handleNextAndSubmit = () => {
        if (currentStep === 1) {
            setCurrentStep(2)
        }

        if (currentStep === 2) {
            if (isEmptyFormValue()) {
                setErrorMessage(true)
                messageApi.open({
                    type: 'warning',
                    content: 'Please fill the required fields',
                })
                return
            } else {
                try {
                    setLoading(true)
                    templates
                        .writeContent(formValue)
                        .then((response) => {
                            if (response.data.statusCode === 200) {
                                message.success(response.data.message)
                                setCurrentStep(1)
                                setShowModalCreate(false)
                                setformValue((prev: any) => ({
                                    ...prev,
                                    templateRef: '',
                                }))
                                setCardEnable(true)
                                setLoading(false)
                                setTrigger((pre: any) => {
                                    return !pre
                                })
                            } else {
                                setCurrentStep(1)
                                setShowModalCreate(false)
                                setformValue((prev: any) => ({
                                    ...prev,
                                    templateRef: '',
                                }))
                                setCardEnable(true)
                                setLoading(false)
                                message.error(response.data.message)
                            }
                        })
                        .catch((err: any) => {
                            message.error(err)
                        })
                } catch (error: any) {
                    message.error(error)
                }
            }
        }
    }

    const handlePrevious = () => {
        setCurrentStep(1)
    }

    const isEmptyFormValue = () => {
        const { type, Title, mainContent } = formValue
        if (type === '' || Title === '' || mainContent === '') {
            return true
        } else {
            return false
        }
    }

    const handleCancel = () => {
        setCurrentStep(1)
        setErrorMessage(false)
        setShowModalCreate(false)
        setformValue((prev: any) => ({
            ...prev,
            templateRef: '',
        }))
        setCardEnable(true)
    }

    useEffect(() => {
        if (isOpenCreate) {
            getAllpages()
        }
    }, [isOpenCreate])

    const getAllpages = () => {
        try {
            templates.Listtempltes().then((response: any) => {
                if (response.data.statusCode === 200) {
                    setcardLoading(false)
                    setPagesData(response.data.result)
                }
            })
        } catch (error: any) {
            message.error(error)
        }
    }

    const onSelected = (item: any) => {
        setformValue((prev: any) => ({
            ...prev,
            templateRef: item.template_ref,
        }))
    }

    const handleCallBack = useCallback(
        (value: any) => {
            setCardEnable(value)
        },
        [setCardEnable],
    )

    const mappedArr: any = arr.map((ite: any) => {
        return ite
    })

    return (
        <div>
            {contextHolder}
            <Modal
                width={'70%'}
                centered
                cancelButtonProps={{
                    style: { display: 'none' },
                }}
                open={isOpenCreate}
                footer={[
                    <Button
                        key='submit'
                        style={{
                            background: '#7CB845',
                            borderRadius: '20px',
                            fontWeight: '600',
                            marginTop: '2rem',
                            color: '#fff',
                            opacity: cardEnable ? '0.6' : '',
                            width: '13rem',
                        }}
                        disabled={cardEnable}
                        type='primary'
                        loading={loading}
                        onClick={handleNextAndSubmit}
                    >
                        {currentStep === 1 ? 'Next' : 'Submit'}
                    </Button>,
                ]}
                onCancel={handleCancel}
            >
                {currentStep === 2 && (
                    <ArrowLeftOutlined
                        style={{
                            position: 'absolute',
                            left: '24px',
                            top: '24px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                        onClick={handlePrevious}
                    />
                )}
                <div className='process'>
                    <p className='pageHeader'>
                        {currentStep === 1 ? ' Create page (1/2)' : 'Create page (2/2)'}
                    </p>
                </div>
                <div className='pageModelContainer'>
                    <p className='subPageHeader'>
                        {currentStep === 1 ? 'Choose your Template' : 'Enter your Details'}
                    </p>

                    <div
                        className='formContainer'
                        style={{ height: currentStep == 1 ? '90%' : 'auto' }}
                    >
                        {currentStep === 1 ? (
                            cardLoading ? (
                                <div className='spin-container'>
                                    <Spin size='small' tip='Processing...'></Spin>
                                </div>
                            ) : (
                                <div className='templateFormContainer'>
                                    <div className='cont'>
                                        {pagesData.map((item: any, key: any) => {
                                            const index = key % mappedArr.length
                                            const url = mappedArr[index]
                                            return (
                                                <Card
                                                    key={key}
                                                    isSelectable
                                                    value={formValue.templateRef}
                                                    onClick={() => onSelected(item)}
                                                    handleCallBack={handleCallBack}
                                                    title={item.Title}
                                                    data={item}
                                                    url={url}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className='pageFormContainer'>
                                <div className='firstAndSecondField'>
                                    <div className='labelAndInput'>
                                        <Text className='input-lable'>Template Ref</Text>
                                        <Input
                                            style={{ marginTop: '8px' }}
                                            value={formValue.templateRef}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className='labelAndInput'>
                                        <Text className='input-lable'>Type</Text>
                                        <Input
                                            style={{
                                                marginTop: '8px',
                                                borderColor:
                                                    errorMessage && formValue.type === ''
                                                        ? 'red'
                                                        : '',
                                            }}
                                            placeholder='Enter your Type'
                                            allowClear
                                            onChange={(e) =>
                                                setformValue((prevState) => ({
                                                    ...prevState,
                                                    type: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className='labelAndInput'>
                                    <Text className='input-lable'>Title</Text>
                                    <Input
                                        style={{
                                            marginTop: '8px',
                                            borderColor:
                                                errorMessage && formValue.Title === '' ? 'red' : '',
                                        }}
                                        placeholder='Enter your Title'
                                        allowClear
                                        onChange={(e) =>
                                            setformValue((prevState) => ({
                                                ...prevState,
                                                Title: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className='labelAndInput'>
                                    <Text className='input-lable'>Main Content</Text>
                                    <TextArea
                                        rows={4}
                                        placeholder='Enter your main content'
                                        style={{
                                            resize: 'none',
                                            borderColor:
                                                errorMessage && formValue.mainContent === ''
                                                    ? 'red'
                                                    : '',
                                        }}
                                        onChange={(e) =>
                                            setformValue((prevState) => ({
                                                ...prevState,
                                                mainContent: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className='labelAndInput'>
                                    <Text className='input-lable'>Competitor Content</Text>
                                    <TextArea
                                        rows={4}
                                        placeholder='Enter your competitor content'
                                        style={{ resize: 'none' }}
                                        onChange={(e) =>
                                            setformValue((prevState) => ({
                                                ...prevState,
                                                CompetitorContent: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Pages
