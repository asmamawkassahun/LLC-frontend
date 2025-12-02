// import { useState } from 'react';
// import StepHeader from './StepHeader';

// interface ServicesData {
//     ein: boolean;
//     itin: boolean;
//     website: boolean;
//     domainHosting: boolean;
//     businessEmail: boolean;
// }

// interface Step5ServicesProps {

//     companyName: string; services: { ein: boolean; itin: boolean; website: boolean; domainHosting: boolean; businessEmail: boolean; }; onServicesChange: (services: ServicesData) => void;
// }

// const Step5Services = ({ companyName, onServicesChange }: Step5ServicesProps) => {
//     // const [services, setServices] = useState<ServicesData[]>(servicesData);

//     const servicesData = [
//         {
//             name: 'EIN',
//             description: 'Get your EIN in just 2-5 business days as a non-US resident. Read more',
//             price: '$60 Total amount',
//             priceNumber: 60,
//             fullDescription: [
//                 { type: 'paragraph', text: 'An EIN (Employer Identification Number) is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your EIN can often be a slow process — most providers take 10 to 30 days.' },
//             ],
//         },
//         {
//             name: 'ITIN',
//             description: 'Get your ITIN in just 2-5 business days as a non-US resident. Read more',
//             price: '$297 Total amount',
//             priceNumber: 297,
//             fullDescription: [
//                 { type: 'paragraph', text: 'An ITIN (Individual Taxpayer Identification Number) is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your ITIN can often be a slow process — most providers take 10 to 30 days.' },
//             ],
//         },
//         {
//             name: 'Website',
//             description: 'Get your website in just 2-5 business days as a non-US resident. Read more',
//             price: '$297 Total amount',
//             priceNumber: 297,
//             fullDescription: [
//                 { type: 'paragraph', text: 'A website is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your website can often be a slow process — most providers take 10 to 30 days.' },
//             ],
//         },
//         {
//             name: 'Domain Hosting',
//             description: 'Get your domain hosting in just 2-5 business days as a non-US resident. Read more',
//             price: '$297 Total amount',
//             priceNumber: 297,
//             fullDescription: [
//                 { type: 'paragraph', text: 'A domain hosting is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your domain hosting can often be a slow process — most providers take 10 to 30 days.' },
//             ],
//         },
//         {
//             name: 'Business Email',
//             description: 'Get your business email in just 2-5 business days as a non-US resident. Read more',
//             price: '$297 Total amount',
//             priceNumber: 297,
//             fullDescription: [
//                 { type: 'paragraph', text: 'A business email is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your business email can often be a slow process — most providers take 10 to 30 days.' },
//             ],
//         },
//     ]


//     const handleServiceToggle = (serviceKey: keyof ServicesData) => {
//         const updated = {
//             ...servicesData,
//             [serviceKey]: !servicesData[serviceKey],
//         };
//         onServicesChange(updated);
//     };



//     return (
//         <div className="max-w-sm lg:max-w-2xl mx-auto px-4 md:px-0 pb-6 md:pb-8 space-y-24">
//             <div className="flex flex-col gap-24">
//                 <StepHeader
//                     icon="https://cdn-icons-png.flaticon.com/512/5474/5474438.png"
//                     title="Services"
//                     subtitle="Select the services you want for your company"
//                 />

//                 <div className="space-y-6">
//                     {servicesData.map((service) => (
//                         <div key={service.name}>
//                             <div>
//                                 <input type="checkbox" checked={service.selected} onChange={() => handleServiceToggle(service.name)} />
//                             </div>
//                             <div>
//                                 <div className="flex items-center gap-2">
//                                     <h3 className="text-lg font-medium">{service.name}</h3>
//                                 </div>
//                                 <p className="text-muted-foreground">{service.description}</p>
//                                 <p className="text-muted-foreground">{service.price}</p>
//                             </div>

//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Step5Services;


import StepHeader from './StepHeader';

