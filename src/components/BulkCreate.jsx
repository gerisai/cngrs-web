import { Button, Typography, Drawer, Form, Upload, Space, Switch, Flex } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
// Project imports
import { useNotification } from '../lib/context/notification';
import useUsers from '../hooks/useUsers';
import usePeople from '../hooks/usePeople';

const { Text } = Typography;

const csvFields = {
    usuarios: ['name','email'],
    asistentes: ['name', 'email', 'gender', 'cellphone', 'zone', 'branch', 'room', 'tutor', 'illness']
}


function BulkCreate({ open, setOpen, type }) {
  const api = useNotification();
  const { bulkCreateUsers } = useUsers();
  const { bulkCreatePeople } = usePeople();

  const assetUrl = `${import.meta.env.VITE_ASSETS_URL}/${type}.csv`

  let data = new FormData();

  const csvProps = {
    name: 'csv',
    accept: '.csv',
    multiple: false,
    maxCount: 1,
    onChange({ file }) {
      const { status, error, response } = file;
      if (status === 'done') {
        api.success({ message: 'Éxito', description: response, placement: 'top'});
      } else if (status === 'error') {
        api.error({ message: 'Error', description: error, placement: 'top'});
      }
    },
    async customRequest ({ file, onSuccess, onError }) {
      data = new FormData();
      try {
        data.append('csv', file);
        onSuccess('Archivo cargado');
      } catch (err) {
        onError(err.message);
      }
    },
  };

  const sendCsv = async (values) => {
    const { sendMail } = values;
    const bulkCreateFunction = type === 'user' ? bulkCreateUsers : bulkCreatePeople;
    try {
      const message = await bulkCreateFunction(data, sendMail);
      api.success({ message: 'Éxito', description: message, placement: 'top'});
    } catch (err) {
      api.error({ message: 'Error', description: err.message, placement: 'top'});
    }
  }

  const onClose = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Drawer
        title={`Crear muchos ${type}`}
        onClose={onClose}
        open={open}
      >
      <Form
        layout="vertical"
        onFinish={sendCsv}
        size="large"
      >
        <Space style={{ paddingBottom: 20}}>
            <Text level={5}>Sube un archivo CSV con los siguientes campos: {csvFields[type].join(',')}</Text>
        </Space>
        <Form.Item>
          <Flex wrap justify='flex-start' gap='middle'>
          <Button href={assetUrl} icon={<DownloadOutlined/>} type="primary">Ejemplo</Button>
          <Upload {...csvProps}>
              <Button icon={<UploadOutlined/>}>Subir archivo</Button>
          </Upload>
          </Flex>
        </Form.Item>
        <Form.Item
            name="sendMail"
            label="¿Enviar email de bienvenida?"
        >
            <Switch />
        </Form.Item>
        <Space>
            <Button onClick={onClose}>Cancelar</Button>
            <Button htmlType="submit" type="primary">Enviar</Button>
        </Space>
      </Form>
      </Drawer>
    </>
  )
}

export default BulkCreate;