import { Brand, MotorcycleModel, ReplacementGuide, TechniqueGuide, ProblemCategory, Symptom, TroubleshootingNode, CommunityPost, User } from '../types';

export const SEED_BRANDS: Brand[] = [
  { id: 'b_honda', name: 'Honda', country: 'Japan' },
  { id: 'b_yamaha', name: 'Yamaha', country: 'Japan' },
  { id: 'b_suzuki', name: 'Suzuki', country: 'Japan' },
  { id: 'b_kawasaki', name: 'Kawasaki', country: 'Japan' },
  { id: 'b_chinabikes', name: 'China Bikes (Generic)', country: 'China / Philippines Assemblers' }
];

export const SEED_MODELS: MotorcycleModel[] = [
  {
    id: 'm_click125',
    brandId: 'b_honda',
    brandName: 'Honda',
    modelName: 'Click 125i / 125 V2/V3',
    category: 'Scooter',
    engineDisplacement: '124.8 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Liquid Cooled',
    oilCapacity: '0.8 Liters (SAE 10W-30 MB)',
    sparkPlugType: 'NGK CPR9EA-9 / DENSO U27EPR9',
    batteryType: 'YTZ6V / GTZ6V (12V 5Ah)',
    tireSizeFront: '90/80-14',
    tireSizeRear: '100/80-14',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    description: 'The most popular commuter automatic scooter in the Philippines. Known for eSP engine reliability and PGM-FI system.',
    commonIssues: ['CVT Dragging/Drag/Kalog at low speed', 'Coolant reservoir low level', 'ACG starter battery sensitivity', 'Fuel pump filter clogging from impure gasoline']
  },
  {
    id: 'm_beat110',
    brandId: 'b_honda',
    brandName: 'Honda',
    modelName: 'Beat 110 FI',
    category: 'Scooter',
    engineDisplacement: '108.2 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Air Cooled',
    oilCapacity: '0.7 Liters (SAE 10W-30 MB)',
    sparkPlugType: 'NGK MR9C-9N',
    batteryType: 'YTZ4V / GTZ4V (12V 3Ah)',
    tireSizeFront: '80/90-14',
    tireSizeRear: '90/90-14',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    description: 'Lightweight, ultra-fuel efficient scooter widely used for food delivery and daily city commuting in PH.',
    commonIssues: ['Drive belt wear at 15,000 km', 'Idle stop switch contacts oxidation', 'Rear brake cable stretching']
  },
  {
    id: 'm_adv160',
    brandId: 'b_honda',
    brandName: 'Honda',
    modelName: 'ADV160 / ADV150',
    category: 'Scooter',
    engineDisplacement: '156.9 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Liquid Cooled',
    oilCapacity: '0.85 Liters (SAE 10W-30 MB)',
    sparkPlugType: 'NGK LMAR8L-9',
    batteryType: 'YTZ7S / GTZ7S (12V 6Ah)',
    tireSizeFront: '110/80-14',
    tireSizeRear: '130/70-13',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    description: 'Adventure style scooter equipped with eSP+ 4-valve engine, HSTC traction control, and long-travel suspension.',
    commonIssues: ['Subtank shock absorber seal inspection', 'CVT roller wear under heavy loads', 'Radiator cap pressure holding test']
  },
  {
    id: 'm_pcx160',
    brandId: 'b_honda',
    brandName: 'Honda',
    modelName: 'PCX160 CBS/ABS',
    category: 'Scooter',
    engineDisplacement: '156.9 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Liquid Cooled',
    oilCapacity: '0.85 Liters (SAE 10W-30 MB)',
    sparkPlugType: 'NGK LMAR8L-9',
    batteryType: 'YTZ7S (12V 6Ah)',
    tireSizeFront: '110/70-14',
    tireSizeRear: '130/70-13',
    imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
    description: 'Premium maxi scooter popular among long-distance commuters and touring enthusiasts in Luzon, Visayas, and Mindanao.',
    commonIssues: ['CVT bell housing glazing', 'Keyless fob battery drain', 'Front ABS sensor tip cleaning']
  },
  {
    id: 'm_wave110',
    brandId: 'b_honda',
    brandName: 'Honda',
    modelName: 'Wave 110 Alpha / Wave Dash',
    category: 'Underbone',
    engineDisplacement: '109.1 cc',
    fuelSystem: 'Carburetor',
    transmission: 'Semi-Automatic',
    coolingSystem: 'Air Cooled',
    oilCapacity: '0.8 Liters (SAE 20W-50 / 10W-40 MA)',
    sparkPlugType: 'NGK C7HSA / CPR6EA-9',
    batteryType: 'YTZ5S / GTZ5S (12V 3.5Ah)',
    tireSizeFront: '70/90-17',
    tireSizeRear: '80/90-17',
    imageUrl: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80',
    description: 'Legendary workhorse underbone in the Philippines. Simple 4-stroke engine, indestructible chassis, low maintenance.',
    commonIssues: ['Carburetor float height misadjustment', 'Chain slack stretching', 'Clutch plate wear on heavy load hauling']
  },
  {
    id: 'm_tmx125',
    brandId: 'b_honda',
    brandName: 'Honda',
    modelName: 'TMX 125 Alpha / TMX Supremo',
    category: 'Backbone',
    engineDisplacement: '125.0 cc',
    fuelSystem: 'Carburetor',
    transmission: 'Manual (Chain)',
    coolingSystem: 'Air Cooled',
    oilCapacity: '0.9 Liters (SAE 20W-50 MA)',
    sparkPlugType: 'NGK D8EA',
    batteryType: 'YB3L-A (12V 3Ah)',
    tireSizeFront: '2.75-18',
    tireSizeRear: '3.00-18',
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    description: 'The premier Philippine tricycle power unit and heavy haulage utility motorcycle. Simple pushrod OHV engine.',
    commonIssues: ['Spoke rim tension loss', 'Carburetor main jet clog from rusty steel tank', 'Contact point/CDI pulse generator wear']
  },
  {
    id: 'm_miogear',
    brandId: 'b_yamaha',
    brandName: 'Yamaha',
    modelName: 'Mio Gear 125',
    category: 'Scooter',
    engineDisplacement: '125.0 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Air Cooled',
    oilCapacity: '0.8 Liters (SAE 10W-40 Yamalube AT)',
    sparkPlugType: 'NGK CR6HSA',
    batteryType: 'YTZ4V (12V 3Ah)',
    tireSizeFront: '80/80-14',
    tireSizeRear: '100/70-14',
    imageUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=800&q=80',
    description: 'Tough utility scooter designed for rugged city riding with scratch-resistant body panels and double hook attachments.',
    commonIssues: ['V-belt dust accumulation in CVT cover', 'TPS (Throttle Position Sensor) voltage drift', 'Brake shoe dust buildup']
  },
  {
    id: 'm_mioi125',
    brandId: 'b_yamaha',
    brandName: 'Yamaha',
    modelName: 'Mio i125 / Mio Soul i 125',
    category: 'Scooter',
    engineDisplacement: '125.0 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Air Cooled',
    oilCapacity: '0.8 Liters (SAE 10W-40 Yamalube AT)',
    sparkPlugType: 'NGK CR6HSA',
    batteryType: 'YTZ4V / GTZ5S',
    tireSizeFront: '70/90-14',
    tireSizeRear: '80/90-14',
    imageUrl: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=800&q=80',
    description: 'Compact Blue Core 125cc scooter. One of the highest selling scooters across all Philippine regions.',
    commonIssues: ['CVT drag / vibration at 20-30 kph', 'Ignition switch keyhole lock corrosion', 'Air filter premature clogging']
  },
  {
    id: 'm_nmax155',
    brandId: 'b_yamaha',
    brandName: 'Yamaha',
    modelName: 'NMAX 155 V1 / V2 / Tech Max',
    category: 'Scooter',
    engineDisplacement: '155.1 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Liquid Cooled',
    oilCapacity: '0.9 Liters (SAE 10W-40 Yamalube)',
    sparkPlugType: 'NGK CPR8EA-9',
    batteryType: 'YTZ6V / GTZ6V (12V 5Ah)',
    tireSizeFront: '110/70-13',
    tireSizeRear: '130/70-13',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Maxi scooter with Variable Valve Actuation (VVA) technology. Huge community and aftermarket ecosystem in PH.',
    commonIssues: ['VVA solenoid connector loose', 'Water pump mechanical seal weep hole leak', 'Rear brake pad uneven wear']
  },
  {
    id: 'm_aerox155',
    brandId: 'b_yamaha',
    brandName: 'Yamaha',
    modelName: 'Mio Aerox 155 V1 / V2',
    category: 'Scooter',
    engineDisplacement: '155.1 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Liquid Cooled',
    oilCapacity: '0.9 Liters (SAE 10W-40 Yamalube)',
    sparkPlugType: 'NGK CPR8EA-9',
    batteryType: 'YTZ6V (12V 5Ah)',
    tireSizeFront: '110/80-14',
    tireSizeRear: '140/70-14',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    description: 'Sports scooter with aggressive styling, wide tires, VVA technology, and smart key system.',
    commonIssues: ['Error code 12 (Stator/CPS socket melting if loose)', 'Rear monoshock squeak', 'Front fork bottoming out on PH humps']
  },
  {
    id: 'm_sniper155',
    brandId: 'b_yamaha',
    brandName: 'Yamaha',
    modelName: 'Sniper 150 / Sniper 155 R',
    category: 'Underbone',
    engineDisplacement: '155.1 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Manual (Chain)',
    coolingSystem: 'Liquid Cooled',
    oilCapacity: '1.0 Liters (SAE 10W-40 Yamalube 4T)',
    sparkPlugType: 'NGK CPR8EA-9 / CPR9EA-9',
    batteryType: 'YTZ4V / YTZ6V (12V)',
    tireSizeFront: '90/80-17',
    tireSizeRear: '120/70-17',
    imageUrl: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=800&q=80',
    description: 'King of Underbones in the Philippines. 6-speed manual transmission with assist & slipper clutch on the 155 R.',
    commonIssues: ['Timing chain tensioner click noise', 'Clutch cable stretch', 'Drive chain slack noise']
  },
  {
    id: 'm_raider150',
    brandId: 'b_suzuki',
    brandName: 'Suzuki',
    modelName: 'Raider R150 FI / Carb (Underbone King)',
    category: 'Underbone',
    engineDisplacement: '147.3 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Manual (Chain)',
    coolingSystem: 'Liquid Cooled',
    oilCapacity: '1.3 Liters (SAE 10W-40 MA2)',
    sparkPlugType: 'NGK MR9E-9 / DENSO U27EPR9',
    batteryType: 'YTZ6V (12V 5Ah)',
    tireSizeFront: '70/90-17',
    tireSizeRear: '80/90-17',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    description: 'DOHC 4-valve hyper-underbone engine with raw acceleration. High RPM capability and lightweight frame.',
    commonIssues: ['Camshaft shim clearance tight at high km', 'Overheated stator coil if oil level low', 'Rear brake pedal return spring stretch']
  },
  {
    id: 'm_burgman125',
    brandId: 'b_suzuki',
    brandName: 'Suzuki',
    modelName: 'Burgman Street 125 / EX',
    category: 'Scooter',
    engineDisplacement: '124.0 cc',
    fuelSystem: 'Fuel Injection (FI)',
    transmission: 'Automatic (CVT)',
    coolingSystem: 'Air Cooled',
    oilCapacity: '0.8 Liters (SAE 10W-40)',
    sparkPlugType: 'NGK CPR6EA-9',
    batteryType: 'YTZ5S (12V 4Ah)',
    tireSizeFront: '90/90-12',
    tireSizeRear: '90/100-10 (or 100/80-12 EX)',
    imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
    description: 'Maxi-styled commuter scooter with spacious floorboard, SEP engine efficiency, and comfortable ergonomics.',
    commonIssues: ['Rear tire size upgrade requests', 'CVT roller flat spots', 'Front disc brake squeal']
  },
  {
    id: 'm_barako175',
    brandId: 'b_kawasaki',
    brandName: 'Kawasaki',
    modelName: 'Barako II 175 / Barako III',
    category: 'Backbone',
    engineDisplacement: '177.0 cc',
    fuelSystem: 'Carburetor',
    transmission: 'Manual (Chain)',
    coolingSystem: 'Air Cooled',
    oilCapacity: '1.1 Liters (SAE 20W-50 / 10W-40 MA)',
    sparkPlugType: 'NGK C7HSA / D8EA',
    batteryType: 'YB3L-B / YTX4L-BS (12V)',
    tireSizeFront: '2.75-18',
    tireSizeRear: '3.00-18',
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty commercial backbone engine engineered specifically for heavy sidecar passenger tricycles in PH.',
    commonIssues: ['Carburetor float pin wear', 'Heavy clutch cable tension', 'Dual rear shock absorber bushing wear']
  },
  {
    id: 'm_chinabike125',
    brandId: 'b_chinabikes',
    brandName: 'China Bikes (Generic)',
    modelName: 'Generic 125/150 Carburetor (Rusi, Euro, Motorstar)',
    category: 'Underbone',
    engineDisplacement: '124.0 cc - 149.0 cc',
    fuelSystem: 'Carburetor',
    transmission: 'Semi-Automatic',
    coolingSystem: 'Air Cooled',
    oilCapacity: '0.9 Liters (SAE 20W-50 MA)',
    sparkPlugType: 'NGK C7HSA / D8EA',
    batteryType: '12V 4Ah / 5Ah',
    tireSizeFront: '2.50-17 / 70/90-17',
    tireSizeRear: '2.75-17 / 80/90-17',
    imageUrl: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80',
    description: 'Budget generic 4-stroke 125/150 engines (Honda CG125 / Wave clone platforms). Highly customizable and widely used in rural areas.',
    commonIssues: ['CDI unit wire connector oxidation', 'Carburetor overflow due to dirty petcock strainer', 'Vibration loosening chassis bolts']
  }
];

