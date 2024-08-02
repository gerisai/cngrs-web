import { useState } from 'react';
import { Typography, Flex, Form, Select, Input, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Project imports
import HomeLayout from './HomeLayout';
import useUser from '../hooks/useUser';
import Loading from './Loading';
import Error from './Error';
import Unathorized from './Unathorized';
import validationRules from '../util/validation';
import evaluateRole from '../util/roleValidation';

const { Title } = Typography;

function User() {
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { username } = useParams();
  const { readUser, updateUser, deleteUser } = useUser();
  
  const { data: user, isLoading, error } = useQuery({
    queryFn: () => readUser(username),
    queryKey: ['user'],
    retry: false
  });

  const { mutateAsync: handleUpdate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      navigate('/users');
    }
  });

  const { mutateAsync: handleDelete } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbbiden')) return <Unathorized/>;
    return <Error message={error.message}/>;
  }

  return (
      <HomeLayout>
        <Flex vertical align='start'>
        <Flex align='center'>
        <Title>{user.name}</Title>
        { evaluateRole(user.role, { resource: 'user', verb: 'READ' }, { it: user.name, role: user.role }) ?
            <Button size="large" icon={<EditOutlined />} style={{marginTop: 3}} onClick={() => setEditable(!editable)} htmlType="submit" type="outlined"/>
        : null }
        </Flex>
        <Form layout="vertical" onFinish={handleUpdate} onFinishFailed={true} size="large" disabled={!editable}>
          <Form.Item
            name="username"
            label="Usuario"
            rules={validationRules.username}
            initialValue={user.username}
            tooltip='No se puede actualizar el nombre de usuario'
          >
            <Input disabled placeholder="Nombre de usuario" />
          </Form.Item>
          <Form.Item
              name="name"
              label="Nombre"
              rules={validationRules.name}
              initialValue={user.name}
            >
            <Input placeholder="Nombre" />
          </Form.Item>
          <Form.Item
              name="password"
              label="Contraseña"
              tooltip='Introducela solo si quieres cambiarla'
            >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>
          <Form.Item
              name="role"
              label="Rol"
              rules={validationRules.role}
              initialValue={user.role}
            >
              <Select placeholder="Selecciona un rol">
                <Select.Option value="admin">Administrador</Select.Option>
                <Select.Option value="operator">Operador</Select.Option>
              </Select>
            </Form.Item>
          <Space>
          <Popconfirm
            title='¿Borrar el usuario?'
            cancelText='Cancelar'
            okText='Si'
            okType='danger'
            icon={<CloseCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(user.username)}
          >
            <Button danger>
              Borrar
            </Button>
          </Popconfirm>
            <Button onClick={() => setEditable(false)}>Cancelar</Button>
            <Button htmlType="submit" type="primary">
              Actualizar
            </Button>
          </Space>
        </Form>
        </Flex>
      </HomeLayout>
  )
}

export default User;