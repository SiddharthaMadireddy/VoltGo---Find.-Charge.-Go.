import { ChargingStation, chargers, ConnectorType, CurrentType, ChargerStatus } from './stations';

const cities = [
  { city: 'Mumbai', latBase: 40, lngBase: 25 },
  { city: 'Bengaluru', latBase: 65, lngBase: 45 },
  { city: 'Delhi', latBase: 15, lngBase: 35 },
  { city: 'Chennai', latBase: 70, lngBase: 55 },
  { city: 'Pune', latBase: 45, lngBase: 30 }
];

const areas: Record<string, string[]> = {
  Mumbai: ['Bandra', 'Andheri', 'Powai', 'Worli', 'Juhu', 'Colaba', 'Malad', 'Thane'],
  Bengaluru: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Malleswaram', 'Electronic City'],
  Delhi: ['Connaught Place', 'Vasant Kunj', 'Saket', 'Dwarka', 'Karol Bagh', 'Hauz Khas', 'Rohini'],
  Chennai: ['T Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Alwarpet', 'Mylapore'],
  Pune: ['Koregaon Park', 'Viman Nagar', 'Hinjewadi', 'Baner', 'Kalyani Nagar', 'Aundh']
};

const extra: ChargingStation[] = [];
let idCounter = 100;