export const SEED_REPLACEMENT_GUIDES: ReplacementGuide[] = [
  {
    id: 'rg_engine_oil',
    title: 'Engine Oil Drain & Refill',
    category: 'Maintenance',
    componentName: 'Four-Stroke Engine Oil & Drain Bolt',
    estimatedMinutes: 20,
    difficulty: 'Beginner',
    requiredTools: ['12mm or 17mm Box/Socket Wrench', 'Oil Drain Pan', 'Funnel', 'Clean Rag', 'New Engine Oil (0.7L - 1.0L)', 'New Crush Washer / O-ring'],
    safetyReminders: [
      'Engine oil can be extremely hot after riding! Let engine cool down for 10-15 minutes before opening drain bolt.',
      'Wear nitrile gloves to protect skin from used motor oil contaminants.',
      'Do not over-tighten the oil drain bolt into aluminum engine crankcases to prevent stripped threads!'
    ],
    summary: 'Regular oil changes every 1,500 to 3,000 km are the single most vital maintenance procedure for four-stroke motorcycle longevity in Philippine heat and traffic.',
    steps: [
      {
        stepNumber: 1,
        title: 'Warm Up Engine & Park on Center Stand',
        instruction: 'Start engine and let it idle for 2-3 minutes to warm up and suspend particles in the oil. Turn off ignition and put bike securely on center stand on flat ground.',
        proTip: 'Warming up the oil lowers its viscosity so it drains much cleaner and faster.'
      },
      {
        stepNumber: 2,
        title: 'Locate & Clean Drain Bolt Area',
        instruction: 'Locate the oil drain bolt under the engine crankcase (bottom left or bottom right depending on model). Use a clean rag to wipe off road grime before loosening.',
        warning: 'Ensure you do not accidentally loosen the cam chain tensioner bolt on horizontal engines like Honda Wave or TMX!'
      },
      {
        stepNumber: 3,
        title: 'Remove Oil Dipstick & Drain Bolt',
        instruction: 'Place oil drain pan directly under the bolt. Remove top oil filler dipstick to vent crankcase. Using a 12mm or 17mm socket wrench, loosen the drain bolt counter-clockwise and carefully spin off by hand.',
        proTip: 'Keep a tight grip on the bolt at the last thread so it does not fall into the dirty drain pan.'
      },
      {
        stepNumber: 4,
        title: 'Inspect & Clean Oil Strainer Screen / Dipstick',
        instruction: 'Allow oil to drain completely for 5-10 minutes. Clean the drain bolt threads and inspect the crush washer or strainer screen. Replace crushed washer if flattened.',
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 5,
        title: 'Reinstall Drain Bolt & Torque Correctly',
        instruction: 'Hand-thread the drain bolt into crankcase to prevent cross-threading. Tighten with wrench until snug (approx. 20-24 Nm). Do NOT use excessive leverage force.',
        warning: 'Stripped oil drain threads require expensive re-tapping or engine teardown.'
      },
      {
        stepNumber: 6,
        title: 'Pour Fresh Oil & Check Level with Dipstick',
        instruction: 'Insert funnel into oil filler hole. Pour exact recommended capacity (e.g., 0.8L for Click/Mio). Screw dipstick in, start engine for 1 minute, turn off, wait 1 minute, and check dipstick level without threading it in.',
        proTip: 'On scooters, check level on flat ground without screwing the dipstick cap in.'
      }
    ],
    commonMistakes: [
      'Over-tightening drain bolt and stripping soft aluminum crankcase threads.',
      'Pouring car engine oil with friction modifiers into wet-clutch manual motorcycles (causes clutch slippage).',
      'Overfilling above MAX line causing oil blowby into air filter box.',
      'Forgetting to replace drain plug crush washer resulting in slow floor oil drips.'
    ]
  },
  {
    id: 'rg_air_filter',
    title: 'Air Filter Element Replacement',
    category: 'Maintenance',
    componentName: 'Viscous Paper Air Filter / Sponge Element',
    estimatedMinutes: 15,
    difficulty: 'Beginner',
    requiredTools: ['Phillips Screwdriver (#2)', 'Clean Microfiber Towel', 'New Replacement Air Filter Element'],
    safetyReminders: [
      'Never run engine without an air filter installed! Dust entering intake cylinder causes rapid piston ring wear.',
      'Do not wash viscous (oiled) paper filters with gasoline or water; they must be replaced when dark.'
    ],
    summary: 'A clean air filter guarantees crisp throttle response and optimal air-fuel mixture ratio for FI or carburetor motorcycles.',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate Air Filter Box',
        instruction: 'On scooters (Click, Mio, NMAX), air box is located on left side above transmission box. On underbones/backbones, it is under center cover or under seat.',
        proTip: 'Wipe exterior airbox plastics to prevent sand from falling inside during cover removal.'
      },
      {
        stepNumber: 2,
        title: 'Remove Air Box Cover Screws',
        instruction: 'Use Phillips #2 screwdriver to remove all perimeter screws (usually 5 to 7 screws). Keep screws organized in a magnetic tray.',
        warning: 'Do not lose small rubber sealing grommets if equipped.'
      },
      {
        stepNumber: 3,
        title: 'Inspect Dirty Filter Element',
        instruction: 'Pull out filter element. If paper pleats are black, oily, or clogged with dust, it is ready for replacement (typically every 10,000 - 15,000 km in dusty conditions).',
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 4,
        title: 'Clean Interior Airbox Housing',
        instruction: 'Wipe inside of plastic airbox housing with a clean microfiber towel soaked in a tiny amount of isopropyl alcohol. Inspect drain plug tube at bottom of airbox and drain trapped oil/water.',
        proTip: 'Always wipe away from the throttle body intake inlet tube.'
      },
      {
        stepNumber: 5,
        title: 'Install New Filter & Reassemble Cover',
        instruction: 'Seat new OEM/quality filter element firmly against airbox rubber seal perimeter. Reattach cover and tighten screws in a criss-cross pattern evenly by hand.',
        warning: 'Ensure seal is air-tight so unfiltered air cannot bypass element edges.'
      }
    ],
    commonMistakes: [
      'Blowing high-pressure air through viscous oiled filter paper (tears microscopic fibers and ruins filtering efficiency).',
      'Forgetting to re-insert bottom rubber oil drain cap on airbox bottom.',
      'Cross-threading plastic screws on air filter cover.'
    ]
  },
  {
    id: 'rg_spark_plug',
    title: 'Spark Plug Inspection & Replacement',
    category: 'Electrical',
    componentName: 'Ignition Spark Plug',
    estimatedMinutes: 20,
    difficulty: 'Intermediate',
    requiredTools: ['16mm or 18mm Spark Plug Socket', 'Ratchet Wrench & Extension Bar', 'Feeler Wire Gap Gauge', 'Wire Brush / Contact Cleaner', 'New NGK / Denso Spark Plug'],
    safetyReminders: [
      'Only thread spark plug into cold engine cylinder head! Hot aluminum cylinder head threads easily strip.',
      'Never pull hard on spark plug wire cable directly; pull firmly on rubber boot neck.'
    ],
    summary: 'Spark plugs ignite air-fuel mixture millions of times. Checking electrode gap and porcelain color reveals engine combustion health.',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate Spark Plug & Disconnect Cap',
        instruction: 'Locate cylinder head area. On scooters, access through under-seat maintenance door or front lower belly panel. Firmly twist and pull spark plug cap boot straight off.',
        proTip: 'Use compressed air or brush to blow dirt away around plug well before removing plug.'
      },
      {
        stepNumber: 2,
        title: 'Unscrew Spark Plug Counter-Clockwise',
        instruction: 'Fit 16mm (or 18mm) spark plug deep socket with rubber retainer insert over plug hex. Turn counter-clockwise with ratchet wrench until loose, then finish unscrewing by hand.',
        warning: 'Keep socket square to plug axis so porcelain body does not crack.'
      },
      {
        stepNumber: 3,
        title: 'Inspect Electrode Color & Wear',
        instruction: 'Check tip condition: Tan/Light Brown = Ideal mixture; White/Glazed = Overheating / Lean mixture; Black Sooty = Rich fuel mixture / Clogged air filter; Oil Wet = Piston ring / Valve seal oil leak.',
        imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 4,
        title: 'Verify Spark Plug Electrode Gap',
        instruction: 'Check new or cleaned plug gap with feeler wire gauge (standard gap is usually 0.8mm - 0.9mm for Honda/Yamaha 125/150). Adjust ground electrode gently if necessary.',
        proTip: 'Never press feeler gauge against delicate center iridium tip.'
      },
      {
        stepNumber: 5,
        title: 'Thread New Plug BY HAND & Torque',
        instruction: 'Thread plug into cylinder head by hand for at least 4-5 full turns to guarantee no cross-threading. Tighten with socket wrench until gasket contacts head, then turn an additional 1/2 turn (new plug) or 1/8 turn (used plug).',
        warning: 'Torque specification is approx 12-14 Nm. Do NOT over-tighten!'
      },
      {
        stepNumber: 6,
        title: 'Reattach Boot Firmly',
        instruction: 'Push spark plug cap back onto plug until you feel and hear a solid click locking mechanism engaged.',
        proTip: 'A loose plug cap causes intermittent misfires during rainy weather.'
      }
    ],
    commonMistakes: [
      'Using socket wrench immediately instead of starting thread by hand (strips cylinder head!).',
      'Installing wrong thread length or heat range plug (causes piston crown damage).',
      'Cracking porcelain insulator during removal.'
    ]
  },
  {
    id: 'rg_cvt_belt_rollers',
    title: 'CVT Drive Belt & Roller Weight Replacement',
    category: 'Transmission',
    componentName: 'CVT V-Belt, Flyball Rollers, & Slide Pieces',
    estimatedMinutes: 45,
    difficulty: 'Advanced',
    requiredTools: ['8mm T-Wrench', '17mm & 19mm Socket Wrench', 'Y-Holder / Universal Pulley Holder Tool', 'Impact Driver / Cordless Wrench (Optional)', 'Brake/Parts Cleaner Spray', 'New OEM V-Belt', 'New Set of 6 Flyball Rollers'],
    safetyReminders: [
      'Never apply grease or oil to drive belt faces, variator pulley faces, or clutch bell surfaces!',
      'Ensure pulley splines are aligned before torquing drive face nut to avoid crushing crankshaft splines.'
    ],
    summary: 'Scooter automatic drive belts stretch and rollers wear flat spots over 15,000 to 25,000 km, causing sluggish acceleration, top speed loss, and vibration.',
    steps: [
      {
        stepNumber: 1,
        title: 'Remove Left Outer CVT Cover',
        instruction: 'Remove 8mm bolts around left plastic air duct and aluminum CVT crankcase cover. Tap gently with rubber mallet to release cover gasket.',
        proTip: 'Keep bolts arranged by length as CVT cover uses different bolt lengths.'
      },
      {
        stepNumber: 2,
        title: 'Hold Variator & Remove Front Shaft Nut',
        instruction: 'Place Y-holder tool into drive face holes (or use electric impact driver). Turn 17mm/19mm nut counter-clockwise to remove nut, washer, and drive face fan plate.',
        warning: 'Do not jam screwdriver into cooling fins; aluminum fins snap easily.'
      },
      {
        stepNumber: 3,
        title: 'Remove Rear Clutch Bell & Clutch Assembly',
        instruction: 'Use holder tool or impact wrench on rear clutch shaft nut (14mm or 19mm). Remove outer steel clutch bell and pull off rear driven pulley with belt attached.',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 4,
        title: 'Inspect & Replace Flyball Rollers',
        instruction: 'Slide out front variator moveable pulley. Remove ramp plate and inspect 6 rollers. If rollers have flat spots or exposed copper core, replace all 6 as a complete set.',
        proTip: 'Clean variator roller tracks thoroughly with dry rag or parts cleaner.'
      },
      {
        stepNumber: 5,
        title: 'Install Rollers with Correct Direction',
        instruction: 'Place new rollers in tracks. If rollers are directional (one side has wider plastic lip), install heavy plastic non-metal side facing counter-clockwise against rotation thrust direction.',
        warning: 'Directional rollers installed backward wear out in under 2,000 km!'
      },
      {
        stepNumber: 6,
        title: 'Compress Driven Pulley Sheaves & Install New Belt',
        instruction: 'Squeeze rear driven pulley spring open by hand to drop new V-belt deep into rear sheaves. This provides slack for front drive shaft assembly.',
        proTip: 'Check directional arrows stamped on outer V-belt rubber for correct forward rotation.'
      },
      {
        stepNumber: 7,
        title: 'Reassemble Drive Face & Torque Nuts',
        instruction: 'Slide drive face onto crank splines. Ensure kickstart ratchet teeth / washer fully align with splines before tightening 17mm nut to 49-55 Nm torque. Rotate pulley by hand to ensure belt is not pinched.',
        warning: 'If drive face is tightened while pinching belt, crank splines will strip on startup!'
      }
    ],
    commonMistakes: [
      'Pinching V-belt between drive faces during tightening (strips crankshaft threads!).',
      'Installing rollers in reverse direction.',
      'Allowing grease on pulley drive faces causing belt slippage.'
    ]
  },
  {
    id: 'rg_brake_pads',
    title: 'Front Hydraulic Brake Pad Replacement',
    category: 'Brakes',
    componentName: 'Front Disc Brake Caliper & Friction Pads',
    estimatedMinutes: 30,
    difficulty: 'Intermediate',
    requiredTools: ['8mm, 10mm, 12mm Socket/Wrench', '5mm or 6mm Allen Hex Key', 'Flathead Screwdriver / Brake Piston Tool', 'Wire Brush', 'Brake Cleaner Spray', 'New Ceramic/Sintered Brake Pads'],
    safetyReminders: [
      'Do NOT pull or pump brake lever while brake caliper is off the disc rotor!',
      'Avoid breathing brake dust particles. Spray brake cleaner to wash down dust safely.',
      'Always test brake lever pressure BEFORE riding motorcycle after pad replacement!'
    ],
    summary: 'Brake pads wear down under Philippine stop-and-go city traffic. Replacing pads before metal backing plate hits rotor prevents costly rotor gouging.',
    steps: [
      {
        stepNumber: 1,
        title: 'Loosen Pad Retaining Pin Plug',
        instruction: 'Before removing caliper mounting bolts, break loose the pad pin cap screw or hex pin on caliper body while caliper is securely mounted on fork leg.',
        proTip: 'It is much easier to apply breaking torque while caliper is bolted down.'
      },
      {
        stepNumber: 2,
        title: 'Unbolt Caliper Mounting Bolts',
        instruction: 'Remove two 12mm caliper mounting bolts securing caliper to front fork leg. Slide caliper up and off brake disc rotor gently.',
        warning: 'Do not let caliper hang unsupported by rubber brake hose line.'
      },
      {
        stepNumber: 3,
        title: 'Remove Pad Pin & Old Brake Pads',
        instruction: 'Unscrew pad retaining pin completely and slide out worn brake pads and anti-rattle spring shim plate. Note pad orientation.',
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 4,
        title: 'Clean & Push Caliper Pistons Back',
        instruction: 'Clean dirt and dust off exposed caliper piston walls using brake cleaner and soft brush. Use old pad and flathead tool to press pistons back flush into caliper bore.',
        proTip: 'Check master cylinder reservoir under handlebar; pushing pistons back forces brake fluid up into reservoir.'
      },
      {
        stepNumber: 5,
        title: 'Install New Brake Pads & Re-mount Caliper',
        instruction: 'Install new brake pads with anti-rattle spring plate in place. Slide pad pin through pad eyes, thread tight, slide caliper over disc, and torque mounting bolts to 30 Nm.',
        warning: 'Must pump front brake lever 4-5 times until solid firm pressure returns before riding!'
      }
    ],
    commonMistakes: [
      'Forgetting to pump brake lever after installation (causes total brake failure on first stop!).',
      'Contaminating new pad friction surfaces with oily thumb grease.',
      'Not cleaning dirty caliper pistons before pushing back (forces grit past piston oil seals).'
    ]
  },
  {
    id: 'rg_battery_replace',
    title: '12V Sealed Maintenance-Free Battery Replacement',
    category: 'Electrical',
    componentName: '12V AGM / VRLA Gel Battery',
    estimatedMinutes: 15,
    difficulty: 'Beginner',
    requiredTools: ['Phillips #2 Screwdriver', '10mm Wrench / Nut Driver', 'Digital Multimeter', 'Dielectric Terminal Grease', 'New 12V Battery (YTZ4V / YTZ6V)'],
    safetyReminders: [
      'ALWAYS disconnect NEGATIVE (-) BLACK cable FIRST during removal!',
      'ALWAYS connect POSITIVE (+) RED cable FIRST during installation!',
      'Short-circuiting battery terminals with metal tools can cause sparks and battery rupture.'
    ],
    summary: 'Fuel-injected motorcycles and ACG starter scooters require healthy 12.6V+ battery power to initialize fuel pump, ECU, and ignition coils.',
    steps: [
      {
        stepNumber: 1,
        title: 'Access Battery Compartment',
        instruction: 'Locate battery compartment cover (on floorboard mat on Honda Click/Beat, under seat on Mio, or under front cover on NMAX/Aerox). Remove screws and plastic cover.',
        proTip: 'Clean top of battery box of sand or water before opening.'
      },
      {
        stepNumber: 2,
        title: 'Disconnect Black Negative (-) Cable FIRST',
        instruction: 'Unscrew 10mm bolt on BLACK Negative (-) terminal first. Move cable away from terminal to prevent accidental grounding contact.',
        warning: 'Removing positive cable first can cause spark if screwdriver touches frame metal!'
      },
      {
        stepNumber: 3,
        title: 'Disconnect Red Positive (+) Cable & Remove Battery',
        instruction: 'Unscrew RED Positive (+) terminal bolt. Remove battery hold-down strap and lift old battery out of compartment.',
        imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 4,
        title: 'Test New Battery Voltage Before Installation',
        instruction: 'Use multimeter on DC 20V scale. A fresh fully-charged battery must read 12.6V to 12.8V DC at rest.',
        proTip: 'If new battery reads below 12.4V, trickle charge before installation.'
      },
      {
        stepNumber: 5,
        title: 'Connect Red Positive (+) FIRST, Then Black Negative (-)',
        instruction: 'Place new battery in tray. Secure RED (+) cable first with 10mm bolt. Apply thin coating of dielectric grease to prevent acid corrosion, then connect BLACK (-) cable second.',
        warning: 'Ensure square nut inside terminal post stays aligned with bolt.'
      }
    ],
    commonMistakes: [
      'Reversing positive and negative terminal connections (immediately blows 15A main ECU fuse!).',
      'Disconnecting positive terminal first and sparking against frame metal.',
      'Leaving terminal screws loose resulting in intermittent stalling.'
    ]
  },
  {
    id: 'rg_fuel_pump',
    title: 'FI Fuel Pump Assembly & Filter Strainer Replacement',
    category: 'Fuel System',
    componentName: 'In-Tank Electric Fuel Pump & Mesh Strainer',
    estimatedMinutes: 40,
    difficulty: 'Intermediate',
    requiredTools: ['10mm Socket Wrench / T-Wrench', 'Flathead Screwdriver', 'Clean Shop Towels', 'New Fuel Strainer Filter / Fuel Pump Assembly', 'New Pump Base O-Ring Seal'],
    safetyReminders: [
      'NO OPEN FLAMES, SPARKS, OR SMOKING nearby fuel tank work!',
      'Work in well-ventilated outdoor area. Disconnect negative battery terminal before opening fuel tank.',
      'Relieve residual fuel line pressure before disconnecting fuel quick-connector hose!'
    ],
    summary: 'Contaminated fuel in rural gas stations clogs fuel pump tea-bag strainers over time, causing high RPM hesitation, engine bogging, and hard starting.',
    steps: [
      {
        stepNumber: 1,
        title: 'Relieve Pressure & Disconnect Battery',
        instruction: 'Disconnect negative battery cable. Remove seat bucket or panel to access top of fuel tank. Disconnect 4-pin electric fuel pump connector wire harness.',
        proTip: 'Wrap rag around fuel quick connector before releasing lock tab to catch small fuel drops.'
      },
      {
        stepNumber: 2,
        title: 'Disconnect Fuel Quick-Connector Hose',
        instruction: 'Pinch green/orange retaining clip on fuel hose connector and pull connector straight off fuel pump outlet nipple.',
        warning: 'Do not pry with metal pliers; plastic fuel hose fittings crack easily.'
      },
      {
        stepNumber: 3,
        title: 'Unbolt Fuel Pump Retainer Plate',
        instruction: 'Use 10mm socket to unscrew 4 or 6 nuts on fuel pump mounting ring plate in a criss-cross pattern. Lift metal retainer plate off.',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 4,
        title: 'Carefully Lift Fuel Pump Out',
        instruction: 'Slowly angle and lift fuel pump unit out of tank so fuel level float arm is not bent or damaged during extraction. Drain remaining fuel back into tank.',
        warning: 'Never force the float arm through tank opening.'
      },
      {
        stepNumber: 5,
        title: 'Replace Tea-Bag Strainer Filter & Base O-Ring',
        instruction: 'Snap off brown dirty bottom strainer filter from fuel pump motor inlet. Wash motor housing with clean gas, click on new strainer filter, and install fresh rubber O-ring seal on tank mouth.',
        proTip: 'Never reuse old swollen rubber tank O-ring; it will leak fuel when tank is full!'
      },
      {
        stepNumber: 6,
        title: 'Reinstall Pump, Torque Nuts, & Test Pressure',
        instruction: 'Lower pump gently back in. Tighten mounting nuts evenly to 10 Nm. Reconnect fuel line until clip clicks. Connect battery, turn ignition key ON 3 times to prime system before starting engine.',
        proTip: 'Listen for smooth 2-second fuel pump hum sound when ignition key turns ON.'
      }
    ],
    commonMistakes: [
      'Bending fuel level float wire causing inaccurate fuel gauge reading on dashboard.',
      'Reusing old fuel tank base O-ring causing fuel leak when tank is filled to brim.',
      'Starting engine without cycling ignition 3 times to purge air locks from fuel line.'
    ]
  }
];

