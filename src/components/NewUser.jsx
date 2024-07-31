import { Button, Col, Drawer, Form, Input, Row, Space, Select } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import validationRules from '../util/validation';
import useUser from '../hooks/useUser';

function NewUser({ open, setOpen, notificationApi }) {
  const { createUser } = useUser();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutateAsync: addUser } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    }
  });
  
  const handleNewUser = async (values) => {
    setOpen(false)
    try {
      await addUser(values);
      form.resetFields();
      notificationApi.success({ message: 'Éxito', description: 'Usuario creado', placement: 'top', showProgress: true });
    } catch(err) {
      notificationApi.error({ message: 'Error', description: err.message, placement: 'top', showProgress: true });
    }
  }

  const handleValidation = () => {
    notificationApi.error({ message: 'Error', description: 'Revisa los campos', placement: 'top', showProgress: true });
  }

  const onClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Drawer
        title="Crear usuario"
        onClose={onClose}
        open={open}
      >
      <Form layout="vertical" onFinish={handleNewUser} onFinishFailed={handleValidation} size="large" 
      form={form}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="username"
                label="Usuario"
                rules={validationRules.username}
              >
                <Input placeholder="Nombre de usuario" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="name"
                label="Nombre"
                rules={validationRules.name}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="role"
                label="Rol"
                rules={validationRules.role}
              >
                <Select placeholder="Selecciona un rol">
                  <Option value="admin">Administrador</Option>
                  <Option value="operator">Operador</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={onClose} htmlType="submit" type="primary">
              Crear
            </Button>
          </Space>
        </Form>
      </Drawer>
    </>
  )
}

export default NewUser;