import { List, Typography, Button, AutoComplete, Flex, Space, Badge, Skeleton } from 'antd';
import { useState, createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EnvironmentOutlined, HomeOutlined, CheckCircleOutlined, QrcodeOutlined } from '@ant-design/icons';
// Project imports
import { useUser } from '../lib/context/user';
import usePeople from '../hooks/usePeople';
import Error from './Error';
import Unathorized from './Unathorized';
import Person from '../components/Person';
import BulkCreate from '../components/BulkCreate';
import canRoleDo from '../util/roleValidation';

const { Title } = Typography;

const IconText = ({ icon, text }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

function People() {
  const { user } = useUser();
  const { readPeople } = usePeople();
  const navigate = useNavigate();

  // Drawer render state
  const [open, setOpen] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [personId, setPersonId] = useState(null);

  // Search state
  const [options, setOptions] = useState([]);

  // Filter state
  const [people, setPeople] = useState(null);

  const { data: queryPeople , isPending, error } = useQuery({
    queryFn: () => readPeople(),
    queryKey: ['people'],
    retry: false
  });

  if (isPending) {
    return (
      <Flex align='center' justify='center'>
        <Skeleton active />
      </Flex>
    );
  }

  if (error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Forbbiden')) return <Unathorized/>;
    return <Error message={error.message}/>;
  }

  let data = queryPeople ? queryPeople.map((person,i) => ({
      key: i,
      personId: person.personId,
      name: person.name,
      zone: person.zone,
      branch: person.branch,
      accessed: person.accessed
  })) : null;
  const personNames = data ? data.map((person) => person.name) : null;

  const onSelect = (match) => {
    setPeople(data.filter((person) => person.name === match));
  };

  const handleSearch = (value) => {
    setPeople(null)
    const matches = personNames.filter((name) => name.includes(value.toUpperCase()));
    setPeople(data.filter((person) => person.name.includes(value.toUpperCase()))); // filter in real time
    setOptions(!value ? [] : matches.map(m => ({ value: m })));
  };

  return (
      <>
      <Flex gap='small' wrap style={{ marginBottom: 20 }} justify='space-between' >
      { canRoleDo(user.role, 'CREATE', 'person') ?
          <Flex gap='small' wrap style={{ marginBottom: 20 }}>
          <Button type="primary" size="large" onClick={() => {
          setActionType('Crear')
          setOpen(true)
          }}>
            Crear
          </Button>
          <Button size="large" onClick={() => setOpenBulk(true)}>
            Crear muchos
          </Button>
          </Flex>
        : null }
      <AutoComplete
        popupMatchSelectWidth={252}
        style={{
          width: 300
        }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        size="large"
        placeholder='Buscar...'
      />
      </Flex>
      <div className='scroll'>
      <List
        style={{ marginTop: 20 }}
        locale={{
          emptyText: <Title>Sin asistentes</Title>
        }}
        dataSource={people || data}
          renderItem={(item, index) => (
            <List.Item
              extra={
                <Button type="link" onClick={() => navigate(`/person/${item.personId}`)} icon={<QrcodeOutlined/>}/>
              }
            >
              <List.Item.Meta
                title={<>
                  <a onClick={() => {
                    setActionType('Editar')
                    setPersonId(item.personId)
                    setOpen(true)
                    }}>{item.name}</a>
                    { item.accessed ?
                    <Badge offset={[5,-3]} count={<CheckCircleOutlined style={{color: '#52c41a' }}/> }/>
                    : null
                    }
                  </>
                }
                description={
                  <Flex gap='middle'>
                    <IconText icon={EnvironmentOutlined} text={item.zone}/>
                    <IconText icon={HomeOutlined} text={item.branch}/>
                  </Flex>
                }
              />
            </List.Item>
          )}
        />
        </div>
        { open ?
        <Person open={open} setOpen={setOpen} type={actionType} personId={personId} />
        : null }
        { openBulk ?
            <BulkCreate open={openBulk} setOpen={setOpenBulk} type={'asistentes'} />
          : null }
        </>
  )
}

export default People;