cities.forEach((c) => {
  areas[c.city].forEach((area, index) => {
    idCounter++;
    
    // Generate some random looking coords around the base
    const lat = Math.max(0, Math.min(100, c.latBase + (Math.random() * 10 - 5)));
    const lng = Math.max(0, Math.min(100, c.lngBase + (Math.random() * 10 - 5)));
    const distanceKm = Math.round((Math.random() * 20 + 2) * 10) / 10;
    const rating = Math.round((Math.random() * 1 + 3.8) * 10) / 10;
    const reviews = Math.floor(Math.random() * 2000) + 10;
    
    const isFast = Math.random() > 0.3;
    const isFree = Math.random() > 0.9;
    
    // Generate random chargers
    const numChargers = Math.floor(Math.random() * 6) + 2;
    const chargerSpecs: Array<[ConnectorType, CurrentType, number, ChargerStatus, [number, number]]> = [];
    
    for (let i = 0; i < numChargers; i++) {
      const isDc = isFast && Math.random() > 0.4;
      const type: ConnectorType = isDc ? (Math.random() > 0.2 ? 'CCS2' : (Math.random() > 0.5 ? 'CHAdeMO' : 'GB/T')) : 'Type 2';
      const current: CurrentType = isDc ? 'DC' : 'AC';
      const kw = isDc ? (Math.random() > 0.5 ? 60 : 120) : (Math.random() > 0.5 ? 22 : 7.4);
      const statuses: ChargerStatus[] = ['available', 'available', 'occupied', 'offline'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const timeBase = isDc ? 20 : 180;
      const min = timeBase + Math.floor(Math.random() * 20);
      const max = min + Math.floor(Math.random() * 30);
      
      chargerSpecs.push([type, current, kw, status, [min, max]]);
    }
    
    const availableCount = chargerSpecs.filter(s => s[3] === 'available').length;
    let stationStatus: ChargingStation['status'] = 'available';
    if (availableCount === 0) stationStatus = 'occupied';
    else if (availableCount < chargerSpecs.length / 2) stationStatus = 'limited';
    
    extra.push({
      id: `st-ext-${idCounter}`,
      name: `VoltGo ${area}`,
      city: c.city,
      area: area,
      address: `Main Road, ${area}, ${c.city}`,
      distanceKm,
      lat,
      lng,
      rating,
      reviews,
      open247: Math.random() > 0.2,
      hours: Math.random() > 0.2 ? '24/7' : '6:00 AM - 11:00 PM',
      status: stationStatus,
      freeCharging: isFree,
      fastCharging: isFast,
      amenities: ['wifi', 'parking', 'restroom', Math.random() > 0.5 ? 'cafe' : 'store'],
      chargers: chargers(chargerSpecs, isFree ? 0 : 18),
      parkingFeePerHour: Math.floor(Math.random() * 3) * 10 + 20,
      idleFeePerMin: Math.floor(Math.random() * 5) + 3,
      reservationFee: 10
    });
  });
});

const highways = [
  { route: 'Mumbai-Pune Expressway', city: 'Highway', latBase: 42, lngBase: 27 },
  { route: 'Delhi-Agra Expressway', city: 'Highway', latBase: 18, lngBase: 38 },
  { route: 'Bengaluru-Chennai Highway', city: 'Highway', latBase: 68, lngBase: 50 },
  { route: 'Hyderabad-Vijayawada Highway', city: 'Highway', latBase: 35, lngBase: 40 },
  { route: 'NH 48 (Delhi-Mumbai)', city: 'Highway', latBase: 25, lngBase: 30 },
  { route: 'NH 44 (North-South Corridor)', city: 'Highway', latBase: 50, lngBase: 40 },
  { route: 'NH 27 (East-West Corridor)', city: 'Highway', latBase: 30, lngBase: 60 },
  { route: 'NH 19 (Delhi-Kolkata)', city: 'Highway', latBase: 20, lngBase: 55 },
  { route: 'Mumbai-Goa Highway', city: 'Highway', latBase: 50, lngBase: 26 },
  { route: 'Ahmedabad-Vadodara Expressway', city: 'Highway', latBase: 30, lngBase: 25 },
  { route: 'Purvanchal Expressway', city: 'Highway', latBase: 22, lngBase: 50 },
  { route: 'Delhi-Jaipur Highway', city: 'Highway', latBase: 20, lngBase: 32 },
  { route: 'Eastern Peripheral Expressway', city: 'Highway', latBase: 16, lngBase: 38 },
  { route: 'Hyderabad-Bengaluru Highway', city: 'Highway', latBase: 50, lngBase: 42 },
  { route: 'Pune-Nashik Highway', city: 'Highway', latBase: 38, lngBase: 28 },
  { route: 'Chennai-Kolkata Highway', city: 'Highway', latBase: 45, lngBase: 65 },
  { route: 'Bengaluru-Mysuru Expressway', city: 'Highway', latBase: 70, lngBase: 44 }
];

highways.forEach((h) => {
  for (let i = 1; i <= 3; i++) {
    idCounter++;
    
    const lat = Math.max(0, Math.min(100, h.latBase + (Math.random() * 8 - 4)));
    const lng = Math.max(0, Math.min(100, h.lngBase + (Math.random() * 8 - 4)));
    
    const numChargers = Math.floor(Math.random() * 4) + 4; // 4 to 7 chargers
    const chargerSpecs: Array<[ConnectorType, CurrentType, number, ChargerStatus, [number, number]]> = [];
    
    for (let c = 0; c < numChargers; c++) {
      const isUltra = Math.random() > 0.4;
      const kw = isUltra ? (Math.random() > 0.5 ? 350 : 150) : 60;
      const statuses: ChargerStatus[] = ['available', 'available', 'occupied'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      chargerSpecs.push(['CCS2', 'DC', kw, status, [15, 25]]);
    }
    
    const availableCount = chargerSpecs.filter(s => s[3] === 'available').length;
    let stationStatus: ChargingStation['status'] = 'available';
    if (availableCount === 0) stationStatus = 'occupied';
    else if (availableCount < chargerSpecs.length / 2) stationStatus = 'limited';
    
    extra.push({
      id: `st-hw-${idCounter}`,
      name: `VoltGo Premium - ${h.route} KM ${Math.floor(Math.random() * 150) + 20}`,
      city: h.city,
      area: 'Highway Service Area',
      address: `Food Court & Rest Area, ${h.route}`,
      distanceKm: Math.round((Math.random() * 100 + 40) * 10) / 10,
      lat,
      lng,
      rating: Math.round((Math.random() * 0.3 + 4.7) * 10) / 10,
      reviews: Math.floor(Math.random() * 500) + 50,
      open247: true,
      hours: '24/7',
      status: stationStatus,
      freeCharging: false,
      fastCharging: true,
      amenities: ['restaurant', 'cafe', 'restroom', 'parking', 'wifi', 'lounge', 'cctv', 'card'],
      chargers: chargers(chargerSpecs, 35), // Expensive: ₹35/kWh
      parkingFeePerHour: 0,
      idleFeePerMin: 15,
      reservationFee: 25
    });
  }
});

export const MORE_STATIONS = extra;
