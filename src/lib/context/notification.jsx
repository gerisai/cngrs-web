import { createContext, useContext } from 'react';
import { notification } from 'antd';

const NotificationContext = createContext(null);

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [api, contextHolder] = notification.useNotification();

    return (
        <NotificationContext.Provider value={ api }>
          { contextHolder }
          { children }
        </NotificationContext.Provider>
      )
}
