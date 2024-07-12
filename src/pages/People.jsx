import React from 'react';
import { Avatar, List, Typography } from 'antd';

const { Text } = Typography;

const data = [
  {
    title: 'Juan Pérez',
  },
  {
    title: 'Carlos Hernández',
  },
  {
    title: 'Pedro López',
  },
  {
    title: 'Miguel Sánchez',
  },
];

function People() {
  return (
    <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={<Text >{item.title}</Text>}
        />
      </List.Item>
    )}
  />
  )
}

export default People;