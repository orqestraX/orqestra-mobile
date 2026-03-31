// Orqestra AI Help Desk Agent
// Auto-reply engine with intent detection and contextual responses

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface Intent {
  keywords: string[];
  response: string;
  quickReplies?: string[];
  followUp?: string;
}

const INTENTS: Intent[] = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'what up', 'sup'],
    response: "Hey! I'm Orq, your Orqestra assistant. I can help with orders, shipments, marketplace listings, compliance, billing, and more. What do you need?",
    quickReplies: ['Track my order', 'Marketplace help', 'Compliance question', 'Billing issue'],
  },

  // Order status
  {
    keywords: ['order status', 'where is my order', 'order update', 'check order', 'my order', 'orq-', 'order number'],
    response: "To check a specific order, go to the Orders tab and tap the order card — you'll see real-time status and a full timeline. If you need to escalate an issue with an order, share the order ID (e.g. ORQ-0041) and I'll look into it.",
    quickReplies: ['Go to Orders', 'Cancel an order', 'Order not received'],
  },

  // Shipment / tracking
  {
    keywords: ['track', 'tracking', 'shipment', 'delivery', 'driver', 'transit', 'shipped', 'where is', 'logistics'],
    response: "You can track all active shipments in the Logistics tab. Each shipment shows the route, driver info, ETA, and a live timeline with checkpoints. Shipments are updated as the driver hits each checkpoint.",
    quickReplies: ['Open Logistics', 'Shipment delayed', 'Wrong delivery address'],
  },

  // Marketplace / listings
  {
    keywords: ['listing', 'marketplace', 'product', 'buy', 'purchase', 'browse', 'flower', 'concentrate', 'edible', 'pre-roll', 'price', 'vendor', 'stock'],
    response: "The Marketplace tab shows all verified operator listings in New Mexico. You can filter by product type, search by name or vendor, and tap any card to see full details including THC/CBD percentages, stock levels, and vendor license info. Ready to place an order?",
    quickReplies: ['How to place an order', 'Minimum order quantities', 'Become a vendor'],
  },

  // Placing an order
  {
    keywords: ['place order', 'how to order', 'create order', 'new order', 'buy product', 'submit order'],
    response: "Placing an order is a 2-step process:\n\n1. Tap a listing in the Marketplace and hit 'Place Order'\n2. Choose your quantity, delivery method, and add any notes\n\nOnce submitted, the vendor has 24 hours to confirm. You'll get a notification the moment they do.",
    quickReplies: ['What payment methods are accepted', 'Minimum order sizes', 'Cancel an order'],
  },

  // Cancel order
  {
    keywords: ['cancel', 'cancellation', 'cancel order', 'undo order', 'remove order'],
    response: "You can cancel a Pending order directly from the Order Detail screen — tap the order and you'll see a 'Cancel Order' button at the bottom.\n\nOnce a vendor confirms your order (status changes to Active), cancellations require contacting the vendor directly. Want me to connect you with vendor support?",
    quickReplies: ['Contact vendor support', 'Order already active', 'Refund policy'],
  },

  // Payment / billing
  {
    keywords: ['payment', 'billing', 'invoice', 'pay', 'charge', 'receipt', 'refund', 'subscription', 'fee', 'transaction'],
    response: "Billing details, invoices, and receipts are all in Profile → Billing. A few key things:\n\n• Orqestra charges a platform fee of 2.5% per transaction\n• Invoices are generated within 24 hours of order completion\n• Refunds for disputed orders are processed within 5–7 business days\n\nIs there a specific billing issue I can help with?",
    quickReplies: ['Request a refund', 'View my invoices', 'Change payment method'],
  },

  // Compliance / licensing
  {
    keywords: ['license', 'compliance', 'ccd', 'legal', 'regulation', 'manifest', 'metrc', 'track and trace', 'permit', 'compliant', 'law'],
    response: "Every operator on Orqestra is verified against New Mexico CCD records before they can transact. Here's how compliance works:\n\n• All orders generate a transport manifest automatically\n• Vendor licenses are displayed on every listing\n• All transactions are logged for audit purposes\n\nNeed help with a specific compliance question?",
    quickReplies: ['Upload my license', 'What licenses are accepted', 'Manifest questions'],
  },

  // Account / profile
  {
    keywords: ['account', 'profile', 'password', 'login', 'sign in', 'email', 'username', 'settings', 'update info'],
    response: "You can update your account details in the Profile tab — business name, contact info, and license number. For password resets or email changes, use the Security section in Profile.\n\nIs there something specific with your account I can help fix?",
    quickReplies: ['Change my email', 'Reset password', 'Update business info'],
  },

  // Become a vendor / list products
  {
    keywords: ['sell', 'list my product', 'become a vendor', 'add listing', 'post listing', 'my products', 'vendor account'],
    response: "To list products on the Orqestra Marketplace:\n\n1. Make sure your NM license is verified in your profile\n2. Go to Profile → Business Profile → Manage Listings\n3. Submit your product details — we review and approve within 24 hours\n\nCurrently in early access, so listing approval is manual. We'll notify you once live.",
    quickReplies: ['Upload my license', 'Listing requirements', 'Pricing guidelines'],
  },

  // Pricing / fees
  {
    keywords: ['how much', 'fee', 'cost', 'pricing', 'subscription', 'plan', 'free', 'charge'],
    response: "Orqestra pricing:\n\n• Starter — Free · Browse + receive orders\n• Professional — $299/mo · Full marketplace access\n• Enterprise — Custom · Multi-location operators\n\nAll plans include a 2.5% transaction fee. No setup fees. Upgrade anytime from Profile → Billing.",
    quickReplies: ['Compare plans', 'Upgrade my plan', 'Is there a free trial'],
  },

  // Dispute / issue with vendor
  {
    keywords: ['dispute', 'issue', 'problem', 'wrong', 'damaged', 'quality', 'complaint', 'bad', 'missing', 'short'],
    response: "Sorry to hear you're having an issue. Here's how to resolve it:\n\n1. Go to the Order Detail screen\n2. Tap 'Report Issue' (available within 48 hours of delivery)\n3. Describe the problem and attach photos if needed\n\nOur team reviews disputes within 1 business day. For urgent issues, I can escalate this directly.",
    quickReplies: ['Escalate to support team', 'Request a refund', 'Contact vendor directly'],
  },

  // Escalation / human support
  {
    keywords: ['human', 'agent', 'real person', 'speak to someone', 'call', 'phone', 'escalate', 'urgent', 'emergency', 'help'],
    response: "I'll connect you with our support team right away.\n\n📧 support@orqestrax.com\n📞 (505) 000-0000 · Mon–Fri 9AM–6PM MT\n\nFor urgent logistics or compliance issues, use the priority line and mention your order ID. Average response time is under 2 hours during business hours.",
    quickReplies: ['Send email to support', 'What are your hours', 'Report a critical issue'],
  },

  // Thanks / positive
  {
    keywords: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful', 'great', 'perfect', 'awesome'],
    response: "Happy to help! Is there anything else you need? I'm here 24/7.",
    quickReplies: ['Back to Dashboard', 'View my orders', 'Browse marketplace'],
  },
];

