import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // Adjust this path as necessary
import { mailSender } from '../utils/MailSender/MailSender.js';

const Otp = sequelize.define('Otp', {
  otp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },  createdAt: { // Sequelize will automatically handle this field
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: { // Sequelize will automatically handle this field
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: true
});

async function sendVerificationEmail(email, otp) {
  console.log(email, otp, 'email, otp');
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

Otp.addHook('afterCreate', async (otpInstance, options) => {
  await sendVerificationEmail(otpInstance.email, otpInstance.otp);
});

export default Otp;
