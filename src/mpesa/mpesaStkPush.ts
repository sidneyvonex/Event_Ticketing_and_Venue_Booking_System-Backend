import dotenv from "dotenv";
dotenv.config();

export const generateMpesaTimestamp = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${date}${hour}${minute}${second}`;
};

interface StkPushRequestBody {
    BusinessShortCode: string;
    Password: string;
    Timestamp: string;
    TransactionType: string;
    Amount: number;
    PartyA: string;
    PartyB: string;
    PhoneNumber: string;
    CallBackURL: string;
    AccountReference: string;
    TransactionDesc: string;
}

export async function stkPush(
    accessToken: string,
    phoneNumber: string,
    amount: number,
    productName: string
): Promise<any> {
    try {
        const shortCode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL;

        if (!shortCode || !passkey || !callbackUrl) {
            throw new Error("Missing required M-Pesa environment variables.");
        }

        const timestamp: string = generateMpesaTimestamp();
        const password: string = Buffer.from(shortCode + passkey + timestamp).toString("base64");
        const requestBody: StkPushRequestBody = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: shortCode,
            PhoneNumber: phoneNumber,
            CallBackURL: callbackUrl,
            AccountReference: phoneNumber,
            TransactionDesc: productName
        };

        const response: Response = await fetch(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        const data = await response.json();
        console.log("🌟 ~ M-PESA STK Response:", data);
        return data;
    } catch (error: any) {
        console.error("stkPush error:", error);
        return null;
    }
}
