import React from 'react';
import { Flex, Typography, QRCode, Space } from 'antd';

const { Title, Text } = Typography;

function Person() {
  return (
    <Flex  className='main-flex' align='center' justify='center'>
        <Flex className='box' vertical align='center' justify='center'>
          <Space direction='vertical' align='center'>
            <Title>Juan Pérez</Title>
            <Text>Zona: CDMX</Text>
            <Text>Localidad: Churubusco</Text>
            <Text>Registrado: Si</Text>
            <Text>Cuarto: AM2</Text>
            <QRCode value={'example'} icon='/CNGRS.svg'/>
          </Space>
        </Flex>
    </Flex>
  )
}

export default Person;
