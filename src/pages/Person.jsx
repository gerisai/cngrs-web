import React from 'react';
import { Flex, Typography, QRCode, Descriptions } from 'antd';
import HomeLayout from './HomeLayout.jsx';

const { Title, Text } = Typography;

const person = [
  {
    key: '1',
    label: 'Zona',
    children: 'CDMX'
  },
  {
    key: '2',
    label: 'Localidad',
    children: 'Churubusco'
  },
  {
    key: '3',
    label: 'Registrado',
    children: 'Si'
  },
  {
    key: '4',
    label: 'Cuarto',
    children: 'AM2'
  },
  {
    key: '5',
    label: 'QR',
    children: (<QRCode value={'Heber Aguero'} errorLevel='H' icon='/CNGRS.svg'/>)
  }
]

function Person() {
  return (
    <HomeLayout>
      <Flex vertical align='start'>
        <Descriptions title="Juan Pérez" bordered items={person} />
      </Flex>
    </HomeLayout>
  )
}

export default Person;