const FALLBACK_RESPONSES = [
  "I want to make sure I give you the right answer. Could you rephrase that or choose one of the options below?",
  "That's a bit outside what I have info on right now. For complex issues, I'd recommend reaching out to our support team at support@orqestrax.com.",
  "I'm not sure I have the answer to that specific question. Want me to connect you with the support team, or can I help with something else?",
];

let fallbackIndex = 0;

export function getAgentReply(userMessage: string): { text: string; quickReplies?: string[] } {
  const msg = userMessage.toLowerCase().trim();

  // Find best matching intent
  let bestMatch: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const score = intent.keywords.reduce((acc, kw) => {
      return acc + (msg.includes(kw.toLowerCase()) ? 1 : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent;
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      text: bestMatch.response,
      quickReplies: bestMatch.quickReplies,
    };
  }

  // Fallback
  const response = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
  fallbackIndex++;
  return {
    text: response,
    quickReplies: ['Track my order', 'Billing question', 'Speak to a human'],
  };
}

export function getWelcomeMessage(): Message {
  return {
    id: 'welcome',
    role: 'agent',
    text: "Hi! I'm Orq, your Orqestra assistant 👋\n\nI can help with orders, shipments, marketplace listings, compliance, and billing. What can I help you with today?",
    timestamp: new Date(),
    quickReplies: ['Track my order', 'Marketplace help', 'Billing question', 'Speak to a human'],
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
