import { Flex, Typography } from 'antd';

const { Title } = Typography;

function NotFound () {
  return (
    <Flex vertical className='main-flex' align='center' justify='center'>
      <Title style={{ color: 'white' }} className='text-center'>404 No encontrado</Title>
      <img width='20%' src="/Travolta.png" alt="TravoltaWaiting" />
    </Flex>
  )
}

export default NotFound;
