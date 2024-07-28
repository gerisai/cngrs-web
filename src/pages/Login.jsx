import { useState } from 'react';
import { Flex, Typography, Input, Button, Form, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import validationRules from '../util/validation';
const { Title } = Typography;

import useAuth from '../hooks/useAuth';

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [api, contextHolder] = notification.useNotification();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await loginUser({...values});
      setLoading(false);
      navigate('/people');
    } catch(err) {
      setLoading(false);
      api.error({ message: 'Error', description: err.message, placement: 'top', showProgress: true });
    }
  }

  const handleValidation = () => {
    api.error({ message: 'Error', description: 'Llena todos en los campos', placement: 'top', showProgress: true });
  }

  return (
    <>
    {contextHolder}
    <Flex className='main-flex' align='center' justify='center'>
        <Flex className='box' vertical align='center' justify='center'>
          <Title>Iniciar Sesión</Title>
          <Form name="login" onFinish={handleLogin} onFinishFailed={handleValidation} size="large">
            <Form.Item
              name="username"
              rules={validationRules.username}
            >
              <Input placeholder='Usuario'/>
            </Form.Item>

            <Form.Item
              name="password"
              rules={validationRules.password}
            >
              <Input.Password placeholder='Contraseña' />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </Flex>
    </Flex>
    </>
  )
}

export default Login;
