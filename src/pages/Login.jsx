import React from 'react';
import { Flex, Typography, Form, Input, Button } from 'antd';

const { Title } = Typography;

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function Login() {
  return (
    <Flex  className='main-flex' align='center' justify='center'>
        <Flex className='box' vertical align='center' justify='center'>
          <Title>Iniciar Sesión</Title>
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Teclea tu usuario',
                },
              ]}
            >
              <Input placeholder='Usuario'/>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Teclea tu contraseña',
                },
              ]}
            >
              <Input.Password placeholder='Contraseña' />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16,}}>
              <Button  type="primary" htmlType="submit">
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </Flex>
    </Flex>
  )
}

export default Login;
