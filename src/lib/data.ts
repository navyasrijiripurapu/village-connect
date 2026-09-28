import tractorImg from "@/assets/tractor.jpg";
import harvesterImg from "@/assets/harvester.jpg";
import tankerImg from "@/assets/tanker.jpg";
import sprayImg from "@/assets/spray.jpg";
import borewellImg from "@/assets/borewell.jpg";
import rotavatorImg from "@/assets/rotavator.jpg";
import electricianImg from "@/assets/electrician.jpg";
import plumberImg from "@/assets/plumber.jpg";
import mechanicImg from "@/assets/mechanic.jpg";
import farmworkerImg from "@/assets/farmworker.jpg";
import driverImg from "@/assets/driver.jpg";

export const CATEGORIES = [
  "Tractor",
  "Harvester",
  "Rotavator",
  "Water Tanker",
  "Spray Machine",
  "Borewell Machine",
  "Skilled Worker",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const VILLAGES = [
  "Rampur",
  "Shivpuri",
  "Chandanpur",
  "Kesarwadi",
  "Nandgaon",
  "Bhimnagar",
];

export type Review = {
  user: string;
  rating: number;
  comment: string;
  date: string;
};

export type Resource = {
  id: string;
  name: string;
  category: Category;
  skill?: string;
  image: string;
  owner: string;
  phone: string;
  village: string;
  location: string;
  distanceKm: number;
  price: number;
  priceUnit: string;
  available: boolean;
  availableFrom: string;
  rating: number;
  reviews: Review[];
  description: string;
  emergencyTags: string[];
};

const r = (x: Omit<Resource, "reviews"> & { reviews?: Review[] }): Resource => ({
  reviews: [],
  ...x,
});

export const RESOURCES: Resource[] = [
  r({
    id: "tractor-1",
    name: "Sonalika DI-750 Tractor",
    category: "Tractor",
    image: tractorImg,
    owner: "Ramesh Patil",
    phone: "+91 98765 43210",
    village: "Rampur",
    location: "Near Rampur Mandi Road",
    distanceKm: 1.2,
    price: 650,
    priceUnit: "per hour",
    available: true,
    availableFrom: "Today, 6:00 AM",
    rating: 4.8,
    description:
      "50 HP tractor in excellent condition. Suitable for ploughing, trolley work and rotavator attachment. Driver available on request.",
    emergencyTags: ["Agricultural Equipment", "Transport"],
    reviews: [
      { user: "Suresh K.", rating: 5, comment: "Very well maintained tractor, owner is punctual.", date: "12 Jun 2026" },
      { user: "Mahesh D.", rating: 4, comment: "Good service, fair rate.", date: "02 May 2026" },
    ],
  }),
  r({
    id: "tractor-2",
    name: "Mahindra 575 DI Tractor",
    category: "Tractor",
    image: tractorImg,
    owner: "Vijay Shinde",
    phone: "+91 98220 11223",
    village: "Nandgaon",
    location: "Nandgaon East Field Road",
    distanceKm: 6.4,
    price: 600,
    priceUnit: "per hour",
    available: false,
    availableFrom: "22 Aug 2026",
    rating: 4.4,
    description: "Reliable 45 HP tractor with trolley. Best for transport of crops and fertiliser.",
    emergencyTags: ["Agricultural Equipment", "Transport"],
    reviews: [{ user: "Anil P.", rating: 4, comment: "Trolley was very useful during harvest.", date: "18 Apr 2026" }],
  }),
  r({
    id: "harvester-1",
    name: "Combine Harvester (Wheat/Paddy)",
    category: "Harvester",
    image: harvesterImg,
    owner: "Sardar Gurpreet Singh",
    phone: "+91 90000 55221",
    village: "Shivpuri",
    location: "Shivpuri Main Canal Road",
    distanceKm: 3.8,
    price: 1800,
    priceUnit: "per hour",
    available: true,
    availableFrom: "Today, 8:00 AM",
    rating: 4.9,
    description:
      "Self-propelled combine harvester for wheat and paddy. Covers up to 1 acre per hour with trained operator included.",
    emergencyTags: ["Agricultural Equipment"],
    reviews: [
      { user: "Kishan L.", rating: 5, comment: "Finished 4 acres in one morning. Excellent.", date: "05 Jul 2026" },
    ],
  }),
  r({
    id: "tanker-1",
    name: "Water Tanker 5000 Litre",
    category: "Water Tanker",
    image: tankerImg,
    owner: "Jal Seva Provider - Imran Shaikh",
    phone: "+91 93456 77889",
    village: "Chandanpur",
    location: "Chandanpur Water Point",
    distanceKm: 2.1,
    price: 900,
    priceUnit: "per trip",
    available: true,
    availableFrom: "Today, anytime",
    rating: 4.6,
    description:
      "Clean drinking and irrigation water supply. Emergency delivery available within 45 minutes in nearby villages.",
    emergencyTags: ["Water Emergency", "Borewell/Water Problem", "Transport"],
    reviews: [{ user: "Sunita B.", rating: 5, comment: "Came quickly during summer shortage.", date: "20 May 2026" }],
  }),
  r({
    id: "spray-1",
    name: "Power Spray Machine",
    category: "Spray Machine",
    image: sprayImg,
    owner: "Balu Jadhav",
    phone: "+91 91234 88776",
    village: "Rampur",
    location: "Rampur South Farms",
    distanceKm: 1.9,
    price: 250,
    priceUnit: "per acre",
    available: true,
    availableFrom: "Tomorrow, 7:00 AM",
    rating: 4.3,
    description: "Battery and petrol operated sprayer for pesticide and fertiliser spraying. Operator included.",
    emergencyTags: ["Agricultural Equipment"],
    reviews: [{ user: "Deepak R.", rating: 4, comment: "Good spraying coverage.", date: "11 Jun 2026" }],
  }),
  r({
    id: "borewell-1",
    name: "Borewell Machine & Submersible Motor",
    category: "Borewell Machine",
    image: borewellImg,
    owner: "Ganesh Borewells",
    phone: "+91 99887 66554",
    village: "Kesarwadi",
    location: "Kesarwadi Highway Junction",
    distanceKm: 8.5,
    price: 120,
    priceUnit: "per foot",
    available: true,
    availableFrom: "Today, on call",
    rating: 4.5,
    description:
      "Borewell drilling rig with submersible pump installation and motor repair service. 24x7 emergency repairs.",
    emergencyTags: ["Borewell/Water Problem", "Water Emergency"],
    reviews: [{ user: "Pandurang T.", rating: 5, comment: "Repaired our motor same day.", date: "29 Jul 2026" }],
  }),
  r({
    id: "rotavator-1",
    name: "Heavy Duty Rotavator",
    category: "Rotavator",
    image: rotavatorImg,
    owner: "Sanjay Kale",
    phone: "+91 90909 12312",
    village: "Bhimnagar",
    location: "Bhimnagar Village Center",
    distanceKm: 4.7,
    price: 700,
    priceUnit: "per acre",
    available: true,
    availableFrom: "Today, 9:00 AM",
    rating: 4.2,
    description: "7-feet rotavator for soil preparation. Attaches to 45 HP+ tractors. Tractor can be arranged.",
    emergencyTags: ["Agricultural Equipment"],
    reviews: [{ user: "Ravi M.", rating: 4, comment: "Soil was well prepared.", date: "14 Mar 2026" }],
  }),
  r({
    id: "worker-electrician",
    name: "Prakash Yadav",
    category: "Skilled Worker",
    skill: "Electrician",
    image: electricianImg,
    owner: "Prakash Yadav",
    phone: "+91 98111 22334",
    village: "Rampur",
    location: "Rampur Bazaar",
    distanceKm: 0.9,
    price: 400,
    priceUnit: "per visit",
    available: true,
    availableFrom: "Today, on call",
    rating: 4.7,
    description: "Certified village electrician. House wiring, motor starter repair, transformer and pump connections.",
    emergencyTags: ["Electrical Problem"],
    reviews: [{ user: "Nilesh S.", rating: 5, comment: "Fixed our pump starter at night.", date: "08 Aug 2026" }],
  }),
  r({
    id: "worker-plumber",
    name: "Ashok Gaikwad",
    category: "Skilled Worker",
    skill: "Plumber",
    image: plumberImg,
    owner: "Ashok Gaikwad",
    phone: "+91 97555 44332",
    village: "Chandanpur",
    location: "Chandanpur Well Road",
    distanceKm: 2.6,
    price: 350,
    priceUnit: "per visit",
    available: true,
    availableFrom: "Today, 10:00 AM",
    rating: 4.4,
    description: "Hand pump repair, pipeline fitting, tank cleaning and drip irrigation line work.",
    emergencyTags: ["Water Emergency", "Borewell/Water Problem"],
    reviews: [],
  }),
  r({
    id: "worker-mechanic",
    name: "Irfan Khan",
    category: "Skilled Worker",
    skill: "Mechanic",
    image: mechanicImg,
    owner: "Irfan Khan",
    phone: "+91 96322 55441",
    village: "Shivpuri",
    location: "Shivpuri Workshop Lane",
    distanceKm: 3.2,
    price: 500,
    priceUnit: "per visit",
    available: false,
    availableFrom: "21 Aug 2026",
    rating: 4.6,
    description: "Tractor, pump and diesel engine mechanic. On-field breakdown service available.",
    emergencyTags: ["Agricultural Equipment"],
    reviews: [],
  }),
  r({
    id: "worker-farm",
    name: "Lakshmi Bai Group",
    category: "Skilled Worker",
    skill: "Agricultural Worker",
    image: farmworkerImg,
    owner: "Lakshmi Bai",
    phone: "+91 95111 33221",
    village: "Nandgaon",
    location: "Nandgaon Paddy Fields",
    distanceKm: 5.9,
    price: 450,
    priceUnit: "per day",
    available: true,
    availableFrom: "Tomorrow, 6:30 AM",
    rating: 4.8,
    description: "Group of 6 experienced farm workers for sowing, weeding, transplanting and harvesting.",
    emergencyTags: ["Agricultural Equipment"],
    reviews: [{ user: "Bhaskar J.", rating: 5, comment: "Hardworking team, finished on time.", date: "02 Aug 2026" }],
  }),
  r({
    id: "worker-driver",
    name: "Santosh More",
    category: "Skilled Worker",
    skill: "Driver",
    image: driverImg,
    owner: "Santosh More",
    phone: "+91 94222 66778",
    village: "Bhimnagar",
    location: "Bhimnagar Bus Stand",
    distanceKm: 4.1,
    price: 800,
    priceUnit: "per day",
    available: true,
    availableFrom: "Today, on call",
    rating: 4.5,
    description: "Tempo and tractor-trolley driver. Available for market transport and medical emergency travel.",
    emergencyTags: ["Transport", "Medical Emergency"],
    reviews: [],
  }),
];

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  resourceId: string;
  resourceName: string;
  provider: string;
  date: string;
  time: string;
  price: number;
  status: BookingStatus;
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-1041",
    resourceId: "tractor-1",
    resourceName: "Sonalika DI-750 Tractor",
    provider: "Ramesh Patil",
    date: "20 Aug 2026",
    time: "07:00 AM - 11:00 AM",
    price: 2600,
    status: "Confirmed",
  },
  {
    id: "BK-1038",
    resourceId: "tanker-1",
    resourceName: "Water Tanker 5000 Litre",
    provider: "Imran Shaikh",
    date: "18 Aug 2026",
    time: "02:00 PM",
    price: 900,
    status: "Pending",
  },
  {
    id: "BK-1022",
    resourceId: "harvester-1",
    resourceName: "Combine Harvester (Wheat/Paddy)",
    provider: "Gurpreet Singh",
    date: "02 Jul 2026",
    time: "06:00 AM - 12:00 PM",
    price: 10800,
    status: "Completed",
  },
  {
    id: "BK-1009",
    resourceId: "spray-1",
    resourceName: "Power Spray Machine",
    provider: "Balu Jadhav",
    date: "12 Jun 2026",
    time: "07:00 AM",
    price: 1250,
    status: "Cancelled",
  },
];

