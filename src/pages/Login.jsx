import { useState } from 'react';
import { Flex, Typography, Input, Button, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import validationRules from '../util/validation';
const { Title } = Typography;

import useAuth from '../hooks/useAuth';

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await loginUser({...values});
      setLoading(false);
      navigate('/people');
    } catch(err) {
      setLoading(false);
      messageApi.open({ type: 'error', content: err.message });
    }
  }

  const handleValidation = () => {
    messageApi.open({ type: 'error', content: 'Error en los campos' });
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
