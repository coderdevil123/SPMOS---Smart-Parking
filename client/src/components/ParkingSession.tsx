import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Route, Clock, Headphones, Pause } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { formatDuration, calculateCurrentCost } from '@/utils/realTimeUpdates';
import { formatCurrencyDetailed } from '@/utils/currency';
import type { ParkingSpot } from "@shared/schema";
import { QRCodeSVG } from "qrcode.react";

export default function ParkingSession() {
  const { sessionData, stopTimer, setCurrentView, parkingSpots, markAsReached, scanTicket } = useParking();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { booking, actualStartTime, timerStarted, status } = sessionData;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!timerStarted) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted]);

  // ✅ Case: No active session
  if (!sessionData?.booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">No Active Session</h2>
            <p className="text-muted-foreground mb-4">
              You don't have an active parking session.
            </p>
            <Button onClick={() => setCurrentView('search')}>
              Find Parking Spots
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Normalize ID (string/number mismatch fix)
  const bookingSpotId = String(booking.parkingSpot);

  // ✅ Find the parking spot from dummy list
  const spot: ParkingSpot | undefined = parkingSpots.find(
    (s: ParkingSpot) => String(s.id) === bookingSpotId
  );

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-red-600 text-xl font-bold">
          Error: Parking spot not found
        </div>
      </div>
    );
  }

  // ✅ Hourly rate from the dummy spot
  const hourlyRate = parseFloat(spot.hourlyRate);
  const duration = timerStarted && actualStartTime
  ? formatDuration(actualStartTime, currentTime)
  : "00:00:00";

  const currentCost = timerStarted && actualStartTime
    ? calculateCurrentCost(actualStartTime, hourlyRate)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-session">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">Active Parking Session</CardTitle>
              <Badge className="status-available font-medium">
                <div className="w-2 h-2 rounded-full bg-current mr-2" /> {sessionData.status}
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

              {/* Spot Info */}
              <div>
                <h3 className="font-semibold mb-2" data-testid="text-session-spot-name">
                  {spot.name}
                </h3>
                <p className="text-muted-foreground text-sm" data-testid="text-session-spot-address">
                  {spot.address}
                </p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Vehicle:</span>{' '}
                  <span data-testid="text-session-vehicle">{booking.vehicleNumber}</span>
                </p>
              </div>

              {/* Duration */}
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1" data-testid="text-session-duration">
                  {duration}
                </div>
                <p className="text-sm text-muted-foreground">Session Duration</p>
              </div>

              {/* Cost */}
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1" data-testid="text-session-cost">
                  {formatCurrencyDetailed(currentCost)}
                </div>
                <p className="text-sm text-muted-foreground">Current Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  <Route className="inline text-primary mr-2" />
                  Navigation
                </h3>
                <p className="text-muted-foreground">Need directions to your parking spot?</p>
              </div>
              <Button
                onClick={() => setCurrentView('navigation')}
                data-testid="button-navigation"
              >
                <Route className="mr-2 h-4 w-4" /> Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Session Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">

              <Button
                variant="outline"
                className="p-4 h-auto justify-start"
                onClick={() => alert('Extend session modal goes here')}
                data-testid="button-extend-session"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Extend Session</h4>
                    <p className="text-sm text-muted-foreground">Add more time to your parking</p>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="p-4 h-auto justify-start"
                onClick={() => alert('Support chat goes here')}
                data-testid="button-contact-support"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Headphones className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Get Help</h4>
                    <p className="text-sm text-muted-foreground">Contact customer support</p>
                  </div>
                </div>
              </Button>

            </div>
          </CardContent>
        </Card>

        {!sessionData.reached && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-4">
                Arrived at Parking Location?
              </h3>

              <Button onClick={markAsReached}>
                I Have Reached Destination
              </Button>
            </CardContent>
          </Card>
        )}

        {sessionData.reached && !sessionData.scanned && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold mb-4">Parking Ticket</h3>

              <QRCodeSVG
                value={`SPMOS-${booking.vehicleNumber}-${Date.now()}`}
                size={180}
              />

              <p className="text-sm mt-4 text-muted-foreground">
                Scan this ticket at the entry gate.
              </p>

              <Button
                className="mt-4"
                onClick={scanTicket}
              >
                Simulate Scan Ticket
              </Button>
            </CardContent>
          </Card>
        )}

        {/* End Session */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-accent mb-2">
                  End Parking Session
                </h3>
                <p className="text-muted-foreground">
                  Ready to leave? End your session and complete payment.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={stopTimer}
                data-testid="button-end-session"
              >
                <Pause className="mr-2 h-4 w-4" /> End Session
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
