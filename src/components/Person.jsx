import { useState } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Space, Skeleton, Flex, Popconfirm, Select } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CloseCircleOutlined } from '@ant-design/icons';
// Project imports
import validationRules from '../util/validation';
import { useUser } from '../lib/context/user';
import { useNotification } from '../lib/context/notification';
import usePeople from '../hooks/usePeople';
import canRoleDo from '../util/roleValidation';
import { activities } from '../util/constants';

function Person({ open, setOpen, type, personId }) {
  const { user: currentUser } = useUser();
  const { createPerson, readPerson, updatePerson, deletePerson, getPeopleCategory } = usePeople();
  const api = useNotification();
  const [cities, setCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const queryClient = useQueryClient();

  const { mutateAsync: addPerson } = useMutation({
    mutationFn: async (values) => {
      try {
        setOpen(false);
        await createPerson({ ...values, accessed: true });
        api.success({ message: 'Éxito', description: 'Asistente creado', placement: 'top', showProgress: true });
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['people'])
    }
  });

  const { data: person, isPending, isFetching, isError, error } = useQuery({
    queryFn: () => {
      try {
        if (type === 'Crear') return { username: '', name: '', role: '' }
        return readPerson(personId)
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    queryKey: ['person']
  });

  const { mutateAsync: handleUpdate } = useMutation({
    mutationFn: async (values) => {
      try {
        setOpen(false);
        values.personId = personId; // Adding personId to keep it invisible to form
        await updatePerson(values);
        api.success({ message: 'Éxito', description: 'Asistente actualizado', placement: 'top', showProgress: true });
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
    }
  });

  const { mutateAsync: handleDelete } = useMutation({
    mutationFn: async (username) => {
      try { 
        setOpen(false);
        await deletePerson(username);
        api.success({ message: 'Éxito', description: 'Asistente borrado', placement: 'top', showProgress: true });
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
    }
  });

    const loadCategory = async (name, setFields, fields) => {
      if (fields.length !== 0) return; // Prevents multiple loads
      const category = await getPeopleCategory(name);
      setFields(category.map(c => ({ label: c, value: c })));
    }

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
        title={`${type} asistente`}
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
        onFinish={ type === 'Crear' ? addPerson : handleUpdate }
        onFinishFailed={handleValidation}
        size="large"
        disabled={ person ? !canRoleDo(currentUser.role, 'UPDATE', 'person') : false }
      >
          <Row>
            <Col span={24}>
            <Form.Item
                name="name"
                label="Nombre"
                rules={validationRules.name}
                initialValue={person ? person.name : ''}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="gender"
                label="Género"
                rules={validationRules.gender}
                initialValue={person ? person.gender : ''}
              >
                <Select 
                  placeholder="Selecciona género"
                  options={[
                    {label: 'Hombre', value: 'male'},
                    {label: 'Mujer', value: 'female'}
                ]}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="email"
                label="Correo electrónico"
                rules={validationRules.email}
                initialValue={person ? person.email : ''}
              >
                <Input placeholder="Correo electrónico" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="cellphone"
                label="Teléfono"
                rules={validationRules.cellphone}
                initialValue={person ? person.cellphone : ''}
              >
                <Input placeholder="Teléfono" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="tutor"
                label="Tutor"
                rules={validationRules.tutor}
                initialValue={person ? person.tutor : ''}
              >
                <Input placeholder="Tutor" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="illness"
                label="Enfermedad/Medicamentos"
                rules={validationRules.illness}
                initialValue={person ? person.illness : ''}
              >
                <Input.TextArea rows={2} placeholder="" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="zone"
                label="Zona/Estado"
                initialValue={person ? person.zone : ''}
              >
                <Input placeholder="Zona" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="branch"
                label="Localidad"
                initialValue={person ? person.branch : ''}
              >
                <Input placeholder="Localidad" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="city"
                label="Ciudad"
                rules={validationRules.city}
                initialValue={person ? person.city : ''}
              >
                <Select 
                  placeholder="Selecciona ciudad"
                  onFocus={async () => await loadCategory('city', setCities, cities)} options={cities}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            <Form.Item
                name="age"
                label="Edad"
                rules={validationRules.age}
                initialValue={person ? person.age : ''}
              >
                <Input placeholder="Edad" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="activity"
                label="Actividad"
                initialValue={person ? person.activity : ''}
              >
                <Select 
                  placeholder="Selecciona actividad"
                  options={activities.map((activity, index) => ({ label: activity, value: activity }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="room"
                label="Cuarto"
                rules={validationRules.room}
                initialValue={person ? person.room : ''}
              >
                <Input placeholder="Cuarto" />
                {/* <Select 
                  placeholder="Selecciona cuarto"
                  onFocus={async () => await loadCategory('room', setRooms, rooms)} options={rooms}
                /> */}
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button onClick={onClose}>Cancelar</Button>
            <Button htmlType="submit" type="primary">
              {type}
            </Button>
            { type === 'Editar' ?
            <Popconfirm
              title='¿Borrar el asistente?'
              cancelText='Cancelar'
              okText='Si'
              okType='danger'
              icon={<CloseCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDelete(person.personId)}
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

export default Person;