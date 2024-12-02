import { Flex, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

function Unathorized () {
  const navigate = useNavigate();

  return (
    <Flex vertical className='main-flex text-center' align='center' justify='center' gap='middle'>
      <Title>403 No autorizado</Title>
      <img width='30%' src='/ese.jpg' alt='TeQuieresMorirEse' />
      <Text>Es posible que tu sesión haya caducado.</Text>
      <Button onClick={() => navigate('/login')}  type="primary">
          Iniciar Sesión
      </Button>
    </Flex>
  )
}

export default Unathorized;
