async function sendParentNotification(phone, message, templateVariables = null) {
  try {
    if (!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      console.warn('WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set, skipping notification');
      return;
    }

    // Clean phone number: remove +, spaces, dashes
    let cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`; // Default to India 91 prefix for 10-digit mobile numbers
    }

    const templateName = process.env.WHATSAPP_TEMPLATE_NAME;

    let payload;
    if (templateName) {
      payload = {
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: templateName,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en_US" }
        }
      };
      if (templateVariables && Array.isArray(templateVariables)) {
        payload.template.components = [{
          type: "body",
          parameters: templateVariables.map(v => ({ type: "text", text: String(v) }))
        }];
      }
    } else {
      payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "text",
        text: { body: message }
      };
    }

    const response = await fetch(`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ WhatsApp Cloud API Delivery Failure:', JSON.stringify(errorData, null, 2));
      
      const errorCode = errorData?.error?.code;
      if (errorCode === 131030) {
        console.warn('⚠️ SANDBOX TEST RESTRICTION: Because payment is not set up, Meta only sends messages to verified test numbers. Go to Meta Developer -> WhatsApp -> API Setup and add +91' + cleanPhone.slice(-10) + ' to your Test Phone Numbers list!');
      } else if (errorCode === 131047 || errorCode === 131026) {
        console.warn('⚠️ 24-HOUR POLICY RESTRICTION: You attempted to send plain text outside a user-initiated 24-hour conversation window. To test without paying, send "Hi" from your mobile WhatsApp to your Meta Test Number first, or set WHATSAPP_TEMPLATE_NAME="hello_world" in your .env!');
      }
    } else {
      const successData = await response.json();
      console.log(`✅ WhatsApp alert successfully dispatched to +${cleanPhone} [Message ID: ${successData.messages?.[0]?.id}]`);
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error.message);
  }
}

async function sendAbsenceAlert(phone, studentName, date, schoolName) {
  const message = `🏫 ${schoolName} Alert

Dear Parent, your child ${studentName} was marked ABSENT on ${date}.

ಪ್ರಿಯ ಪೋಷಕರೇ, ನಿಮ್ಮ ಮಗು ${studentName} ಅವರು ${date} ರಂದು ಗೈರುಹಾಜರಾಗಿದ್ದಾರೆ.

— ${schoolName}`;

  // Pass variables twice (for English and Kannada placeholders in the bilingual template)
  await sendParentNotification(phone, message, [studentName, date, studentName, date]);
}

module.exports = {
  sendParentNotification,
  sendAbsenceAlert
};
