// Sample realistic data for Smart Home Management System (HomeCare)

export const initialRepairs = [
  {
    id: "rep-001",
    problemName: "Kitchen Sink Pipe Leakage",
    category: "Kitchen",
    description: "Slow drip under the double-bowl kitchen sink creating moisture buildup near cabinet wood.",
    location: "Kitchen",
    priority: "High",
    reportedDate: "2026-10-02",
    dueDate: "2026-10-06",
    estimatedCost: 85,
    actualCost: 90,
    status: "Completed",
    serviceProvider: "Marcus Vance (Apex Plumbing)",
    notes: "Replaced P-trap compression seal and tightened drainage slip nut. Tested with full drain.",
    completionDate: "2026-10-05"
  },
  {
    id: "rep-002",
    problemName: "Living Room AC Coil Freezing & Low Cooling",
    category: "Electrical",
    description: "Air conditioner running continuously but temperature remains warm; frost observed on copper lines.",
    location: "Living Room",
    priority: "Urgent",
    reportedDate: "2026-10-07",
    dueDate: "2026-10-10",
    estimatedCost: 140,
    actualCost: null,
    status: "In Progress",
    serviceProvider: "Elena Rostova (CoolAir Dynamics)",
    notes: "Technician checked gas pressure. Recharging R32 refrigerant and replacing air filters.",
    completionDate: null
  },
  {
    id: "rep-003",
    problemName: "Master Bathroom Shower Mixer Jammed",
    category: "Plumbing",
    description: "Thermostatic valve cartridge stuck on lukewarm water; hard water scaling around knob.",
    location: "Bathroom",
    priority: "Medium",
    reportedDate: "2026-10-05",
    dueDate: "2026-10-12",
    estimatedCost: 65,
    actualCost: null,
    status: "Scheduled",
    serviceProvider: "David Sterling (Premier Plumbers)",
    notes: "Scheduled for technician visit on Friday morning 10:00 AM.",
    completionDate: null
  },
  {
    id: "rep-004",
    problemName: "Main Entrance Smart Lock Battery Drainage",
    category: "Doors & Windows",
    description: "Electronic lock reporting critical battery warning within 2 weeks of fresh lithium cells.",
    location: "Doors & Windows",
    priority: "High",
    reportedDate: "2026-10-08",
    dueDate: "2026-10-14",
    estimatedCost: 45,
    actualCost: null,
    status: "Reported",
    serviceProvider: "Unassigned",
    notes: "Need firmware check or latch motor resistance inspection.",
    completionDate: null
  },
  {
    id: "rep-005",
    problemName: "Garden Sprinkler Valve 2 Sticking Open",
    category: "Garden",
    description: "Zone 2 solenoid valve does not shut off automatically when timer concludes cycle.",
    location: "Garden",
    priority: "Low",
    reportedDate: "2026-09-28",
    dueDate: "2026-10-05", // overdue
    estimatedCost: 55,
    actualCost: null,
    status: "Scheduled",
    serviceProvider: "GreenThumb Landscaping",
    notes: "Requires solenoid diaphragm cleanout or replacement.",
    completionDate: null
  },
  {
    id: "rep-006",
    problemName: "Roof Terrace Gutter Debris Blockage",
    category: "Roof",
    description: "Rainwater pooling at northeast downspout outlet after heavy autumn windstorm.",
    location: "Roof",
    priority: "Medium",
    reportedDate: "2026-09-25",
    dueDate: "2026-09-30",
    estimatedCost: 75,
    actualCost: 70,
    status: "Completed",
    serviceProvider: "Peak Cleaners & Guttering",
    notes: "Cleared bird nesting and dried leaves. Installed wire mesh guard over downspout hopper.",
    completionDate: "2026-09-29"
  },
  {
    id: "rep-007",
    problemName: "Basement Breaker #4 Tripping Under Load",
    category: "Electrical",
    description: "20A circuit breaker trips when both dehumidifier and laundry dryer operate simultaneously.",
    location: "Electrical",
    priority: "Urgent",
    reportedDate: "2026-10-09",
    dueDate: "2026-10-11",
    estimatedCost: 110,
    actualCost: null,
    status: "Reported",
    serviceProvider: "Carlos Mendez (BrightWatt Electric)",
    notes: "Urgent electrical inspection requested for sub-panel balance.",
    completionDate: null
  }
];

