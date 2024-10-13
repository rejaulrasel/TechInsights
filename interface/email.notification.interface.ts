export interface TAuthEmail {
    subject: string;
    receiver_name: string;
    receiver_email: string;
    description: string;
    otp: string;
    [kye: string]: unknown;
}

export interface INotificationEmail {
    subject: string;
    receiver_name: string;
    description: string;
    receiver_email: string;
    [key: string]: unknown;
}
