import { useEffect, useState } from 'react';
import { User } from '../types/model';


export const useTelegramUser = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (tgUser) {
          //  setUser(tgUser);
        }
    }, []);

    return user;
};