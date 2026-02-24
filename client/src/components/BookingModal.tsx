import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Car, Clock, Check } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatCurrencyDetailed, calculateGST } from '@/utils/currency';

export default function BookingModal() {
  const { selectedSpot, setSelectedSpot, startSession, setCurrentView } = useParking();
  const { toast } = useToast();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [duration, setDuration] = useState(2);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  });

  if (!selectedSpot) return null;

  const hourlyRate = parseFloat(selectedSpot.hourlyRate);
  const subtotal = hourlyRate * duration;
  const serviceFee = 5;
  const gst = calculateGST(subtotal + serviceFee);
  const total = subtotal + serviceFee + gst;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'almost_full':
        return 'status-almost-full';
      case 'full':
        return 'status-full';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleConfirmBooking = async () => {
  if (!vehicleNumber.trim()) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Please enter your vehicle number",
    });
    return;
  }
   console.log("🔥 selectedSpot:", selectedSpot);
  console.log("🔥 selectedSpot._id:", selectedSpot._id);

  // ✅ Safely get logged-in user
  const storedUser = localStorage.getItem("spmos_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    toast({
      variant: "destructive",
      title: "Login required",
      description: "Please login before booking a parking spot.",
    });
    return;
  }

  // ✅ Create correct booking payload (MATCHES BACKEND)
  const bookingData = {
  user: user.id,                              // REQUIRED ✅
  parkingSpot: selectedSpot.id,              // ✅ Correct field
  vehicleNumber: vehicleNumber.trim(),        // ✅ Required
  startTime: new Date(startTime),             // ✅ Required
  endTime: new Date(new Date(startTime).getTime() + duration * 60 * 60 * 1000),
  totalAmount: total                          // ✅ Correct name
};


  console.log("📦 Sending booking:", bookingData);

  try {
    // Use relative path in production (works on Vercel), localhost for development
    const API_URL = import.meta.env.VITE_API_URL !== undefined 
      ? import.meta.env.VITE_API_URL 
      : (import.meta.env.DEV ? "http://localhost:5001" : "");
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to book");

    startSession(data.booking);

    setSelectedSpot(null);

    toast({
      title: "Booking Confirmed!",
      description: `Your parking spot ${selectedSpot.name} has been reserved.`,
    });
  } catch (error: unknown) {
    console.error("❌ Booking error:", error);
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "Something went wrong.";
    toast({
      variant: "destructive",
      title: "Booking Failed",
      description: message,
    });
  }
};


  return (
    <Dialog open={!!selectedSpot} onOpenChange={() => setSelectedSpot(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={selectedSpot.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
            alt={`${selectedSpot.name} parking facility`}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            <Badge className={`${getStatusColor(selectedSpot.status)} font-medium`}>
              <div className="w-2 h-2 rounded-full bg-current mr-2" />
              Available
            </Badge>
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl" data-testid="text-booking-spot-name">
            {selectedSpot.name}
          </DialogTitle>
          <p className="text-muted-foreground" data-testid="text-booking-spot-address">
            {selectedSpot.address}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{formatCurrency(selectedSpot.hourlyRate)}</div>
            <div className="text-sm text-muted-foreground">per hour</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{selectedSpot.availableSpots}</div>
            <div className="text-sm text-muted-foreground">available</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-lg font-bold text-slate-800">{selectedSpot.operatingHours}</div>
            <div className="text-sm text-muted-foreground">operating</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-lg font-bold text-slate-800">2 min</div>
            <div className="text-sm text-muted-foreground">walk to main area</div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reserve Your Spot</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                data-testid="input-vehicle-number"
                placeholder="SK 01 AB 1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger data-testid="select-vehicle-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car (4-wheeler)</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle (2-wheeler)</SelectItem>
                  <SelectItem value="suv">SUV/Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Expected Duration</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger data-testid="select-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">8 hours (Full day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                data-testid="input-start-time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Cost Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Rate per hour:</span>
                <span data-testid="text-hourly-rate">{formatCurrency(hourlyRate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span data-testid="text-duration">{duration} hours</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span data-testid="text-subtotal">{formatCurrencyDetailed(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee:</span>
                <span data-testid="text-service-fee">{formatCurrencyDetailed(serviceFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span data-testid="text-gst">{formatCurrencyDetailed(gst)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-primary" data-testid="text-total-cost">
                  {formatCurrencyDetailed(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedSpot(null)}
              data-testid="button-cancel-booking"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmBooking}
              data-testid="button-confirm-booking"
            >
              Confirm Booking
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