export const initialAssets = [
  {
    id: "ast-001",
    name: "Daikin 1.5 Ton 5-Star Inverter AC",
    category: "AC",
    brand: "Daikin",
    model: "FTKM50TV16U",
    purchaseDate: "2024-04-15",
    purchasePrice: 650,
    warrantyDuration: "5 Years",
    warrantyExpiry: "2029-04-15",
    lastServiceDate: "2026-04-10",
    nextServiceDate: "2026-10-15", // due very soon
    location: "Living Room",
    condition: "Fair",
    notes: "Outdoor unit mounted on shaded terrace bracket. Service scheduled for deep coil cleaning.",
    serviceHistory: [
      { date: "2025-04-12", serviceType: "Summer tune-up", technician: "Elena Rostova", cost: 45, notes: "Condenser wash and filter hygiene rinse." },
      { date: "2025-10-20", serviceType: "General Servicing", technician: "Elena Rostova", cost: 35, notes: "Blower wheel wipe and amp draw measurement." },
      { date: "2026-04-10", serviceType: "Pre-season cleaning", technician: "Elena Rostova", cost: 50, notes: "Drain line vacuum and gas pressure verified." }
    ]
  },
  {
    id: "ast-002",
    name: "Samsung French Door 580L Refrigerator",
    category: "Refrigerator",
    brand: "Samsung",
    model: "RF57A5032S9",
    purchaseDate: "2023-08-20",
    purchasePrice: 1200,
    warrantyDuration: "3 Years",
    warrantyExpiry: "2026-08-20", // recently expired
    lastServiceDate: "2026-02-14",
    nextServiceDate: "2027-02-14",
    location: "Kitchen",
    condition: "Excellent",
    notes: "Twin Cooling Plus system. Water dispenser filter replaced annually.",
    serviceHistory: [
      { date: "2024-08-15", serviceType: "Annual Filter & Coil Wash", technician: "TechCare Samsung", cost: 60, notes: "Replaced inline carbon water filter." },
      { date: "2026-02-14", serviceType: "Routine Check", technician: "TechCare Samsung", cost: 40, notes: "Door gaskets lubricated with food-grade silicone." }
    ]
  },
  {
    id: "ast-003",
    name: "Bosch Series 6 8kg Front Load Washer",
    category: "Washing Machine",
    brand: "Bosch",
    model: "WAT28461IN",
    purchaseDate: "2023-11-10",
    purchasePrice: 780,
    warrantyDuration: "3 Years",
    warrantyExpiry: "2026-11-10", // expiring soon!
    lastServiceDate: "2026-05-02",
    nextServiceDate: "2026-11-02",
    location: "Utility Room",
    condition: "Good",
    notes: "EcoSilence Drive. Descaling cycle performed every 30 washes.",
    serviceHistory: [
      { date: "2024-11-05", serviceType: "Descaling and Inlet Strainer Cleaning", technician: "Bosch Authorized", cost: 30, notes: "Inspected suspension struts." },
      { date: "2026-05-02", serviceType: "Drum Deep Clean", technician: "Bosch Authorized", cost: 35, notes: "Cleaned drain pump coin trap." }
    ]
  },
  {
    id: "ast-004",
    name: "Sony Bravia XR 65-Inch 4K OLED TV",
    category: "TV",
    brand: "Sony",
    model: "XR-65A80K",
    purchaseDate: "2024-12-15",
    purchasePrice: 1850,
    warrantyDuration: "2 Years",
    warrantyExpiry: "2026-12-15",
    lastServiceDate: "2025-12-10",
    nextServiceDate: "2026-12-10",
    location: "Home Theater / Living Room",
    condition: "Excellent",
    notes: "Connected through voltage surge suppressor power strip.",
    serviceHistory: [
      { date: "2025-12-10", serviceType: "Calibration and firmware patch", technician: "Sony Pro Services", cost: 0, notes: "Colorimeter calibrated and panel pixel refresh ran." }
    ]
  },
  {
    id: "ast-005",
    name: "Kent Grand Plus RO + UV Water Purifier",
    category: "Water Purifier",
    brand: "Kent",
    model: "Grand+ 11099",
    purchaseDate: "2024-01-10",
    purchasePrice: 240,
    warrantyDuration: "1 Year",
    warrantyExpiry: "2025-01-10", // expired
    lastServiceDate: "2026-07-15",
    nextServiceDate: "2026-10-18", // due in days!
    location: "Kitchen",
    condition: "Needs Attention",
    notes: "Sediment and carbon pre-filters require biannual cartridge replacement.",
    serviceHistory: [
      { date: "2024-07-20", serviceType: "Filter Cartridge Replacement", technician: "Kent Service Team", cost: 25, notes: "Replaced 5-micron spun PP filter." },
      { date: "2025-01-15", serviceType: "RO Membrane Replacement", technician: "Kent Service Team", cost: 55, notes: "TDS dropped from 420 to 32 ppm." },
      { date: "2026-07-15", serviceType: "Bi-annual Filter Change", technician: "Kent Service Team", cost: 30, notes: "Post-carbon polishing filter replaced." }
    ]
  },
  {
    id: "ast-006",
    name: "Havells Adonia Spin 25L Digital Geyser",
    category: "Water Heater",
    brand: "Havells",
    model: "GHWAGDW025",
    purchaseDate: "2025-02-18",
    purchasePrice: 210,
    warrantyDuration: "4 Years",
    warrantyExpiry: "2029-02-18",
    lastServiceDate: "2025-11-20",
    nextServiceDate: "2026-11-20",
    location: "Master Bathroom",
    condition: "Good",
    notes: "Feroglas coated inner tank with anode rod.",
    serviceHistory: [
      { date: "2025-11-20", serviceType: "Magnesium Anode Inspection", technician: "Havells Care", cost: 20, notes: "Checked heating element scaling." }
    ]
  },
  {
    id: "ast-007",
    name: "Luminous Solar Hybrid Inverter 3.5kVA",
    category: "Inverter",
    brand: "Luminous",
    model: "Solar NXG 3500",
    purchaseDate: "2023-06-12",
    purchasePrice: 950,
    warrantyDuration: "3 Years",
    warrantyExpiry: "2026-06-12",
    lastServiceDate: "2026-03-10",
    nextServiceDate: "2026-12-10",
    location: "Garage / Electrical Room",
    condition: "Good",
    notes: "Connected to 4x 150Ah Tubular batteries. Battery distilled water topped in March.",
    serviceHistory: [
      { date: "2025-03-05", serviceType: "Battery Specific Gravity Check", technician: "SunVolt Power", cost: 30, notes: "Electrolyte gravity 1.250 across all 24 cells." },
      { date: "2026-03-10", serviceType: "Inverter Efficiency Load Test", technician: "SunVolt Power", cost: 45, notes: "Cooling fan cleaned and terminal lugs tightened." }
    ]
  },
  {
    id: "ast-008",
    name: "Panasonic 32L Convection Microwave Oven",
    category: "Microwave",
    brand: "Panasonic",
    model: "NN-CD87KS",
    purchaseDate: "2024-05-18",
    purchasePrice: 320,
    warrantyDuration: "1 Year",
    warrantyExpiry: "2025-05-18",
    lastServiceDate: "2025-05-10",
    nextServiceDate: "2026-11-15",
    location: "Kitchen",
    condition: "Excellent",
    notes: "Inverter technology magnetron.",
    serviceHistory: [
      { date: "2025-05-10", serviceType: "Door interlock switch inspection", technician: "Panasonic Center", cost: 0, notes: "Free end-of-warranty inspection passed." }
    ]
  },
  {
    id: "ast-009",
    name: "Sintex Pure Triple-Layer 2000L Water Tank",
    category: "Water Tank",
    brand: "Sintex",
    model: "Pure Antimicrobial 2000L",
    purchaseDate: "2022-09-01",
    purchasePrice: 420,
    warrantyDuration: "10 Years",
    warrantyExpiry: "2032-09-01",
    lastServiceDate: "2026-04-20",
    nextServiceDate: "2026-10-25", // due this month
    location: "Roof",
    condition: "Good",
    notes: "Scheduled for high-pressure jet washing and UV disinfection.",
    serviceHistory: [
      { date: "2025-10-18", serviceType: "Tank Scrub & Sanitization", technician: "AquaClean Pros", cost: 50, notes: "Sludge vacuuming and food-grade chlorination." },
      { date: "2026-04-20", serviceType: "Spring Clean & De-silt", technician: "AquaClean Pros", cost: 50, notes: "Inlet ball valve float calibrated." }
    ]
  },
  {
    id: "ast-010",
    name: "Ring Alarm Pro Security Hub & Cameras",
    category: "Security Equipment",
    brand: "Ring",
    model: "Pro 8-Piece Kit",
    purchaseDate: "2024-03-10",
    purchasePrice: 580,
    warrantyDuration: "2 Years",
    warrantyExpiry: "2026-03-10",
    lastServiceDate: "2026-01-15",
    nextServiceDate: "2027-01-15",
    location: "Entire House",
    condition: "Excellent",
    notes: "Includes 4 exterior solar spotlight cams and motion PIR sensors.",
    serviceHistory: [
      { date: "2026-01-15", serviceType: "Backup battery & sensor battery swap", technician: "Self Serviced", cost: 25, notes: "CR123A batteries refreshed in door contact sensors." }
    ]
  }
];

