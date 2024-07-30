import { Flex, Typography } from 'antd';

const { Title } = Typography;

function Error () {
  return (
    <Flex vertical className='main-flex' align='center' justify='center'>
      <Title>500 Ocurrió un error en el servidor</Title>
      <img width='30%' src="/elmo_fire.gif" alt="ElmoOnFire" />
    </Flex>
  )
}

export default Error;
