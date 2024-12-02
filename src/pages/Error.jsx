import { Flex, Typography } from 'antd';

const { Title, Text } = Typography;

function Error ({ message }) {
  return (
    <Flex vertical className='main-flex text-center' align='center' justify='center'>
      <Title style={{ color: 'white' }}>500 Ocurrió un error en el servidor</Title>
      <img style={{marginBottom: 15}} width='30%' src="/elmo_fire.gif" alt="ElmoOnFire" />
      <Text mark>Mensaje confuso pal programador</Text>
      <Text keyboard>{ message }</Text>
    </Flex>
  )
}

export default Error;