export const initialServiceProviders = [
  {
    id: "pro-001",
    name: "Marcus Vance",
    category: "Plumber",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
    experience: 9,
    rating: 4.9,
    reviewsCount: 142,
    approxPrice: 45,
    priceUnit: "/ hr",
    availability: "Available",
    serviceArea: "Central, West & North Hills",
    phone: "+1 (555) 438-9012",
    email: "marcus.plumbing@homecarepro.com",
    description: "Master certified plumber specializing in sanitary fittings, pipe leak detection, water pressure boosting, and hot water heaters."
  },
  {
    id: "pro-002",
    name: "Elena Rostova",
    category: "AC Technician",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    experience: 7,
    rating: 4.9,
    reviewsCount: 189,
    approxPrice: 55,
    priceUnit: "/ visit",
    availability: "Available",
    serviceArea: "Metro & Surrounding Suburbs",
    phone: "+1 (555) 892-3341",
    email: "elena.hvac@coolairdynamics.com",
    description: "HVAC specialist certified in inverter multi-split ACs, coil leak welding, duct cleaning, and seasonal maintenance plans."
  },
  {
    id: "pro-003",
    name: "Carlos Mendez",
    category: "Electrician",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    experience: 12,
    rating: 4.8,
    reviewsCount: 220,
    approxPrice: 50,
    priceUnit: "/ hr",
    availability: "Available",
    serviceArea: "Citywide & South District",
    phone: "+1 (555) 231-7788",
    email: "carlos.electric@brightwatt.com",
    description: "Licensed master electrician covering breaker panel upgrades, short-circuit diagnostics, smart switches, and whole-home surge protection."
  },
  {
    id: "pro-004",
    name: "Samantha Wright",
    category: "Cleaner",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    experience: 6,
    rating: 4.9,
    reviewsCount: 175,
    approxPrice: 35,
    priceUnit: "/ hr",
    availability: "Available",
    serviceArea: "East Ridge & Central Suburbs",
    phone: "+1 (555) 674-1290",
    email: "sam.clean@sparklehome.com",
    description: "Professional residential cleaning team lead specializing in post-renovation deep scrubbing, kitchen degreasing, and steam sanitization."
  },
  {
    id: "pro-005",
    name: "Arthur Pendelton",
    category: "Carpenter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    experience: 15,
    rating: 4.7,
    reviewsCount: 96,
    approxPrice: 48,
    priceUnit: "/ hr",
    availability: "Booked this week",
    serviceArea: "North Sector & Downtown",
    phone: "+1 (555) 349-8801",
    email: "arthur.woodcraft@heritagecarpentry.com",
    description: "Artisan woodwork, modular wardrobe realignment, solid wood door framing, hydraulic hinge restoration, and custom shelving."
  },
  {
    id: "pro-006",
    name: "Devon Reed",
    category: "Painter",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    experience: 8,
    rating: 4.6,
    reviewsCount: 84,
    approxPrice: 40,
    priceUnit: "/ hr",
    availability: "Available",
    serviceArea: "South County & West Valley",
    phone: "+1 (555) 781-4455",
    email: "devon.finishes@primepalette.com",
    description: "Interior & exterior wall damp proofing, emulsion color matching, ceiling water stain repairs, and architectural texture finishes."
  },
  {
    id: "pro-007",
    name: "Rajesh Kumar",
    category: "Appliance Technician",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    experience: 11,
    rating: 4.9,
    reviewsCount: 210,
    approxPrice: 42,
    priceUnit: "/ visit",
    availability: "Available",
    serviceArea: "Greater Metro Region",
    phone: "+1 (555) 662-9844",
    email: "rajesh.repairs@appliancecare.io",
    description: "Certified component-level repair for front-load washing machines, microwave magnetrons, multi-stage RO systems, and refrigerators."
  },
  {
    id: "pro-008",
    name: "Chloe Bennett",
    category: "Gardener",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    experience: 5,
    rating: 4.8,
    reviewsCount: 68,
    approxPrice: 38,
    priceUnit: "/ hr",
    availability: "Available",
    serviceArea: "Greenbelt & North Shore",
    phone: "+1 (555) 912-6632",
    email: "chloe.gardens@bloombotanics.com",
    description: "Landscape maintenance, automated drip irrigation tune-ups, hedge pruning, lawn aeration, and organic pest protection."
  },
  {
    id: "pro-009",
    name: "Victor Stone",
    category: "Pest Control Worker",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    experience: 10,
    rating: 4.8,
    reviewsCount: 115,
    approxPrice: 65,
    priceUnit: "/ treatment",
    availability: "Available",
    serviceArea: "All Districts",
    phone: "+1 (555) 843-2219",
    email: "victor@shieldpestcontrol.com",
    description: "Odorless herbal termite barriers, cockroach gel baiting, bedbug eradication, and attic rodent exclusion treatments."
  },
  {
    id: "pro-10",
    name: "Tariq Al-Mansoor",
    category: "Mason",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    experience: 14,
    rating: 4.7,
    reviewsCount: 78,
    approxPrice: 52,
    priceUnit: "/ hr",
    availability: "Available",
    serviceArea: "East & South Zones",
    phone: "+1 (555) 381-9922",
    email: "tariq.stone@buildcraftmasonry.com",
    description: "Tile re-grouting, bathroom slope correction, patio paver leveling, plaster crack repair, and damp proof masonry."
  }
];

