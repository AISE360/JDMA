// Migrated + curated content from the legacy www.jpma.org.in site.
// Used as on-site fallback AND as the seed payload for Supabase (see supabase/schema.sql).

export const siteSettings = {
  company: 'J. P. Mukherji & Associates Pvt. Ltd.',
  short: 'JPMA',
  tagline: 'Engineering Sweetness Since 1972',
  phone1: '+91 20 25397303',
  phone2: '+91 7756891500',
  fax: '(020) 25399287',
  email1: 'info@jpma.org.in',
  email2: 'marketing@jpma.org.in',
  address: "'Jyoti House', 172, Dahanukar Colony, Kothrud, Pune – 411 038, INDIA",
  facebook: 'https://www.facebook.com/profile.php?id=100086787363629',
  linkedin: 'https://www.linkedin.com/company/j-p-mukherji-associates-private-limited/',
  brochurePath: '/assets/JPMA_Brochure_2025.pdf',
  heroVideo: 'https://www.youtube.com/embed/g7SYnthaIKk?si=FtzKPmG_e7khwPId',
}

export const stats = [
  { value: 54, suffix: '', label: 'Years of practice', sub: 'est. 1972 · Pvt. Ltd. since 1974' },
  { value: 500, suffix: '+', label: 'Projects delivered', sub: 'concept to commissioning' },
  { value: 30, suffix: '+', label: 'Countries served', sub: 'across 4 continents' },
  { value: 1000, suffix: ' MW', label: 'Cogeneration advised', sub: 'bagasse, biomass & coal' },
]

export const heroSlides = [
  {
    eyebrow: "India's first true sugar multinational",
    title: 'Concept to commissioning, for sugar & allied industries.',
    copy: 'Sugar plants · refineries · cogeneration · ethanol, one accountable consultancy since 1972.',
    image: '/assets/slider-one.jpg',
    cta: 'Explore expertise',
    href: '/expertise',
  },
  {
    eyebrow: '5 decades · 500+ projects',
    title: 'Engineering sweetness since 1974.',
    copy: 'Milling, process house, automation, power & water, balanced as one system.',
    image: '/assets/slider-two.jpg',
    cta: 'Our story',
    href: '/about',
  },
  {
    eyebrow: '30+ countries and counting',
    title: 'Exported expertise the world trusts.',
    copy: 'Nigeria · Fiji · Indonesia · Cuba · Egypt · Saudi Arabia, and across India.',
    image: '/assets/slider-three.jpg',
    cta: 'See projects',
    href: '/projects',
  },
  {
    eyebrow: '60+ professionals',
    title: 'Committed to deliver innovation.',
    copy: 'BEE-certified energy auditors, process engineers, PMC specialists, in-house.',
    image: '/assets/slider-five.jpg',
    cta: 'Services',
    href: '/services',
  },
  {
    eyebrow: '500+ projects',
    title: 'Specialized in all aspects of sugarcane, sugar, cogeneration and ethanol.',
    copy: 'Sugar, cogeneration, ethanol and byproducts, from concept to commissioning.',
    image: '/assets/slider-six.jpg',
    cta: 'See projects',
    href: '/projects',
  },
]

