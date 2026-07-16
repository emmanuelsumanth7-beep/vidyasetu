const SMS_COST = 0.005; // USD
const WHATSAPP_COST = 0.01; // USD

/**
 * Simulates sending an SMS or WhatsApp notification to parents.
 * In a real-world scenario, this would integrate with Twilio or AWS SNS.
 */
async function sendParentNotification({ type, phone, message, studentName }) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const cost = type === 'whatsapp' ? WHATSAPP_COST : SMS_COST;
  
  console.log('--------------------------------------------------');
  console.log(`[NOTIFIER - ${type.toUpperCase()}]`);
  console.log(`To: ${phone || 'All Parents'}`);
  console.log(`Student: ${studentName || 'N/A'}`);
  console.log(`Message: ${message}`);
  console.log(`Estimated Cost Billed to School: $${cost} (₹${(cost * 83).toFixed(2)})`);
  console.log('--------------------------------------------------');

  return { success: true, cost };
}

module.exports = { sendParentNotification };
