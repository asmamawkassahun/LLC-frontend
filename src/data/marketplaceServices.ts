export type DescriptionItem = 
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'bullets'; items: string[] };

export interface ServiceCard {
    title: string;
    description: string;
    price: string;
    fullDescription: DescriptionItem[];
    requirements: string[];
    priceNumber: number;
}

export const services: ServiceCard[] = [
    {
        title: "ITIN",
        description: "ITIN allows access to more US banks, build credit history, and support your U.S. VISA. Read more",
        price: "$297 Total amount",
        priceNumber: 297,
        fullDescription: [
            { 
                type: 'paragraph', 
                text: '**Get your ITIN** (Individual Taxpayer Identification Number) to unlock the full potential of your US business and financial journey. As a non-US resident, having an ITIN gives you access to more US banks, helps you start building a US credit score, and can even support your US visa application.' 
            },
            { 
                type: 'paragraph', 
                text: 'Whether you\'re a business owner, freelancer, or investor, the ITIN is often a key requirement for receiving payments, opening business bank accounts, and staying compliant with US tax regulations.' 
            },
            { 
                type: 'paragraph', 
                text: 'At Privatily, we handle everything for you — from preparing your paperwork to filing and submitting it directly to the IRS — all within **48 hours**. After submission, the **IRS takes 8 to 14 weeks** to process and issue the ITIN. While their timeline is out of our control, **we guarantee the fastest possible processing time on our side**, and if the IRS doesn\'t issue your ITIN, **you\'ll receive a full refund**.' 
            },
            { 
                type: 'paragraph', 
                text: 'With Privatily, you\'re backed by experience, speed, and a results-driven process from start to finish.' 
            },
            { 
                type: 'paragraph', 
                text: 'Note: Due to U.S. government sanctions and restrictions, the following countries are unfortunately ineligible to apply for an ITIN: **Burundi, the Central African Republic, the Republic of Congo, the Democratic Republic of the Congo, Iran, Iraq, North Korea, Liberia, Somalia, South Sudan, Sudan, Yemen,** and **Zimbabwe.**'
            }
        ],
        requirements: [
            'Valid passport or national ID',
            'Completed W-7 form',
            'Supporting documentation'
        ]
    },
    {
        title: "Logo Design",
        description: "Get 3 original, custom-made logos tailored to your business style and preferences — 100% unique. Read more",
        price: "$50 Total amount",
        priceNumber: 50,
        fullDescription: [
            { 
                type: 'paragraph', 
                text: 'Looking for a brand identity that truly reflects your business? With this service, you\'ll receive 3 completely original logo designs, created from scratch based on your preferences, business niche, and brand personality.' 
            },
            { 
                type: 'paragraph', 
                text: 'Whether you want something modern, minimal, bold, or playful — our designers take the time to understand your vision and translate it into 3 unique logo options. You\'ll get high-resolution versions of each design, suitable for websites, social media, and printing.' 
            },
            { 
                type: 'paragraph', 
                text: 'This package is perfect if you\'re launching a new company, rebranding, or simply want options to choose from. The logos are not from templates or stock graphics — every design is crafted with care, creativity, and attention to detail.' 
            },
            { 
                type: 'paragraph', 
                text: 'Let your brand stand out from day one with logos that make a lasting impression.' 
            }
        ],
        requirements: [
            'Brief description of your business',
            'Preferred colors or style (if any)',
            'Inspiration or references (optional)'
        ]
    },
    {
        title: "EIN",
        description: "Get your EIN in just 2-5 business days as a non-US resident. Read more",
        price: "$60 Total amount",
        priceNumber: 60,
        fullDescription: [
            { 
                type: 'paragraph', 
                text: 'An EIN (Employer Identification Number) is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your EIN can often be a slow process — most providers take 10 to 30 days.' 
            },
            { 
                type: 'paragraph', 
                text: 'At Privatily, we\'ve optimized the process to deliver your EIN in just 2 to 5 business days, making us one of the fastest options available for non-residents. No delays, no confusing forms — just fast and reliable service.' 
            },
            { 
                type: 'paragraph', 
                text: 'We handle the entire application for you and keep you updated at every step. If you formed your company through us, you probably don\'t need to buy this since all our US packages already comes with EIN included for free.' 
            },
            { 
                type: 'paragraph', 
                text: 'Save time, avoid frustration, and get your EIN the smart way.' 
            }
        ],
        requirements: [
            'Valid passport or national ID',
            'Business information',
            'Contact details'
        ]
    },
    {
        title: "UK Proof of Address",
        description: "Obtain a UK proof of address accepted by Stripe and UK online banking services. Read more",
        price: "$129/y",
        priceNumber: 129,
        fullDescription: [
            { 
                type: 'paragraph', 
                text: 'Need official proof of a UK business address for Stripe, banking, or verifications? Our **UK Commercial Lease Agreement** provides a legally signed lease between your company and a UK business center in Manchester — valid for **1 full year**.' 
            },
            { 
                type: 'paragraph', 
                text: 'This is offered as a **yearly subscription**, and you\'re free to **cancel anytime** to avoid renewal. However, the **initial payment is non-refundable once the signed lease is delivered**, as it includes preparation and confirmation from the landlord.' 
            },
            { 
                type: 'heading', 
                text: 'The lease is:' 
            },
            { 
                type: 'bullets', 
                items: [
                    'Accepted by **UK banks, Stripe**, and payment processors',
                    'Useful for **HMRC or other regulatory verifications**',
                    'Ideal for showing a professional business presence without needing a physical office'
                ]
            },
            { 
                type: 'paragraph', 
                text: 'The agreement includes your company\'s name, the landlord\'s signature, and the official business center address — delivered within **2–3 business days** of receiving your details.' 
            },
            { 
                type: 'paragraph', 
                text: 'No hidden fees, no renewals unless you choose to continue. Simple and professional.' 
            }
        ],
        requirements: [
            'UK Company Name',
            'Company Number',
        ]
    }
];

