import { useContext } from 'react';
import { Flex, Typography, Input, Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
// Project imports
import validationRules from '../util/validation';
import { NotificationContext } from '../hooks/NotificationContext';
import useAuth from '../hooks/useAuth';

const { Title } = Typography;

function Login() {
  const api = useContext(NotificationContext);
  
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const { mutateAsync: handleLogin, isPending } = useMutation({
    mutationFn: async (values) => {
      try {
        await loginUser(values);
        navigate('/people');
      } catch(err) {
        api.error({ message: 'Error', description: err.message, placement: 'top', showProgress: true });
      }
    }
  });

  const handleValidation = () => {
    api.error({ message: 'Error', description: 'Revisa los campos', placement: 'top', showProgress: true });
  }

  return (
    <>
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
              <Button type="primary" htmlType="submit" loading={isPending}>
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
