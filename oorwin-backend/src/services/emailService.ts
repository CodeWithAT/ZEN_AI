import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dummy',
    pass: process.env.EMAIL_PASSWORD || 'dummy'
  }
});

export const sendWelcomeEmail = async (candidateEmail: string, candidateName: string) => {
  if (process.env.EMAIL_USER === "your-email@gmail.com" || !process.env.EMAIL_USER) {
    console.log(`[EMAIL MOCK] Would send welcome email to ${candidateEmail}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: '"ZEN AI Recruitment" <noreply@oorwin.com>',
      to: candidateEmail,
      subject: 'Your profile has been added!',
      html: `<h3>Hello ${candidateName},</h3><p>Your resume has been successfully parsed by our AI and added to the Oorwin Talent Pool.</p>`
    });
    console.log(`Email successfully sent to ${candidateEmail}`);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};