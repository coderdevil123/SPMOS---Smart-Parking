import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, Search, CreditCard } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { formatCurrencyDetailed, calculateGST } from '@/utils/currency';
import { formatDuration } from '@/utils/realTimeUpdates';
import jsPDF from 'jspdf';

export default function SessionSummary() {
  const { sessionData, setCurrentView, parkingSpots } = useParking();

  // ✅ Only show summary if session is COMPLETED
  if (!sessionData?.booking || sessionData.status !== "COMPLETED") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">No Session to Display</h2>
            <p className="text-muted-foreground mb-4">
              There's no completed session to show.
            </p>
            <Button onClick={() => setCurrentView('search')}>
              Find Parking Spots
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { booking, actualStartTime, endTime } = sessionData;

  // ✅ Lookup spot from parkingSpots (SOURCE OF TRUTH)
  const spot = parkingSpots.find(
    (s: any) => String(s.id) === String(booking.parkingSpot)
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

  const hourlyRate = parseFloat(spot.hourlyRate);

  const durationMs =
    (endTime?.getTime() || Date.now()) -
    (actualStartTime ? new Date(actualStartTime).getTime() : 0);

  const actualHours = durationMs / (1000 * 60 * 60);
  const parkingFee = hourlyRate * actualHours;
  const serviceFee = 5;
  const gst = calculateGST(parkingFee + serviceFee);
  const total = parkingFee + serviceFee + gst;

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  /* ==========================
     DOWNLOAD RECEIPT (FIXED)
  =========================== */

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("SPMOS - Parking Receipt", 20, y);

    y += 10;
    doc.setFontSize(12);
    doc.text(`Location: ${spot.name}`, 20, y);

    y += 8;
    doc.text(`Vehicle: ${booking.vehicleNumber}`, 20, y);

    y += 8;
    doc.text(
      `Start Time: ${formatDateTime(actualStartTime)}`,
      20,
      y
    );

    y += 8;
    doc.text(
      `End Time: ${endTime ? formatDateTime(endTime) : "N/A"}`,
      20,
      y
    );

    y += 8;
    doc.text(`Duration: ${actualHours.toFixed(2)} hours`, 20, y);

    y += 12;
    doc.text(`Hourly Rate: ₹${hourlyRate}/hr`, 20, y);

    y += 8;
    doc.text(`Parking Fee: ₹${parkingFee.toFixed(2)}`, 20, y);

    y += 8;
    doc.text(`Service Fee: ₹${serviceFee.toFixed(2)}`, 20, y);

    y += 8;
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 20, y);

    y += 10;
    doc.setFontSize(14);
    doc.text(`Total Paid: ₹${total.toFixed(2)}`, 20, y);

    y += 15;
    doc.setFontSize(10);
    doc.text("Thank you for using SPMOS!", 20, y);

    doc.save(`SPMOS_Receipt_${booking.vehicleNumber}.pdf`);
  };

  const handleReturnToSearch = () => {
    localStorage.removeItem('spmos_session');
    setCurrentView('search');
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-summary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Session Complete!
          </h1>
          <p className="text-muted-foreground">
            Thank you for using SPMOS.
          </p>
        </div>

        {/* DETAILS */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="flex justify-between">
              <span>Location:</span>
              <span>{spot.name}</span>
            </div>

            <div className="flex justify-between">
              <span>Vehicle:</span>
              <span>{booking.vehicleNumber}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Duration:</span>
              <span>{actualHours.toFixed(2)} hours</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total Paid:</span>
              <span>{formatCurrencyDetailed(total)}</span>
            </div>

          </CardContent>
        </Card>

        {/* RECEIPT */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt (PDF)
            </Button>
          </CardContent>
        </Card>

        {/* PAYMENT OPTIONS */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Make Payment</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Button>Pay via UPI</Button>
            <Button>Pay via Card</Button>
            <Button>Net Banking</Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={handleReturnToSearch}>
            <Search className="mr-2 h-5 w-5" />
            Find Another Spot
          </Button>
        </div>

      </div>
    </div>
  );
}