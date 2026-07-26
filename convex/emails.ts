"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";

export const sendStatusEmail = internalAction({
  args: {
    email: v.string(),
    parentName: v.string(),
    childName: v.string(),
    campName: v.string(),
    campDates: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Ověření nastavení SMTP
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("SMTP pověření nenastavena (chybí SMTP_USER nebo SMTP_PASS). Ignoruji odeslání emailu pro:", args.email);
      return;
    }

    // Defaultně pro Seznam.cz, pokud není uvedeno jinak
    const host = process.env.SMTP_HOST || "smtp.seznam.cz";
    const port = parseInt(process.env.SMTP_PORT || "465");
    const secure = port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let subject = "";
    let html = "";

    if (args.status === "Schválená") {
      subject = `Kemp OFS Ústí: Přihláška schválena (${args.childName})`;
      html = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: #fff;">
          <div style="background-color: #0a0f1c; padding: 30px; text-align: center; border-bottom: 4px solid #ef4444;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; color: #fff;">
              <span style="color: #ef4444;">Kemp OFS</span> Ústí
            </h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #22c55e; margin-top: 0; font-size: 22px;">Přihláška úspěšně schválena! 🎉</h2>
            <p style="font-size: 16px; color: #475569;">Dobrý den, ${args.parentName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">s radostí Vám oznamujeme, že přihláška účastníka <strong style="color: #0f172a;">${args.childName}</strong> na fotbalový kemp <strong style="color: #0f172a;">${args.campName}</strong> (${args.campDates}) byla schválena.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; padding: 25px; margin: 30px 0; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 18px; margin-bottom: 15px;">Instrukce k platbě</h3>
              <p style="margin: 0 0 10px 0; font-size: 15px; color: #334155;">Číslo účtu: <strong style="color: #0f172a;">123456789/0000</strong> (ZDE DOPLNIT VÁŠ ÚČET)</p>
              <p style="margin: 0 0 10px 0; font-size: 15px; color: #334155;">Částka: <strong style="color: #0f172a;">Dle ceníku</strong></p>
              <p style="margin: 0 0 10px 0; font-size: 15px; color: #334155;">Variabilní symbol: <strong style="color: #0f172a;">(ZDE DOPLNIT)</strong></p>
              <p style="margin: 0; font-size: 15px; color: #334155; font-style: italic;">Do poznámky k platbě prosím uveďte jméno dítěte.</p>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #475569;">Těšíme se na Vás!</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 14px; margin-bottom: 0; color: #64748b;"><strong>Tým fotbalových kempů OFS Ústí</strong><br/>info@kempofsusti.cz</p>
          </div>
        </div>
      `;
    } else if (args.status === "Zamítnutá") {
      subject = `Kemp OFS Ústí: Informace k přihlášce (${args.childName})`;
      html = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: #fff;">
          <div style="background-color: #0a0f1c; padding: 30px; text-align: center; border-bottom: 4px solid #ef4444;">
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; color: #fff;">
              <span style="color: #ef4444;">Kemp OFS</span> Ústí
            </h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #ef4444; margin-top: 0; font-size: 22px;">Informace k přihlášce</h2>
            <p style="font-size: 16px; color: #475569;">Dobrý den, ${args.parentName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">velmi nás to mrzí, ale přihlášku účastníka <strong style="color: #0f172a;">${args.childName}</strong> na kemp <strong style="color: #0f172a;">${args.campName}</strong> (${args.campDates}) jsme museli bohužel z kapacitních důvodů <strong>zamítnout</strong>.</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">V případě uvolnění místa Vás budeme kontaktovat, nebo se můžete zkusit přihlásit na jiný z našich turnusů.</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #475569;">Děkujeme za pochopení a přízeň.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 14px; margin-bottom: 0; color: #64748b;"><strong>Tým fotbalových kempů OFS Ústí</strong><br/>info@kempofsusti.cz</p>
          </div>
        </div>
      `;
    } else {
      return;
    }

    try {
      await transporter.sendMail({
        from: `"Kemp OFS Ústí" <${process.env.SMTP_USER}>`,
        to: args.email,
        subject: subject,
        html: html,
      });
      console.log(`Email successfully sent to ${args.email} for status ${args.status}`);
    } catch (error) {
      console.error("Error sending email via Nodemailer:", error);
    }
  },
});
