

interface TemplateCredentials {
    name: String,
    image: String,
    code: String
}

export const emailTemplate = (data: TemplateCredentials) => {

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #dddddd;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #dddddd;
            font-size: 12px;
            color: #999999;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            cursor: pointer;
        }
        @media (max-width: 600px) {
            .email-container {
                width: 100%;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${data.image}" alt="Logo">
        </div>
        <div class="content">
            <h1>Welcome, ${data.name}!</h1>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a  href=${data.code} class="button">Verify Email</a>
            <p>If you did not sign up for this account, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Team Stack. All rights reserved.</p>
            <p>Team Stack. Medical Road, Sylhet</p>
        </div>
    </div>
</body>
</html>
    `;
};