export const initialServiceRequests = [
  {
    id: "req-101",
    providerId: "pro-002",
    providerName: "Elena Rostova",
    category: "AC Technician",
    title: "AC Coil Inspection & Gas Top-up",
    problemDescription: "Living room inverter AC isn't cooling properly and pipe is freezing up.",
    location: "Living Room",
    preferredDate: "2026-10-10",
    preferredTime: "11:00 AM",
    status: "In Progress",
    createdAt: "2026-10-07",
    estimatedCost: 140,
    repairId: "rep-002"
  },
  {
    id: "req-102",
    providerId: "pro-001",
    providerName: "Marcus Vance",
    category: "Plumber",
    title: "Thermostatic Mixer Valve Fix",
    problemDescription: "Master bath shower valve knob feels stiff and only delivers lukewarm temperature.",
    location: "Master Bathroom",
    preferredDate: "2026-10-12",
    preferredTime: "10:00 AM",
    status: "Accepted",
    createdAt: "2026-10-06",
    estimatedCost: 65,
    repairId: "rep-003"
  },
  {
    id: "req-103",
    providerId: "pro-007",
    providerName: "Rajesh Kumar",
    category: "Appliance Technician",
    title: "RO Water Purifier Filter Service",
    problemDescription: "Biannual scheduled replacement of pre-carbon and sediment cartridges.",
    location: "Kitchen",
    preferredDate: "2026-10-18",
    preferredTime: "02:30 PM",
    status: "Requested",
    createdAt: "2026-10-08",
    estimatedCost: 35,
    repairId: null
  },
  {
    id: "req-104",
    providerId: "pro-004",
    providerName: "Samantha Wright",
    category: "Cleaner",
    title: "Deep Kitchen & Balcony Steam Cleaning",
    problemDescription: "Exhaust chimney grease removal and balcony floor scrubbing.",
    location: "Kitchen & Balconies",
    preferredDate: "2026-09-27",
    preferredTime: "09:00 AM",
    status: "Completed",
    createdAt: "2026-09-24",
    estimatedCost: 110,
    repairId: null
  }
];

