import React from 'react';
import Button from '../../components/Button/Button';
import styles from './HomePage.module.css';
import Card from '../../components/Card/Card';
import { useUser } from '../../context/UserContext'; // Импортируем хук

interface HomePageProps {
    navigateTo: (page: string) => void;
    // userName больше не нужен как проп
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
    const { currentUser } = useUser(); // Получаем пользователя из контекста

    return (
        <div className={styles.homePage}>
            <Card className={styles.welcomeCard}>
                <h1>Добро пожаловать{currentUser ? `, ${currentUser.name.first}` : ''}!</h1>
                <p>Это ваше приложение для создания и прохождения тестов.</p>
            </Card>

            <div className={styles.navigation}>
                <Button
                    variant="primary"
                    onClick={() => navigateTo('tests')}
                    className={styles.navButton}
                >
                    Перейти к тестам
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => navigateTo('results')}
                    className={styles.navButton}
                >
                    Мои результаты
                </Button>
                <Button
                    variant="link"
                    onClick={() => navigateTo('help')}
                    className={styles.navButton}
                >
                    Справочные материалы
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
