declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    user?: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                    };
                    chat?: {
                        id: number;
                        type: string;
                        title?: string;
                    };
                };
                version: string;
                platform: string;
                colorScheme: 'light' | 'dark';
                themeParams: {
                    bg_color: string;
                    text_color: string;
                    hint_color: string;
                    link_color: string;
                    button_color: string;
                    button_text_color: string;
                };
                isExpanded: boolean;
                viewportHeight: number;
                viewportStableHeight: number;
                headerColor: string;
                backgroundColor: string;
                isClosingConfirmationEnabled: boolean;
                MainButton: {
                    text: string;
                    color: string;
                    textColor: string;
                    isVisible: boolean;
                    isActive: boolean;
                    isProgressVisible: boolean;
                    setText(text: string): void;
                    onClick(callback: () => void): void;
                    show(): void;
                    hide(): void;
                    enable(): void;
                    disable(): void;
                    showProgress(leaveActive?: boolean): void;
                    hideProgress(): void;
                    setParams(params: {
                        text?: string;
                        color?: string;
                        text_color?: string;
                        is_active?: boolean;
                        is_visible?: boolean;
                    }): void;
                };
                BackButton: {
                    isVisible: boolean;
                    onClick(callback: () => void): void;
                    show(): void;
                    hide(): void;
                };
                showPopup(params: {
                    title?: string;
                    message: string;
                    buttons?: Array<{
                        id?: string;
                        type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
                        text: string;
                    }>;
                }, callback?: (id: string) => void): void;
                showAlert(message: string, callback?: () => void): void;
                showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
                ready(): void;
                expand(): void;
                close(): void;
                sendData(data: string): void;
                enableClosingConfirmation(): void;
                disableClosingConfirmation(): void;
                onEvent(eventType: string, eventHandler: () => void): void;
                offEvent(eventType: string, eventHandler: () => void): void;
            };
        };
    }
}

export {};