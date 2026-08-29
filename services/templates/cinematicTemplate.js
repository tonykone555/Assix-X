import { extractCity, detectLanguage } from '../siteTemplate.js';
import { buildDrivingSchoolTemplate } from './drivingSchoolTemplate.js';

// Premium Multi-Niche Framework Niche Presets
export const CINEMATIC_NICHES = {
  landscaping: {
    accent: '#10b981',
    accentHover: '#059669',
    logo: 'Electrascape',
    title: 'Subscription Lawn & Estate Care',
    heroTitle: 'Your Lawn, Fully Cared For — All Year Round',
    heroSubtext: 'Subscription-based lawn care, powered by quiet, electric equipment. No emissions. No stress. Just pristine results.',
    heroCta: 'Get My Lawn Quote',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-aerial-shot-of-a-suburban-neighborhood-42835-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-man-cutting-grass-with-a-lawn-41228-large.mp4',
    servicesLabel: 'Core Services',
    servicesMutedTitle: 'A complete service menu,',
    servicesTitle: 'providing the options you need.',
    services: [
      {
        title: 'Lawn Cut & Trim',
        desc: 'Regular lawn cutting is crucial for the health and vitality of all grass types, keeping grass at an optimal height.',
        img: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Lawn Aeration & Seeding',
        desc: 'Compacted soil can harm your lawn. Aerating helps water, nutrients, and air reach the roots for a healthier lawn.',
        img: 'https://images.unsplash.com/photo-1584479898061-15742e14f50d?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Fertilizing & Garden Plan',
        desc: 'Design and installation of elegant low-maintenance gardens that match your home\'s aesthetic and ecological values.',
        img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'We Show Up in',
    bentoTitle: 'More Than Just Lawns',
    bentoImg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Trust',
        quote: '"I used to constantly check in with our old crew — now, I just glance outside and smile. The result is always flawless."',
        author: 'James Stevenson',
        role: 'Lawn Care Client',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Quality',
        quote: '"The difference was immediate. The edging, the precision, the cleanup — everything looks curated, not just cut."',
        author: 'Maria Hill',
        role: 'Estate Owner',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      },
      {
        tag: 'Quiet',
        quote: '"We didn\'t even realize they had finished until we saw the perfect lines across the yard. No fumes, no loud motors."',
        author: 'Mark Johnson',
        role: 'Homeowner',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Got Questions?',
    faqTitle: 'We\'ve Got Quiet Answers',
    faqs: [
      {
        num: '01',
        question: 'How does subscription lawn care work?',
        answer: 'Subscription lawn care means your property is automatically maintained on a set schedule without the need to call, confirm, or rebook each visit. You choose a plan, and our electric team handles everything quietly and reliably.'
      },
      {
        num: '02',
        question: 'Can I pause my service if I travel?',
        answer: 'Yes, you can pause or modify your maintenance schedule at any time with 24 hours notice directly via your client portal or by phone.'
      },
      {
        num: '03',
        question: 'Are all tools 100% quiet electric?',
        answer: 'Yes, our entire fleet utilizes commercial lithium battery equipment—delivering zero direct emissions and whisper-quiet operation.'
      }
    ],
    formTitle: 'Let\'s Talk Lawns',
    formSubtext: 'Subscription-based lawn care, powered by quiet, electric equipment. No emissions. No stress.',
    formCta: 'Schedule a Free Lawn Quote'
  },

  construction: {
    accent: '#f59e0b',
    accentHover: '#d97706',
    logo: 'ApexMasonry',
    title: 'Estate Construction & Masonry',
    heroTitle: 'WE SHAPE YOUR SPACE. Then We Build.',
    heroSubtext: 'Bespoke architectural masonry, high-end residential additions, and structural hardscaping engineered to modern standards.',
    heroCta: 'Request Structural Audit',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-installing-a-roof-tile-42521-large.mp4',
    servicesLabel: 'Structural Capabilities',
    servicesMutedTitle: 'Engineered for durability,',
    servicesTitle: 'crafted with mathematical precision.',
    services: [
      {
        title: 'Architectural Masonry & Foundations',
        desc: 'Steel-reinforced concrete pours, retaining monoliths, and structural stone walls built to withstand extreme loads.',
        img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Luxury Home Expansions',
        desc: 'Seamless structural extensions and second-story additions aligned with existing architectural lines.',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Custom Terrace & Hardscaping',
        desc: 'Imported natural stone paving, subterranean drainage systems, and outdoor living structures.',
        img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'Over 15 Years of',
    bentoTitle: 'Structural Excellence',
    bentoImg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Precision',
        quote: '"Apex delivered our foundation and retaining wall 4 days ahead of schedule. The site was immaculate every evening."',
        author: 'David Vance',
        role: 'Estate Construction',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      },
      {
        tag: 'Quality',
        quote: '"The structural engineering team solved complex slope drainage issues that three previous contractors couldn\'t fix."',
        author: 'Elena Rostova',
        role: 'Hillside Addition',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Integrity',
        quote: '"Fixed pricing with no surprise add-ons. Their site manager walked us through every phase with daily photo updates."',
        author: 'Robert Sterling',
        role: 'Masonry Build',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Clear Timelines,',
    faqTitle: 'No Construction Surprises',
    faqs: [
      {
        num: '01',
        question: 'Do you handle municipal permitting and zoning approvals?',
        answer: 'Yes, our project managers handle 100% of municipal permit applications, structural engineering sign-offs, and inspector walkthroughs.'
      },
      {
        num: '02',
        question: 'How are project quotes structured?',
        answer: 'We provide itemized guaranteed maximum price contracts after our free initial site walkthrough and soil analysis.'
      },
      {
        num: '03',
        question: 'What warranties cover structural masonry work?',
        answer: 'All concrete foundations and structural masonry include a 10-year transferable warranty.'
      }
    ],
    formTitle: 'Schedule Your Site Inspection',
    formSubtext: 'Direct consultation with our principal structural engineers and site managers.',
    formCta: 'Request Structural Estimate'
  },

  architecture: {
    accent: '#c89b67',
    accentHover: '#b08452',
    logo: 'AetherStudio',
    title: 'Spatial Architecture & Engineering',
    heroTitle: 'ARCHITECTURAL PERMANENCE. Designed for Generations.',
    heroSubtext: 'Creating monumental residential structures, urban monoliths, and minimalist interior sanctuaries with light precision.',
    heroCta: 'Explore Concept Portfolio',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-house-model-41582-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4',
    servicesLabel: 'Design Disciplines',
    servicesMutedTitle: 'Spatial harmony,',
    servicesTitle: 'tailored to modern environments.',
    services: [
      {
        title: '3D Photorealistic BIM Modeling',
        desc: 'Interactive virtual walkthroughs and daylight distribution modeling before ground is ever broken.',
        img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Residential Monolith Architecture',
        desc: 'Bespoke modern residences combining raw concrete, glass facades, and natural cedar timber.',
        img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Acoustic & Environmental Design',
        desc: 'Passive solar optimization, zero-carbon insulation envelopes, and room acoustic calibration.',
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'Monuments of',
    bentoTitle: 'Contemporary Living',
    bentoImg: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Vision',
        quote: '"Aether transformed our challenging cliffside plot into a light-filled architectural masterpiece."',
        author: 'Claire Beaumont',
        role: 'Private Villa',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Detail',
        quote: '"The sightlines and natural ventilation design eliminated the need for heavy AC 8 months out of the year."',
        author: 'Marcus Lindqvist',
        role: 'Urban Monolith',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      },
      {
        tag: 'Execution',
        quote: '"They managed the contractor coordination seamlessly, preserving every millimeter of the original architectural vision."',
        author: 'Arthur Pendelton',
        role: 'Estate Design',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Architectural Process,',
    faqTitle: 'Simplified',
    faqs: [
      {
        num: '01',
        question: 'What is included in the initial design discovery phase?',
        answer: 'We conduct full site topographic analysis, sun-path simulation, and deliver 3 distinct spatial conceptual directions.'
      },
      {
        num: '02',
        question: 'Do you manage construction administration?',
        answer: 'Yes, we oversee contractor bidding, materials selection, and conduct weekly site inspections until handover.'
      },
      {
        num: '03',
        question: 'How do you incorporate sustainable energy design?',
        answer: 'Every blueprint includes thermal dynamics, passive solar orientation, and zero-carbon building materials specification.'
      }
    ],
    formTitle: 'Commission an Architectural Study',
    formSubtext: 'Discuss your site conditions and vision with our principal architectural partners.',
    formCta: 'Request Concept Consultation'
  },

  car_rental: {
    accent: '#e60000',
    accentHover: '#cc0000',
    logo: 'VeloceExotics',
    title: 'Hypercar & Luxury Fleet Access',
    heroTitle: 'COMMAND THE ROAD. Unrestricted Hypercar Access.',
    heroSubtext: 'White-glove tarmac delivery of pristine Lamborghinis, Ferraris, McLarens, and Rolls-Royces to your residence or private jet.',
    heroCta: 'Reserve Your Hypercar',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-street-at-night-4122-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-car-steering-wheel-in-motion-41221-large.mp4',
    servicesLabel: 'Elite Fleet Selection',
    servicesMutedTitle: 'Supercars & Executive Liners,',
    servicesTitle: 'delivered pristine to your doorstep.',
    services: [
      {
        title: 'Tarmac & Hangar VIP Delivery',
        desc: 'Direct runway vehicle handoff with zero counter wait time. Step straight from your aircraft into the driver seat.',
        img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Track-Grade Supercar Fleet',
        desc: 'Pristine late-model Ferraris, McLarens, and Porsche GT models fully maintained by certified master technicians.',
        img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Chauffeur & Security Transport',
        desc: 'Armored Maybach and Cullinan escorts with advance driver protection for executive travel.',
        img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'Uncompromising Speed &',
    bentoTitle: 'White-Glove Fleet Service',
    bentoImg: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Speed',
        quote: '"The SF90 was waiting right on the jet apron when we touched down in Miami. Immaculate condition inside and out."',
        author: 'Julian Thorne',
        role: 'VIP Member',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      },
      {
        tag: 'Fleet',
        quote: '"Zero hassle with paperwork. Their concierge handles insurance verification in 5 minutes flat."',
        author: 'Sienna Mercer',
        role: 'Executive Rental',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Discretion',
        quote: '"The Cullinan chauffeur service was professional, discreet, and perfectly punctual for all weekend galas."',
        author: 'Harrison Vance',
        role: 'Private Member',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Fleet Booking,',
    faqTitle: 'Instant & Direct',
    faqs: [
      {
        num: '01',
        question: 'What are the age and driver license requirements?',
        answer: 'Drivers must be 25 years or older with a valid domestic or international driver license and full physical damage coverage.'
      },
      {
        num: '02',
        question: 'Do you offer custom multi-day delivery to private estates?',
        answer: 'Yes, we provide enclosed trailer delivery directly to private estates, resorts, and track locations.'
      },
      {
        num: '03',
        question: 'What insurance coverage is required for hypercar rentals?',
        answer: 'We accept comprehensive coverage policies or assist in setting up dedicated short-term track/exotic carrier policies.'
      }
    ],
    formTitle: 'Reserve Your Exotic Fleet Vehicle',
    formSubtext: 'Direct priority fleet booking with dedicated 24/7 concierge support.',
    formCta: 'Confirm Fleet Availability'
  },

  consulting: {
    accent: '#10b981',
    accentHover: '#059669',
    logo: 'VeritasAdvisory',
    title: 'M&A & Enterprise Scale Advisory',
    heroTitle: 'SCALE WITH AUTHORITY. Enterprise Systems & EBITDA Growth.',
    heroSubtext: 'We partner with founder-led companies to restructure sales engines, optimize capital allocation, and prepare for 8-figure exits.',
    heroCta: 'Schedule Strategy Briefing',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-41235-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4',
    servicesLabel: 'Core Advisory Practices',
    servicesMutedTitle: 'Systematized growth,',
    servicesTitle: 'engineered for predictable enterprise value.',
    services: [
      {
        title: 'M&A Exit Readiness & Valuation',
        desc: 'Comprehensive financial auditing, revenue quality cleaning, and buyer positioning to maximize exit multiples.',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Go-To-Market & Revenue Engine Rebuild',
        desc: 'Overhauling sales infrastructure, compensation design, and pipeline operations to double organic deal size.',
        img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Capital Allocation & Operating Efficiency',
        desc: 'Slashing EBITDA leakage, restructuring executive leadership teams, and introducing automated reporting systems.',
        img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'Proven Playbooks Behind',
    bentoTitle: '9-Figure Growth Stories',
    bentoImg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Valuation',
        quote: '"Veritas guided our company through our Series B buyout, increasing our pre-money valuation by $24M in 9 months."',
        author: 'Evelyn Reed',
        role: 'CEO & Founder',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Execution',
        quote: '"Unlike traditional strategy consultants who leave you with a PDF, they embedded into our sales floor and built the system."',
        author: 'Nathaniel Cole',
        role: 'Managing Director',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      },
      {
        tag: 'Scale',
        quote: '"Their EBITDA optimization unlocked $3.2M in annual net free cash flow within the first 120 days."',
        author: 'Gavin Ross',
        role: 'Chief Operating Officer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Partner Engagement,',
    faqTitle: 'Built on ROI Benchmarks',
    faqs: [
      {
        num: '01',
        question: 'What size companies do you typically advise?',
        answer: 'We work primarily with founder-led businesses generating between $3M and $50M in annual recurring revenue.'
      },
      {
        num: '02',
        question: 'How are advisory engagements structured?',
        answer: 'Engagements combine an initial 90-day sprint with performance equity or success fee alignments.'
      },
      {
        num: '03',
        question: 'What is the typical timeframe for M&A exit preparation?',
        answer: 'Our exit readiness program runs 6 to 12 months prior to entering formal market auctions to maximize enterprise value.'
      }
    ],
    formTitle: 'Request a Private Strategy Session',
    formSubtext: 'Direct confidential dialogue with a senior M&A partner.',
    formCta: 'Book Private Strategy Audit'
  },

  driving_school: {
    accent: '#3b82f6',
    accentHover: '#2563eb',
    logo: 'ApexDriving',
    title: 'Precision Driving & Motorsport Academy',
    heroTitle: 'MASTER THE WHEEL. Track-Grade Vehicle Control.',
    heroSubtext: 'Accelerated defensive road mastery, skid pan recovery, and high-speed telemetry coaching with certified instructors.',
    heroCta: 'Enroll in Fast-Track Course',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-car-steering-wheel-in-motion-41221-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-street-at-night-4122-large.mp4',
    servicesLabel: 'Instruction Tracks',
    servicesMutedTitle: 'From street confidence,',
    servicesTitle: 'to high-performance emergency control.',
    services: [
      {
        title: 'Accelerated 5-Day License Pass',
        desc: 'Intensive road time paired with mock examiner evaluations to guarantee road test success on your first attempt.',
        img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Skid Pan & Emergency Recovery',
        desc: 'Master hydroplane corrections, ABS panic braking, and high-speed obstacle avoidance on slick surfaces.',
        img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Executive Protection & Defensives',
        desc: 'Advanced vehicle dynamics training for security escorts, evasive maneuvers, and night navigation.',
        img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'Trusted Training for',
    bentoTitle: 'Over 12,000 Graduates',
    bentoImg: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Confidence',
        quote: '"Passed my exam on the very first try with zero fault points. The instructors make you completely relaxed at the wheel."',
        author: 'Sophie Laurent',
        role: 'Fast-Track Pass Student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Safety',
        quote: '"The skid pan training saved me from a serious highway spin just two weeks after completing the class."',
        author: 'Marcus Brody',
        role: 'Advanced Safety Student',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      },
      {
        tag: 'Precision',
        quote: '"The dual-control modern BMW fleet makes learning smooth and enjoyable. Best investment in road safety."',
        author: 'Daniel Craig',
        role: 'Driving Academy Graduate',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Enrollment & Testing,',
    faqTitle: 'All Questions Answered',
    faqs: [
      {
        num: '01',
        question: 'Are dual-control vehicles provided for official road tests?',
        answer: 'Yes, all students take their state exam in the exact dual-control vehicle they trained in during their sessions.'
      },
      {
        num: '02',
        question: 'What is your first-time pass rate?',
        answer: 'Our accelerated students achieve a 98.4% first-time pass rate on their official driver licensing examinations.'
      },
      {
        num: '03',
        question: 'Do you offer pickup and dropoff services for lessons?',
        answer: 'Yes, we provide complimentary door-to-door pickup and dropoff anywhere within our municipal service radius.'
      }
    ],
    formTitle: 'Schedule Your First Driving Session',
    formSubtext: 'Door-to-door pick-up and personalized instruction with master certified coaches.',
    formCta: 'Book Driving Slot'
  },

  caterer: {
    accent: '#f59e0b',
    accentHover: '#d97706',
    logo: 'AuraCatering',
    title: 'Haute Private Catering & Banquets',
    heroTitle: 'CULINARY ARTISTRY. Unforgettable Elite Banquets.',
    heroSubtext: 'Bespoke multi-course tasting menus, master sommelier wine pairings, and full white-glove butler service for private galas.',
    heroCta: 'Reserve Event Tasting',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-dish-in-a-kitchen-42847-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4',
    servicesLabel: 'Culinary Experiences',
    servicesMutedTitle: 'Michelin-caliber gastronomy,',
    servicesTitle: 'served seamlessly at your venue.',
    services: [
      {
        title: 'Private Gala & Wedding Catering',
        desc: 'Custom 5-course plated menus prepared on-site by executive chefs with artisanal organic pairings.',
        img: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Sommelier Wine & Cocktail Pairings',
        desc: 'Rare vintage wine cellaring, signature mixology bars, and crystal glassware staging.',
        img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'White-Glove Butler & Staffing',
        desc: 'Bilingual maitre d\'s, professional silver-service waitstaff, and comprehensive event cleanup.',
        img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'Crafted for Memorable',
    bentoTitle: 'Celebrations & Dinners',
    bentoImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Taste',
        quote: '"Our guests are still talking about the wagyu tenderloin and truffle risotto 3 months after our wedding."',
        author: 'Isabella Fontaine',
        role: 'Estate Wedding Bride',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Service',
        quote: '"The butler service was invisible yet flawless. Plates were cleared instantly and wine glasses were never empty."',
        author: 'Charles Montrose',
        role: 'Gala Host',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      },
      {
        tag: 'Detail',
        quote: '"They seamlessly accommodated 14 distinct guest dietary requirements without compromising the presentation."',
        author: 'Victoria Sterling',
        role: 'Corporate Event Lead',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Event Planning,',
    faqTitle: 'Simple & Transparent',
    faqs: [
      {
        num: '01',
        question: 'How far in advance should we book private catering?',
        answer: 'We recommend reserving your date 3 to 6 months in advance, though private tasting sessions can be scheduled weekly.'
      },
      {
        num: '02',
        question: 'Do you provide full event equipment and table decor?',
        answer: 'Yes, we supply custom tableware, linens, crystal glassware, and portable kitchen equipment if needed.'
      },
      {
        num: '03',
        question: 'Can you accommodate severe food allergies and special diets?',
        answer: 'Our culinary team prepares custom vegan, gluten-free, kosher, and allergy-safe options with dedicated preparation stations.'
      }
    ],
    formTitle: 'Plan Your Private Culinary Event',
    formSubtext: 'Schedule a menu consultation and private tasting session with our executive chef.',
    formCta: 'Request Event Consultation'
  },

  veneers: {
    accent: '#06b6d4',
    accentHover: '#0891b2',
    logo: 'LumiereSmile',
    title: 'Aesthetic Cosmetic Dentistry & Veneers',
    heroTitle: 'RADIANT PERFECTION. The Signature Porcelain Smile.',
    heroSubtext: 'Ultra-thin handcrafted porcelain veneers, laser whitening, and 3D digital smile design tailored to your exact facial symmetry.',
    heroCta: 'Book 3D Smile Preview',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-41584-large.mp4',
    section2Video: 'https://assets.mixkit.co/videos/preview/mixkit-decorating-and-renovating-a-room-41580-large.mp4',
    servicesLabel: 'Cosmetic Procedures',
    servicesMutedTitle: 'Facial symmetry,',
    servicesTitle: 'engineered through porcelain artistry.',
    services: [
      {
        title: '3D Digital Smile Simulation',
        desc: 'Preview your exact smile result in high-definition 3D prior to beginning any dental treatment.',
        img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Minimally Invasive Porcelain Veneers',
        desc: 'Custom handcrafted ceramic veneers designed for maximum natural translucency and lifetime durability.',
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Laser Teeth Whitening',
        desc: 'Single-session advanced laser whitening boosting brightness up to 10 shades with zero tooth sensitivity.',
        img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
      }
    ],
    bentoMutedTitle: 'Transforming Confidence,',
    bentoTitle: 'One Smile at a Time',
    bentoImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    testimonials: [
      {
        tag: 'Artistry',
        quote: '"The 3D preview was spot-on. My porcelain veneers look completely natural and feel identical to real teeth."',
        author: 'Giselle Vance',
        role: 'Veneers Patient',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
      },
      {
        tag: 'Comfort',
        quote: '"Zero pain during the entire procedure. The team was gentle, attentive, and incredibly skilled."',
        author: 'Liam O\'Connor',
        role: 'Laser Whitening Patient',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop'
      },
      {
        tag: 'Precision',
        quote: '"I got my dream smile in just two appointments. Worth every single penny!"',
        author: 'Amara Lopez',
        role: 'Smile Redesign Patient',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop'
      }
    ],
    faqLabel: 'FAQ',
    faqMutedTitle: 'Smile Design,',
    faqTitle: 'Clear & Painless',
    faqs: [
      {
        num: '01',
        question: 'How long do porcelain veneers last?',
        answer: 'With proper oral care and routine checkups, porcelain veneers typically last between 15 and 20 years.'
      },
      {
        num: '02',
        question: 'Is tooth enamel removed during the veneer procedure?',
        answer: 'We utilize zero-prep or ultra-thin micro-prep options that preserve maximum natural enamel structure.'
      },
      {
        num: '03',
        question: 'How many visits are required for a complete veneer transformation?',
        answer: 'Most custom porcelain smile redesigns require only two appointments: the initial 3D scan and the final hand-crafted porcelain bonding.'
      }
    ],
    formTitle: 'Schedule Your Cosmetic Consultation',
    formSubtext: 'Direct private briefing and 3D smile scan with our master cosmetic dentists.',
    formCta: 'Book 3D Smile Scan'
  }
};

const UI_I18N = {
  en: {
    services: 'Services',
    reviews: 'Reviews',
    faq: 'FAQ',
    contact: 'Contact',
    formName: 'Your Full Name',
    formPhone: 'Phone Number or Email',
    formCity: 'Location / Address',
    formDetails: 'Brief details regarding your request...',
    alertSent: 'Thank you! Your inquiry has been sent directly to '
  },
  fr: {
    services: 'Services',
    reviews: 'Avis',
    faq: 'FAQ',
    contact: 'Contact',
    formName: 'Votre Nom Complet',
    formPhone: 'Téléphone ou Email',
    formCity: 'Adresse / Ville',
    formDetails: 'Précisez votre demande...',
    alertSent: 'Merci ! Votre demande a été envoyée directement à ',
    footerNavigation: 'Navigation Rapide',
    footerContact: 'Contact & Coordonnées',
    footerRights: 'Tous droits réservés',
    footerLegal: 'Mentions Légales & Confidentialité'
  },
  es: {
    services: 'Servicios',
    reviews: 'Opiniones',
    faq: 'FAQ',
    contact: 'Contacto',
    formName: 'Su Nombre Completo',
    formPhone: 'Teléfono o Correo Electrónico',
    formCity: 'Ubicación / Dirección',
    formDetails: 'Detalles de su solicitud...',
    alertSent: '¡Gracias! Su consulta ha sido enviada a ',
    footerNavigation: 'Navegación Rápida',
    footerContact: 'Contacto e Información',
    footerRights: 'Todos los derechos reservados',
    footerLegal: 'Aviso Legal y Privacidad'
  },
  de: {
    services: 'Leistungen',
    reviews: 'Bewertungen',
    faq: 'FAQ',
    contact: 'Kontakt',
    formName: 'Ihr Vollständiger Name',
    formPhone: 'Telefonnummer oder E-Mail',
    formCity: 'Standort / Adresse',
    formDetails: 'Kurze Details zu Ihrer Anfrage...',
    alertSent: 'Vielen Dank! Ihre Anfrage wurde gesendet an ',
    footerNavigation: 'Schnellnavigation',
    footerContact: 'Kontakt & Details',
    footerRights: 'Alle Rechte vorbehalten',
    footerLegal: 'Impressum & Datenschutz'
  }
};

function getLocalizedConfig(baseConfig, resolvedNiche, lang) {
  if (!lang || lang === 'en') return baseConfig;

  const translations = {
    fr: {
      landscaping: {
        title: 'Entretien d\'Espaces Verts & Pelouses par Abonnement',
        heroTitle: 'Votre Jardin, Soigné Toute l\'Année — Sans Bruit',
        heroSubtext: 'Entretien paysager par abonnement avec matériel électrique silencieux. Sans émission, sans stress.',
        heroCta: 'Obtenir Mon Devis Jardin',
        servicesLabel: 'Prestations Clés',
        servicesMutedTitle: 'Un catalogue complet,',
        servicesTitle: 'adapté à toutes vos exigences.',
        bentoMutedTitle: 'Notre Savoir-Faire',
        bentoTitle: 'Au-Delà de la Simple Tonte',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Des Questions ?',
        faqTitle: 'Toutes Nos Réponses',
        formTitle: 'Parlons de Votre Jardin',
        formSubtext: 'Entretien sur mesure par abonnement avec matériel électrique silencieux.',
        formCta: 'Demander Mon Devis Gratuit'
      },
      construction: {
        title: 'Maçonnerie & Construction de Prestige',
        heroTitle: 'NOUS FAÇONNONS VOTRE ESPACE. Puis Nous Construisons.',
        heroSubtext: 'Maçonnerie architecturale sur mesure, extensions résidentielles haut de gamme et aménagements extérieurs.',
        heroCta: 'Demander un Audit Structural',
        servicesLabel: 'Compétences Structurales',
        servicesMutedTitle: 'Conçu pour durer,',
        servicesTitle: 'bâti avec précision rigoureuse.',
        bentoMutedTitle: 'Plus de 15 Ans d\'',
        bentoTitle: 'Excellence en Construction',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Calendrier Clair,',
        faqTitle: 'Aucune Surprise sur le Chantier',
        formTitle: 'Planifier une Inspection de Chantier',
        formSubtext: 'Consultation directe avec nos ingénieurs et chefs de chantier.',
        formCta: 'Demander une Estimation'
      },
      architecture: {
        title: 'Architecture Spatiale & Design d\'Intérieur',
        heroTitle: 'PERMANENCE ARCHITECTURALE. Conçue pour les Générations.',
        heroSubtext: 'Création de résidences d\'exception, structures monolithiques et sanctuaires épurés baignés de lumière.',
        heroCta: 'Découvrir nos Réalisations',
        servicesLabel: 'Disciplines de Design',
        servicesMutedTitle: 'Harmonie spatiale,',
        servicesTitle: 'sur mesure pour environnements modernes.',
        bentoMutedTitle: 'Monuments de la',
        bentoTitle: 'Vie Contemporaine',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Processus de Création,',
        faqTitle: 'Transparence Absolue',
        formTitle: 'Planifier une Consultation d\'Architecture',
        formSubtext: 'Entretien privé avec nos architectes principaux.',
        formCta: 'Réserver un Rendez-vous'
      },
      car_rental: {
        title: 'Location de Supercars & Véhicules d\'Exception',
        heroTitle: 'PERFORMANCE ET EXCLUSIVITÉ. La Flotte d\'Exception.',
        heroSubtext: 'Accès immédiat aux plus belles supercars et hypercars avec service conciergerie VIP 24/7.',
        heroCta: 'Réserver un Véhicule',
        servicesLabel: 'Services Conciergerie',
        servicesMutedTitle: 'Conduite d\'exception,',
        servicesTitle: 'livraison sur mesure à votre porte.',
        bentoMutedTitle: 'Flotte Réservée aux',
        bentoTitle: 'Membres Privilégiés',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Réservation de Flotte,',
        faqTitle: 'Directe & Instantanée',
        formTitle: 'Réserver Votre Véhicule de Prestige',
        formSubtext: 'Accès prioritaire à notre flotte avec accompagnement 24/7.',
        formCta: 'Confirmer la Disponibilité'
      },
      consulting: {
        title: 'Conseil en Fusion-Acquisition & Scalabilité',
        heroTitle: 'PILOTEZ VOTRE CROISSANCE. Accélérez Votre Valorisation.',
        heroSubtext: 'Accompagnement stratégique des dirigeants pour restructurer vos opérations et préparer votre transmission.',
        heroCta: 'Planifier une Session Stratégique',
        servicesLabel: 'Domaines d\'Intervention',
        servicesMutedTitle: 'Croissance structurée,',
        servicesTitle: 'orientée valeur d\'entreprise.',
        bentoMutedTitle: 'Méthodes Éprouvées pour',
        bentoTitle: 'Sociétés à Forte Croissance',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Accompagnement Stratégique,',
        faqTitle: 'Clarté et Rigueur',
        formTitle: 'Planifier un Diagnostic Stratégique',
        formSubtext: 'Entretien privé avec nos associés principaux.',
        formCta: 'Réserver un Entretien Privé'
      },
      driving_school: {
        title: 'École de Conduite de Précision & Sécurité',
        heroTitle: 'MAÎTRISE PARFAITE. Formation à la Conduite Réactive.',
        heroSubtext: 'Programmes intensifs de conduite sur piste, permis accélérés et perfectionnement de sécurité.',
        heroCta: 'Réserver Mon Stage',
        servicesLabel: 'Formations Pro',
        servicesMutedTitle: 'Réflexes d\'exception,',
        servicesTitle: 'enseignés par des pilotes d\'essai.',
        bentoMutedTitle: 'Plus de 2 500',
        bentoTitle: 'Pilotes Formés avec Succès',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Formations & Stages,',
        faqTitle: 'Informations Pratiques',
        formTitle: 'Réserver Votre Stage de Conduite',
        formSubtext: 'Session privée et évaluation sur piste fermée.',
        formCta: 'Confirmer Mon Inscription'
      },
      caterer: {
        title: 'Traiteur Haute Gastronomie & Réceptions',
        heroTitle: 'EXCELLENCE GOURMANDE. Événements & Gastronomie.',
        heroSubtext: 'Menus gastronomiques sur mesure préparés par nos chefs pour vos mariages, galas et réceptions privées.',
        heroCta: 'Découvrir nos Menus',
        servicesLabel: 'Expériences Culinaires',
        servicesMutedTitle: 'Gastronomie d\'exception,',
        servicesTitle: 'servie sur le lieu de votre événement.',
        bentoMutedTitle: 'Élaboré pour des',
        bentoTitle: 'Réceptions Inoubliables',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Organisation d\'Événement,',
        faqTitle: 'Simple & Transparente',
        formTitle: 'Organiser Votre Événement Privé',
        formSubtext: 'Consultation culinaire et dégustation privée avec notre chef.',
        formCta: 'Demander une Dégustation'
      },
      veneers: {
        title: 'Dentisterie Esthétique & Facettes Dentaires',
        heroTitle: 'SURIRE ÉCLATANT. Facettes en Porcelaine sur Mesure.',
        heroSubtext: 'Conception numérique 3D de votre sourire, facettes céramiques ultra-fines et blanchiment laser haute technologie.',
        heroCta: 'Réserver ma Simulation 3D',
        servicesLabel: 'Procédures Esthétiques',
        servicesMutedTitle: 'Harmonie du visage,',
        servicesTitle: 'façonnée par l\'art de la porcelaine.',
        bentoMutedTitle: 'Créateurs de',
        bentoTitle: 'Sourires Éclatants',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Transformations Dentaires,',
        faqTitle: 'Ce Qu\'il Faut Savoir',
        formTitle: 'Planifier Votre Consultation Esthétique',
        formSubtext: 'Scanner 3D et bilan personnalisé avec nos chirurgiens-dentistes.',
        formCta: 'Réserver Mon Bilan 3D'
      }
    },
    es: {
      landscaping: {
        title: 'Mantenimiento de Jardines y Césped por Suscripción',
        heroTitle: 'Su Jardín Impecable Todo el Año',
        heroSubtext: 'Mantenimiento de jardines por suscripción con equipos eléctricos silenciosos. Sin emisiones, sin estrés.',
        heroCta: 'Solicitar Presupuesto de Jardín',
        servicesLabel: 'Servicios Principales',
        servicesMutedTitle: 'Un catálogo completo,',
        servicesTitle: 'adaptado a sus necesidades.',
        bentoMutedTitle: 'Excelencia en',
        bentoTitle: 'Cada Rincón Verde',
        faqLabel: 'FAQ',
        faqMutedTitle: '¿Preguntas?',
        faqTitle: 'Respuestas Claras',
        formTitle: 'Hablemos de su Jardín',
        formSubtext: 'Atención personalizada y presupuestos sin compromiso.',
        formCta: 'Programar Presupuesto Gratuito'
      },
      construction: {
        title: 'Construcción y Albañilería de Alta Gama',
        heroTitle: 'DISEÑAMOS SU ESPACIO. Construimos con Excelencia.',
        heroSubtext: 'Albañilería arquitectónica, ampliaciones residenciales de lujo y estructuras de alta resistencia.',
        heroCta: 'Solicitar Auditoría Estructural',
        servicesLabel: 'Capacidades Estructurales',
        servicesMutedTitle: 'Diseñado para durar,',
        servicesTitle: 'construido con precisión.',
        bentoMutedTitle: 'Más de 15 Años de',
        bentoTitle: 'Excelencia Estructural',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Cronogramas Claros,',
        faqTitle: 'Sin Sorpresas en Obra',
        formTitle: 'Programar Inspección de Obra',
        formSubtext: 'Atención directa con nuestros ingenieros.',
        formCta: 'Solicitar Presupuesto Estructural'
      },
      architecture: {
        title: 'Arquitectura Espacial e Diseño de Interiores',
        heroTitle: 'PERMANENCIA ARQUITECTÓNICA. Diseñada para Generaciones.',
        heroSubtext: 'Diseño de residencias exclusivas, estructuras monolíticas y espacios minimalistas.',
        heroCta: 'Explorar Proyectos',
        servicesLabel: 'Disciplinas de Diseño',
        servicesMutedTitle: 'Armonía espacial,',
        servicesTitle: 'adaptada al entorno moderno.',
        bentoMutedTitle: 'Iconos de la',
        bentoTitle: 'Vida Contemporánea',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Proceso de Diseño,',
        faqTitle: 'Transparente y Directo',
        formTitle: 'Consultoría Arquitectónica',
        formSubtext: 'Reunión privada con nuestros arquitectos.',
        formCta: 'Solicitar Cita'
      },
      car_rental: {
        title: 'Alquiler de Superdeportivos y Flota de Lujo',
        heroTitle: 'RENDIMIENTO Y EXCLUSIVIDAD. La Flota de Sus Sueños.',
        heroSubtext: 'Acceso directo a superdeportivos y coches de gran lujo con entrega personalizada.',
        heroCta: 'Reservar Vehículo',
        servicesLabel: 'Servicios Concierge',
        servicesMutedTitle: 'Conducción de lujo,',
        servicesTitle: 'entrega directa a su puerta.',
        bentoMutedTitle: 'Flota Exclusiva para',
        bentoTitle: 'Clientes VIP',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Reserva Directa,',
        faqTitle: 'Rápida y Sencilla',
        formTitle: 'Reserva de Flota Exclusiva',
        formSubtext: 'Servicio concierge 24/7.',
        formCta: 'Verificar Disponibilidad'
      },
      consulting: {
        title: 'Consultoría M&A y Crecimiento Empresarial',
        heroTitle: 'CRECIMIENTO CON AUTORIDAD. Optimización de EBITDA.',
        heroSubtext: 'Asesoramiento para empresas en restructuración de ventas y valoración para fusiones y adquisiciones.',
        heroCta: 'Agendar Sesión Estratégica',
        servicesLabel: 'Áreas de Práctica',
        servicesMutedTitle: 'Crecimiento estructurado,',
        servicesTitle: 'para aumentar valor de empresa.',
        bentoMutedTitle: 'Estrategias de',
        bentoTitle: 'Gran Crecimiento',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Asesoría Ejecutiva,',
        faqTitle: 'Resultados Medibles',
        formTitle: 'Solicitar Diagnóstico Empresarial',
        formSubtext: 'Reunión estratégica con nuestros socios.',
        formCta: 'Confirmar Cita Privada'
      },
      driving_school: {
        title: 'Academia de Conducción de Precisión',
        heroTitle: 'CONTROL TOTAL. Cursos Avanzados de Conducción.',
        heroSubtext: 'Formación intensiva de manejo, licencias rápidas y técnicas de seguridad en pista.',
        heroCta: 'Inscribirse al Curso',
        servicesLabel: 'Cursos Profesionales',
        servicesMutedTitle: 'Técnicas avanzadas,',
        servicesTitle: 'impartidas por instructores pro.',
        bentoMutedTitle: 'Más de 2.500',
        bentoTitle: 'Pilotos Graduados',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Cursos de Manejo,',
        faqTitle: 'Información Detallada',
        formTitle: 'Reservar Curso de Conducción',
        formSubtext: 'Atención personalizada e inscripción inmediata.',
        formCta: 'Confirmar Inscripción'
      },
      caterer: {
        title: 'Catering de Alta Cocina y Banquetes',
        heroTitle: 'GASTRONOMÍA DE EXCELENCIA. Eventos Inolvidables.',
        heroSubtext: 'Menús de autor para bodas, galas empresariales y cenas privadas de alto nivel.',
        heroCta: 'Consultar Menús',
        servicesLabel: 'Experiencias Culinarias',
        servicesMutedTitle: 'Gastronomía de autor,',
        servicesTitle: 'servida en su localización.',
        bentoMutedTitle: 'Creado para',
        bentoTitle: 'Eventos Memorables',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Organización de Catering,',
        faqTitle: 'Proceso Sencillo',
        formTitle: 'Planificar Su Evento Privado',
        formSubtext: 'Consulta de menú y degustación privada.',
        formCta: 'Solicitar Degustación'
      },
      veneers: {
        title: 'Odontología Estética y Facetas de Porcelana',
        heroTitle: 'SONRISA PERFECTA. Carillas de Porcelana Artesanales.',
        heroSubtext: 'Diseño digital 3D de sonrisa, carillas de cerámica ultrafinas y blanqueamiento láser avanzado.',
        heroCta: 'Reservar Simulación 3D',
        servicesLabel: 'Procedimientos Estéticos',
        servicesMutedTitle: 'Armonía facial,',
        servicesTitle: 'a través del arte cerámico.',
        bentoMutedTitle: 'Especialistas en',
        bentoTitle: 'Diseño de Sonrisa',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Transformación Dental,',
        faqTitle: 'Preguntas Frecuentes',
        formTitle: 'Solicitar Consulta Estética',
        formSubtext: 'Escaneo digital 3D sin compromiso.',
        formCta: 'Agendar Escaneo 3D'
      }
    },
    de: {
      landscaping: {
        title: 'Rasen- & Gartenpflege im Abonnement',
        heroTitle: 'Ihr Garten, Das Ganze Jahr Perfekt Gepflegt',
        heroSubtext: 'Abonnement-Gartenpflege mit leisen, elektrischen Geräten. Keine Emissionen, kein Lärm.',
        heroCta: 'Garten-Angebot Anfordern',
        servicesLabel: 'Kernleistungen',
        servicesMutedTitle: 'Ein vollständiges Leistungsangebot,',
        servicesTitle: 'maßgeschneidert für Ihre Wünsche.',
        bentoMutedTitle: 'Mehr Als Nur',
        bentoTitle: 'Einfaches Rasenmähen',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Fragen?',
        faqTitle: 'Wir Haben Die Antworten',
        formTitle: 'Lassen Sie Uns Über Ihren Garten Sprechen',
        formSubtext: 'Kostenlose Beratung und individuelle Pflegepläne.',
        formCta: 'Kostenloses Angebot Anfordern'
      },
      construction: {
        title: 'Bau- & Maurerarbeiten für Anwesen',
        heroTitle: 'WIR GESTALTEN IHREN RAUM. Und Bauen Mit Präzision.',
        heroSubtext: 'Architektonische Mauerwerksarbeiten, luxuriöse Anbauten und tragfähige Außenstrukturen.',
        heroCta: 'Strukturaudit Anfordern',
        servicesLabel: 'Bau-Kompetenzen',
        servicesMutedTitle: 'Gebaut für die Zukunft,',
        servicesTitle: 'ausgeführt mit mathematischer Präzision.',
        bentoMutedTitle: 'Über 15 Jahre',
        bentoTitle: 'Exzellenter Baupraxis',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Klare Zeitpläne,',
        faqTitle: 'Keine Überraschungen am Bau',
        formTitle: 'Bauinspektion Vereinbaren',
        formSubtext: 'Direkte Beratung mit unseren Ingenieuren.',
        formCta: 'Anfrage Für Bauprojekt Senden'
      },
      architecture: {
        title: 'Architektur & Raumplanung',
        heroTitle: 'ARCHITEKTONISCHE PERMANENZ. Für Generationen Entworfen.',
        heroSubtext: 'Gestaltung maßgeschneiderter Wohnhäuser, monolithischer Bauwerke und lichtdurchfluteter Räume.',
        heroCta: 'Portfolio Entdecken',
        servicesLabel: 'Design-Disziplinen',
        servicesMutedTitle: 'Räumliche Harmonie,',
        servicesTitle: 'abgestimmt auf moderne Umgebungen.',
        bentoMutedTitle: 'Ikonen',
        bentoTitle: 'Zeitgenössischen Wohnens',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Designprozess,',
        faqTitle: 'Klar und Transparent',
        formTitle: 'Architekturberatung Buchen',
        formSubtext: 'Persönlicher Termin mit unseren Architekten.',
        formCta: 'Beratungstermin Vereinbaren'
      },
      car_rental: {
        title: 'Luxusauto- & Sportwagenvermietung',
        heroTitle: 'LEISTUNG & EXKLUSIVITÄT. Unsere Luxusflotte.',
        heroSubtext: 'Direkter Zugang zu exklusiven Supercars und Luxuslimousinen mit 24/7 Concierge-Service.',
        heroCta: 'Fahrzeug Buchen',
        servicesLabel: 'Concierge-Services',
        servicesMutedTitle: 'Fahrgenuss auf höchstem Niveau,',
        servicesTitle: 'direkt an Ihren Wunschort geliefert.',
        bentoMutedTitle: 'Exklusive Flotte für',
        bentoTitle: 'Anspruchsvolle Kunden',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Flottenbuchung,',
        faqTitle: 'Direkt & Unkompliziert',
        formTitle: 'Mietanfrage Für Luxusfahrzeuge',
        formSubtext: 'Prioritäts-Buchung mit Rundum-Betreuung.',
        formCta: 'Verfügbarkeit Prüfen'
      },
      consulting: {
        title: 'M&A- & Unternehmensberatung',
        heroTitle: 'SKALIERUNG MIT AUTORITÄT. EBITDA- & Unternehmenswachstum.',
        heroSubtext: 'Strategische Beratung für Unternehmensführung, Prozessoptimierung und M&A-Vorbereitung.',
        heroCta: 'Strategiegespräch Buchen',
        servicesLabel: 'Beratungsbereiche',
        servicesMutedTitle: 'Systematisches Wachstum,',
        servicesTitle: 'für nachhaltigen Unternehmenswert.',
        bentoMutedTitle: 'Bewährte Konzepte für',
        bentoTitle: 'Starkes Wachstum',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Strategieberatung,',
        faqTitle: 'Klar und Zielgerichtet',
        formTitle: 'Anfrage Für Unternehmensberatung',
        formSubtext: 'Erstgespräch mit unseren Senior-Partnern.',
        formCta: 'Termin Vereinbaren'
      },
      driving_school: {
        title: 'Fahrakademie & Präzisionstraining',
        heroTitle: 'PERFEKTE KONTROLLE. Intensiv- & Sicherheitstraining.',
        heroSubtext: 'Professionelle Fahrausbildung, Schnellkurse und Fahrsicherheitstraining auf abgesperrter Strecke.',
        heroCta: 'Kurs Buchen',
        servicesLabel: 'Fahrtrainings',
        servicesMutedTitle: 'Fahrdynamik der Spitzenklasse,',
        servicesTitle: 'geschult von Profi-Instruktoren.',
        bentoMutedTitle: 'Über 2.500',
        bentoTitle: 'Erfolgreiche Absolventen',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Fahrkurse,',
        faqTitle: 'Wichtige Informationen',
        formTitle: 'Anmeldung Zum Fahrtraining',
        formSubtext: 'Individuelle Betreuung auf dem Übungsgelände.',
        formCta: 'Platz Buchen'
      },
      caterer: {
        title: 'Exklusiver Catering- & Bankettservice',
        heroTitle: 'KULINARISCHE PERFEKTION. Für Ihre Besondere Feier.',
        heroSubtext: 'Maßgeschneiderte Gourmet-Menüs von Spitzenköchen für Hochzeiten, Galas und private Events.',
        heroCta: 'Menüangebote Entdecken',
        servicesLabel: 'Kulinarik-Erlebnisse',
        servicesMutedTitle: 'Gastronomie auf Sterneniveau,',
        servicesTitle: 'perfekt serviert an Ihrem Veranstaltungsort.',
        bentoMutedTitle: 'Kreiert für',
        bentoTitle: 'Unvergessliche Feiern',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Eventplanung,',
        faqTitle: 'Transparente Abläufe',
        formTitle: 'Ihr Privates Event Planen',
        formSubtext: 'Menüberatung und Verköstigung mit unserem Chefkoch.',
        formCta: 'Probe-Essen Buchen'
      },
      veneers: {
        title: 'Ästhetische Zahnmedizin & Veneers',
        heroTitle: 'STRAHLENDES LÄCHELN. Maßgefertigte Keramik-Veneers.',
        heroSubtext: '3D-Software-Lächeln-Simulation, hauchdünne Porzellan-Veneers und Laser-Zahnaufhellung.',
        heroCta: '3D-Smile-Preview Buchen',
        servicesLabel: 'Ästhetische Behandlungen',
        servicesMutedTitle: 'Gesichtssymmetrie,',
        servicesTitle: 'perfektioniert durch Keramik-Kunst.',
        bentoMutedTitle: 'Spezialisten für',
        bentoTitle: 'Ästhetische Zahnkorrektur',
        faqLabel: 'FAQ',
        faqMutedTitle: 'Zahnästhetik,',
        faqTitle: 'Häufige Fragen',
        formTitle: 'Termin Für Ästhetische Beratung',
        formSubtext: '3D-Scan und Beratung beim Spezialisten.',
        formCta: '3D-Scan Buchen'
      }
    }
  };

  const langSet = translations[lang] || {};
  const nicheOverride = langSet[resolvedNiche] || {};
  return { ...baseConfig, ...nicheOverride };
}

export function buildCinematicTemplate(lead, content = {}, nicheKey = 'landscaping') {
  const currentContent = content || {};
  const activeKey = (currentContent.nicheOverride || nicheKey || lead.niche || lead.sector || 'landscaping').toLowerCase();
  
  // Resolve active niche preset
  let resolvedNiche = 'landscaping';
  if (activeKey.includes('landscap') || activeKey.includes('garden') || activeKey.includes('lawn') || activeKey.includes('vert')) resolvedNiche = 'landscaping';
  else if (activeKey.includes('construct') || activeKey.includes('mason') || activeKey.includes('batiment')) resolvedNiche = 'construction';
  else if (activeKey.includes('arch')) resolvedNiche = 'architecture';
  else if (activeKey.includes('car') || activeKey.includes('rental') || activeKey.includes('auto') || activeKey.includes('hypercar')) resolvedNiche = 'car_rental';
  else if (activeKey.includes('consult') || activeKey.includes('audit') || activeKey.includes('business') || activeKey.includes('scale')) resolvedNiche = 'consulting';
  if (activeKey.includes('drive') || activeKey.includes('school') || activeKey.includes('ecole') || activeKey.includes('permis') || activeKey.includes('conduite')) resolvedNiche = 'driving_school';
  else if (activeKey.includes('cater') || activeKey.includes('trait') || activeKey.includes('restau')) resolvedNiche = 'caterer';
  else if (activeKey.includes('dent') || activeKey.includes('smile') || activeKey.includes('veneer')) resolvedNiche = 'veneers';

  const lang = detectLanguage(lead, currentContent.language);
  const baseConfig = CINEMATIC_NICHES[resolvedNiche] || CINEMATIC_NICHES.landscaping;
  const config = getLocalizedConfig(baseConfig, resolvedNiche, lang);

  const ui = UI_I18N[lang] || UI_I18N.en;

  const brandName = lead.name || lead.companyName || lead.company || lead.businessName || config.logo;
  const displayCity = lead.city || extractCity(lead) || (lang === 'fr' ? 'Secteur Métropolitain' : lang === 'es' ? 'Área Metropolitana' : lang === 'de' ? 'Metropolregion' : 'Metropolitan Area');
  
  const displayPhone = lead.phone || '01 45 67 89 10';
  const phoneHref = lead.phone ? `tel:${lead.phone}` : 'tel:0145678910';
  const displayEmail = lead.email || `contact@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'entreprise'}.fr`;
  const displayAddress = lead.address || `${displayCity}, France`;

  // Dynamic colors matching user's design system
  const accentColor = currentContent.accentColor || currentContent.hex || config.accent;
  const accentHover = currentContent.accentHover || config.accentHover;

  // Modifiable Hero Video & Section Video
  const heroVideo = currentContent.heroVideo || currentContent.videoUrl || currentContent.hero_video || config.heroVideo;
  const section2Video = currentContent.section2Video || currentContent.secondaryVideo || config.section2Video;

  // Text Overrides
  const heroTitle = currentContent.aboutTitle || currentContent.heroTitle || config.heroTitle;
  const heroSubtext = currentContent.aboutText || currentContent.heroSubtext || config.heroSubtext;
  const heroCta = currentContent.heroCta || config.heroCta;

  // Custom service mapping or default niche services
  let serviceItems = config.services;
  if (currentContent.services && Array.isArray(currentContent.services) && currentContent.services.length >= 3) {
    serviceItems = currentContent.services.map((s, idx) => ({
      title: s.title || config.services[idx]?.title || 'Premium Service',
      desc: s.description || s.desc || config.services[idx]?.desc || 'High quality service delivered to exact standards.',
      img: s.image || s.img || config.services[idx]?.img || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=800&q=80'
    }));
  }

  // FAQ Items
  let faqList = config.faqs;
  if (currentContent.faqList && Array.isArray(currentContent.faqList) && currentContent.faqList.length > 0) {
    faqList = currentContent.faqList.map((f, idx) => ({
      num: `0${idx + 1}`,
      question: f.question || f.q || 'Question',
      answer: f.answer || f.a || 'Answer'
    }));
  }

  // Testimonial Bento Items
  let testimonialsList = config.testimonials;
  if (currentContent.testimonials && Array.isArray(currentContent.testimonials) && currentContent.testimonials.length >= 3) {
    testimonialsList = currentContent.testimonials.map((t, idx) => ({
      tag: t.rating ? `★ ${t.rating}.0` : (config.testimonials[idx]?.tag || 'Review'),
      quote: `"${t.text || t.quote || ''}"`,
      author: t.name || t.author || 'Satisfied Client',
      role: t.city || displayCity || 'Verified Client',
      avatar: t.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop`
    }));
  }

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} | ${displayCity} ${config.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    /* ==========================================================================
       DESIGN SYSTEM VARIABLES
       ========================================================================== */
    :root {
      --accent-color: ${accentColor};
      --accent-hover: ${accentHover};
      --bg-light: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-radius-lg: 28px;
      --border-radius-md: 20px;
      --border-radius-pill: 9999px;
      --font-family: 'Inter', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-light);
      color: var(--text-main);
      font-family: var(--font-family);
      line-height: 1.5;
      padding: 20px;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
    }

    section {
      margin-bottom: 80px;
    }

    /* ==========================================================================
       TYPOGRAPHY SYSTEM
       ========================================================================== */
    .section-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .section-label::before {
      content: '';
      width: 8px;
      height: 8px;
      background-color: var(--accent-color);
      border-radius: 50%;
    }

    .headline-two-tone {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 32px;
    }

    .headline-two-tone span.muted {
      color: #94a3b8;
      font-weight: 400;
    }

    /* ==========================================================================
       BUTTONS & PILLS
       ========================================================================== */
    .btn-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background-color: var(--accent-color);
      color: #ffffff;
      padding: 14px 28px;
      border-radius: var(--border-radius-pill);
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn-pill:hover {
      background-color: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }

    .btn-pill .arrow-circle {
      width: 26px;
      height: 26px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }

    .icon-btn-pill {
      width: 44px;
      height: 44px;
      background-color: var(--accent-color);
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(0,0,0,0.1);
      transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
    }

    .icon-btn-pill:hover {
      transform: scale(1.08);
      background-color: var(--accent-hover);
      box-shadow: 0 6px 18px rgba(0,0,0,0.15);
    }

    /* ==========================================================================
       1. NAVIGATION HEADER (TRANSPARENT, NO SQUARE LOGO)
       ========================================================================== */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent; /* Completely transparent background */
      padding: 16px 8px;
      margin-bottom: 16px;
    }

    .logo-box {
      border: none; /* Removed square border around logo */
      padding: 0;
      font-weight: 800;
      font-size: 22px;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-links {
      display: flex;
      gap: 32px;
      list-style: none;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text-main);
      font-weight: 600;
      font-size: 15px;
      transition: color 0.2s ease;
    }

    .nav-links a:hover {
      color: var(--accent-color);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    /* ==========================================================================
       2. HERO SECTION WITH VIDEO BACKGROUND
       ========================================================================== */
    .hero-container {
      position: relative;
      height: 600px;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(0,0,0,0.06);
    }

    .hero-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 60px;
      color: white;
    }

    .hero-title {
      font-size: 52px;
      font-weight: 800;
      line-height: 1.1;
      max-width: 680px;
      margin-bottom: 16px;
      letter-spacing: -0.03em;
      text-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .hero-subtext {
      font-size: 17px;
      color: rgba(255,255,255,0.9);
      max-width: 560px;
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .hero-cta-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    /* ==========================================================================
       3. SERVICES SECTION (3-COLUMN GRID)
       ========================================================================== */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .service-card {
      position: relative;
      height: 400px;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.05);
    }

    .service-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .service-card:hover img {
      transform: scale(1.06);
    }

    .service-card .top-right-pill {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10;
    }

    .service-card-glass {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 24px;
      border-radius: var(--border-radius-md);
      color: white;
    }

    .service-card-glass h3 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .service-card-glass p {
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      line-height: 1.45;
    }

    /* ==========================================================================
       4. TESTIMONIALS (BENTO GRID)
       ========================================================================== */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .bento-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: var(--border-radius-md);
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
    }

    .bento-card.image-card {
      padding: 0;
      overflow: hidden;
      border: none;
    }

    .bento-card.image-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--border-radius-md);
    }

    .bento-card h4 {
      font-size: 18px;
      font-weight: 700;
      position: relative;
      display: inline-block;
      color: var(--text-main);
    }

    .bento-card h4::after {
      content: '';
      display: block;
      width: 28px;
      height: 3px;
      background-color: var(--accent-color);
      margin-top: 6px;
      border-radius: 2px;
    }

    .bento-quote {
      font-size: 14px;
      font-style: italic;
      color: var(--text-main);
      margin: 20px 0;
      line-height: 1.6;
    }

    .bento-author {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .bento-author img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    /* ==========================================================================
       5. FAQ ACCORDION
       ========================================================================== */
    .faq-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .faq-item {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: var(--border-radius-md);
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.25s ease;
      cursor: pointer;
    }

    .faq-item.active {
      border-left: 4px solid var(--accent-color);
      box-shadow: 0 6px 20px rgba(0,0,0,0.04);
    }

    .faq-header {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      justify-content: space-between;
    }

    .faq-number {
      color: #94a3b8;
      font-weight: 700;
      font-size: 16px;
    }

    .faq-question {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-main);
      flex-grow: 1;
      margin-left: 12px;
    }

    .faq-answer {
      margin-top: 16px;
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.65;
    }

    /* ==========================================================================
       6. CONTACT FORM & VIDEO OVERLAY (HIGH-VISIBILITY FROSTED GLASS)
       ========================================================================== */
    .form-section {
      position: relative;
      min-height: 580px;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 50px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.08);
    }

    .form-bg-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .form-overlay-dark {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.75) 100%);
      z-index: 1;
    }

    .glass-form-card {
      position: relative;
      z-index: 2;
      width: 500px;
      max-width: 100%;
      background: rgba(15, 23, 42, 0.82); /* High contrast frosted glass */
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 40px;
      border-radius: var(--border-radius-lg);
      color: white;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }

    .glass-form-card h2 {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 10px;
      color: #ffffff;
      line-height: 1.2;
    }

    .glass-form-card p {
      font-size: 14px;
      color: rgba(255,255,255,0.88);
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-input {
      width: 100%;
      padding: 14px 20px;
      background: rgba(255, 255, 255, 0.12);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      border-radius: var(--border-radius-pill);
      color: #ffffff;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .form-input:focus {
      border-color: var(--accent-color);
      background: rgba(255, 255, 255, 0.2);
    }

    .form-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    textarea.form-input {
      border-radius: var(--border-radius-md);
      height: 100px;
      resize: none;
    }

    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 900px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
      .navbar {
        flex-direction: column;
        gap: 16px;
      }
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
      }
      .hero-title {
        font-size: 36px;
      }
      .bento-grid {
        grid-template-columns: 1fr;
      }
      .faq-grid {
        grid-template-columns: 1fr;
      }
      .form-section {
        justify-content: center;
        padding: 20px;
      }
      .glass-form-card {
        width: 100%;
      }
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- 1. TRANSPARENT NAVIGATION BAR -->
    <nav class="navbar">
      <div class="logo-box">${brandName}</div>
      <ul class="nav-links">
        <li><a href="#services">${ui.services}</a></li>
        <li><a href="#testimonials">${ui.reviews}</a></li>
        <li><a href="#faq">${ui.faq}</a></li>
        <li><a href="#contact">${ui.contact}</a></li>
      </ul>
      <div class="nav-actions">
        <a href="${phoneHref}" style="text-decoration:none; color:var(--text-main); font-weight:700;">${displayPhone}</a>
        <a href="#contact" class="btn-pill">
          ${heroCta}
          <span class="arrow-circle">→</span>
        </a>
      </div>
    </nav>

    <!-- 2. HERO SECTION WITH VIDEO BACKGROUND -->
    <section>
      <div class="hero-container">
        <video class="hero-video" id="mainHeroVideo" autoplay loop muted playsinline>
          <source src="${heroVideo}" type="video/mp4">
        </video>
        <div class="hero-overlay">
          <h1 class="hero-title">${heroTitle}</h1>
          <p class="hero-subtext">${heroSubtext}</p>
          <div class="hero-cta-wrapper">
            <a href="#contact" class="btn-pill">
              ${heroCta}
              <span class="arrow-circle">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SERVICES MENU SECTION -->
    <section id="services">
      <div class="section-label">${config.servicesLabel}</div>
      <h2 class="headline-two-tone">
        <span class="muted">${config.servicesMutedTitle}</span> ${config.servicesTitle}
      </h2>
      
      <div class="services-grid">
        ${serviceItems.map(item => `
          <div class="service-card">
            <img src="${item.img}" alt="${item.title}">
            <a href="#contact" class="icon-btn-pill top-right-pill">↗</a>
            <div class="service-card-glass">
              <h3>${item.title}</h3>
              <p>${item.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. TESTIMONIALS (BENTO GRID) -->
    <section id="testimonials">
      <h2 class="headline-two-tone">
        <span class="muted">${config.bentoMutedTitle}</span> ${config.bentoTitle}
      </h2>

      <div class="bento-grid">
        <!-- Image Card -->
        <div class="bento-card image-card">
          <img src="${config.bentoImg}" alt="${brandName} Showcase">
        </div>

        ${testimonialsList.map(t => `
          <div class="bento-card">
            <h4>${t.tag}</h4>
            <p class="bento-quote">${t.quote}</p>
            <div class="bento-author">
              <img src="${t.avatar}" alt="${t.author}">
              <span>${t.author}</span> • <span>${t.role}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 5. FAQ SECTION -->
    <section id="faq">
      <div class="section-label">${config.faqLabel}</div>
      <h2 class="headline-two-tone">
        <span class="muted">${config.faqMutedTitle}</span> ${config.faqTitle}
      </h2>

      <div class="faq-grid">
        ${faqList.map((f, idx) => `
          <div class="faq-item ${idx === 0 ? 'active' : ''}">
            <div class="faq-header">
              <span class="faq-number">${f.num}</span>
              <span class="faq-question">${f.question}</span>
              <span class="icon-btn-pill faq-toggle-icon" style="width:32px; height:32px; font-size:14px;">${idx === 0 ? '↑' : '→'}</span>
            </div>
            <p class="faq-answer" style="display: ${idx === 0 ? 'block' : 'none'};">${f.answer}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 6. CONTACT FORM & VIDEO SECTION -->
    <section id="contact">
      <div class="form-section">
        <video class="form-bg-video" autoplay loop muted playsinline>
          <source src="${section2Video}" type="video/mp4">
        </video>
        <div class="form-overlay-dark"></div>
        <div class="glass-form-card">
          <h2>${config.formTitle}</h2>
          <p>${config.formSubtext}</p>
          <form onsubmit="event.preventDefault(); alert('${ui.alertSent}${brandName}.');">
            <div class="form-group">
              <input type="text" required class="form-input" placeholder="${ui.formName}">
            </div>
            <div class="form-group">
              <input type="text" required class="form-input" placeholder="${ui.formPhone}">
            </div>
            <div class="form-group">
              <input type="text" class="form-input" placeholder="${ui.formCity} (${displayCity})">
            </div>
            <div class="form-group">
              <textarea class="form-input" placeholder="${ui.formDetails}"></textarea>
            </div>
            <button type="submit" class="btn-pill" style="width: 100%; justify-content: center;">
              ${config.formCta}
              <span class="arrow-circle">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- 7. FOOTER SECTION -->
    <footer style="margin-top: 60px; padding: 50px 32px 30px; border-top: 1px solid rgba(0,0,0,0.08); background: #ffffff; border-radius: 28px; box-shadow: 0 10px 40px rgba(0,0,0,0.02);">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px;">
        <!-- Company Info -->
        <div>
          <div style="font-size: 20px; font-weight: 800; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="width: 10px; height: 10px; background: var(--accent-color); border-radius: 50%; display: inline-block;"></span>
            ${brandName}
          </div>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">
            ${config.heroSubtext || 'Prestations d\'excellence et accompagnement sur-mesure pour tous vos besoins.'}
          </p>
          <div style="font-size: 12px; font-weight: 700; color: var(--accent-color);">
            📍 ${displayCity}
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h4 style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">
            ${ui.footerNavigation || 'Navigation'}
          </h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-muted);">
            <li><a href="#services" style="color: inherit; text-decoration: none;">${ui.services}</a></li>
            <li><a href="#testimonials" style="color: inherit; text-decoration: none;">${ui.reviews}</a></li>
            <li><a href="#faq" style="color: inherit; text-decoration: none;">${ui.faq}</a></li>
            <li><a href="#contact" style="color: inherit; text-decoration: none;">${ui.contact}</a></li>
          </ul>
        </div>

        <!-- Contact details -->
        <div>
          <h4 style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">
            ${ui.footerContact || 'Contact & Informations'}
          </h4>
          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: var(--text-muted);">
            <div>📞 <a href="${phoneHref}" style="color: inherit; text-decoration: none; font-weight: 600;">${displayPhone}</a></div>
            <div>✉️ <span style="font-weight: 500;">${displayEmail}</span></div>
            <div>🏢 <span style="font-weight: 500;">${displayAddress}</span></div>
          </div>
        </div>
      </div>

      <div style="max-width: 1200px; margin: 40px auto 0; padding-top: 24px; border-top: 1px solid #f1f5f9; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; font-size: 12px; color: #94a3b8;">
        <div>
          © ${new Date().getFullYear()} ${brandName}. ${ui.footerRights || 'Tous droits réservés'}.
        </div>
        <div style="display: flex; gap: 16px;">
          <a href="#contact" style="color: inherit; text-decoration: none;">${ui.footerLegal || 'Mentions Légales'}</a>
        </div>
      </div>
    </footer>

  </div>

  <script>
    // 1. FAQ Accordion Interactivity
    document.addEventListener('DOMContentLoaded', function() {
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        item.addEventListener('click', function() {
          const answer = this.querySelector('.faq-answer');
          const toggleIcon = this.querySelector('.faq-toggle-icon');
          const isOpen = answer.style.display === 'block';

          // Close all
          faqItems.forEach(other => {
            const otherAns = other.querySelector('.faq-answer');
            const otherIcon = other.querySelector('.faq-toggle-icon');
            if (otherAns) otherAns.style.display = 'none';
            if (otherIcon) otherIcon.textContent = '→';
            other.classList.remove('active');
          });

          // Toggle clicked item
          if (!isOpen) {
            answer.style.display = 'block';
            toggleIcon.textContent = '↑';
            this.classList.add('active');
          }
        });
      });

      // 2. Autoplay Video Resilience
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        v.play().catch(err => {
          console.log('Autoplay deferred until user touch:', err);
          const playOnTouch = () => {
            v.play().catch(() => {});
            document.removeEventListener('click', playOnTouch);
            document.removeEventListener('touchstart', playOnTouch);
          };
          document.addEventListener('click', playOnTouch);
          document.addEventListener('touchstart', playOnTouch);
        });
      });
    });

    // 3. Hero Scroll Video Engine & Live Customizer Listener
    (function() {
      var v = document.getElementById('mainHeroVideo');
      var heroSection = document.querySelector('.hero-container') || document.body;
      var currentEffect = "${content.heroVideoEffect || 'scroll-scrub'}";
      var currentTiming = parseFloat("${content.heroScrollTiming || 1.5}") || 1.5;

      function handleVideoScroll() {
        if (!v) v = document.getElementById('mainHeroVideo');
        if (!v || v.style.display === 'none') return;

        var scrolled = window.scrollY || window.pageYOffset || 0;
        var heroHeight = heroSection ? heroSection.offsetHeight : (window.innerHeight || 600);
        var scrollSpan = Math.max(100, heroHeight * currentTiming);
        var scrollRatio = Math.min(1, Math.max(0, scrolled / scrollSpan));

        if (currentEffect === 'scroll-scrub') {
          try { if (!v.paused) v.pause(); } catch(e) {}
          if (v.duration && !isNaN(v.duration) && v.duration > 0) {
            var targetTime = scrollRatio * (v.duration - 0.05);
            try { v.currentTime = Math.min(v.duration - 0.05, Math.max(0, targetTime)); } catch(e) {}
          }
          v.style.transform = 'scale(' + (1 + scrollRatio * 0.15) + ')';
          v.style.filter = 'brightness(' + (1 - scrollRatio * 0.3) + ')';
        } else if (currentEffect === 'sticky-zoom') {
          try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
          v.style.transform = 'scale(' + (1 + scrollRatio * 0.45) + ')';
          v.style.filter = 'brightness(' + (1 - scrollRatio * 0.35) + ') blur(' + (scrollRatio * 6) + 'px)';
        } else if (currentEffect === 'parallax-fade') {
          try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
          v.style.transform = 'translateY(' + (scrolled * 0.35) + 'px)';
          v.style.opacity = Math.max(0.1, 1 - scrollRatio * 0.8);
        } else if (currentEffect === '3d-tilt') {
          try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
          v.style.transform = 'perspective(1000px) rotateX(' + (scrollRatio * 20) + 'deg) scale(' + (1 + scrollRatio * 0.1) + ')';
        } else {
          try { if (v.paused) v.play().catch(function(){}); } catch(e) {}
          v.style.transform = 'none';
          v.style.filter = 'none';
          v.style.opacity = '1';
        }
      }

      window.addEventListener('scroll', handleVideoScroll, { passive: true });
      if (v) {
        v.addEventListener('loadedmetadata', handleVideoScroll);
        v.addEventListener('canplay', handleVideoScroll);
      }

      window.addEventListener('message', function(event) {
        if (!event || !event.data) return;
        var d = event.data;
        
        // Image updates
        if (d.type === 'UPDATE_IMAGE' && d.url) {
          var f = d.field;
          var targetEl = document.getElementById(f) || document.querySelector('[data-site-img="' + f + '"]');
          if (targetEl && targetEl.tagName === 'IMG') {
            targetEl.src = d.url;
          }
        }
        if ((d.type === 'PINTEREST_PHOTOS' || d.type === 'UPDATE_ALL_PHOTOS') && Array.isArray(d.photos) && d.photos.length > 0) {
          d.photos.forEach(function(pUrl, idx) {
            var targetEl = document.getElementById('img_' + idx) || document.querySelector('[data-site-img="photo_' + idx + '"]');
            if (targetEl && targetEl.tagName === 'IMG') {
              targetEl.src = pUrl;
            }
          });
        }

        // Theme / Color updates
        if (d.type === 'UPDATE_THEME' || d.type === 'UPDATE_ACCENT') {
          const p = d.palette || d.color;
          const hex = (p && p.hex) ? p.hex : (typeof p === 'string' ? p : null);
          if (hex) {
            document.documentElement.style.setProperty('--accent-color', hex);
            document.documentElement.style.setProperty('--accent-hover', hex);
          }
        }

        // Video source & scroll effect updates
        if (d.type === 'UPDATE_VIDEO' || d.type === 'UPDATE_HERO_VIDEO' || d.heroVideo || d.heroVideoUrl || d.videoUrl) {
          const newUrl = d.url || d.heroVideo || d.videoUrl || d.heroVideoUrl;
          if (d.heroVideoEffect) currentEffect = d.heroVideoEffect;
          if (d.heroScrollTiming) currentTiming = parseFloat(d.heroScrollTiming) || 1.5;

          if (newUrl) {
            if (!v) v = document.getElementById('mainHeroVideo');
            if (v) {
              const srcElem = v.querySelector('source');
              if (srcElem) srcElem.src = newUrl;
              else v.src = newUrl;
              v.load();
              setTimeout(handleVideoScroll, 150);
            }
          }
        }
      });
    })();
  </script>
</body>
</html>`;
}
