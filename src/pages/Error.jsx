import { Flex, Typography } from 'antd';

const { Title, Text } = Typography;

function Error ({ message }) {
  return (
    <Flex vertical className='main-flex' align='center' justify='center'>
      <Title>500 Ocurrió un error en el servidor</Title>
      <img width='30%' src="/elmo_fire.gif" alt="ElmoOnFire" />
      <Text type="danger">Mensaje confuso pal programador</Text>
      <Text keyboard>{ message }</Text>
    </Flex>
  )
}

export default Error;
