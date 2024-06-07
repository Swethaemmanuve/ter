import React, { useEffect, useState } from 'react'
import Card from '../../components/card/Card'
import './pages.scss'
import { Empty, Spin, message } from 'antd'
import website1 from '../../assets/images/website (1).svg'
import website2 from '../../assets/images/webiste2.png'
import website3 from '../../assets/images/website3.png'
import website4 from '../../assets/images/website4.png'
import website5 from '../../assets/images/website5.png'
import website6 from '../../assets/images/website6.png'
import Navbar from '../../components/nav/Navbar'
import templates from '../../api/services/templates'
import { useNavigate } from 'react-router-dom'

function Pages() {
    let arr = [website1, website2, website3, website4, website5, website6]

    const navigate = useNavigate()
    const [trigger, setTrigger] = useState(false)
    const [pagesData, setPagesData] = useState([])
    const [spin, setSpin] = useState(true)

    useEffect(() => {
        getData()
    }, [trigger])

    const getData = () => {
        try {
            templates.listProjects().then((response: any) => {
                if (response.data.statusCode === 200) {
                    setSpin(false)
                    setPagesData(response.data.result)
                }
            })
        } catch (error: any) {
            message.error(error)
        }
    }

    const mappedArr: any = arr.map((ite: any) => {
        return ite
    })

    return (
        <div className='main'>
            {spin ? (
                <div className='spin-container'>
                    <Spin tip='Processing...'></Spin>
                </div>
            ) : (
                <React.Fragment>
                    <div className='header'>
                        <Navbar lable={'Create'} setTrigger={setTrigger} />
                    </div>
                    <div className='templates'>
                        <div className='sub-heading'>Pages</div>
                        {pagesData.length <= 0 ? (
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
                                {pagesData.map((item: any, key: any) => {
                                    const index = key % mappedArr.length
                                    const url = mappedArr[index]
                                    return (
                                        <Card
                                            pages
                                            key={key}
                                            data={item}
                                            url={url}
                                            onNavigating={(id: any) =>
                                                navigate('/editor', { state: { key: id } })
                                            }
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}

export default Pages
