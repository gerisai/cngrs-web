import { Table, Typography, Button } from 'antd';
import { useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
// Project imports
import { UserContext } from '../hooks/UserContext';
import HomeLayout from './HomeLayout';
import usePeople from '../hooks/usePeople';
import Loading from './Loading';
import Error from './Error';
import Unathorized from './Unathorized';
import Person from '../components/Person';
import canRoleDo from '../util/roleValidation';

const { Text } = Typography;


function People() {
  const { user } = useContext(UserContext);
  const { readPeople } = usePeople();
  
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [personId, setPersonId] = useState(null);

  const { data: people , isLoading, error } = useQuery({
    queryFn: () => readPeople(),
    queryKey: ['people'],
    retry: false
  });

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbbiden')) return <Unathorized/>;
    return <Error message={error.message}/>;
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a onClick={() => {
        setActionType('Editar')
        setPersonId(text.personId)
        setOpen(true)
      }}>{text.name}</a>,
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

  return (
      <HomeLayout>
        <Table columns={columns} dataSource={ people.map((person,i) => {
          return {
            key: i,
            name: {personId: person.personId, name: person.name},
            zone: person.zone,
            branch: person.branch,
            registered: person.registered
          }
        })} />
        { canRoleDo(user.role, 'CREATE', 'person') ?
          <Button type="primary" size="large" onClick={() => {
          setActionType('Crear')
          setOpen(true)
          }}>
            Crear
          </Button>
        : null }
          { open ?
          <Person open={open} setOpen={setOpen} type={actionType} personId={personId} />
          : null }
      </HomeLayout>
  )
}

export default People;