export const businessAreas = [
  {
    slug: 'sugar',
    title: 'Sugar Plants',
    image: '/assets/business-img.jpg',
    intro: 'Raw, plantation-white & refined sugar, plus jaggery, candy, cubes, icing, brown & invert syrups.',
    points: ['Greenfield turnkey sugar & jaggery plants', 'Milling & diffuser design, process house balancing', 'Expansion, modernisation, BMRE & automation', 'Steam economy < 36% on cane · loss & downtime reduction'],
  },
  {
    slug: 'cogeneration',
    title: 'Cogeneration & Captive Power',
    image: '/assets/power-gen.jpg',
    intro: '~1000 MW of cogeneration advised worldwide, bagasse, biomass, coal & IPPs.',
    points: ['Low/medium/high-pressure steam systems', 'Bagasse & coal cogeneration, captive & DG sets', 'Electrification, automation & grid evacuation', 'Boiler/turbine PG tests, efficiency improvement'],
  },
  {
    slug: 'ethanol',
    title: 'Distillery & Ethanol',
    image: '/assets/ethonal-service.jpg',
    intro: 'Molasses, juice/syrup & grain ethanol, ENA, fuel ethanol & rectified spirit with zero-liquid discharge.',
    points: ['100–600 KLPD molasses / grain / dual-feed plants', 'B-heavy & C-heavy diversion, juice concentration', 'Bio-methanation, composting, incineration, CO₂ bottling', 'Bankable DPRs lenders actually clear'],
  },
  {
    slug: 'energy-audit',
    title: 'Energy Audit',
    image: '/assets/solar-b.jpg',
    intro: 'BEE-certified auditors with lab-grade instruments, power, flue-gas & thermal imaging.',
    points: ['Plant-wide generation-to-use audit', 'Benchmarked savings roadmap', 'Boiler, turbine & process optimisation', 'Repeatable efficiency gains'],
  },
  {
    slug: 'agriculture',
    title: 'Sugarcane Agriculture',
    image: '/assets/surgarcane-agriculture.jpg',
    intro: 'From soil survey to cane yard, yield, logistics & mechanisation engineered together.',
    points: ['Topography, soil & hydrology studies', 'Irrigation, agronomy & variety selection', 'Harvest mechanisation & cane transport', 'Training & implementation master plan'],
  },
  {
    slug: 'renewables',
    title: 'Renewables & Special Studies',
    image: '/assets/about_carousel_bg.jpg',
    intro: 'Solar TEFS (P50/P75/P90), hybrids, plus financial, environmental & valuation studies.',
    points: ['Solar & biomass-hybrid TEFS', 'Financial viability & asset valuation', 'EIA, socio-economic & market studies', 'Corrective engineering & commissioning trials'],
  },
]

export const services = [
  {
    slug: 'conceptual',
    no: '01',
    title: 'Conceptual Studies',
    image: '/assets/service-one.jpg',
    copy: 'Pre-feasibility to bankable DPR, mass, steam, water, power & financial balances lenders trust.',
    items: ['Pre-feasibility & feasibility studies', 'Detailed & bankable project reports', 'Due diligence, valuation & EIA', 'Market & financial viability studies'],
  },
  {
    slug: 'engineering',
    no: '02',
    title: 'Engineering Services',
    image: '/assets/service-engg.jpg',
    copy: 'FEED to detailed engineering, tendering, procurement assistance & vendor finalisation.',
    items: ['FEED, P&IDs, layouts & tender docs', 'Specs, BOQs & bid evaluation', 'Civil design & preferred vendors', 'Manufacturing drawing approval'],
  },
  {
    slug: 'pmc',
    no: '03',
    title: 'Project Management (PMC)',
    image: '/assets/project-manage.jpg',
    copy: 'Single accountable owner for time, cost & quality, home-office + site supervision.',
    items: ['Planning, scheduling & contract management', 'Site supervision & QA/QC', 'Bill certification & safety supervision', 'Commissioning & handover report'],
  },
  {
    slug: 'quality',
    no: '04',
    title: 'Quality Inspection',
    image: '/assets/service-engg.jpg',
    copy: 'QAP approval, stage inspections, factory acceptance tests & clearance certification.',
    items: ['QAP review & approval', 'Vendor-shop inspection visits', 'FAT witnessing & stage QC', 'Monthly status reporting'],
  },
  {
    slug: 'energy-audit-service',
    no: '05',
    title: 'Energy Audit Service',
    image: '/assets/solar-b.jpg',
    copy: 'Optimum generation from bagasse and its use in process, without touching quality or cost.',
    items: ['BEE-certified audit team', 'Power, flue-gas & thermal diagnostics', 'Customised savings solutions', 'Benchmark compliance'],
  },
  {
    slug: 'rnd',
    no: '06',
    title: 'R&D & Innovation',
    image: '/assets/r-and-d.jpg',
    copy: 'Patented in-house designs, MCU, mill couplings, fibrizers & crystallizers via Jyoti Sugar Engineering.',
    items: ['Moisture Control Unit (MCU), CEAI award', 'JPMA mill coupling & fibrizer', 'Clarifier upgrades & GRPF', 'Modern jaggery plants'],
  },
]

