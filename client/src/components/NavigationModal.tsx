import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { useState } from 'react';

export default function NavigationModal() {
  const {
    currentView,
    setCurrentView,
    sessionData,
    userLocation,
    setUserLocation
  } = useParking();
  const isOpen = currentView === 'navigation';

  const [eta, setEta] = useState<string>("Click 'Open Maps' to calculate");

  const handleClose = () => {
    setCurrentView('session');
  };

  /* =========================================================
     SAFE ACCESS TO SPOT
  ========================================================= */

  const spot = sessionData?.booking?.spot;

  const spotName = spot?.name ?? "Your Parking Spot";

  /* =========================================================
     CALCULATE ETA FROM BACKEND
  ========================================================= */

  const calculateETA = async (
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ) => {
    try {
      setEta("Calculating...");

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

      const response = await fetch(
        `${backendUrl}/api/maps/distance?originLat=${originLat}&originLng=${originLng}&destLat=${destLat}&destLng=${destLng}`
      );

      const data = await response.json();

      const element = data?.rows?.[0]?.elements?.[0];

      if (element?.status === "OK") {
        setEta(`${element.duration.text} (${element.distance.text})`);
      } else {
        setEta("Route not available");
      }
    } catch (error) {
      console.error("ETA Error:", error);
      setEta("Unable to calculate");
    }
  };

  /* =========================================================
     OPEN GOOGLE MAPS + CALCULATE ETA
  ========================================================= */

  const openMaps = (
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ) => {
    calculateETA(originLat, originLng, destLat, destLng);

    const mapsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${originLat},${originLng}` +
      `&destination=${destLat},${destLng}` +
      `&travelmode=driving`;

    window.open(mapsUrl, "_blank");
  };

  const handleOpenExternalMap = () => {
    if (!spot) {
      alert("No active parking session found.");
      return;
    }

    const destLat = spot.latitude;
    const destLng = spot.longitude;

    if (destLat == null || destLng == null) {
      alert("Destination coordinates not available.");
      return;
    }

    // ✅ If we already have location, reuse it
    if (userLocation) {
      openMaps(userLocation.latitude, userLocation.longitude, destLat, destLng);
      return;
    }

    // ✅ Ask only once
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const originLat = position.coords.latitude;
        const originLng = position.coords.longitude;

        // Save globally
        setUserLocation({
          latitude: originLat,
          longitude: originLng
        });

        openMaps(originLat, originLng, destLat, destLng);
      },
      () => {
        alert("Please allow location access.");
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="text-white h-8 w-8" />
            </div>
            Navigation
          </DialogTitle>
        </DialogHeader>

        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Click on "Open Maps" to get real-time directions.
          </p>

          <div className="space-y-3 mb-6">

            {/* FROM */}
            <div className="text-left p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-sm">
                  <strong>From:</strong> Your current location
                </p>
              </div>
            </div>

            {/* TO */}
            <div className="text-left p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <p className="text-sm">
                  <strong>To:</strong> {spotName}
                </p>
              </div>
            </div>

            {/* ETA */}
            <div className="text-left p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Navigation className="h-4 w-4 text-primary mr-2" />
                <p className="text-sm text-primary">
                  <strong>ETA:</strong> {eta}
                </p>
              </div>
            </div>

          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Close
            </Button>

            <Button
              className="flex-1"
              onClick={handleOpenExternalMap}
            >
              Open Maps
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}