// Legal / policy content. Drafts written for Samachify Foods Private Limited
// (Chennai-based fresh ready-to-cook meal kits). Items in [BRACKETS] should be
// confirmed by the business before launch.

export interface LegalSection {
  heading: string
  body: string[]
}

export interface LegalDoc {
  slug: string
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

const COMPANY = 'Samachify Foods Private Limited'
const SUPPORT_EMAIL = '[support@samachify.in — confirm]'
const SUPPORT_PHONE = '+91 90251 15657'
const ADDRESS = '[Registered address, Chennai, Tamil Nadu, India — confirm]'
const UPDATED = '4 July 2026'

export const legalDocs: Record<string, LegalDoc> = {
  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    updated: UPDATED,
    intro: `These Terms & Conditions govern your use of the Samachify website (samachify.in) and the purchase of our fresh ready-to-cook meal kits. By placing an order or using this website, you agree to these terms.`,
    sections: [
      {
        heading: '1. About us',
        body: [
          `This website is operated by ${COMPANY} ("Samachify", "we", "us", "our"), a company based in Chennai, Tamil Nadu, India. Our products are FSSAI-compliant fresh ingredient meal kits.`,
        ],
      },
      {
        heading: '2. Eligibility',
        body: [
          `You must be at least 18 years old and capable of entering into a legally binding contract to place an order. By ordering, you confirm that the information you provide (name, contact number, delivery address) is accurate and complete.`,
        ],
      },
      {
        heading: '3. Products & pricing',
        body: [
          `Our products are perishable fresh food kits containing pre-cut vegetables and prepared ingredients. Product images are for representation; actual contents may vary slightly based on seasonal availability.`,
          `All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time before you place an order.`,
        ],
      },
      {
        heading: '4. Orders',
        body: [
          `An order is confirmed only after successful payment (for online payments) or order placement (for Cash on Delivery). We reserve the right to accept or decline any order, including where the delivery address is outside our serviceable area or where product is unavailable.`,
        ],
      },
      {
        heading: '5. Payments',
        body: [
          `We accept online payments (UPI, cards, netbanking) via Razorpay, and Cash on Delivery where available. Online payments are processed securely by Razorpay; we do not store your card or bank details.`,
        ],
      },
      {
        heading: '6. Delivery',
        body: [
          `Delivery is available in selected areas only. Delivery timelines and charges are described in our Shipping & Delivery Policy. As our products are perishable, please ensure someone is available to receive the order.`,
        ],
      },
      {
        heading: '7. Cancellations & refunds',
        body: [
          `Cancellations and refunds are governed by our Refund & Cancellation Policy. Because our products are perishable, cancellations are only possible before the order is prepared/dispatched.`,
        ],
      },
      {
        heading: '8. Food safety & usage',
        body: [
          `Our kits are prepared hygienically and must be refrigerated on receipt and consumed by the "use by" date printed on the pack. We are not responsible for issues arising from improper storage or handling after delivery.`,
        ],
      },
      {
        heading: '9. Limitation of liability',
        body: [
          `To the extent permitted by law, our total liability for any claim relating to an order is limited to the value of that order. We are not liable for indirect or consequential losses.`,
        ],
      },
      {
        heading: '10. Governing law',
        body: [
          `These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.`,
        ],
      },
      {
        heading: '11. Contact',
        body: [
          `For any questions about these terms, contact us at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}. Registered address: ${ADDRESS}.`,
        ],
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    updated: UPDATED,
    intro: `This Privacy Policy explains what information ${COMPANY} collects when you use samachify.in, how we use it, and your rights. We are committed to protecting your privacy.`,
    sections: [
      {
        heading: '1. Information we collect',
        body: [
          `Information you provide: name, email address, phone number, and delivery address when you create an account or place an order.`,
          `Order information: the items you buy, order value, and order history.`,
          `Payment information: online payments are handled by Razorpay. We do not collect or store your card, UPI, or bank details — Razorpay processes these securely.`,
          `Technical information: basic usage data (such as pages visited) that helps us improve the website.`,
        ],
      },
      {
        heading: '2. How we use your information',
        body: [
          `To process and deliver your orders, and to contact you about your order.`,
          `To create and manage your account.`,
          `To provide customer support and respond to your queries.`,
          `To improve our products, website, and service. With your consent, to send you offers and updates (you can opt out anytime).`,
        ],
      },
      {
        heading: '3. Who we share it with',
        body: [
          `We share information only as needed to run the service — for example, with our payment provider (Razorpay) to process payments, and with delivery personnel to fulfil your order. We do not sell your personal information to third parties.`,
        ],
      },
      {
        heading: '4. Data storage & security',
        body: [
          `Your account and order data are stored securely with our infrastructure provider (Supabase). We use industry-standard measures to protect your data, including encrypted connections and access controls. Passwords are stored in hashed form and are never visible to us.`,
        ],
      },
      {
        heading: '5. Cookies',
        body: [
          `We use minimal cookies and local storage to keep you signed in and to remember your cart. These are necessary for the website to function.`,
        ],
      },
      {
        heading: '6. Your rights',
        body: [
          `You may access, correct, or request deletion of your personal data by contacting us. You can also sign out and stop using the service at any time.`,
        ],
      },
      {
        heading: '7. Contact',
        body: [
          `For privacy questions or requests, contact us at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}.`,
        ],
      },
    ],
  },

  refunds: {
    slug: 'refunds',
    title: 'Refund & Cancellation Policy',
    updated: UPDATED,
    intro: `Because Samachify sells fresh, perishable food kits, this policy explains when orders can be cancelled and how refunds work. We want you to be happy with every order.`,
    sections: [
      {
        heading: '1. Cancellations',
        body: [
          `You can cancel an order free of charge any time before it has been prepared or dispatched. Once a perishable order has been prepared or handed to delivery, it cannot be cancelled.`,
          `To cancel, contact us as soon as possible at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE} with your order ID.`,
        ],
      },
      {
        heading: '2. Damaged, spoiled, or wrong items',
        body: [
          `If your order arrives damaged, spoiled, or incorrect, please contact us within 2 hours of delivery with your order ID and a photo of the issue.`,
          `After verification, we will offer a replacement or a full/partial refund for the affected items.`,
        ],
      },
      {
        heading: '3. Returns',
        body: [
          `Due to the perishable nature of our products, we do not accept returns of food items once delivered, except in the damaged/spoiled/wrong-item cases described above.`,
        ],
      },
      {
        heading: '4. Refund method & timeline',
        body: [
          `Approved refunds for online (Razorpay) payments are credited back to your original payment method within 5–7 business days.`,
          `For Cash on Delivery orders, approved refunds are made via UPI or bank transfer to the details you provide.`,
        ],
      },
      {
        heading: '5. Failed or duplicate payments',
        body: [
          `If money is deducted but your order is not confirmed, or you are charged twice, the amount is normally auto-reversed by your bank within a few business days. If not, contact us and we will resolve it promptly.`,
        ],
      },
      {
        heading: '6. Contact',
        body: [
          `For any cancellation or refund request, contact us at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}.`,
        ],
      },
    ],
  },

  shipping: {
    slug: 'shipping',
    title: 'Shipping & Delivery Policy',
    updated: UPDATED,
    intro: `This policy explains where and how Samachify delivers its fresh meal kits, and the applicable timelines and charges.`,
    sections: [
      {
        heading: '1. Delivery areas',
        body: [
          `We currently deliver to selected areas in and around [Chennai / your serviceable cities]. At checkout, if your pincode is outside our serviceable area, we may be unable to accept the order.`,
        ],
      },
      {
        heading: '2. Delivery charges',
        body: [
          `Delivery costs ₹5 per kilometre using the road route from our Medavakkam operating office. Delivery is free for road distances below 2 km or product subtotals above ₹379. We deliver only to approved pincodes, and the exact charge is shown at checkout before you pay.`,
        ],
      },
      {
        heading: '3. Delivery timelines',
        body: [
          `As our products are fresh and perishable, orders are typically delivered within [same day / next day, as per your cut-off times]. You will be informed of the expected delivery window for your order.`,
        ],
      },
      {
        heading: '4. Receiving your order',
        body: [
          `Please ensure someone is available at the delivery address to receive the order. Refrigerate the kit immediately on receipt and use it by the "use by" date on the pack.`,
          `If delivery fails because no one is available or the address/contact details are incorrect, we may be unable to re-attempt delivery of perishable items, and the order may not be eligible for a refund.`,
        ],
      },
      {
        heading: '5. Freshness & handling',
        body: [
          `We prepare and pack orders hygienically and handle them with care to preserve freshness until they reach you. Once delivered, proper storage is the customer's responsibility.`,
        ],
      },
      {
        heading: '6. Contact',
        body: [
          `For delivery questions, contact us at ${SUPPORT_EMAIL} or ${SUPPORT_PHONE}.`,
        ],
      },
    ],
  },
}

export const legalList = [
  { slug: 'terms', title: 'Terms & Conditions' },
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'refunds', title: 'Refund & Cancellation' },
  { slug: 'shipping', title: 'Shipping & Delivery' },
]
