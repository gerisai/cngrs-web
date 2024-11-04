import { Button, Col, Drawer, Form, Input, Row, Space, Select, Skeleton, Flex, Popconfirm, Switch } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CloseCircleOutlined } from '@ant-design/icons';
// Project imports
import validationRules from '../util/validation';
import { useUser } from '../lib/context/user';
import { useNotification } from '../lib/context/notification';
import useUsers from '../hooks/useUsers';
import createRandomPassword from '../util/passwords';
import canRoleDo from '../util/roleValidation';

function User({ open, setOpen, type, username }) {
  const { user: currentUser } = useUser();
  const { createUser, readUser, updateUser, deleteUser } = useUsers();
  const api = useNotification();

  const queryClient = useQueryClient();

  const { mutateAsync: addUser } = useMutation({
    mutationFn: async (values) => {
      try {
        setOpen(false);
        await createUser(values);
        api.success({ message: 'Éxito', description: 'Usuario creado', placement: 'top', showProgress: true });
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    }
  });

  const { data: user, isPending, isFetching, isError, error } = useQuery({
    queryFn: () => {
      try {
        if (type === 'Crear') return { username: '', name: '', role: '' }
        return readUser(username)
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    queryKey: ['user']
  });

  const { mutateAsync: handleUpdate } = useMutation({
    mutationFn: async (values) => {
      try {
        setOpen(false);
        await updateUser(values);
        if (values.username === currentUser.username) window.location.reload(); // Update UI for current user
        api.success({ message: 'Éxito', description: 'Usuario actualizado', placement: 'top', showProgress: true });
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const { mutateAsync: handleDelete } = useMutation({
    mutationFn: async (username) => {
      try { 
        setOpen(false);
        await deleteUser(username);
        api.success({ message: 'Éxito', description: 'Usuario borrado', placement: 'top', showProgress: true });
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const handleValidation = () => {
    api.error({ message: 'Error', description: 'Revisa los campos', placement: 'top', showProgress: true });
  }
  
  const onClose = () => {
    setOpen(false);
  };

  if (isError) {
    setOpen(false);
    api.error({ message: 'Error', description: error.message, placement: 'top', showProgress: true });
  }
  
  return (
    <>
      <Drawer
        title={`${type} usuario`}
        onClose={onClose}
        open={open}
      >
      {
        (isPending || isFetching) ?
        <Flex align='center' justify='center'>
          <Skeleton active />
        </Flex>
      :
      <Form
        layout="vertical"
        onFinish={ type === 'Crear' ? addUser : handleUpdate }
        onFinishFailed={handleValidation}
        size="large"
        disabled={ user ? !canRoleDo(currentUser.role, 'UPDATE', 'user') : false }
      >
          <Row>
            <Col span={24}>
              <Form.Item
                name="username"
                label="Usuario"
                rules={validationRules.username}
                initialValue={user ? user.username : ''}
                tooltip={type === 'Editar' ? 'No se puede actualizar el nombre de usuario' : null}
              >
                <Input placeholder="Nombre de usuario" disabled={type === 'Editar' ? true : false}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="name"
                label="Nombre"
                rules={validationRules.name}
                initialValue={user ? user.name : ''}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="email"
                label="Correo electrónico"
                rules={validationRules.email}
                initialValue={user ? user.email : ''}
              >
                <Input placeholder="Correo electrónico" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
              name="password"
              label="Contraseña"
              tooltip={ type === 'Crear' ? 'Copia esta contraseña' : 'Introducela solo si quieres cambiarla'}
              initialValue={ type === 'Crear' ? createRandomPassword(8) : ''}
            >
            <Input.Password placeholder="Contraseña"/>
          </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="role"
                label="Rol"
                rules={validationRules.role}
                initialValue={user ? user.role : ''}
              >
                <Select placeholder="Selecciona un rol">
                  <Select.Option value="admin">Administrador</Select.Option>
                  <Select.Option value="operator">Operador</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            { type === 'Crear' ?
              <Form.Item
                name="sendMail"
                label="¿Enviar email de bienvenida?"
              >
                <Switch />
              </Form.Item>
            : null
            }
            </Col>
          </Row>
          <Space>
            <Button onClick={onClose}>Cancelar</Button>
            <Button htmlType="submit" type="primary">
              {type}
            </Button>
            { type === 'Editar' ?
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
            : null }
          </Space>
        </Form>
      }
      </Drawer>
    </>
  )
}

export default User;