import React from 'react';
import { Table, Typography } from 'antd';

const { Text } = Typography;

const columns = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Zona',
    dataIndex: 'zone',
    key: 'zone',
  },
  {
    title: 'Localidad',
    dataIndex: 'branch',
    key: 'branch',
  },
  {
    title: 'Registrado',
    dataIndex: 'registered',
    key: 'registered',
    render:  (text) => <Text>{text ? 'Si' : 'No'}</Text>,
  }
]

const data = [
  {
    name: 'Juan Pérez',
    zone: 'CDMX',
    branch: 'Churubusco',
    registered: true
  },
  {
    name: 'Carlos Hernández',
    zone: 'CDMX',
    branch: 'Yugelito',
    registered: true
  },
  {
    name: 'Pedro López',
    zone: 'Edo Mex',
    branch: 'Tejocote',
    registered: true
  },
  {
    name: 'Miguel Sánchez',
    zone: 'Morelos',
    branch: 'Puente Blanco',
    registered: true
  },
];

function People() {
  
  return (
      <Table columns={columns} dataSource={data} />
  )
}

export default People;