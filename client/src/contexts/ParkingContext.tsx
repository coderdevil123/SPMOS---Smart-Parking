import {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";
import type { ParkingSpot } from "@shared/schema";

/* =========================================================
   1️⃣  ADD COORDINATES TO ALL DUMMY SPOTS
========================================================= */

const initialParkingSpots: ParkingSpot[] = [
  {
    id: "1",
    name: "MG Marg Central Parking",
    address: "Gangtok, Sikkim",
    city: "Gangtok",
    hourlyRate: "40.00",
    totalSpots: 20,
    availableSpots: 12,
    operatingHours: "24/7",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
    createdAt: new Date(),
    state: "Sikkim",
    latitude: 27.3389,
    longitude: 88.6065,
  },
  {
    id: "2",
    name: "Lal Bazaar Shopping Complex",
    address: "Gangtok, Sikkim",
    city: "Gangtok",
    hourlyRate: "35.00",
    totalSpots: 15,
    availableSpots: 3,
    operatingHours: "6AM-10PM",
    status: "almost_full",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
    createdAt: new Date(),
    state: "Sikkim",
    latitude: 27.3315,
    longitude: 88.6120,
  },
  {
    id: "3",
    name: "Rumtek Monastery Parking",
    address: "Rumtek, Sikkim",
    city: "Rumtek",
    hourlyRate: "25.00",
    totalSpots: 30,
    availableSpots: 25,
    operatingHours: "5AM-8PM",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    createdAt: new Date(),
    state: "Sikkim",
    latitude: 27.2997,
    longitude: 88.5843,
  },
  {
    id: "4",
    name: "Namchi Central Plaza",
    address: "Namchi, Sikkim",
    city: "Namchi",
    hourlyRate: "30.00",
    totalSpots: 25,
    availableSpots: 18,
    operatingHours: "24/7",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
    createdAt: new Date(),
    state: "Sikkim",
    latitude: 27.1665,
    longitude: 88.3654,
  },
  {
    id: "5",
    name: "Pelling Tourist Hub",
    address: "Pelling, Sikkim",
    city: "Pelling",
    hourlyRate: "45.00",
    totalSpots: 12,
    availableSpots: 0,
    operatingHours: "7AM-9PM",
    status: "full",
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    createdAt: new Date(),
    state: "Sikkim",
    latitude: 27.3038,
    longitude: 88.2372,
  },
  {
    id: "6",
    name: "Secretariat Complex Parking",
    address: "Gangtok, Sikkim",
    city: "Gangtok",
    hourlyRate: "50.00",
    totalSpots: 10,
    availableSpots: 8,
    operatingHours: "9AM-6PM",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
    createdAt: new Date(),
    state: "Sikkim",
    latitude: 27.3380,
    longitude: 88.6050,
  },
];

const ParkingContext = createContext<any>(null);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState("landing");
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [sessionData, setSessionData] = useState<any | null>(null);
  const [parkingSpots, setParkingSpots] =
    useState<ParkingSpot[]>(initialParkingSpots);

  /* =========================================================
     2️⃣  FIXED startSession (ATTACH FULL SPOT)
  ========================================================= */

  const startSession = (bookingResponse: any) => {
    const booking = bookingResponse.booking ?? bookingResponse;

    const updatedSpots = parkingSpots.map((spot) =>
      String(spot.id) === String(booking.parkingSpot)
        ? { ...spot, availableSpots: spot.availableSpots - 1 }
        : spot
    );

    setParkingSpots(updatedSpots);

    const fullSpot = updatedSpots.find(
      (s) => String(s.id) === String(booking.parkingSpot)
    );

    const newSession = {
      booking: {
        vehicleNumber: booking.vehicleNumber,
        parkingSpot: String(booking.parkingSpot),
        startTime: booking.startTime,
        endTime: booking.endTime,
        totalAmount: booking.totalAmount,
        spot: fullSpot,   // 🔥 CRITICAL FIX
      },
      isActive: true,
      startTime: new Date(),
    };

    setSessionData(newSession);
    setCurrentView("session");
    localStorage.setItem("spmos_session", JSON.stringify(newSession));
  };

  const endSession = () => {
    const updatedSpots = parkingSpots.map((spot) =>
      String(spot.id) === String(sessionData?.booking.parkingSpot)
        ? { ...spot, availableSpots: spot.availableSpots + 1 }
        : spot
    );

    setParkingSpots(updatedSpots);

    const updatedSession = {
      ...sessionData,
      isActive: false,
      endTime: new Date(),
    };

    setSessionData(updatedSession);
    setCurrentView("summary");
    localStorage.setItem("spmos_session", JSON.stringify(updatedSession));
  };

  return (
    <ParkingContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedSpot,
        setSelectedSpot,
        sessionData,
        setSessionData,
        startSession,
        endSession,
        parkingSpots,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => useContext(ParkingContext);