import { Flex, Spin } from 'antd';

function Loading () {
  return (
    <Flex className='main-flex' align='center' justify='center'>
      <Spin tip='Cargando' spinning={true} fullscreen />
    </Flex>
  )
}

export default Loading;
