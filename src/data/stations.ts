export type ChargerStatus = 'available' | 'occupied' | 'offline';
export type ConnectorType = 'CCS2' | 'Type 2' | 'CHAdeMO' | 'GB/T';
export type CurrentType = 'AC' | 'DC';
import { MORE_STATIONS } from './extraStations';

export interface Charger {
  id: string;
  label: string;
  connector: ConnectorType;
  current: CurrentType;
  powerKw: number;
  status: ChargerStatus;
  estMinutes: [number, number];
  pricePerKwh: number;
}

export type StationStatus = 'available' | 'limited' | 'occupied' | 'offline';
export type AmenityKey =
  | 'cafe' | 'restroom' | 'parking' | 'wifi' | 'restaurant'
  | 'store' | 'lounge' | 'cctv' | 'card' | 'batterySwap';

export interface ChargingStation {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  distanceKm: number;
  lat: number; // 0-100 percentage position on the stylized map
  lng: number;
  rating: number;
  reviews: number;
  open247: boolean;
  hours: string;
  status: StationStatus;
  freeCharging: boolean;
  fastCharging: boolean;
  amenities: AmenityKey[];
  chargers: Charger[];
  parkingFeePerHour: number;
  idleFeePerMin: number;
  reservationFee: number;
}

export const AMENITIES: Record<AmenityKey, { label: string; emoji: string }> = {
  cafe: { label: 'Café', emoji: '☕' },
  restroom: { label: 'Restrooms', emoji: '🚻' },
  parking: { label: 'Parking', emoji: '🅿️' },
  wifi: { label: 'Wi-Fi', emoji: '📶' },
  restaurant: { label: 'Restaurant', emoji: '🍴' },
  store: { label: 'Convenience Store', emoji: '🏪' },
  lounge: { label: 'Waiting Lounge', emoji: '❄️' },
  cctv: { label: 'CCTV', emoji: '🔒' },
  card: { label: 'Card Payment', emoji: '💳' },
  batterySwap: { label: 'Battery Swap', emoji: '🔋' },
};

export const CONNECTORS: Record<ConnectorType, {
  speed: string;
  current: CurrentType;
  maxPower: string;
  vehicles: string[];
  description: string;
}> = {
  'CCS2': {
    speed: 'DC Fast',
    current: 'DC',
    maxPower: '350 kW',
    vehicles: ['Hyundai IONIQ 5', 'Kia EV6', 'BMW i4', 'Mercedes EQS', 'Tata Nexon EV'],
    description: 'Combined Charging System — the dominant DC fast-charging standard in India and Europe.',
  },
  'Type 2': {
    speed: 'AC Fast',
    current: 'AC',
    maxPower: '22 kW',
    vehicles: ['Tesla Model 3', 'MG ZS EV', 'BYD Atto 3', 'Tata Tigor EV'],
    description: 'Universal AC connector for home, workplace and destination chargers.',
  },
  'CHAdeMO': {
    speed: 'DC Fast',
    current: 'DC',
    maxPower: '100 kW',
    vehicles: ['Nissan Leaf', 'Toyota bZ4X', 'Mahindra XUV400 (export)'],
    description: 'Japanese DC fast-charging standard, common on older EVs and select imports.',
  },
  'GB/T': {
    speed: 'DC Fast',
    current: 'DC',
    maxPower: '120 kW',
    vehicles: ['BYD e6', 'Tata Tigor EV (China)', 'Olectra-BYD bus'],
    description: 'Chinese charging standard used by BYD and commercial fleets.',
  },
};

export function chargers(
  specs: Array<[ConnectorType, CurrentType, number, ChargerStatus, [number, number]]>,
  pricePerKwh = 18,
): Charger[] {
  return specs.map((s, i) => ({
    id: `C${String(i + 1).padStart(2, '0')}`,
    label: `Charger #${String(i + 1).padStart(2, '0')}`,
    connector: s[0],
    current: s[1],
    powerKw: s[2],
    status: s[3],
    estMinutes: s[4],
    pricePerKwh,
  }));
}