export const products = [
  'Moisture Control Unit (MCU), patented 2023, CEAI innovation award',
  'JPMA Mill Coupling (rope / GRPF systems)',
  'Cane Fibrizer & milling system improvements',
  'Clarifier upgradation for capacity increase',
  'Continuous juice sulphiter & sulphur burners',
  'Continuous vertical crystallizers',
  'Direct-contact juice heaters',
  'Semi-Kestner evaporators & vacuum pans with circulators',
  'Boiler retubing & upgradation',
  'Modern jaggery plant (moulds, organic, powder)',
]

export const domesticProjects = [
  { client: 'Shri Chhatrapati Shahu SSK, Kagal (Kolhapur)', scope: 'Bankable DPR for distillery expansion + PMC for refinery, cogeneration & spent-wash dryer with granulation', tag: 'Sugar · Distillery · Cogen' },
  { client: 'Balrampur Chini Mills, Gularia & Kumbhi', scope: 'PMC for modernisation & expansion of process house', tag: 'PMC · Process house' },
  { client: 'Shiraguppi Sugar Works, Kagwad (Karnataka)', scope: 'Bankable DPR, sugar plant & 400 KLPD distillery expansion', tag: 'Bankable DPR' },
  { client: 'Chadha Sugars, Gurdaspur (Punjab)', scope: 'Mill #1 roller upsize 990 → 1100 mm + trash-plate profiling', tag: 'Mills' },
  { client: 'The Andhra Sugars, Tanuku (AP)', scope: 'Technical consultancy & valuation of Sugar Plant-I', tag: 'Valuation' },
  { client: 'Rana Sugars, Rampur (UP)', scope: 'Mill settings & trash-plate profile consultancy', tag: 'Mills' },
  { client: 'Madhucon Sugar & Power, Kamma…', scope: 'Performance study at 3,500 TCD + roadmap to 4,000 TCD', tag: 'Optimisation' },
]

export const internationalProjects = [
  { client: 'Dangote (Savannah) Sugar, Nigeria', scope: 'PMC for 6,000 → 9,800 TCD expansion', tag: 'Nigeria · PMC', country: 'Nigeria' },
  { client: 'Durrah Advanced Development, Saudi Arabia', scope: 'Standalone 2,500 TPD sugar refinery', tag: 'Saudi Arabia · Refinery', country: 'Saudi Arabia' },
  { client: 'Fiji Sugar Corporation, Fiji', scope: 'Design & drawings, complete cane-carrier system', tag: 'Fiji · Cane handling', country: 'Fiji' },
  { client: 'Indonesia (multiple mills)', scope: 'Mill improvement systems, MCU, rope coupling & GRPF', tag: 'Indonesia · MCU', country: 'Indonesia' },
  { client: 'AZUIMPORT, Cuba', scope: 'PMC for 50 MW cogeneration project', tag: 'Cuba · Cogen', country: 'Cuba' },
  { client: 'EEAA / Ministry of Environment, Egypt', scope: 'Cooling-tower upgradation across Armant, Edfu, Qus, Naga Hammadi + Abu Qurqas distillery visit', tag: 'Egypt · Utilities', country: 'Egypt' },
]

