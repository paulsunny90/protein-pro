import { log } from "node:console";

const generateOtp = (length=6): string=>{

    const characters = "ABabcdefghijklC_@@@DEFGHIJKLMNOPQRSTUVWXYZa#######bcdefghijklmnopqrstuvwxyz0123456789";

    let otp = "";

    for(let i=0;i<length;i++)
    {
        otp += characters[Math.floor(Math.random() * characters.length)];
    }

    console.log("Generated otp:",otp);
    return otp;
    
};

export default generateOtp;
