export interface ServiceAddOn {
  name: string;
  usd: string;
  inr: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface BlackMarketService {
  id: string;
  title: string;
  description: string;
  startingPriceUsd: string;
  startingPriceInr: string;
  includes: string[];
  addOns: ServiceAddOn[];
  process: string[];
  deliveryTime: string;
  faq: ServiceFAQ[];
  terms: string[];
}

export const BLACK_MARKET_SERVICES: BlackMarketService[] = [
  {
    id: "thumbnail-design",
    title: "Thumbnail Design",
    description: "Custom thumbnails designed with a focus on click-through rate, composition, typography, and strong visual storytelling.",
    startingPriceUsd: "$20 – $45",
    startingPriceInr: "₹1,500 – ₹3,500",
    includes: [
      "1 Custom Thumbnail",
      "High Resolution Export",
      "JPG/PNG Delivery",
      "3 Free Revisions",
      "Commercial Usage Rights"
    ],
    addOns: [
      { name: "Extra Revision", usd: "$5", inr: "₹400" },
      { name: "PSD/Source File", usd: "$30", inr: "₹2,500" },
      { name: "A/B Testing Version", usd: "$15", inr: "₹800" },
      { name: "Express Delivery (24hr)", usd: "$15", inr: "₹1,000" }
    ],
    process: [
      "Understanding the Brief",
      "Moodboard & Creative Direction",
      "Initial Design Concept",
      "Revisions & Feedback",
      "Final Delivery"
    ],
    deliveryTime: "1–3 Business Days",
    faq: [
      {
        question: "Do you provide source files?",
        answer: "Yes, source files can be added as an extra add-on."
      },
      {
        question: "Can I request multiple concepts?",
        answer: "Yes, additional concepts are available at extra cost."
      },
      {
        question: "Do you use AI?",
        answer: "AI-assisted tools may be used during ideation or asset generation when required."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Commercial rights included unless stated otherwise"
    ]
  },
  {
    id: "poster-design",
    title: "Poster Design",
    description: "Cinematic and visually striking poster designs focused on storytelling, typography, and premium composition.",
    startingPriceUsd: "$25 – $100",
    startingPriceInr: "₹2,000 – ₹8,500",
    includes: [
      "Custom Poster Design",
      "High Resolution Export",
      "Print Ready Files",
      "3 Free Revisions",
      "Commercial Usage Rights"
    ],
    addOns: [
      { name: "Extra Revision", usd: "$7", inr: "₹500" },
      { name: "PSD/Source File", usd: "$50", inr: "₹4,000" },
      { name: "Alternate Version", usd: "$20", inr: "₹1,500" }
    ],
    process: [
      "Understanding the Brief",
      "Moodboard & Creative Direction",
      "Initial Design Concept",
      "Revisions & Feedback",
      "Final Delivery"
    ],
    deliveryTime: "2–5 Business Days",
    faq: [
      {
        question: "Do you provide print-ready files?",
        answer: "Yes, print-ready exports can be provided when required."
      },
      {
        question: "Can I request multiple versions?",
        answer: "Yes, alternate concepts and variations are available at additional cost."
      },
      {
        question: "Do you provide multiple poster styles?",
        answer: "Yes, different visual styles and alternate concepts can be created based on your project requirements."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Commercial rights included unless stated otherwise"
    ]
  },
  {
    id: "carousel-design",
    title: "Carousel Design",
    description: "Modern carousel designs built for storytelling, engagement, and strong visual communication across social platforms.",
    startingPriceUsd: "$20 – $120",
    startingPriceInr: "₹1,700 – ₹10,000",
    includes: [
      "Up to 5 Slides",
      "Structured Visual Layout",
      "Social Media Optimized",
      "3 Free Revisions",
      "Commercial Usage Rights"
    ],
    addOns: [
      { name: "Additional Slide", usd: "$10", inr: "₹700" },
      { name: "Source File", usd: "$50", inr: "₹4,000" },
      { name: "Content Assistance", usd: "$25", inr: "₹2,000" },
      { name: "Multi-Platform Resizing", usd: "$20", inr: "₹1,500" }
    ],
    process: [
      "Understanding the Brief",
      "Content & Structure Planning",
      "Initial Design Concept",
      "Revisions & Feedback",
      "Final Delivery"
    ],
    deliveryTime: "2–5 Business Days",
    faq: [
      {
        question: "Do you provide content writing?",
        answer: "Basic content assistance is available as an add-on."
      },
      {
        question: "Can you create interactive or swipe-focused carousel layouts?",
        answer: "Yes, carousel designs are structured to maximize engagement, readability, and smooth storytelling across slides."
      },
      {
        question: "Do you resize for other platforms?",
        answer: "Yes, platform resize packs are available."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Commercial rights included unless stated otherwise"
    ]
  },
  {
    id: "logo-design",
    title: "Logo Design",
    description: "Strategic and modern logo identities designed with a focus on recognition, scalability, and visual impact.",
    startingPriceUsd: "$60 – $250",
    startingPriceInr: "₹5,000 – ₹21,000",
    includes: [
      "Custom Logo Concepts",
      "SVG, PNG & Transparent File Exports",
      "Color Variations & Black/White Versions",
      "High Resolution Logo Files",
      "3 Free Revisions"
    ],
    addOns: [
      { name: "Brand Guidelines", usd: "$70", inr: "₹5,000" },
      { name: "Source File Package", usd: "$50", inr: "₹5,000" },
      { name: "Social Media Brand Kit", usd: "$40", inr: "₹3,000" },
      { name: "Full Brand Identity", usd: "Custom Pricing", inr: "Custom Pricing" },
      { name: "Stationery Mockups", usd: "$25", inr: "₹2,000" }
    ],
    process: [
      "Brand Discovery",
      "Research & Creative Direction",
      "Concept Development",
      "Revisions & Refinement",
      "Final Delivery"
    ],
    deliveryTime: "3–7 Business Days",
    faq: [
      {
        question: "Will I get editable files?",
        answer: "Yes, editable source files are available as an add-on."
      },
      {
        question: "How many concepts are included?",
        answer: "Initial concepts depend on project scope and package."
      },
      {
        question: "Do you provide full branding?",
        answer: "Yes, full brand identity systems are available."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Trademark registration not included"
    ]
  },
  {
    id: "album-art-design",
    title: "Album Art Design",
    description: "Creative album and single cover artwork designed with strong visual storytelling and modern music-industry aesthetics.",
    startingPriceUsd: "$50 – $150",
    startingPriceInr: "₹4,200 – ₹12,500",
    includes: [
      "Custom Cover Artwork",
      "Streaming Platform Optimized",
      "High Resolution Export",
      "3 Free Revisions",
      "Commercial Usage Rights"
    ],
    addOns: [
      { name: "Source File", usd: "$45", inr: "₹3,500" },
      { name: "Alternate Version", usd: "$20", inr: "Starting at ₹1,500" }, // Note: starting price mapped as string
      { name: "Social Promo Assets", usd: "$25", inr: "₹2,000" }
    ],
    process: [
      "Understanding the Music & Vision",
      "Moodboard & Art Direction",
      "Initial Design Concept",
      "Revisions & Refinement",
      "Final Delivery"
    ],
    deliveryTime: "2–5 Business Days",
    faq: [
      {
        question: "Is the artwork platform ready?",
        answer: "Yes, files are optimized for Spotify, Apple Music, SoundCloud, and more."
      },
      {
        question: "Are alternate versions included?",
        answer: "Alternate cover variations are available as an add-on based on your requirements."
      },
      {
        question: "Do you create visualizers?",
        answer: "Yes, I can create AI visualizers and motion visualizers as custom projects based on the client’s requirements."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Commercial rights included unless stated otherwise"
    ]
  },
  {
    id: "pitch-deck-design",
    title: "Pitch Deck Design",
    description: "Professional pitch deck presentations designed for startups, agencies, and brands with a focus on clarity and visual storytelling.",
    startingPriceUsd: "$120 – $400",
    startingPriceInr: "₹8,000 – ₹30,000",
    includes: [
      "Up to 10 Slides",
      "Presentation Design",
      "Infographics & Layouts",
      "PDF/PPT Export",
      "3 Free Revisions"
    ],
    addOns: [
      { name: "Additional Slide", usd: "$12", inr: "₹800" },
      { name: "Editable Source File", usd: "$70", inr: "₹5,000" },
      { name: "Content Structuring", usd: "$40", inr: "₹3,000" },
      { name: "Advanced Infographics", usd: "$35", inr: "₹2,500" },
      { name: "Express Delivery", usd: "Custom Pricing", inr: "Custom Pricing" }
    ],
    process: [
      "Understanding the Presentation Goal",
      "Structuring & Visual Planning",
      "Initial Design Concept",
      "Revisions & Feedback",
      "Final Delivery"
    ],
    deliveryTime: "3–7 Business Days",
    faq: [
      {
        question: "Do you write pitch deck content?",
        answer: "Content structuring assistance is available as an add-on."
      },
      {
        question: "Will the deck be editable?",
        answer: "Yes, editable PPT/source delivery is available."
      },
      {
        question: "Do you provide investor-style decks?",
        answer: "Yes, startup and investor-focused decks are supported."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Commercial rights included unless stated otherwise"
    ]
  },
  {
    id: "brand-identity-design",
    title: "Brand Identity Design",
    description: "Complete visual identity systems designed for brands that want a strong, memorable, and premium visual presence.",
    startingPriceUsd: "$180 – $600",
    startingPriceInr: "₹12,000 – ₹40,000",
    includes: [
      "Logo Design",
      "Color Palette",
      "Typography System",
      "Brand Assets",
      "Basic Brand Guidelines",
      "3 Free Revisions"
    ],
    addOns: [
      { name: "Full Brand Guidelines", usd: "$100", inr: "₹8,000" },
      { name: "Packaging Design", usd: "Custom Pricing", inr: "Custom Pricing" },
      { name: "Social Media Kit", usd: "$50", inr: "₹4,000" },
      { name: "Brand Strategy Add-on", usd: "$80", inr: "₹6,000" },
      { name: "Mockup Presentation", usd: "$40", inr: "₹3,000" }
    ],
    process: [
      "Brand Discovery",
      "Strategy & Creative Direction",
      "Identity Development",
      "Revisions & Refinement",
      "Final Delivery"
    ],
    deliveryTime: "5–10 Business Days",
    faq: [
      {
        question: "Do you provide strategy?",
        answer: "Basic brand direction is included. Full strategy is available as an add-on."
      },
      {
        question: "Can I expand the identity later?",
        answer: "Yes, identity systems can scale with future requirements."
      },
      {
        question: "Is packaging included?",
        answer: "Packaging design is available separately."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Commercial rights included unless stated otherwise"
    ]
  },
  {
    id: "streetwear-clothing-design",
    title: "Streetwear Clothing Design",
    description: "Streetwear graphics and apparel designs inspired by modern fashion culture, typography, and contemporary visual aesthetics.",
    startingPriceUsd: "$35 – $220",
    startingPriceInr: "₹3,000 – ₹18,500",
    includes: [
      "Custom Clothing Graphic",
      "Print Ready Export",
      "High Resolution Files",
      "3 Free Revisions",
      "Commercial Usage Rights"
    ],
    addOns: [
      { name: "Mockup Presentation", usd: "$25", inr: "₹2,000" },
      { name: "Tech Pack", usd: "$70", inr: "₹5,000" },
      { name: "Source File", usd: "$50", inr: "₹4,000" },
      { name: "Multiple Colorways", usd: "$20", inr: "₹1,500" },
      { name: "Full Collection Design", usd: "Custom Pricing", inr: "Custom Pricing" }
    ],
    process: [
      "Understanding the Brand Direction",
      "Research & Moodboarding",
      "Concept Development",
      "Revisions & Refinement",
      "Final Delivery"
    ],
    deliveryTime: "3–7 Business Days",
    faq: [
      {
        question: "Do you provide print-ready files?",
        answer: "Yes, production-ready exports are included."
      },
      {
        question: "Can you design full collections?",
        answer: "Yes, capsule and full collection projects are available."
      },
      {
        question: "Do you create tech packs?",
        answer: "Yes, tech pack add-ons are available."
      }
    ],
    terms: [
      "50% advance payment required",
      "Remaining payment before final delivery",
      "No refunds after project approval",
      "Final files delivered after complete payment",
      "Commercial rights included unless stated otherwise"
    ]
  }
];
