import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import validator from "validator";
import transporter from "../config/transporter.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.json({
      success: false,
      message: "Please Fill the details properly",
    });
  }
  try {
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email format",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.cookie("verifyToken", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 5 * 60 * 1000,
    });
    const otp = String(Math.floor(Math.random() * 9000 + 1000));
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.loginOtp = hashedOtp;
    user.loginOtpExpiry = Date.now() + 60 * 1000;
    await user.save();
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .header h1 {
      margin: 0;
      color: #4CAF50;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      background-color: #f9f9f9;
      padding: 10px 20px;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #666;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your OTP Code</h1>
    </div>
    <div class="content">
      <p>Hello User</p>
      <p>Your one-time password (OTP) for completing your action is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>
    </div>
    <div class="footer">
      <p>Thank you for using our service!</p>
      <p><strong>LocalLinker</strong></p>
    </div>
  </div>
</body>
</html>`;

    const mailOptions = {
      from: `"LocalLinker" ${process.env.SENDER_MAIL}`,
      to: user.email,
      subject: "Your One-Time Password (OTP) for Verification",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "OTP has been sent successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please Fill the details properly",
    });
  }
  try {
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email format",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exists",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    res.cookie("verifyToken", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 5 * 60 * 1000,
    });
    const otp = String(Math.floor(Math.random() * 9000 + 1000));
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.loginOtp = hashedOtp;
    user.loginOtpExpiry = Date.now() + 60 * 1000;
    await user.save();
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .header h1 {
      margin: 0;
      color: #4842d2;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      background-color: #f9f9f9;
      padding: 10px 20px;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #666;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your OTP Code</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your one-time password (OTP) for completing your action is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>
    </div>
    <div class="footer">
      <p>Thank you for using our service!</p>
      <p><strong>LocalLinker</strong></p>
    </div>
  </div>
</body>
</html>`;

    const mailOptions = {
      from: `"LocalLinker" ${process.env.SENDER_MAIL}`,
      to: user.email,
      subject: "Your One-Time Password (OTP) for Verification",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "OTP has been sent successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp2 } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.loginOtp || Date.now() > user.loginOtpExpiry + 5 * 1000) {
      return res.json({
        success: false,
        message: "OTP has expired",
      });
    }
    const isOtpValid = await bcrypt.compare(otp2, user.loginOtp);
    if (!isOtpValid) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.loginOtp = "";
    user.loginOtpExpiry = 0;
    await user.save();
    res.clearCookie("verifyToken", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userName = user.name;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #4842d2;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
        }
        .email-body {
            padding: 20px;
        }
        .email-body h2 {
            margin-top: 0;
        }
        .email-footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #555555;
        }
        .btn {
            display: inline-block;
            background-color: #4842d2;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
        }
        .btn:hover {
            background-color: #4842d2;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            Welcome to LocalLinker!
        </div>
        <div class="email-body">
            <h2>Hello ${userName},</h2>
            <p>We're excited to have you on board! Thank you for logging in and being part of our community.</p>
            <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
        </div>
        <div class="email-footer">
            &copy; 2024 LocalLinker. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

    const mailOptions = {
      from: `"LocalLinker" ${process.env.SENDER_MAIL}`,
      to: user.email,
      subject: `${userName} 😊 Welcome to LocalLinker – We're Excited to Have You!`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    res.clearCookie("token", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    const otp = String(Math.floor(Math.random() * 9000 + 1000));
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.loginOtp = hashedOtp;
    user.loginOtpExpiry = Date.now() + 60 * 1000;
    await user.save();
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .header h1 {
      margin: 0;
      color: #4842d2;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      background-color: #f9f9f9;
      padding: 10px 20px;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #666;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your OTP Code</h1>
    </div>
    <div class="content">
      <p>Your one-time password (OTP) for completing your action is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>
    </div>
    <div class="footer">
      <p>Thank you for using our service!</p>
      <p><strong>LocalLinker</strong></p>
    </div>
  </div>
</body>
</html>`;
    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Your One-Time Password (OTP) for Verification",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "OTP has been resented successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    const otp = String(Math.floor(Math.random() * 9000 + 1000));
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = Date.now() + 60 * 1000;
    await user.save();
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .header h1 {
      margin: 0;
      color: #4842d2;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      background-color: #f9f9f9;
      padding: 10px 20px;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #666;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your OTP Code</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your one-time password (OTP) for completing your action is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>
    </div>
    <div class="footer">
      <p>Thank you for using our service!</p>
      <p><strong>LocalLinker</strong></p>
    </div>
  </div>
</body>
</html>`;

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "Your One-Time Password (OTP) for Verification",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "OTP has been resented successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const checkMail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email format",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist",
      });
    }
    const token = jwt.sign(
      { userId: user._id.toString(), email },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    res.cookie("resetToken", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 5 * 60 * 1000,
    });
    const otp = String(Math.floor(Math.random() * 9000 + 1000));
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = Date.now() + 60 * 1000;
    await user.save();
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .header h1 {
      margin: 0;
      color: #4842d2;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      background-color: #f9f9f9;
      padding: 10px 20px;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #666;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Your OTP Code</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your one-time password (OTP) for completing your action is:</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for 1 minute. Please do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>
    </div>
    <div class="footer">
      <p>Thank you for using our service!</p>
      <p><strong>LocalLinker</strong></p>
    </div>
  </div>
</body>
</html>`;
    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: email,
      subject: "Your One-Time Password (OTP) for Verification",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "OTP Sent successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User doesn't exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.clearCookie("resetToken", {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { userId, otp2 } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetOtp || Date.now() > user.resetOtpExpiry + 5 * 1000) {
      return res.json({
        success: false,
        message: "OTP has expired",
      });
    }

    const isOtpValid = await bcrypt.compare(otp2, user.resetOtp);
    if (!isOtpValid) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.resetOtp = "";
    user.resetOtpExpiry = 0;
    await user.save();

    res.json({
      success: true,
      message: "Otp verified successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordValid) {
      return res.json({
        success: false,
        message: "Incorrect old password",
      });
    }
    if (oldPassword === newPassword) {
      return res.json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }
    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
