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
        host: 'localhost', // For your own SMTP server
        port: 587, // Port used for sending emails
        secure: false, // Secure false for port 587
        auth: {
            user: '', // Leave empty if no auth is needed
            pass: '', // Leave empty if no auth is needed
        },
        tls: {
            rejectUnauthorized: false, // Allow self-signed certificates if applicable
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Chiang Mai Highlanders Golf" <no-reply@highlandersgolf.online>`, // Replace with your email
            to,
            subject,
            text,
            html,
        });

        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw new Error('Failed to send email');
    }
};