export const initialBills = [
  {
    id: "bil-001",
    title: "City Electric Grid - October Billing",
    category: "Electricity",
    amount: 142.50,
    billDate: "2026-10-01",
    dueDate: "2026-10-16",
    paymentStatus: "Pending",
    paidDate: null,
    notes: "Units consumed: 620 kWh with solar net metering credit applied."
  },
  {
    id: "bil-002",
    title: "Municipal Water & Sewage Utility",
    category: "Water",
    amount: 38.00,
    billDate: "2026-09-25",
    dueDate: "2026-10-10",
    paymentStatus: "Pending",
    paidDate: null,
    notes: "Bimonthly municipal metered water consumption."
  },
  {
    id: "bil-003",
    title: "Quarterly HOA Community Maintenance",
    category: "Maintenance",
    amount: 195.00,
    billDate: "2026-10-01",
    dueDate: "2026-10-15",
    paymentStatus: "Pending",
    paidDate: null,
    notes: "Includes street lighting, gated security guard, and common clubhouse upkeep."
  },
  {
    id: "bil-004",
    title: "Fiber Optic High-Speed Internet 500Mbps",
    category: "Other",
    amount: 65.00,
    billDate: "2026-10-03",
    dueDate: "2026-10-12",
    paymentStatus: "Paid",
    paidDate: "2026-10-04",
    notes: "Paid via auto-debit linked card."
  },
  {
    id: "bil-005",
    title: "City Electric Grid - September Billing",
    category: "Electricity",
    amount: 158.20,
    billDate: "2026-09-01",
    dueDate: "2026-09-16",
    paymentStatus: "Paid",
    paidDate: "2026-09-12",
    notes: "Paid online."
  },
  {
    id: "bil-006",
    title: "Natural Gas Pipeline Supply",
    category: "Other",
    amount: 42.10,
    billDate: "2026-09-15",
    dueDate: "2026-09-30",
    paymentStatus: "Paid",
    paidDate: "2026-09-28",
    notes: "Cooking stove and central water line fuel."
  },
  {
    id: "bil-007",
    title: "Bi-monthly Pest Control Inspection",
    category: "Cleaning",
    amount: 65.00,
    billDate: "2026-09-10",
    dueDate: "2026-09-20",
    paymentStatus: "Paid",
    paidDate: "2026-09-18",
    notes: "Shield Pest Control invoice."
  }
];

