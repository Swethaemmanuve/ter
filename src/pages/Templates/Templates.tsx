import React, { useEffect, useState } from 'react'
import Card from '../../components/card/Card'
import { Spin, message } from 'antd'
import './templates.scss'
import Navbar from '../../components/nav/Navbar'
import templates from '../../api/services/templates'
import { log } from 'console'
import website1 from '../../assets/images/website (1).svg'
import website2 from '../../assets/images/webiste2.png'
import website3 from '../../assets/images/website3.png'
import website4 from '../../assets/images/website4.png'
import website5 from '../../assets/images/website5.png'
import website6 from '../../assets/images/website6.png'
import { Empty } from 'antd'
function Templates() {
    let arr = [website1, website2, website3, website4, website5, website6]
    const [templatesData, setTemplatesData] = useState([])
    const [trigger, setTrigger] = useState(false)
    const [spin, setSpin] = useState(true)

    useEffect(() => {
        getData()
    }, [trigger])

    const getData = () => {
        try {
            templates.Listtempltes().then((response: any) => {
                if (response.data.statusCode === 200) {
                    setSpin(false)
                    setTemplatesData(response.data.result)
                } else {
                    message.error(response.data.result)
                }
            })
        } catch (error: any) {
            message.error(error)
        }
    }

    const mappedArr: any = arr.map((ite: any) => {
        return ite
    })

    const checking = []
    return (
        <div className='main'>
            {spin ? (
                <div className='spin-container'>
                    <Spin size='small' tip='Processing...' />
                </div>
            ) : (
                <React.Fragment>
                    <div className='header'>
                        <Navbar lable={'Upload'} setTrigger={setTrigger} />
                    </div>
                    <div className='templates'>
                        <div className='sub-heading'>Templates</div>

                        {templatesData.length <= 0 ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '80vh',
                                }}
                            >
                                <Empty />
                            </div>
                        ) : (
                            <div className='cont'>
                                {templatesData.map((item: any, key: any) => {
                                    const index = key % mappedArr.length
                                    const url = mappedArr[index]
                                    return <Card key={key} url={url} data={item} />
                                })}
                            </div>
                        )}
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}

export default Templates
