import React, { useCallback, useContext, useState } from 'react'
import '../../assets/Stylesheet/Main.scss'
import Button from '../../components/btn/Button'
import ButtonImg from '../../components/btnimg/ButtonImg'
import Input from '../../components/Input/Input'
import { Spin, message } from 'antd'
import authServices from '../../api/services/authServices'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/UserAuthContext'
import { LoadingOutlined } from '@ant-design/icons'

function Login() {
    const authContext = useContext(AuthContext)

    const navigate = useNavigate()

    const [heading, setHeading] = useState(true)
    const [isLoadingLogin, setIsLoadingLogin] = useState(false)
    const [isLoadingSign, setIsLoadingSign] = useState(false)
    const [signupForm, setSignUpForm]: any = useState({
        name: '',
        signUpMobNum: '',
        signUpPassw: '',
    })

    const [signUpErrors, setSignUpErrors]: any = useState({
        name: '',
        signUpMobNum: '',
        signUpPassw: '',
    })

    const [loginForm, setLoginForm]: any = useState({
        loginMobNum: '',
        loginPassw: '',
    })

    const [loginErrors, setLoginErrors]: any = useState({
        loginMobNum: '',
        loginPassw: '',
    })

    const validateInput = useCallback((key: string, value: any, isSubmit?: any) => {
        let errorMsg = ''
        if (!value) {
            errorMsg = '*This field is required*'
        } else if (isSubmit && key === 'signUpMobNum' && value && value.length < 10) {
            errorMsg = '*Mobile number must be 10 digits*'
        } else if (isSubmit && key === 'loginMobNum' && value && value.length < 10) {
            errorMsg = '*Mobile number must be 10 digits*'
        }
        return errorMsg
    }, [])

    const signUpInputChange = useCallback(
        (key: string, value: any) => {
            const errorMsg = validateInput(key, value)
            if (key === 'signUpMobNum' && (value.length > 10 || !/^\d*$/.test(value))) {
                return
            }
            setSignUpErrors((prevErrors: any) => ({
                ...prevErrors,
                [key]: errorMsg,
            }))

            setSignUpForm((prevForm: any) => ({
                ...prevForm,
                [key]: value,
            }))
        },
        [validateInput],
    )

    const handleSignup = async (e: any) => {
        e.preventDefault()
        const formErrors = Object.keys(signupForm).reduce((acc: any, key: string) => {
            const errorMsg = validateInput(key, signupForm[key], true)
            if (errorMsg) {
                acc[key] = errorMsg
            }
            return acc
        }, {})
        setSignUpErrors(formErrors)
        if (Object.keys(formErrors).length > 0) {
            return
        }
        setIsLoadingSign(true)
        const obj = {
            name: signupForm.name,
            phone: signupForm.signUpMobNum,
            password: signupForm.signUpPassw,
        }
        try {
            const response = await authServices.signUP(obj)
            console.log(response);
            

            if (response.data.statusCode === 200) {
                setSignUpForm({
                    name: '',
                    signUpMobNum: '',
                    signUpPassw: '',
                })
                setHeading(!heading)
                message.success(response.data.message)
            } else {
                message.error(response.data.message)
            }
        } catch (error: any) {
            message.error(error.data?.message || error.message)
        } finally {
            setIsLoadingSign(false)
        }
    }

    const loginInputChange = useCallback(
        (key: string, value: any) => {
            const errorMsg = validateInput(key, value)
            if (key === 'loginMobNum' && (value.length > 10 || !/^\d*$/.test(value))) {
                return
            }
            setLoginErrors((prevErrors: any) => ({
                ...prevErrors,
                [key]: errorMsg,
            }))

            setLoginForm((prevForm: any) => ({
                ...prevForm,
                [key]: value,
            }))
        },
        [validateInput],
    )

    const toggle = (key: string) => {
        if (key === 'signUp') {
            setHeading(!heading)
            setSignUpErrors({
                name: '',
                signUpMobNum: '',
                signUpPassw: '',
            })
            setSignUpForm({
                name: '',
                signUpMobNum: '',
                signUpPassw: '',
            })
        }

        setHeading(!heading)
        setLoginErrors({
            loginMobNum: '',
            loginPassw: '',
        })
        setLoginForm({
            loginMobNum: '',
            loginPassw: '',
        })
    }

    const handleLogin = async (e: any) => {
        e.preventDefault()
        const formErrors = Object.keys(loginForm).reduce((acc: any, key: string) => {
            const errorMsg = validateInput(key, loginForm[key], true)
            if (errorMsg) {
                acc[key] = errorMsg
            }
            return acc
        }, {})
        setLoginErrors(formErrors)

        if (Object.keys(formErrors).length > 0) {
            return
        }
        setIsLoadingLogin(true)
        let obj = {
            phone: loginForm.loginMobNum,
            password: loginForm.loginPassw,
        }
        try {
            const response = await authServices.signIn(obj)
            if (response.data.statusCode == 200) {
                setLoginForm({
                    loginMobNum: '',
                    loginPassw: '',
                })
                localStorage.setItem('idToken', response.data.token)
                localStorage.setItem('userName', response.data.result.name)
                message.success(response.data.message)
                authContext?.getToken()
                navigate('/')
            } else {
                message.error(response.data.message)
            }
        } catch (error: any) {
            message.error(error.data?.message || error.message)
        } finally {
            setIsLoadingLogin(false)
        }
    }

    return (
        <div className='container'>
            <div className='image-section'></div>
            {true ? (
                <div className='form-section'>
                    <div className='input-container'>
                        <div className='flex'>
                            <div
                                className='justify'
                                style={{
                                    width: '100%',
                                    minWidth: '100%',
                                    transition: 'all 0.5s',
                                    transform: `translateX(${heading ? '0%' : 'calc(-100% - 2rem)'})`,
                                }}
                            >
                                <h1 className='heading'> Sign up</h1>
                                <p className='sub-heading'>
                                    Lorem ipsum dolor sit amet consectetur. Congue in congue
                                    volutpat
                                </p>

                                <Input
                                    label={'Name'}
                                    error={signUpErrors.name}
                                    inputValue={signupForm.name}
                                    onInputChange={(value: any) => signUpInputChange('name', value)}
                                />

                                <Input
                                    label={'Mobile number'}
                                    inputType={'number'}
                                    maxLength={10}
                                    error={signUpErrors.signUpMobNum}
                                    inputValue={signupForm.signUpMobNum}
                                    onInputChange={(value: any) =>
                                        signUpInputChange('signUpMobNum', value)
                                    }
                                />

                                <Input
                                    label={'Password'}
                                    inputType={'password'}
                                    error={signUpErrors.signUpPassw}
                                    inputValue={signupForm.signUpPassw}
                                    onInputChange={(value: any) =>
                                        signUpInputChange('signUpPassw', value)
                                    }
                                />

                                <p className='consent-text'>
                                    By registering for an account, you are consenting to our{' '}
                                    <a href='#'>Terms of Service</a> and confirming that you have
                                    reviewed and accepted the{' '}
                                    <a href='#'>Global Privacy Statement</a>.
                                </p>

                                <Button
                                    onClick={handleSignup}
                                    linearBackground={' #7CB845 ,#0A5144  '}
                                >
                                    <Spin
                                        size='small'
                                        spinning={isLoadingSign}
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 24,
                                                    padding: '2px',
                                                    color: '#fff',
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                    Sign up
                                </Button>
                                <p className='login-text'>
                                    Already have an account?{' '}
                                    <a href='#' onClick={() => toggle('signUp')}>
                                        Login
                                    </a>
                                </p>
                            </div>
                            :
                            <div
                                className='justify'
                                style={{
                                    width: '100%',
                                    minWidth: '100%',
                                    transition: 'all 0.5s',
                                    transform: `translateX(${heading ? '0%' : 'calc(-100% - 4.2rem)'})`,
                                }}
                            >
                                <h1 className='heading'> Login</h1>
                                <p className='sub-heading'>
                                    Lorem ipsum dolor sit amet consectetur. Congue in congue
                                    volutpat
                                </p>

                                <Input
                                    label={'Mobile number'}
                                    inputType={'number'}
                                    error={loginErrors.loginMobNum}
                                    inputValue={loginForm.loginMobNum}
                                    onInputChange={(value: any) =>
                                        loginInputChange('loginMobNum', value)
                                    }
                                />

                                <Input
                                    label={'Password'}
                                    inputType={'password'}
                                    error={loginErrors.loginPassw}
                                    inputValue={loginForm.loginPassw}
                                    onInputChange={(value: any) =>
                                        loginInputChange('loginPassw', value)
                                    }
                                />
                                <p className='consent-text'>
                                    By registering for an account, you are consenting to our{' '}
                                    <a href='#'>Terms of Service</a> and confirming that you have
                                    reviewed and accepted the{' '}
                                    <a href='#'>Global Privacy Statement</a>.
                                </p>

                                <Button
                                    onClick={handleLogin}
                                    linearBackground={' #7CB845 ,#0A5144 '}
                                >
                                    <Spin
                                        size='small'
                                        spinning={isLoadingLogin}
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 24,
                                                    padding: '2px',
                                                    color: '#fff',
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                    Login
                                </Button>
                                <p className='login-text'>
                                    Don't have an account?{' '}
                                    <a href='#' onClick={() => toggle('logIn')}>
                                        Signup
                                    </a>
                                </p>
                            </div>
                        </div>

                        <div className='social-login'>
                            <ButtonImg google text={'Continue with Google'} />
                            <ButtonImg text={'Continue with Google'} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className='form-section'>
                    <div className='input-container'>
                        <div className='social-login'>
                            <ButtonImg google text={'Continue with Google'} />
                            <ButtonImg text={'Continue with Google'} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
