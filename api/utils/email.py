import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_verification_email(email: str, token: str, name: str):
    """
    Sends the "Set Password" link to a new user.
    """
    frontend_url = os.getenv("FRONTEND_BASE", "http://localhost:5173")
    verification_link = f"{frontend_url}/set-password?token={token}"
    
    subject = "Complete your Robot Store Registration"
    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #007bff;">Welcome to the Robot Store, {name}!</h2>
        <p>Please click the link below to set your password and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" style="padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Set My Password</a>
        </div>
        <p style="color: #666; font-size: 12px;">This link will expire in 24 hours. If you didn't request this, please ignore this email.</p>
    </div>
    """
    
    _send_email(email, subject, body)

def send_otp_email(email: str, otp: str):
    """
    Sends a 6-digit OTP for login verification.
    """
    subject = "Your Login Verification Code"
    body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #007bff;">Security Verification</h2>
        <p>Your one-time login code is:</p>
        <div style="text-align: center; margin: 30px 0;">
            <h1 style="color: #007bff; letter-spacing: 10px; font-size: 36px; margin: 0;">{otp}</h1>
        </div>
        <p style="color: #666; font-size: 12px;">This code will expire in 10 minutes. Do not share this code with anyone.</p>
    </div>
    """
    
    _send_email(email, subject, body)

def _send_email(to_email: str, subject: str, html_body: str):
    """
    Core helper to send SMTP emails.
    Loads config INSIDE the function to ensure the latest .env values are used.
    """
    # Load configuration
    host = os.getenv("SMTP_HOST")
    port = os.getenv("SMTP_PORT")
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASS")
    from_email = os.getenv("SMTP_FROM_EMAIL")

    try:
        if not all([host, port, user, password, from_email]):
            print("⚠️ SMTP Configuration is missing in environment. Email not sent.")
            return

        port = int(port)
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(html_body, 'html'))
        
        # Connect and send
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
            
        print(f"📧 [Success] Email sent to {to_email}")
        
    except Exception as e:
        print(f"❌ [Error] Failed to send email to {to_email}: {e}")
