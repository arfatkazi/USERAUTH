import { MailtrapClient } from "mailtrap";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipent = [{ email }];
  const sender = "hello@demomailtrap.com";
  try {
    const response = await MailtrapClient.send({
      from: sender,
      to: recipent,
      subject: "verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{Verification token}",
        verificationToken
      ),
      category: "email verification",
    });

    console.log("Email sent successfully", response);
  } catch (err) {
    console.log(err.message);
  }
};