export const STATIONS: ChargingStation[] = [
  {
    id: 'st-gachibowli',
    name: 'VoltGo Gachibowli',
    city: 'Hyderabad',
    area: 'Gachibowli',
    address: 'Plot 14, DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032',
    distanceKm: 2.4,
    lat: 38,
    lng: 32,
    rating: 4.7,
    reviews: 1284,
    open247: true,
    hours: '24/7',
    status: 'available',
    freeCharging: false,
    fastCharging: true,
    amenities: ['cafe', 'restroom', 'parking', 'wifi', 'lounge', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 120, 'available', [18, 28]],
      ['CCS2', 'DC', 120, 'occupied', [18, 28]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['CHAdeMO', 'DC', 50, 'available', [35, 50]],
      ['CHAdeMO', 'DC', 50, 'offline', [35, 50]],
    ]),
    parkingFeePerHour: 20,
    idleFeePerMin: 5,
    reservationFee: 10,
  },
  {
    id: 'st-hitech',
    name: 'VoltGo Hitech City',
    city: 'Hyderabad',
    area: 'Hitech City',
    address: 'Tower B, Mindspace MADHAVA, Hitech City, Hyderabad, Telangana 500081',
    distanceKm: 5.1,
    lat: 30,
    lng: 44,
    rating: 4.6,
    reviews: 968,
    open247: true,
    hours: '24/7',
    status: 'limited',
    freeCharging: false,
    fastCharging: true,
    amenities: ['restroom', 'parking', 'wifi', 'store', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['CHAdeMO', 'DC', 50, 'available', [35, 50]],
    ]),
    parkingFeePerHour: 30,
    idleFeePerMin: 5,
    reservationFee: 10,
  },
  {
    id: 'st-jubilee',
    name: 'VoltGo Jubilee Hills',
    city: 'Hyderabad',
    area: 'Jubilee Hills',
    address: 'Road No 36, Jubilee Hills, Hyderabad, Telangana 500033',
    distanceKm: 7.8,
    lat: 48,
    lng: 22,
    rating: 4.8,
    reviews: 742,
    open247: false,
    hours: '6:00 AM – 11:00 PM',
    status: 'available',
    freeCharging: false,
    fastCharging: true,
    amenities: ['cafe', 'restroom', 'parking', 'wifi', 'restaurant', 'lounge', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
    ]),
    parkingFeePerHour: 40,
    idleFeePerMin: 8,
    reservationFee: 15,
  },
  {
    id: 'st-banjara',
    name: 'VoltGo Banjara Hills',
    city: 'Hyderabad',
    area: 'Banjara Hills',
    address: 'Road No 12, Banjara Hills, Hyderabad, Telangana 500034',
    distanceKm: 9.2,
    lat: 54,
    lng: 30,
    rating: 4.5,
    reviews: 521,
    open247: false,
    hours: '7:00 AM – 10:00 PM',
    status: 'occupied',
    freeCharging: false,
    fastCharging: false,
    amenities: ['cafe', 'restroom', 'parking', 'cctv', 'card'],
    chargers: chargers([
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['Type 2', 'AC', 22, 'offline', [180, 240]],
    ]),
    parkingFeePerHour: 40,
    idleFeePerMin: 8,
    reservationFee: 15,
  },
  {
    id: 'st-airport',
    name: 'VoltGo Airport',
    city: 'Hyderabad',
    area: 'Shamshabad',
    address: 'RGIA Terminal Parking, Shamshabad, Hyderabad, Telangana 500409',
    distanceKm: 22.5,
    lat: 70,
    lng: 52,
    rating: 4.4,
    reviews: 1893,
    open247: true,
    hours: '24/7',
    status: 'limited',
    freeCharging: false,
    fastCharging: true,
    amenities: ['restroom', 'parking', 'wifi', 'store', 'lounge', 'cctv', 'card', 'batterySwap'],
    chargers: chargers([
      ['CCS2', 'DC', 120, 'available', [15, 25]],
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['CCS2', 'DC', 120, 'available', [15, 25]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 60, 'occupied', [30, 45]],
      ['CHAdeMO', 'DC', 50, 'available', [35, 50]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
    ]),
    parkingFeePerHour: 80,
    idleFeePerMin: 10,
    reservationFee: 20,
  },
  {
    id: 'st-madhapur',
    name: 'VoltGo Madhapur',
    city: 'Hyderabad',
    area: 'Madhapur',
    address: 'Image Hospital Road, Madhapur, Hyderabad, Telangana 500081',
    distanceKm: 4.6,
    lat: 34,
    lng: 38,
    rating: 4.6,
    reviews: 612,
    open247: true,
    hours: '24/7',
    status: 'available',
    freeCharging: true,
    fastCharging: true,
    amenities: ['cafe', 'restroom', 'parking', 'wifi', 'store', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
    ], 0),
    parkingFeePerHour: 20,
    idleFeePerMin: 5,
    reservationFee: 0,
  },
  {
    id: 'st-kondapur',
    name: 'VoltGo Kondapur',
    city: 'Hyderabad',
    area: 'Kondapur',
    address: 'Kothaguda X Roads, Kondapur, Hyderabad, Telangana 500084',
    distanceKm: 3.1,
    lat: 40,
    lng: 28,
    rating: 4.3,
    reviews: 388,
    open247: false,
    hours: '5:00 AM – 12:00 AM',
    status: 'offline',
    freeCharging: false,
    fastCharging: false,
    amenities: ['restroom', 'parking', 'cctv'],
    chargers: chargers([
      ['Type 2', 'AC', 22, 'offline', [180, 240]],
      ['Type 2', 'AC', 22, 'offline', [180, 240]],
      ['Type 2', 'AC', 22, 'offline', [180, 240]],
    ]),
    parkingFeePerHour: 20,
    idleFeePerMin: 5,
    reservationFee: 10,
  },
  {
    id: 'st-koramangala',
    name: 'VoltGo Koramangala',
    city: 'Bengaluru',
    area: 'Koramangala',
    address: '5th Block, 80 Feet Road, Koramangala, Bengaluru, Karnataka 560095',
    distanceKm: 6.8,
    lat: 62,
    lng: 64,
    rating: 4.7,
    reviews: 1042,
    open247: true,
    hours: '24/7',
    status: 'available',
    freeCharging: false,
    fastCharging: true,
    amenities: ['cafe', 'restroom', 'parking', 'wifi', 'restaurant', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 120, 'available', [15, 25]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 60, 'occupied', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['CHAdeMO', 'DC', 50, 'available', [35, 50]],
    ]),
    parkingFeePerHour: 30,
    idleFeePerMin: 6,
    reservationFee: 10,
  },
  {
    id: 'st-whitefield',
    name: 'VoltGo Whitefield',
    city: 'Bengaluru',
    area: 'Whitefield',
    address: 'ITPL Main Road, Whitefield, Bengaluru, Karnataka 560066',
    distanceKm: 14.2,
    lat: 72,
    lng: 72,
    rating: 4.5,
    reviews: 876,
    open247: true,
    hours: '24/7',
    status: 'limited',
    freeCharging: false,
    fastCharging: true,
    amenities: ['restroom', 'parking', 'wifi', 'store', 'lounge', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'offline', [180, 240]],
    ]),
    parkingFeePerHour: 25,
    idleFeePerMin: 5,
    reservationFee: 10,
  },
  {
    id: 'st-bandra',
    name: 'VoltGo Bandra',
    city: 'Mumbai',
    area: 'Bandra West',
    address: 'Linking Road, Bandra West, Mumbai, Maharashtra 400050',
    distanceKm: 8.9,
    lat: 20,
    lng: 58,
    rating: 4.6,
    reviews: 1320,
    open247: false,
    hours: '6:00 AM – 1:00 AM',
    status: 'available',
    freeCharging: false,
    fastCharging: true,
    amenities: ['cafe', 'restroom', 'parking', 'wifi', 'restaurant', 'store', 'lounge', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['CHAdeMO', 'DC', 50, 'available', [35, 50]],
    ]),
    parkingFeePerHour: 60,
    idleFeePerMin: 10,
    reservationFee: 20,
  },
  {
    id: 'st-bkc',
    name: 'VoltGo BKC',
    city: 'Mumbai',
    area: 'Bandra Kurla Complex',
    address: 'G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    distanceKm: 10.4,
    lat: 24,
    lng: 62,
    rating: 4.7,
    reviews: 654,
    open247: true,
    hours: '24/7',
    status: 'limited',
    freeCharging: false,
    fastCharging: true,
    amenities: ['restroom', 'parking', 'wifi', 'lounge', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 120, 'available', [15, 25]],
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['CCS2', 'DC', 120, 'occupied', [15, 25]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
    ]),
    parkingFeePerHour: 80,
    idleFeePerMin: 12,
    reservationFee: 25,
  },
  {
    id: 'st-saket',
    name: 'VoltGo Saket',
    city: 'Delhi',
    area: 'Saket',
    address: 'District Centre, Saket, New Delhi, Delhi 110017',
    distanceKm: 5.3,
    lat: 16,
    lng: 40,
    rating: 4.4,
    reviews: 489,
    open247: true,
    hours: '24/7',
    status: 'available',
    freeCharging: false,
    fastCharging: true,
    amenities: ['cafe', 'restroom', 'parking', 'wifi', 'store', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['GB/T', 'DC', 120, 'available', [20, 35]],
    ]),
    parkingFeePerHour: 40,
    idleFeePerMin: 8,
    reservationFee: 15,
  },
  {
    id: 'st-cyberhub',
    name: 'VoltGo Cyber Hub',
    city: 'Gurugram',
    area: 'Cyber City',
    address: 'Cyber Hub, DLF Cyber City, Gurugram, Haryana 122002',
    distanceKm: 18.7,
    lat: 14,
    lng: 48,
    rating: 4.8,
    reviews: 921,
    open247: true,
    hours: '24/7',
    status: 'available',
    freeCharging: false,
    fastCharging: true,
    amenities: ['cafe', 'restroom', 'parking', 'wifi', 'restaurant', 'store', 'lounge', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 120, 'available', [15, 25]],
      ['CCS2', 'DC', 120, 'available', [15, 25]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['CHAdeMO', 'DC', 50, 'available', [35, 50]],
    ]),
    parkingFeePerHour: 50,
    idleFeePerMin: 10,
    reservationFee: 20,
  },
  {
    id: 'st-anna-nagar',
    name: 'VoltGo Anna Nagar',
    city: 'Chennai',
    area: 'Anna Nagar',
    address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu 600040',
    distanceKm: 7.2,
    lat: 68,
    lng: 18,
    rating: 4.3,
    reviews: 356,
    open247: false,
    hours: '6:00 AM – 11:00 PM',
    status: 'available',
    freeCharging: false,
    fastCharging: false,
    amenities: ['cafe', 'restroom', 'parking', 'cctv', 'card'],
    chargers: chargers([
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'occupied', [180, 240]],
      ['GB/T', 'DC', 120, 'available', [20, 35]],
    ]),
    parkingFeePerHour: 30,
    idleFeePerMin: 5,
    reservationFee: 10,
  },
  {
    id: 'st-hinjewadi',
    name: 'VoltGo Hinjewadi',
    city: 'Pune',
    area: 'Hinjewadi',
    address: 'Rajiv Gandhi Infotech Park, Hinjewadi, Pune, Maharashtra 411057',
    distanceKm: 12.6,
    lat: 44,
    lng: 70,
    rating: 4.5,
    reviews: 478,
    open247: true,
    hours: '24/7',
    status: 'limited',
    freeCharging: false,
    fastCharging: true,
    amenities: ['restroom', 'parking', 'wifi', 'store', 'cctv', 'card'],
    chargers: chargers([
      ['CCS2', 'DC', 60, 'occupied', [30, 45]],
      ['CCS2', 'DC', 60, 'available', [30, 45]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['Type 2', 'AC', 22, 'available', [180, 240]],
      ['CHAdeMO', 'DC', 50, 'occupied', [35, 50]],
    ]),
    parkingFeePerHour: 25,
    idleFeePerMin: 5,
    reservationFee: 10,
  },
];