export const initialExpenses = [
  {
    id: "exp-001",
    title: "Apex Plumbing - Kitchen P-Trap Fix",
    category: "Appliance Repair",
    amount: 90.00,
    date: "2026-10-05",
    notes: "Payment for repair rep-001."
  },
  {
    id: "exp-002",
    title: "Fiber Internet Subscription",
    category: "Other",
    amount: 65.00,
    date: "2026-10-04",
    notes: "Monthly connection fee."
  },
  {
    id: "exp-003",
    title: "Gutter Mesh Guard Hardware",
    category: "Maintenance",
    amount: 70.00,
    date: "2026-09-29",
    notes: "Paid to Peak Cleaners & Guttering."
  },
  {
    id: "exp-004",
    title: "Deep Steam Cleaning Service",
    category: "Cleaning",
    amount: 110.00,
    date: "2026-09-27",
    notes: "SparkleHome professional cleaning."
  },
  {
    id: "exp-005",
    title: "Electricity Bill - September",
    category: "Electricity",
    amount: 158.20,
    date: "2026-09-12",
    notes: "Utility payment."
  },
  {
    id: "exp-006",
    title: "Water Softener Salt 50lb Bags",
    category: "Water",
    amount: 32.50,
    date: "2026-09-08",
    notes: "Replenished basement brine tank."
  }
];

