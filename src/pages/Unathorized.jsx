import { Flex, Typography } from 'antd';

const { Title, Text, Link } = Typography;

function Unathorized () {
  return (
    <Flex vertical className='main-flex' align='center' justify='center'>
      <Title>403 No autorizado</Title>
      <img width='30%' src='/ese.jpg' alt='TeQuieresMorirEse' />
      <Text>Es posible que tu sesión haya caducado.</Text>
      <Link href={ `${import.meta.env.VITE_WEB_URL}/login` } target=''>Iniciar Sesión</Link>
    </Flex>
  )
}

export default Unathorized;
