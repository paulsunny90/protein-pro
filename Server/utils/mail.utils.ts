import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string) => {
    // For development, we'll use a test account or just log it
    // In production, use real SMTP settings

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'test@ethereal.email', // Replace with real user
            pass: 'testpass', // Replace with real pass
        },
    });

    // Since this is a demo/dev environment, we might not have real SMTP credentials
    // Let's log the OTP to the console for the user to see during development
    console.log(`------------------------------`);
    console.log(`OTP for ${email}: ${otp}`);
    console.log(`------------------------------`);

    try {
        const info = await transporter.sendMail({
            from: '"ProteinPro Admin" <admin@proteinpro.com>',
            to: email,
            subject: "Your Login OTP",
            text: `Your OTP for login is: ${otp}. It will expire in 10 minutes.`,
            html: `<b>Your OTP for login is: ${otp}</b><br>It will expire in 10 minutes.`,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.warn("Mail sending failed, but continuing for dev purposes. Check console for OTP.");
        return true; // Return true so dev doesn't break
    }
};
