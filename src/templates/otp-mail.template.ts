export const getOtpEmailTemplate = (
	username: string,
	otp: number,
	currentYear: string
) => {
	return `
	<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Mock AI Interview</title>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont/tabler-icons.min.css"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
      }

      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-bottom: 30px;
      }

      .icon-container {
        width: 50px;
        height: 50px;
        padding: 8px;
        background: linear-gradient(to right, #34d399, #4ade80);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .icon-container i {
        color: white;
        font-size: 32px;
      }

      .logo-text {
        font-size: 32px;
        font-weight: bold;
        margin: 0;
        color: #333;
      }

      .gradient-text {
        background: linear-gradient(to right, #34d399, #4ade80);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      h4 {
        font-size: 24px;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        line-height: 1.6;
        margin: 10px 0;
      }

      .otp-box {
        display: inline-block;
        background-color: #34d399;
        color: white;
        padding: 10px 20px;
        font-size: 20px;
        font-weight: bold;
        border-radius: 6px;
        margin-top: 15px;
      }

      .footer {
        text-align: center;
        font-size: 14px;
        margin-top: 20px;
        color: #777;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <!-- Dynamic Greeting and OTP Section -->
      <h4>Hello ${username},</h4>
      <p>
        Welcome to Mock AI Interview! We are thrilled to have you as a part of our
        community. To complete your registration or verify your identity,
        please use the One-Time Password (OTP) provided below:
      </p>

      <div class="otp-box">${otp}</div>

      <p>
        If you did not request this verification, please ignore this email. For
        any issues, feel free to contact our support team.
      </p>

      <!-- Footer -->
      <div class="footer">
        Thank you for choosing Mock AI Interview!<br />
        &copy; ${currentYear} Mock AI Interview. All rights reserved.
      </div>
    </div>
  </body>
</html>

	`;
};