export const timeline = [
  { year: '1972', title: 'Company established', note: 'Troubleshooting-first consultancy by J. P. Mukherji' },
  { year: '1974', title: 'Incorporated Pvt. Ltd.', note: 'Project management & troubleshooting practice begins' },
  { year: '1975', title: 'First international assignment', note: "India's sugar expertise goes abroad" },
  { year: '1976', title: 'Equipment for better O&M', note: 'In-house designs for operation & maintenance' },
  { year: '2008', title: 'ISO 9001 certified', note: 'Quality management system' },
  { year: '2012', title: 'Service excellence award', note: '' },
  { year: '2013', title: 'Best engineering consultant', note: '' },
  { year: '2017', title: 'CEAI excellence, project engineering', note: '' },
  { year: '2018', title: 'CEAI excellence, innovation (MCU)', note: '' },
  { year: '2020', title: 'ISO 14001 · 45001 · 50001 · SA 8000', note: 'Environment, safety, energy & social responsibility' },
]

export const team = [
  { name: 'Mr. Shirish Karandikar', role: 'Chairman & Managing Director', photo: '/assets/board/karandikar.jpg' },
  { name: 'Mr. T. S. Rao', role: 'Director', photo: '/assets/board/tsrao.jpg' },
  { name: 'Mr. D. S. Nikam', role: 'Director', photo: '/assets/board/dsnikam.jpg' },
]

export const news = [
  { date: '2025-04-01', title: 'JPMA Day, April 2025', tag: 'Culture', excerpt: 'Annual gathering of the 60+ professionals behind 500+ projects.', image: '/assets/events/8.jpg' },
  { date: '2024-12-01', title: 'Technical seminar, Indonesia (Dec 2024)', tag: 'Seminar', excerpt: 'Mill improvement, MCU & coupling systems presented to Indonesian mills.', image: '/assets/events/3.jpg' },
  { date: '2024-11-01', title: 'Technical seminar, Kenya (Nov 2024)', tag: 'Seminar', excerpt: 'Week-long programme with Kenyan sugar leadership; MD with H.E. President Ruto.', image: '/assets/events/11.jpg' },
  { date: '2023-01-01', title: 'MCU patent granted, 2023', tag: 'R&D', excerpt: 'Moisture Control Unit patent certificate issued; CEAI innovation laureate.', image: '/assets/mcu-patent-certificate.jpg' },
  { date: '2024-06-01', title: '500 KLPD grain ethanol, feasibility', tag: 'Ethanol', excerpt: 'Feasibility study for 500 KLPD bio-ethanol from grain feedstock.', image: '/assets/ethonal-service.jpg' },
  { date: '2024-06-01', title: 'Dual-feed distillery wave', tag: 'Ethanol', excerpt: '100–400 KLPD molasses/grain dual-feed DPRs, conversions & technical audits.', image: '/assets/business-img.jpg' },
]

export const gallery = [
  '/assets/events/1.jpg', '/assets/events/2.jpg', '/assets/events/3.jpg',
  '/assets/events/4.jpg', '/assets/events/5.jpg', '/assets/events/6.jpg',
  '/assets/events/7.jpg', '/assets/events/8.jpg', '/assets/events/9.jpg',
  '/assets/events/10.jpg', '/assets/events/11.jpg', '/assets/events/12.jpg',
  '/assets/events/13.jpg', '/assets/events/14.jpg', '/assets/events/15.jpg',
  '/assets/events/16.jpg', '/assets/events/17.jpg', '/assets/events/18.jpg',
  '/assets/events/19.jpg', '/assets/events/20.jpg', '/assets/events/21.jpg',
]

export const values = [
  'Customer orientation', 'Sustainability', 'Ethical behaviour',
  'Social responsibility', 'Care for environment', 'Equal opportunity', 'Cooperation & loyalty',
]

export const certs = [
  'ISO 9001:2015, Quality Management',
  'ISO 50001:2018, Energy Management',
  'ISO 45001:2018, Occupational Health & Safety',
  'ISO 14001:2015, Environmental Management',
  'SA 8000, Social Responsibility',
]
