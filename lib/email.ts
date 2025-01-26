import nodemailer from 'nodemailer';

export const sendEmail = async ({
                                    to,
                                    subject,
                                    text,
                                    html,
                                }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) => {
    const transporter = nodemailer.createTransport({
        host: 'localhost', // Use the local Postfix server
        port: 25, // Use port 25 for sending emails with Postfix
        secure: false, // Postfix is not using SSL/TLS by default
        tls: {
            rejectUnauthorized: false, // Allow self-signed certificates
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Chiang Mai Highlanders Golf" <no-reply@highlandersgolf.online>`, // Sender address
            to, // Receiver email(s)
            subject, // Subject line
            text, // Plain text body
            html, // HTML body
        });

        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error sending email: ${error.message}`);
        } else {
            console.error('Unknown error occurred while sending email');
        }
        throw new Error('Failed to send email');
    }
};
