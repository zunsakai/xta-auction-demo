import React from 'react'
import { Button, Form, FormProps, Input, Layout, message } from 'antd'
import { useLogin } from '../../query'
import { useNavigate } from 'react-router-dom'

const { Content } = Layout

type FieldType = {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage({
    top: 80,
  })
  const login = useLogin()
  const navigate = useNavigate()

  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    login.mutate(values, {
      onSuccess: async data => {
        if (data.token) {
          // Can be saved to the cookie to be more secure
          localStorage.setItem('accessToken', data.token)
          messageApi.open({
            type: 'success',
            content: 'Login successful',
          })
          // sleep for 1 second
          await new Promise(resolve => setTimeout(resolve, 1000))
          navigate('/auction')
        }
      },
      onError: (error: any) => {
        Array.isArray(error.message)
          ? error.message?.forEach((msg: string) =>
              messageApi.open({
                type: 'error',
                content: msg,
              })
            )
          : messageApi.open({
              type: 'error',
              content: error.message,
            })
      },
    })
  }

  return (
    <Content style={{ textAlign: 'center', margin: '0 auto', marginTop: 100 }}>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ minWidth: 500 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={login.isPending}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Content>
  )
}

export default Login
