// src/components/UserInitializer.tsx
import { useEffect } from 'react';
import { User } from '../../types/model';

type UserInitializerProps = {
  onUserIdentified: (user: User) => void;
};

export const UserInitializer = ({ onUserIdentified }: UserInitializerProps) => {
  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    if (tgUser) {
      const user: User = {
        id: String(tgUser.id),
        login: tgUser.username || '',
        name: {
          first: tgUser.first_name,
          last: tgUser.last_name || '',
        },
        testResults: [],
      };
      onUserIdentified(user);
    }
  }, []);

  return null;
};