export const monthlySpendingChartData = [
  { month: "May", electricity: 135, water: 34, maintenance: 80, cleaning: 60, repairs: 45, total: 354 },
  { month: "Jun", electricity: 172, water: 42, maintenance: 110, cleaning: 65, repairs: 90, total: 479 },
  { month: "Jul", electricity: 195, water: 48, maintenance: 95, cleaning: 70, repairs: 50, total: 458 },
  { month: "Aug", electricity: 188, water: 45, maintenance: 120, cleaning: 65, repairs: 85, total: 503 },
  { month: "Sep", electricity: 158, water: 38, maintenance: 195, cleaning: 110, repairs: 70, total: 571 },
  { month: "Oct", electricity: 142, water: 38, maintenance: 195, cleaning: 35, repairs: 90, total: 500 }
];

export const initialNotifications = [
  {
    id: "notif-001",
    type: "repair",
    title: "Urgent Repair Requires Attention",
    message: "Basement Breaker #4 is tripping repeatedly under appliance load.",
    date: "2026-10-09 10:15 AM",
    read: false,
    priority: "high",
    link: "/maintenance"
  },
  {
    id: "notif-002",
    type: "service",
    title: "Daikin AC Routine Service Due Soon",
    message: "Living Room AC is due for seasonal deep coil maintenance on Oct 15.",
    date: "2026-10-08 04:30 PM",
    read: false,
    priority: "high",
    link: "/assets"
  },
  {
    id: "notif-003",
    type: "warranty",
    title: "Bosch Washing Machine Warranty Expiring",
    message: "3-year manufacturer warranty expires on Nov 10, 2026 (32 days remaining).",
    date: "2026-10-07 09:00 AM",
    read: false,
    priority: "normal",
    link: "/assets"
  },
  {
    id: "notif-004",
    type: "bill",
    title: "Pending Bill: Electric Grid Due Oct 16",
    message: "Amount $142.50 due in 7 days to avoid late surcharge fee.",
    date: "2026-10-06 01:20 PM",
    read: false,
    priority: "normal",
    link: "/expenses"
  },
  {
    id: "notif-005",
    type: "service",
    title: "Service Request Accepted",
    message: "David Sterling accepted your request for Master Bath Shower Mixer.",
    date: "2026-10-06 11:45 AM",
    read: true,
    priority: "normal",
    link: "/services"
  },
  {
    id: "notif-006",
    type: "warranty",
    title: "Samsung Refrigerator Warranty Expired",
    message: "Warranty for French Door Refrigerator expired on Aug 20, 2026. Consider extended AMC.",
    date: "2026-08-21 08:00 AM",
    read: true,
    priority: "low",
    link: "/assets"
  }
];

export const initialActivities = [
  {
    id: "act-001",
    title: "Service request accepted",
    description: "Elena Rostova accepted inspection for Living Room AC",
    time: "3 hours ago",
    type: "service"
  },
  {
    id: "act-002",
    title: "Repair marked completed",
    description: "Kitchen Sink Pipe Leakage repaired by Marcus Vance ($90)",
    time: "2 days ago",
    type: "repair"
  },
  {
    id: "act-003",
    title: "Bill paid successfully",
    description: "High-Speed Internet bill ($65.00) paid via auto-debit",
    time: "5 days ago",
    type: "bill"
  },
  {
    id: "act-004",
    title: "New asset registered",
    description: "Panasonic Convection Microwave added to Kitchen assets",
    time: "1 week ago",
    type: "asset"
  },
  {
    id: "act-005",
    title: "Overdue maintenance scheduled",
    description: "Garden Sprinkler Valve 2 inspection assigned to GreenThumb",
    time: "1 week ago",
    type: "maintenance"
  }
];

export const initialSettings = {
  profile: {
    fullName: "Alex Morgan",
    email: "alex.morgan@homecare.io",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  home: {
    homeName: "Villa Serenade",
    address: "742 Evergreen Terrace, Springfield, IL 62704",
    propertyType: "Independent Single Family Home",
    builtYear: "2019",
    totalArea: "2,850 sq ft",
    floors: "2 Floors + Basement",
    rooms: "4 Bedrooms, 3.5 Baths, Study, Garage"
  },
  preferences: {
    currency: "$",
    dateFormat: "YYYY-MM-DD",
    emailAlerts: true,
    smsAlerts: false,
    warrantyReminderDays: 30,
    serviceReminderDays: 14,
    theme: "light"
  }
};