export type Notification = {
  id: string;
  type: "Booking" | "Cancellation" | "Availability" | "Emergency" | "New Resource";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "Emergency",
    title: "Emergency alert near Rampur",
    body: "Water tanker requested at Rampur South Farms. 2 providers responded.",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: "n2",
    type: "Booking",
    title: "Booking confirmed",
    body: "Ramesh Patil confirmed your tractor booking BK-1041 for 20 Aug 2026.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "n3",
    type: "Availability",
    title: "Harvester now available",
    body: "Combine Harvester in Shivpuri is available from today 8:00 AM.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n4",
    type: "New Resource",
    title: "New resource added in your village",
    body: "Heavy Duty Rotavator added by Sanjay Kale in Bhimnagar.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: "n5",
    type: "Cancellation",
    title: "Booking cancelled",
    body: "Your spray machine booking BK-1009 was cancelled.",
    time: "12 Jun 2026",
    unread: false,
  },
];

export const EMERGENCY_TYPES = [
  "Medical Emergency",
  "Water Emergency",
  "Agricultural Equipment",
  "Transport",
  "Electrical Problem",
  "Borewell/Water Problem",
  "Other",
];

export type EmergencyRequest = {
  id: string;
  type: string;
  description: string;
  village: string;
  resourceRequired: string;
  contact: string;
  urgency: string;
  status: string;
  time: string;
};

export const INITIAL_EMERGENCIES: EmergencyRequest[] = [
  {
    id: "EM-221",
    type: "Water Emergency",
    description: "Drinking water shortage in 12 houses.",
    village: "Rampur",
    resourceRequired: "Water Tanker",
    contact: "+91 98765 43210",
    urgency: "High",
    status: "In Progress",
    time: "Today, 09:15 AM",
  },
  {
    id: "EM-218",
    type: "Electrical Problem",
    description: "Pump starter burnt, irrigation stopped.",
    village: "Chandanpur",
    resourceRequired: "Electrician",
    contact: "+91 91234 55667",
    urgency: "Medium",
    status: "Resolved",
    time: "Yesterday",
  },
];