interface ServicesData {
    ein: boolean;
    itin: boolean;
    website: boolean;
    domainHosting: boolean;
    businessEmail: boolean;
}

interface ServiceItem {
    name: string;
    key: keyof ServicesData;
    description: string;
    price: string;
    priceNumber: number;
    fullDescription: Array<{ type: string; text: string }>;
}

interface Step5ServicesProps {
    services: ServicesData;
    onServicesChange: (services: ServicesData) => void;
}

const Step5Services = ({  services, onServicesChange }: Step5ServicesProps) => {
    const servicesData: ServiceItem[] = [
        {
            name: 'EIN',
            key: 'ein',
            description: 'Get your EIN in just 2-5 business days as a non-US resident. Read more',
            price: '$60 Total amount',
            priceNumber: 60,
            fullDescription: [
                { type: 'paragraph', text: 'An EIN (Employer Identification Number) is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your EIN can often be a slow process — most providers take 10 to 30 days.' },
            ],
        },
        {
            name: 'ITIN',
            key: 'itin',
            description: 'Get your ITIN in just 2-5 business days as a non-US resident. Read more',
            price: '$297 Total amount',
            priceNumber: 297,
            fullDescription: [
                { type: 'paragraph', text: 'An ITIN (Individual Taxpayer Identification Number) is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your ITIN can often be a slow process — most providers take 10 to 30 days.' },
            ],
        },
        {
            name: 'Website',
            key: 'website',
            description: 'Get your website in just 2-5 business days as a non-US resident. Read more',
            price: '$297 Total amount',
            priceNumber: 297,
            fullDescription: [
                { type: 'paragraph', text: 'A website is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your website can often be a slow process — most providers take 10 to 30 days.' },
            ],
        },
        {
            name: 'Domain Hosting',
            key: 'domainHosting',
            description: 'Get your domain hosting in just 2-5 business days as a non-US resident. Read more',
            price: '$297 Total amount',
            priceNumber: 297,
            fullDescription: [
                { type: 'paragraph', text: 'A domain hosting is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your domain hosting can often be a slow process — most providers take 10 to 30 days.' },
            ],
        },
        {
            name: 'Business Email',
            key: 'businessEmail',
            description: 'Get your business email in just 2-5 business days as a non-US resident. Read more',
            price: '$297 Total amount',
            priceNumber: 297,
            fullDescription: [
                { type: 'paragraph', text: 'A business email is required for opening a US business bank account, applying for Stripe or PayPal, filing taxes, and more. If you\'re a non-US resident, getting your business email can often be a slow process — most providers take 10 to 30 days.' },
            ],
        },
    ];

    const handleServiceToggle = (serviceKey: keyof ServicesData, serviceName: string, serviceFee: number) => {
        const updated = {
            ...services,
            [serviceKey]: !services[serviceKey],
        };
        
        // Log the service name, status, and fee when toggled
        console.log('Service toggled:', {
            name: serviceName,
            selected: updated[serviceKey],
            fee: serviceFee,
        });
        
        onServicesChange(updated);
    };



    return (
        <div className="max-w-sm lg:max-w-2xl mx-auto px-4 md:px-0 pb-6 md:pb-8 space-y-24">
            <div className="flex flex-col gap-24">
                <StepHeader
                    icon="https://cdn-icons-png.flaticon.com/512/5474/5474438.png"
                    title="Services"
                    subtitle="Select the services you want for your company"
                />

                <div className="space-y-6">
                    {servicesData.map((service) => (
                        <div key={service.key} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-purple transition-colors">
                            <div className="shrink-0 pt-1">
                                <input 
                                    type="checkbox" 
                                    checked={services[service.key]} 
                                    onChange={() => handleServiceToggle(service.key, service.name, service.priceNumber)}
                                    className="w-5 h-5 text-purple border-gray-300 rounded focus:ring-purple cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-medium text-foreground">{service.name}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                                <p className="text-sm font-semibold text-foreground">{service.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step5Services;

