declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    query_id?: string; // Добавим query_id, он может быть полезен
                    user?: {
                        id: number;
                        is_bot?: boolean; // Добавим is_bot
                        first_name: string;
                        last_name?: string;
                        username: string;
                        language_code?: string;
                        is_premium?: boolean; // Добавим is_premium
                        added_to_attachment_menu?: boolean; // Добавим поле
                        allows_write_to_pm?: boolean; // Добавим поле
                        photo_url?: string; // Добавим photo_url
                    };
                    receiver?: { // Добавим receiver, если приложение открыто в чате с ботом
                        id: number;
                        is_bot?: boolean;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        photo_url?: string;
                    };
                    chat?: { // Добавим chat, если приложение открыто из чата
                        id: number;
                        type: 'group' | 'supergroup' | 'channel'; // Уточним типы
                        title: string;
                        username?: string;
                        photo_url?: string;
                    };
                    chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel'; // Добавим chat_type
                    chat_instance?: string; // Добавим chat_instance
                    start_param?: string; // Добавим start_param
                    can_send_after?: number; // Добавим can_send_after
                    auth_date: number; // Добавим auth_date
                    hash: string; // Добавим hash для валидации
                };
                version: string;
                platform: string;
                colorScheme: 'light' | 'dark';
                themeParams: {
                    bg_color?: string; // Сделаем опциональными, т.к. могут отсутствовать
                    text_color?: string;
                    hint_color?: string;
                    link_color?: string;
                    button_color?: string;
                    button_text_color?: string;
                    secondary_bg_color?: string; // Добавим secondary_bg_color
                    header_bg_color?: string; // Добавим header_bg_color
                    accent_text_color?: string; // Добавим accent_text_color
                    section_bg_color?: string; // Добавим section_bg_color
                    section_header_text_color?: string; // Добавим section_header_text_color
                    subtitle_text_color?: string; // Добавим subtitle_text_color
                    destructive_text_color?: string; // Добавим destructive_text_color
                };
                isExpanded: boolean;
                viewportHeight: number;
                viewportStableHeight: number;
                headerColor: string; // Может быть keyof themeParams. Accent text color?
                backgroundColor: string; // Может быть keyof themeParams. Bg color?
                isClosingConfirmationEnabled: boolean;
                BackButton: {
                    isVisible: boolean;
                    onClick(callback: () => void): void;
                    offClick(callback: () => void): void; // Добавим offClick
                    show(): void;
                    hide(): void;
                };
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isActive: boolean;
                    isProgressVisible: boolean;
                    setText(text: string): void;
                    onClick(callback: () => void): void;
                    offClick(callback: () => void): void; // Добавим offClick
                    show(): void;
                    hide(): void;
                    enable(): void;
                    disable(): void;
                    showProgress(leaveActive?: boolean): void;
                    hideProgress(): void;
                    setParams(params: {
                        text?: string;
                        color?: string; // Может быть keyof themeParams
                        text_color?: string; // Может быть keyof themeParams
                        is_active?: boolean;
                        is_visible?: boolean;
                    }): void;
                };
                HapticFeedback: { // Добавим HapticFeedback
                    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
                    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
                    selectionChanged(): void;
                };
                CloudStorage: { // Добавим CloudStorage
                    setItem(key: string, value: string, callback?: (error: string | null, stored: boolean) => void): void;
                    getItem(key: string, callback: (error: string | null, value: string | null) => void): void;
                    getItems(keys: string[], callback: (error: string | null, values: { [key: string]: string | null }) => void): void;
                    removeItem(key: string, callback?: (error: string | null, removed: boolean) => void): void;
                    removeItems(keys: string[], callback?: (error: string | null, removed: boolean) => void): void;
                    getKeys(callback: (error: string | null, keys: string[]) => void): void;
                };
                isVersionAtLeast(version: string): boolean; // Добавим isVersionAtLeast
                setHeaderColor(color: string): void; // Добавим setHeaderColor (может быть keyof themeParams)
                setBackgroundColor(color: string): void; // Добавим setBackgroundColor (может быть keyof themeParams)
                enableClosingConfirmation(): void;
                disableClosingConfirmation(): void;
                onEvent(eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked' | 'backButtonClicked' | 'settingsButtonClicked' | 'invoiceClosed' | 'popupClosed' | 'qrTextReceived' | 'clipboardTextReceived' | 'writeAccessRequested' | 'contactRequested', eventHandler: Function): void; // Уточним eventType и тип eventHandler
                offEvent(eventType: 'themeChanged' | 'viewportChanged' | 'mainButtonClicked' | 'backButtonClicked' | 'settingsButtonClicked' | 'invoiceClosed' | 'popupClosed' | 'qrTextReceived' | 'clipboardTextReceived' | 'writeAccessRequested' | 'contactRequested', eventHandler: Function): void; // Уточним eventType и тип eventHandler
                sendData(data: string): void;
                switchInlineQuery(query: string, choose_chat_types?: Array<'users' | 'bots' | 'groups' | 'channels'>): void; // Добавим switchInlineQuery
                openLink(url: string, options?: { try_instant_view?: boolean }): void; // Добавим openLink
                openTelegramLink(url: string): void; // Добавим openTelegramLink
                openInvoice(url: string, callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void): void; // Добавим openInvoice
                showPopup(params: {
                    title?: string;
                    message: string;
                    buttons?: Array<{
                        id?: string;
                        type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
                        text?: string; // Сделаем текст опциональным, если есть стандартный тип
                    }>;
                }, callback?: (button_id?: string) => void): void; // Уточним callback
                showAlert(message: string, callback?: () => void): void;
                showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
                showScanQrPopup(params: { text?: string }, callback?: (text: string) => void | true): void; // Добавим showScanQrPopup, callback может вернуть true для закрытия
                closeScanQrPopup(): void; // Добавим closeScanQrPopup
                readTextFromClipboard(callback?: (text: string | null) => void): void; // Добавим readTextFromClipboard
                requestWriteAccess(callback?: (access: boolean) => void): void; // Добавим requestWriteAccess
                requestContact(callback?: (contact: boolean) => void): void; // Добавим requestContact
                ready(): void;
                expand(): void;
                close(): void;
            };
        };
    }
}
export {}; // Обязательно для объявления глобальных типов в модуле

