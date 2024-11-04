import { Flex, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

function Unathorized () {
  const navigate = useNavigate();

  return (
    <Flex vertical className='main-flex' align='center' justify='center' gap='middle'>
      <Title className='text-center'>403 No autorizado</Title>
      <img width='30%' src='/ese.jpg' alt='TeQuieresMorirEse' />
      <Text className='text-center'>Es posible que tu sesión haya caducado.</Text>
      <Button onClick={() => navigate('/login')}  type="primary">
          Iniciar Sesión
      </Button>
    </Flex>
  )
}

export default Unathorized;
