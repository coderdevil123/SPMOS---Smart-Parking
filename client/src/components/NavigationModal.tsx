import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { useState } from 'react';

export default function NavigationModal() {
  const { currentView, setCurrentView, sessionData } = useParking();
  const isOpen = currentView === 'navigation';
  const [eta, setEta] = useState("Calculating...");
  
  const spotName = sessionData?.booking?.spot?.name || 'Your Parking Spot';

  const handleClose = () => {
    setCurrentView('session');
  };

  const calculateETA = (originLat: number, originLng: number, destLat: number, destLng: number) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const element = data.rows[0].elements[0];
      if (element.status === "OK") {
        setEta(`${element.duration.text} (${element.distance.text})`);
      }
    })
    .catch(() => setEta("Unable to calculate"));
};

  const handleOpenExternalMap = () => {
  if (!sessionData?.booking?.spot?.latitude || 
      !sessionData?.booking?.spot?.longitude) {
    alert("Destination coordinates not available.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
    const originLat = position.coords.latitude;
    const originLng = position.coords.longitude;

    const destLat = sessionData.booking.spot.latitude;
    const destLng = sessionData.booking.spot.longitude;

    calculateETA(originLat, originLng, destLat, destLng);
  },
    (error) => {
      alert("Unable to get your location. Please allow location access.");
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
            open google maps
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="text-left p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                <p className="text-sm">
                  <strong>From:</strong> Your current location
                </p>
              </div>
            </div>
            <div className="text-left p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                <p className="text-sm" data-testid="text-navigation-destination">
                  <strong>To:</strong> {spotName}
                </p>
              </div>
            </div>
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
              data-testid="button-close-navigation"
            >
              Close
            </Button>
            <Button
              className="flex-1"
              onClick={handleOpenExternalMap}
              data-testid="button-open-external-map"
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