import { Flex, Typography, Input, Button, Form, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
// Project imports
import validationRules from '../util/validation';
import { useUser } from '../lib/context/user';
import { useNotification } from '../lib/context/notification';
import Loading from './Loading';

const { Title } = Typography;

function Login() {
  const { user, authLoading } = useUser();

  if (authLoading) return <Loading/> 
  
  useEffect(() =>{
    if (user) return navigate('/');
  },[])

  const api = useNotification();

  const navigate = useNavigate();
  const { login } = useUser();

  const { mutateAsync: handleLogin, isPending } = useMutation({
    mutationFn: async (values) => {
      try {
        await login(values);
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
    <Flex className='main-flex-login' align='center' justify='center'>
        <Flex vertical align='center' justify='center'>
          <Image width={80} height={80} preview={false} src="/logo-white.svg"/>
          <Title style={{ color: 'white', textAlign: 'center' }}>Congreso 2024</Title>
          <Title style={{ color: 'white' }}>Iniciar Sesión</Title>
            <Form
              name="login" 
              onFinish={handleLogin} 
              onFinishFailed={handleValidation} 
              size="large" 
              layout='vertical'
              variant='outlined'
            >
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
                <Button block ghost variant="outlined" htmlType="submit" loading={isPending}>
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
