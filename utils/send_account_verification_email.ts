import emailjs from "emailjs-com";
import jwt from 'jsonwebtoken';
const SERVICE_ID = "techinsights";
const PUBLIC_KEY = "qFd5qmb5ZtWsVpwuc";
const TEMPLATE_ID = "template_0mdbb8k";

async function sendAccountVerificationEmail(payload: { email: string; name: string }) {

    const jwtToken = jwt.sign(payload,
        process.env.JWT_SECRET_FOR_ACCOUNT_VERIFICATION as string,
        { expiresIn: '1h' }
    );


}

export default sendAccountVerificationEmail;