export const CITIES = ['All Cities', 'Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Gurugram', 'Chennai', 'Pune'];

export function stationAvailableCount(s: ChargingStation): number {
  return s.chargers.filter((c) => c.status === 'available').length;
}
export function stationOccupiedCount(s: ChargingStation): number {
  return s.chargers.filter((c) => c.status === 'occupied').length;
}
export function stationOfflineCount(s: ChargingStation): number {
  return s.chargers.filter((c) => c.status === 'offline').length;
}
export function stationMinPrice(s: ChargingStation): number {
  const prices = s.chargers.map((c) => c.pricePerKwh).filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : 0;
}
export function stationMaxPower(s: ChargingStation): number {
  return Math.max(0, ...s.chargers.map((c) => c.powerKw));
}
export function stationConnectors(s: ChargingStation): ConnectorType[] {
  return Array.from(new Set(s.chargers.map((c) => c.connector)));
}
export function statusLabel(s: ChargingStation): string {
  const avail = stationAvailableCount(s);
  const total = s.chargers.length;
  if (s.status === 'offline') return 'Offline';
  if (avail === 0) return 'Fully occupied';
  return `${avail} of ${total} available`;
}

export interface WalletTxn {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  title: string;
  subtitle: string;
  date: string;
  method?: string;
}

export interface ChargingSession {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  energyKwh: number;
  durationMin: number;
  connector: ConnectorType;
  amount: number;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  batteryKwh: number;
  connectors: ConnectorType[];
  maxChargingKw: number;
  regNumber: string;
}

export interface AppNotification {
  id: string;
  type: 'booking' | 'charging' | 'wallet' | 'reminder' | 'availability' | 'payment';
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface Booking {
  id: string;
  stationId: string;
  stationName: string;
  chargerLabel: string;
  date: string;
  time: string;
  durationMin: number;
  reservationFee: number;
  estimatedCost: number;
  total: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

STATIONS.push(...MORE_STATIONS);