export const SEED_TECHNIQUE_GUIDES: TechniqueGuide[] = [
  {
    id: 'tg_multimeter',
    title: 'Using a Digital Multimeter for Motorcycle Electrical Systems',
    type: 'Multimeter',
    estimatedMinutes: 25,
    difficulty: 'Beginner',
    whyItMatters: 'Electrical issues (dead battery, blown fuses, faulty stator, bad sensors) account for over 35% of motorcycle breakdowns. Mastering a 500-peso digital multimeter allows you to diagnose electrical faults accurately without guessing or replacing expensive parts unnecessarily.',
    requiredTools: ['Digital Multimeter with Test Probes (Red/Black)', 'Safety Glasses'],
    safetyReminders: [
      'Never measure Resistance (Ohms) on a powered circuit! Always disconnect battery negative wire first.',
      'Ensure probes are inserted into correct COM (Black) and V/Ω (Red) jacks on multimeter.'
    ],
    howToInterpretResults: '• DC Voltage: Resting battery = 12.6V+ (Good). Engine running charging voltage = 13.8V - 14.5V (Good Charging System).\n• Continuity (Beeper): Beep sound = Continuous wire pathway (0 Ohms). No sound/OL = Broken wire / blown fuse / open circuit.\n• Resistance (Ohms): Compare component coil resistance with OEM service manual specs (e.g. stator coil 0.2 - 1.0 Ohm).',
    steps: [
      {
        stepNumber: 1,
        title: 'Understand Multimeter Dial Settings',
        instruction: 'DC Voltage (V⎓) = Battery, charging, sensors. Resistance (Ω) = Coils, wires, switches. Continuity (Speaker Icon) = Fuses, grounds, harness breaks.',
        proTip: 'For 12V motorcycle systems, set DC Voltage selector dial to 20V DC mode.'
      },
      {
        stepNumber: 2,
        title: 'Measuring Battery Resting Voltage',
        instruction: 'Turn ignition OFF. Touch Red probe to Positive (+) battery post and Black probe to Negative (-) post. Read LCD display value.',
        proTip: '12.6V - 12.8V = 100% Charged; 12.2V = 50% Charged; Below 12.0V = Discharged / Defective Cell.'
      },
      {
        stepNumber: 3,
        title: 'Testing Generator/Stator Charging Voltage',
        instruction: 'Start engine and let it warm up. Rev engine to 4,000 RPM while holding probes on battery posts. Reading should climb to 13.8V - 14.6V DC.',
        warning: 'If voltage stays at 12.5V or exceeds 15.5V, stator or rectifier regulator is faulty!'
      },
      {
        stepNumber: 4,
        title: 'Testing Fuse & Wire Continuity',
        instruction: 'Turn dial to Continuity Beeper mode. Touch probes together; multimeter must beep and show ~0.00. Touch probe tips across fuse blades. Loud beep = Fuse OK; Silence/OL = Blown fuse!',
        imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'tg_compression_test',
    title: 'Cylinder Compression Testing (Dry & Wet Test)',
    type: 'Testing',
    estimatedMinutes: 30,
    difficulty: 'Intermediate',
    whyItMatters: 'Low cylinder compression causes hard starting, weak power, excessive smoke, and stalling. Testing compression determines whether engine mechanical sealing (piston rings, cylinder wall, valves, head gasket) is healthy.',
    requiredTools: ['Motorcycle Compression Gauge Tester with 10mm/12mm/14mm Spark Plug Adapters', 'Spark Plug Wrench', 'Engine Oil Dropper'],
    safetyReminders: [
      'Ground spark plug cap wire to engine block during crank test so high voltage ignition pulse does not damage CDI/ECU!',
      'Hold throttle wide open during cranking test to ensure full air intake into cylinder.'
    ],
    howToInterpretResults: '• Normal Compression: 140 - 180 PSI (depends on compression ratio spec).\n• Low Compression (Under 110 PSI): Engine will struggle to fire or lack power.\n• Wet Test Diagnosis: Squirt 5cc engine oil into spark plug hole. Re-test compression. If PSI jumps up by 30+ PSI = Worn Piston Rings / Scored Cylinder Wall. If PSI stays low = Tight/Leaking Valves or Blown Head Gasket!',
    steps: [
      {
        stepNumber: 1,
        title: 'Warm Up Engine & Remove Spark Plug',
        instruction: 'Run engine 3 minutes to warm cylinder. Remove spark plug cap and unscrew spark plug completely.',
        proTip: 'Clean plug well before removal so no grit falls into cylinder.'
      },
      {
        stepNumber: 2,
        title: 'Thread Compression Gauge Adapter',
        instruction: 'Select matching threaded brass adapter for spark plug hole. Hand-thread compression tester hose firmly into spark plug hole until rubber O-ring seals.',
        warning: 'Do not use pliers on tester brass threads.'
      },
      {
        stepNumber: 3,
        title: 'Perform Wide-Open Throttle Crank Test',
        instruction: 'Hold throttle grip 100% WIDE OPEN. Hold electric starter button or kickstart vigorously 5-7 times until pressure gauge needle stops rising. Record peak PSI reading.',
        proTip: 'Holding throttle wide open allows maximum air volume into cylinder for accurate peak reading.'
      },
      {
        stepNumber: 4,
        title: 'Perform Wet Compression Test (If Pressure is Low)',
        instruction: 'If dry compression is below 120 PSI, squirt 5mL clean engine oil into spark plug hole. Crank engine 2 revolutions to distribute oil around piston rings, then re-attach tester and re-test.',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'tg_fuel_pressure',
    title: 'FI Fuel Pump Pressure & Flow Testing',
    type: 'Testing',
    estimatedMinutes: 25,
    difficulty: 'Intermediate',
    whyItMatters: 'Fuel-injected engines require precise fuel pressure (typically 42 - 45 PSI / 294 kPa) to atomize gasoline correctly through injector nozzles. Low fuel pressure causes lean misfires, high RPM bogging, and hard starting.',
    requiredTools: ['Fuel Injection Pressure Gauge Tester with T-Fitting Adapters', 'Safety Glasses', 'Clean Measuring Cup'],
    safetyReminders: [
      'Gasoline spray under pressure is a fire hazard! Wear eye protection and wrap rag over connection points when releasing fittings.',
      'Keep fire extinguisher nearby.'
    ],
    howToInterpretResults: '• Honda PGM-FI Normal Pressure: 294 kPa (approx 42 - 43 PSI).\n• Yamaha Blue Core FI Normal Pressure: 250 - 300 kPa (approx 36 - 43 PSI).\n• Low Pressure (Below 30 PSI): Clogged fuel strainer filter, weak fuel pump motor, or leaking pressure regulator.\n• Pressure Drops Fast after Ignition OFF: Faulty fuel pump check valve or leaking fuel injector.',
    steps: [
      {
        stepNumber: 1,
        title: 'Connect T-Fitting Pressure Gauge',
        instruction: 'Disconnect fuel hose at injector or fuel pump. Insert fuel pressure tester T-fitting in series between fuel pump hose and injector fuel rail.',
        proTip: 'Ensure quick lock tabs snap firmly so fuel line does not blow off during test.'
      },
      {
        stepNumber: 2,
        title: 'Key ON Prime Pressure Check',
        instruction: 'Turn ignition switch ON (do not start engine yet). Fuel pump will hum for 2 seconds. Observe pressure gauge reading at prime.',
        proTip: 'Repeat key ON 2 times to purge air bubbles from gauge hose.'
      },
      {
        stepNumber: 3,
        title: 'Engine Idle & High RPM Pressure Check',
        instruction: 'Start engine and let idle. Observe gauge reading. Snap throttle open quickly to 6,000 RPM. Fuel pressure must remain steady and must not dip dramatically.',
        warning: 'If pressure drops 10+ PSI during throttle snap, fuel strainer filter is severely restricted!'
      }
    ]
  },
  {
    id: 'tg_valve_clearance',
    title: 'Valve Clearance Inspection & Adjustment (Feeler Gauge)',
    type: 'Inspection',
    estimatedMinutes: 45,
    difficulty: 'Advanced',
    requiredTools: ['Blade Feeler Gauge Set (0.05mm - 0.20mm)', '8mm, 10mm, 17mm Socket Wrench', 'Square Tappet Adjustment Tool / Pliers', '10mm Locknut Wrench', 'Crankcase Timing Hole Cap Tool'],
    whyItMatters: 'As valves open and close millions of times against cylinder head valve seats, valve clearances tighten over time. Tight valves cannot fully close when hot, causing compression loss, hard starting when warm, burnt valve seats, and idle stalling.',
    safetyReminders: [
      'Engine MUST be 100% COLD (room temperature, stopped for at least 3 hours) before measuring valve clearances!',
      'Setting valves on a warm engine results in incorrect loose clearances and noisy engine clatter.'
    ],
    howToInterpretResults: '• Honda Click/Beat Spec: Intake 0.16mm (±0.02mm) / Exhaust 0.25mm (±0.02mm) OR Intake 0.08mm / Exhaust 0.12mm (check model spec sticker under seat).\n• Yamaha Mio i125 Spec: Intake 0.08 - 0.12mm / Exhaust 0.12 - 0.16mm.\n• Feeler Gauge Feel: Gauge blade should slip through valve stem top with slight drag (like pulling a playing card from a tight deck).',
    steps: [
      {
        stepNumber: 1,
        title: 'Remove Cylinder Head Tappet Covers',
        instruction: 'Remove cylinder head valve inspection covers (or valve cover valve cap bolts). Place container to catch small residual oil drips.',
        proTip: 'Clean valve cover perimeter so no dirt falls inside rocker arm area.'
      },
      {
        stepNumber: 2,
        title: 'Rotate Crankshaft to Top Dead Center (TDC) Compression Stroke',
        instruction: 'Remove timing inspection plug on left crankcase cover. Turn flywheel bolt counter-clockwise with socket wrench until "T" mark aligns with index mark notch on crankcase, and both rocker arms have slight loose wiggle play.',
        warning: 'If "T" mark is aligned but rocker arms are stiff, engine is on TDC Exhaust stroke! Rotate flywheel 360 degrees more to reach TDC Compression stroke.'
      },
      {
        stepNumber: 3,
        title: 'Measure Clearance with Feeler Gauge Blade',
        instruction: 'Slide feeler gauge blade corresponding to OEM spec between rocker arm adjustment screw tip and valve stem top.',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
      },
      {
        stepNumber: 4,
        title: 'Adjust Screws & Torque Locknut',
        instruction: 'Loosen 10mm locknut. Use square tappet tool to adjust center screw until feeler gauge slides with smooth light drag. Hold square tool stationary while tightening 10mm locknut securely.',
        proTip: 'Re-check clearance with feeler gauge after tightening locknut as locknut torque can slightly alter gap setting.'
      }
    ]
  }
];

export const SEED_PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: 'cat_wont_start',
    title: "Won't Start / No Crank or No Fire",
    iconName: 'PowerOff',
    description: 'Engine will not start when starter button is pressed or kickstart is kicked.'
  },
  {
    id: 'cat_fi_light',
    title: 'FI Warning Light ON / Blinking',
    iconName: 'AlertTriangle',
    description: 'Instrument cluster FI / Engine Check lamp stays lit or blinks error code.'
  },
  {
    id: 'cat_acceleration',
    title: 'Poor Acceleration & CVT Drag',
    iconName: 'Gauge',
    description: 'Engine revs up but motorcycle responds slowly, vibrates at low speed, or bogs down.'
  },
  {
    id: 'cat_electrical',
    title: 'Battery Draining & Electrical Faults',
    iconName: 'Zap',
    description: 'Battery dies frequently, lights flicker, horn weak, or starter solenoid clicks.'
  },
  {
    id: 'cat_brakes',
    title: 'Brake Softness & Squealing Noise',
    iconName: 'ShieldAlert',
    description: 'Spongy brake lever, fading stopping power, or sharp grinding sound.'
  },
  {
    id: 'cat_overheating',
    title: 'Engine Overheating & Coolant Issues',
    iconName: 'Thermometer',
    description: 'High temperature warning light ON, coolant boiling over, or engine power loss when hot.'
  }
];

export const SEED_SYMPTOMS: Symptom[] = [
  {
    id: 'sym_cranks_no_start',
    categoryId: 'cat_wont_start',
    title: 'Engine Cranks / Turns Over normally, but Will NOT Fire / Start',
    description: 'Starter motor turns engine flywheel strongly, but engine refuses to catch and run.',
    initialNodeId: 'node_crank_1_spark'
  },
  {
    id: 'sym_no_crank_silent',
    categoryId: 'cat_wont_start',
    title: 'Starter Button Pressed: Complete Silence or Clicking Sound (No Crank)',
    description: 'Pressing starter switch produces a single click sound or total silence without engine turning.',
    initialNodeId: 'node_nocrank_1_battery'
  },
  {
    id: 'sym_cvt_drag_vibration',
    categoryId: 'cat_acceleration',
    title: 'Scooter Dragging / Heavy Vibration at 10-30 km/h (Kalog / Drag)',
    description: 'When taking off from stop, scooter shakes or drags violently before smoothing out at higher speed.',
    initialNodeId: 'node_cvt_1_bell'
  },
  {
    id: 'sym_battery_draining',
    categoryId: 'cat_electrical',
    title: 'Battery Keeps Draining / Weak Horn & Headlights at Idle',
    description: 'Battery dies after 1-2 days of standing or riding; requires constant jump starting or kickstart.',
    initialNodeId: 'node_elec_1_voltage'
  },
  {
    id: 'sym_brakes_spongy',
    categoryId: 'cat_brakes',
    title: 'Front Brake Lever Lever Feels Spongy & Needs Double Pumping',
    description: 'Brake lever pulls all the way to handlebar grip without firm hydraulic stopping pressure.',
    initialNodeId: 'node_brake_1_fluid'
  }
];

export const SEED_NODES: Record<string, TroubleshootingNode> = {
  // --- TREE 1: Engine Cranks but Won't Start ---
  'node_crank_1_spark': {
    id: 'node_crank_1_spark',
    symptomId: 'sym_cranks_no_start',
    inspectionStep: {
      id: 'step_spark_test',
      title: 'Inspection 1: Spark Plug High Voltage Ignition Test',
      whatToInspect: 'Check whether ignition system is sending strong electric spark across spark plug gap.',
      whyItMatters: 'Engine combustion requires three essential elements: Spark, Air-Fuel Mixture, and Compression. Over 50% of non-starting issues are due to missing or weak ignition spark.',
      locationDescription: 'Cylinder head spark plug well (accessible under seat door or front maintenance panel).',
      requiredTools: ['Spark Plug Socket Wrench', 'Insulated Pliers', 'Leather / Nitrile Gloves'],
      procedure: [
        '1. Turn ignition switch OFF.',
        '2. Remove spark plug boot and unscrew spark plug using plug socket.',
        '3. Re-insert spark plug into rubber boot cap.',
        '4. Using insulated pliers, hold metal threaded body of spark plug firmly against bare unpainted engine cylinder head metal.',
        '5. Turn ignition key ON, set kill switch to RUN, and press starter button for 2-3 seconds while observing electrode tip.'
      ],
      normalCondition: 'Bright BLUE-WHITE sharp spark jumps crisp across electrode gap with audible snap sound.',
      abnormalCondition: 'NO spark at all, or tiny faint YELLOW/ORANGE weak spark.',
      safetyReminders: [
        'Do NOT touch metal plug body with bare fingers during cranking (15,000V electric shock risk!).',
        'Ensure spark plug is kept away from open spark plug hole so gasoline vapor inside cylinder does not ignite!'
      ]
    },
    nextStepOnNormalId: 'node_crank_2_fuel',
    nextStepOnAbnormalId: 'node_crank_3_ignition_components',
    diagnosisIfAbnormal: {
      mostLikelyCause: 'Defective Spark Plug or Faulty Ignition System (Cap / Coil / Stator Pulsar)',
      otherCauses: ['Fouled carbonized spark plug', 'Loose spark plug cap thread', 'Blown ignition fuse', 'Side-stand switch fault'],
      explanation: 'Without ignition spark, fuel in cylinder cannot ignite regardless of fuel pressure.',
      recommendedRepair: 'Replace spark plug with new correct NGK/Denso plug. Check spark plug cap resistance (~5k Ohm) and ignition coil primary harness connections.',
      relatedGuideId: 'rg_spark_plug',
      relatedTechniqueId: 'tg_multimeter',
      difficulty: 'Beginner',
      estimatedMinutes: 20,
      requiredTools: ['Spark Plug Socket', 'New Spark Plug']
    }
  },

  'node_crank_2_fuel': {
    id: 'node_crank_2_fuel',
    symptomId: 'sym_cranks_no_start',
    inspectionStep: {
      id: 'step_fuel_test',
      title: 'Inspection 2: Fuel Delivery & Pump Prime Pressure Test',
      whatToInspect: 'Check whether fuel pump primes upon key ON and supplies fuel to the cylinder.',
      whyItMatters: 'Since ignition spark is confirmed NORMAL, the engine is likely starved of fuel due to a clogged fuel strainer filter, dead fuel pump motor, or clogged injector.',
      locationDescription: 'Under seat inside fuel tank (Fuel Pump) and throttle body intake (Fuel Injector).',
      requiredTools: ['Clean Towel', 'Multimeter', 'Fuel Pressure Tester (Optional)'],
      procedure: [
        '1. Turn ignition key OFF.',
        '2. Place ear near under-seat fuel tank area.',
        '3. Turn ignition key switch ON while listening closely.',
        '4. Listen for 2-second electric motor hum sound ("whirrr-click") as fuel pump primes.',
        '5. After cranking engine 5 seconds, unscrew spark plug and smell electrode tip.'
      ],
      normalCondition: 'Fuel pump hums clearly for 2 seconds on key ON. Spark plug electrode smells distinctly of fresh gasoline (wet cylinder priming).',
      abnormalCondition: 'Complete silence (no fuel pump hum sound), OR spark plug electrode remains bone dry with zero fuel odor after 5 seconds cranking.',
      safetyReminders: ['No smoking or open flames nearby open fuel lines!']
    },
    nextStepOnNormalId: 'node_crank_4_compression',
    nextStepOnAbnormalId: 'node_crank_5_fuel_system_fault',
    diagnosisIfAbnormal: {
      mostLikelyCause: 'Fuel Pump Failure, Clogged Fuel Strainer Filter, or Blown FI Relay/Fuse',
      otherCauses: ['Clogged Fuel Injector nozzle', 'Contaminated water in gasoline tank', 'ECU fuel pump signal line wire cut'],
      explanation: 'The fuel pump is not delivering pressurized gasoline to the injector nozzle.',
      recommendedRepair: 'Check 10A FI fuse in fuse box. Check fuel pump 4-pin socket voltage (12V on prime). Clean or replace fuel pump tea-bag strainer and filter.',
      relatedGuideId: 'rg_fuel_pump',
      relatedTechniqueId: 'tg_fuel_pressure',
      difficulty: 'Intermediate',
      estimatedMinutes: 40,
      requiredTools: ['10mm Socket', 'New Fuel Filter Strainer']
    }
  },

  'node_crank_4_compression': {
    id: 'node_crank_4_compression',
    symptomId: 'sym_cranks_no_start',
    inspectionStep: {
      id: 'step_compression_check',
      title: 'Inspection 3: Cylinder Engine Compression Test',
      whatToInspect: 'Measure engine cylinder compression pressure using a compression gauge or thumb seal check.',
      whyItMatters: 'Since Spark and Fuel are BOTH confirmed normal, the engine cannot start because cylinder compression is too low to create heat needed for air-fuel ignition.',
      locationDescription: 'Cylinder head spark plug hole.',
      requiredTools: ['Compression Gauge Tester', 'Spark Plug Socket'],
      procedure: [
        '1. Thread compression tester gauge into spark plug hole.',
        '2. Hold throttle 100% WIDE OPEN.',
        '3. Crank engine with starter button for 5 seconds.',
        '4. Read peak pressure PSI value on gauge scale.'
      ],
      normalCondition: 'Compression gauge reads 130 PSI to 170 PSI.',
      abnormalCondition: 'Compression is BELOW 100 PSI (or zero resistance felt over plug hole).',
      safetyReminders: ['Hold throttle wide open during crank test!']
    },
    nextStepOnNormalId: undefined,
    diagnosisIfAbnormal: {
      mostLikelyCause: 'Tight Valve Clearance (Valves Stuck Open) or Worn Piston Rings / Scored Cylinder',
      otherCauses: ['Blown cylinder head gasket', 'Decompression mechanism stuck on camshaft'],
      explanation: 'Low compression prevents the fuel mixture from atomizing and igniting under pressure.',
      recommendedRepair: 'Perform Valve Clearance Inspection & Adjustment using feeler gauge. If valves are within spec, perform wet compression test to inspect piston rings.',
      relatedGuideId: undefined,
      relatedTechniqueId: 'tg_valve_clearance',
      difficulty: 'Advanced',
      estimatedMinutes: 45,
      requiredTools: ['Feeler Gauge', 'Tappet Wrench']
    },
    diagnosisIfNormal: {
      mostLikelyCause: 'Engine Flood Condition or Incorrect Ignition/Engine Timing',
      otherCauses: ['Bad engine oil quality / contaminated gas', 'Corrupted TPS zero-point learning'],
      explanation: 'Engine has spark, fuel, and compression. Cylinder may be flooded with excess fuel or ignition timing is offset.',
      recommendedRepair: 'Hold throttle wide open while cranking for 5 seconds to clear flooded intake cylinder. Check flywheel woodruff key alignment.',
      difficulty: 'Intermediate',
      estimatedMinutes: 20,
      requiredTools: ['Spark Plug Wrench']
    }
  },

  // --- TREE 2: Starter Button Silent / No Crank ---
  'node_nocrank_1_battery': {
    id: 'node_nocrank_1_battery',
    symptomId: 'sym_no_crank_silent',
    inspectionStep: {
      id: 'step_battery_voltage',
      title: 'Inspection 1: Battery Terminal Voltage & Load Voltage Check',
      whatToInspect: 'Measure 12V battery open terminal resting voltage using multimeter.',
      whyItMatters: 'The starter solenoid and motor draw over 40 Amperes during startup. A weak battery cannot turn the heavy engine flywheel.',
      locationDescription: 'Under seat or floorboard battery compartment.',
      requiredTools: ['Digital Multimeter set to 20V DC', 'Phillips Screwdriver'],
      procedure: [
        '1. Set multimeter dial to 20V DC.',
        '2. Place Red probe on (+) terminal and Black probe on (-) terminal.',
        '3. Read resting voltage.',
        '4. Press starter button while holding probes on terminals and observe voltage drop.'
      ],
      normalCondition: 'Resting voltage = 12.6V+. When starter button is pressed, voltage remains ABOVE 10.5V.',
      abnormalCondition: 'Resting voltage is BELOW 12.0V, OR voltage plunges down below 9.0V when starter button is pressed.',
      safetyReminders: ['Ensure probes do not short positive terminal against frame metal!']
    },
    nextStepOnNormalId: 'node_nocrank_2_brake_switch',
    nextStepOnAbnormalId: undefined,
    diagnosisIfAbnormal: {
      mostLikelyCause: 'Discharged or Dead 12V Battery / Corroded Battery Terminals',
      otherCauses: ['Faulty stator charging system', 'Short circuit parasitic battery drain'],
      explanation: 'The battery does not have enough stored electrical energy to energize the starter motor.',
      recommendedRepair: 'Clean terminal post corrosion with wire brush. Recharge battery with 12V motorcycle charger. If battery will not hold 12.6V charge, replace battery.',
      relatedGuideId: 'rg_battery_replace',
      relatedTechniqueId: 'tg_multimeter',
      difficulty: 'Beginner',
      estimatedMinutes: 15,
      requiredTools: ['Phillips Screwdriver', 'Multimeter', 'New Battery']
    }
  },

  'node_nocrank_2_brake_switch': {
    id: 'node_nocrank_2_brake_switch',
    symptomId: 'sym_no_crank_silent',
    inspectionStep: {
      id: 'step_brake_switch_check',
      title: 'Inspection 2: Brake Safety Light Switch & Side Stand Switch Test',
      whatToInspect: 'Check whether brake light illuminates brightly on dashboard/rear tail when brake lever is pulled.',
      whyItMatters: 'Modern scooters require the brake lever to be squeezed (to send 12V signal through safety switch) before starter relay will energize.',
      locationDescription: 'Front and rear brake lever pivot perches and side stand pivot bolt.',
      requiredTools: ['Visual inspection', 'Multimeter continuity test'],
      procedure: [
        '1. Turn ignition switch ON.',
        '2. Squeeze left brake lever firmly and observe rear brake taillight.',
        '3. Squeeze right brake lever firmly and observe rear brake taillight.',
        '4. Check side stand is fully flipped UP in retracted position.'
      ],
      normalCondition: 'Rear brake taillight lights up brightly for BOTH left and right brake levers.',
      abnormalCondition: 'Taillight does NOT light up when lever is squeezed, or lights up weakly.',
      safetyReminders: ['Ensure side stand is fully retracted.']
    },
    nextStepOnNormalId: undefined,
    diagnosisIfAbnormal: {
      mostLikelyCause: 'Defective Brake Light Switch / Corroded Switch Contacts or Side Stand Safety Switch',
      otherCauses: ['Blown brake light fuse', 'Broken brake lever wire harness'],
      explanation: 'The starter circuit safety interlock is blocking electrical current to the starter solenoid because it does not register brake lever engagement.',
      recommendedRepair: 'Spray electrical contact cleaner into brake switch boot mechanism. If taillight still fails, replace 150-peso brake lever switch.',
      difficulty: 'Beginner',
      estimatedMinutes: 15,
      requiredTools: ['Phillips Screwdriver', 'Contact Cleaner']
    },
    diagnosisIfNormal: {
      mostLikelyCause: 'Faulty Starter Relay Solenoid or Worn Starter Motor Carbon Brushes',
      otherCauses: ['Corroded starter handlebar button contacts', 'Main starter cable wire break'],
      explanation: 'Power reaches safety switches, but starter relay switch contacts inside solenoid are burned or starter motor carbon brushes are worn down.',
      recommendedRepair: 'Perform bypass test on starter relay terminals with jumper wire. If starter spins during bypass, replace starter relay solenoid.',
      difficulty: 'Intermediate',
      estimatedMinutes: 25,
      requiredTools: ['Multimeter', 'Jumper Wire']
    }
  },

  // --- TREE 3: Scooter Dragging / Kalog Vibration ---
  'node_cvt_1_bell': {
    id: 'node_cvt_1_bell',
    symptomId: 'sym_cvt_drag_vibration',
    inspectionStep: {
      id: 'step_cvt_clutch_inspection',
      title: 'Inspection 1: Rear Clutch Bell Outer & Flyweight Shoe Friction Inspection',
      whatToInspect: 'Remove left CVT cover and inspect inner surface of outer steel clutch bell and clutch shoe friction lining thickness.',
      whyItMatters: 'CVT shudder/drag (kalog) occurs when rear centrifugal clutch shoes slip unevenly against a glazed or heat-warped clutch bell surface during initial engagement.',
      locationDescription: 'Inside rear left CVT transmission cover housing.',
      requiredTools: ['8mm T-Wrench', '14mm/19mm Socket Wrench', 'Universal Pulley Y-Holder Tool', 'Brake Cleaner Spray', 'Fine Sandpaper (240 Grit)'],
      procedure: [
        '1. Remove 8mm CVT cover bolts and take off aluminum cover.',
        '2. Remove clutch shaft nut using pulley holder tool and 14mm socket.',
        '3. Pull off outer steel clutch bell.',
        '4. Inspect inner circumference of clutch bell for dark purple heat glaze patches or oily dust.',
        '5. Measure clutch shoe lining friction pad thickness with ruler.'
      ],
      normalCondition: 'Clutch bell inner wall is clean uniform gray steel. Clutch shoe lining thickness is ABOVE 2.0mm with smooth clean friction surface.',
      abnormalCondition: 'Clutch bell inner wall is shiny glazed, mirror-smooth, or discolored dark purple/blue from overheating. Clutch shoe pads are covered in black glassy glaze or worn below 1.0mm.',
      safetyReminders: ['Do not touch hot clutch bell with bare hands after test ride!']
    },
    nextStepOnNormalId: 'node_cvt_2_rollers',
    nextStepOnAbnormalId: undefined,
    diagnosisIfAbnormal: {
      mostLikelyCause: 'Glazed Clutch Bell & Clutch Shoe Pads / CVT Belt Dust Contamination',
      otherCauses: ['Weak clutch shoe return springs', 'Leaking rear driven pulley grease seal'],
      explanation: 'Smooth glazed metal loses friction coefficient, causing the clutch shoes to grab and slip rapidly (shudder) against the bell.',
      recommendedRepair: 'Degrease clutch bell with brake cleaner spray. Lightly sand inner bell surface and clutch shoe pads with 240-grit sandpaper in cross-hatch pattern to restore friction grip.',
      relatedGuideId: 'rg_cvt_belt_rollers',
      relatedTechniqueId: undefined,
      difficulty: 'Intermediate',
      estimatedMinutes: 30,
      requiredTools: ['Pulley Holder', '240 Grit Sandpaper', 'Brake Cleaner']
    }
  },

  'node_cvt_2_rollers': {
    id: 'node_cvt_2_rollers',
    symptomId: 'sym_cvt_drag_vibration',
    inspectionStep: {
      id: 'step_cvt_rollers_check',
      title: 'Inspection 2: Flyball Roller Weight Flat Spot & Slider Piece Inspection',
      whatToInspect: 'Disassemble front variator movable pulley and inspect roundness of all 6 flyball roller weights.',
      whyItMatters: 'Flyball rollers must roll smoothly up variator ramp tracks to expand front pulley sheaves seamlessly. Flat spots cause sticky gear-ratio shifting and RPM vibration.',
      locationDescription: 'Front variator pulley on crankshaft shaft.',
      requiredTools: ['17mm Socket Wrench', 'Pulley Y-Holder Tool'],
      procedure: [
        '1. Remove front drive face plate 17mm nut.',
        '2. Slide off variator assembly.',
        '3. Inspect outer plastic circumference of all 6 rollers.'
      ],
      normalCondition: 'All 6 rollers are perfectly round without flat spots or cracks. Ramp plate slider plastic guides fit snug.',
      abnormalCondition: 'One or more rollers have distinct flat spots, gouges, or brass core exposed.',
      safetyReminders: ['Ensure variator splines are clean.']
    },
    nextStepOnNormalId: undefined,
    diagnosisIfAbnormal: {
      mostLikelyCause: 'Worn Flat-Spotted CVT Rollers & Stretched Drive Belt',
      otherCauses: ['Grooved variator face plate', 'Worn torque dome slider pins'],
      explanation: 'Flat rollers lock in ramp tracks, preventing smooth expansion of front drive sheaves.',
      recommendedRepair: 'Replace all 6 flyball rollers as a set with OEM weight spec (e.g. 15g for Honda Click, 10g for Mio i125). Clean variator ramp tracks.',
      relatedGuideId: 'rg_cvt_belt_rollers',
      difficulty: 'Intermediate',
      estimatedMinutes: 40,
      requiredTools: ['New Set of 6 Flyball Rollers', 'Pulley Tool']
    },
    diagnosisIfNormal: {
      mostLikelyCause: 'Engine Rubber Mount Bushing Wear or Rear Engine Wheel Axle Bearing Play',
      otherCauses: ['Imbalanced rear tire rim', 'Exhaust pipe loose mounting bracket'],
      explanation: 'CVT components are healthy. Low speed vibration is being transmitted through worn chassis/engine rubber isolation mounts.',
      recommendedRepair: 'Inspect center engine hanger rubber mount bushings for cracks or looseness.',
      difficulty: 'Intermediate',
      estimatedMinutes: 30,
      requiredTools: ['12mm / 14mm Wrench']
    }
  }
};

export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    userId: 'u_mechanic_1',
    authorName: 'Kuya Ben Mechanic',
    authorRole: 'mechanic',
    motorcycleModelId: 'm_click125',
    motorcycleModelName: 'Honda Click 125i',
    title: 'Important tip for Honda Click 125/150: Fix low speed CVT shudder (kalog) without spending on aftermarket parts',
    content: 'Mga kapwa riders, bago kayo bumili ng mahal na aftermarket clutch assembly sa Shopee/Lazada, subukan niyo muna linisin ang stock clutch bell gamit ang brake cleaner at liha (240 grit sandpaper). Karamihan ng kalog sa Click 125 ay dahil sa accumulated belt dust at oil glaze. Huwag din kailanman lalagyan ng langis o grasa ang clutch bell!',
    category: 'Maintenance Tip',
    symptomTag: 'CVT Drag / Vibration',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    likedBy: ['u_rider_1', 'u_student_1'],
    commentsCount: 8,
    isSolved: true,
    status: 'approved',
    ratings: { 'u_rider_1': 5, 'u_student_1': 5, 'u_admin_1': 5 },
    averageRating: 5.0,
    ratingCount: 3,
    createdAt: '2026-07-28T10:30:00Z'
  },
  {
    id: 'post_2',
    userId: 'u_rider_1',
    authorName: 'Mark R.',
    authorRole: 'rider',
    motorcycleModelId: 'm_nmax155',
    motorcycleModelName: 'Yamaha NMAX 155 V2',
    title: 'Error Code 12 prevention for Yamaha NMAX / Aerox riders in rainy weather',
    content: 'Share ko lang experience ko, nag stall bigla si NMAX sa flood tapm; Error Code 12 ang lumabas sa panel. Visual inspection revealed socket melting near stator wire harness connector due to loose connection. Proactive tip: Apply dielectric grease and inspect socket tension every 10,000 km.',
    category: 'Troubleshooting Help',
    symptomTag: 'FI Light ON / Error Code',
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    likes: 29,
    likedBy: ['u_mechanic_1'],
    commentsCount: 5,
    isSolved: true,
    status: 'approved',
    ratings: { 'u_mechanic_1': 5, 'u_admin_1': 4 },
    averageRating: 4.5,
    ratingCount: 2,
    createdAt: '2026-07-30T14:15:00Z'
  },
  {
    id: 'post_3',
    userId: 'u_student_1',
    authorName: 'Carlo Mendoza',
    authorRole: 'student',
    motorcycleModelId: 'm_click125',
    motorcycleModelName: 'Honda Click 125i',
    title: 'How to test battery health using a cheap digital multimeter?',
    content: 'Good day mechanics! I bought a digital multimeter and want to check if my Honda Click battery voltage is drop-testing correctly during engine crank. What DC voltage reading should I expect while hitting the starter button?',
    category: 'Troubleshooting Help',
    symptomTag: 'Battery & Starting',
    likes: 12,
    likedBy: ['u_rider_1'],
    commentsCount: 2,
    isSolved: false,
    status: 'approved',
    ratings: { 'u_mechanic_1': 4 },
    averageRating: 4.0,
    ratingCount: 1,
    createdAt: '2026-08-01T09:10:00Z'
  },
  {
    id: 'post_4',
    userId: 'u_guest_spam',
    authorName: 'CryptoBot99',
    authorRole: 'rider',
    title: 'EARN 5000 PESOS DAILY ONLINE CLICK THIS LINK FAST http://crypto-ph-claim.biz',
    content: 'Earn free money fast no capital needed telegram @cryptolink guaranteed payout whatsapp 09991234567 buy now fast',
    category: 'General',
    likes: 0,
    likedBy: [],
    commentsCount: 0,
    isSolved: false,
    status: 'pending',
    spamFlagged: true,
    spamReason: 'Contains suspicious promotional external URL & spam phrases (http://, crypto, earn money)',
    ratings: {},
    averageRating: 0,
    ratingCount: 0,
    createdAt: '2026-08-02T18:22:00Z'
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'u_rider_1',
    name: 'Juan Dela Cruz',
    email: 'rider@motorel.ph',
    role: 'rider',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    favoriteMotorcycleIds: ['m_click125', 'm_nmax155'],
    savedGuideIds: ['rg_engine_oil', 'rg_cvt_belt_rollers'],
    savedTroubleshootingIds: ['sym_cranks_no_start'],
    completedGuideIds: ['rg_engine_oil', 'rg_air_filter'],
    learningProgress: {
      'rg_engine_oil': 100,
      'rg_air_filter': 100,
      'tg_multimeter': 60
    },
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'u_mechanic_1',
    name: 'Master Benjie (Mechanic)',
    email: 'mechanic@motorel.ph',
    role: 'mechanic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    favoriteMotorcycleIds: ['m_click125', 'm_raider150', 'm_sniper155'],
    savedGuideIds: ['rg_fuel_pump', 'rg_brake_pads'],
    savedTroubleshootingIds: ['sym_cvt_drag_vibration'],
    completedGuideIds: ['rg_engine_oil', 'rg_air_filter', 'rg_spark_plug', 'rg_cvt_belt_rollers', 'rg_brake_pads', 'rg_battery_replace', 'rg_fuel_pump'],
    learningProgress: {
      'rg_engine_oil': 100,
      'tg_multimeter': 100,
      'tg_compression_test': 100,
      'tg_valve_clearance': 100
    },
    createdAt: '2025-11-20T08:00:00Z'
  },
  {
    id: 'u_admin_1',
    name: 'Motorel Admin',
    email: 'admin@motorel.ph',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    favoriteMotorcycleIds: ['m_click125', 'm_mioi125', 'm_wave110'],
    savedGuideIds: [],
    savedTroubleshootingIds: [],
    completedGuideIds: [],
    learningProgress: {},
    createdAt: '2025-01-01T08:00:00Z'
  },
  {
    id: 'u_admin_2',
    name: 'Zerel Pingkian (Admin)',
    email: 'zerelpingkian@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    favoriteMotorcycleIds: ['m_click125', 'm_nmax155', 'm_raider150'],
    savedGuideIds: [],
    savedTroubleshootingIds: [],
    completedGuideIds: [],
    learningProgress: {},
    createdAt: '2025-01-01T08:00:00Z'
  }
];
