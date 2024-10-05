import emailjs from "emailjs-com";
const SERVICE_ID = "techinsights";
const PUBLIC_KEY = "qFd5qmb5ZtWsVpwuc";
const TEMPLATE_ID = "template_0mdbb8k";

async function sendEmailForNewLead(TEMPLATE_PARAMS) {
    try {
        const res = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            TEMPLATE_PARAMS,
            PUBLIC_KEY
        );

        return res;
    } catch (error) {
        console.log(error);

        return null;
    }
}
export default sendEmailForNewLead;