import { Flex, Row, Col, Typography, Card, QRCode, Button, Tooltip } from 'antd';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Project imports
import { useUser } from '../lib/context/user';
import { useNotification } from '../lib/context/notification';
import usePeople from '../hooks/usePeople';
import canRoleDo from '../util/roleValidation';
import Loading from './Loading';
import Error from './Error';
import Unathorized from './Unathorized';

const { Title } = Typography;

function Person() {
  const { user } = useUser();
  const api = useNotification();
  const queryClient = useQueryClient();
  const { readPerson, updatePerson } = usePeople();
  const { personId } = useParams();

  const [showQr, setShowQR] = useState(false);

  const { data: person , isLoading, error } = useQuery({
    queryFn: () => readPerson(personId),
    queryKey: ['person'],
    retry: false
  });

  const { mutateAsync: registerAccess } = useMutation({
    mutationFn: async (values) => {
      try {
        await updatePerson({ personId, accessed: true });
        api.success({ message: 'Éxito', description: 'Acceso registrado', placement: 'top', showProgress: true });
      } catch(err) {
        api.error({ message: 'Error', placement: 'top', description: err.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['people']);
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
    <>
      <Row justify="center">
        <Col>
          <Card
            title={<Title style={{ textAlign: 'center', textWrap: 'wrap' }}>{person.name}</Title>}
          >
            <Title style={{ margin:0 }} level={5}>Zona: {person.zone}</Title>
            <br />
            <Title style={{ margin:0 }} level={5}>Localidad: {person.branch}</Title>
            <br />
            <Title style={{ margin:0 }} level={5}>Registrado: {person.registered ? 'Si' : 'No'}</Title>
            <br />
            <Title style={{ margin:0 }} level={5}>Cuarto: {person.room}</Title>
            <Flex gap={10} style={{ margin: 12 }} vertical justify='center' align='center'>
            { canRoleDo(user.role, 'UPDATE', 'person') ?
            <>
            <Tooltip title={person.accessed ? 'Ya fue registrado el acceso' : ''}>
              <Button disabled={person.accessed} type="primary" size="large" onClick={registerAccess}>
                Registrar acceso
              </Button>
            </Tooltip>
            <Button type="dashed" size="large" onClick={() => setShowQR(!showQr)}>
              { showQr ? 'Esconder QR' : 'Mostrar QR' }
            </Button>
            </>
            : null }
            { showQr ?
              <QRCode style={{ margin: 12 }} value={`${import.meta.env.VITE_WEB_URL}/person/${personId}`} errorLevel='H' icon='/CNGRS.svg'/>
            : null}
            </Flex>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Person;
