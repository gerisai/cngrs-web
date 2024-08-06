import { theme } from 'antd';

const customTheme = {
    components: {
      Card: {
        headerBg: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }
    },
    token: {
      colorPrimary: '#fc46c7',
      colorBgBase: "#141414",
      colorInfo: '#00bed1',
      colorSuccess: '#7fff3f',
      colorWarning: '#ffe355',
      colorError: '#ff595b'
    },
    algorithm: [
      theme.darkAlgorithm
    ]
}

export default customTheme;
