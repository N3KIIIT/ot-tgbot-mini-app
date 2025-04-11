import React, { useEffect, useState } from 'react';

interface InfoPageProps {
    onBack: () => void; // Обработчик для кнопки "Назад"
}

const InfoPage: React.FC<InfoPageProps> = ({ onBack }) => {
    const [infoData, setInfoData] = useState<string | null>(null); // Данные информационного материала

    // Вызов API при загрузке компонента
    useEffect(() => {
        const fetchInfoData = async () => {
            try {
                // Замените на ваш API-эндпоинт
                const response = await fetch('https://api.example.com/info');
                const data = await response.json();
                setInfoData(data.message); // Предположим, что API возвращает { message: string }
            } catch (error) {
                console.error('Ошибка при загрузке информации:', error);
                setInfoData('Не удалось загрузить информационный материал.');
            }
        };

        fetchInfoData();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
            <h1>Информационный материал</h1>
            {infoData && <p>{infoData}</p>}
            <div style={{ marginTop: '20px' }}>

            </div>
        </div>
    );
};

export default InfoPage;