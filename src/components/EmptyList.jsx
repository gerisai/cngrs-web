import { Typography, Flex } from 'antd';
const { Title } = Typography; 

export default function EmptyList() {
  return (
    <Flex vertical className='text-center' align='center' justify='center'>
      <Title>Sin resultados</Title>
      <img width='30%' src="/sad-pug.png" alt="SadPug" />
    </Flex>
  )
}
