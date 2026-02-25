import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, Search, CreditCard } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';
import { formatCurrencyDetailed, calculateGST } from '@/utils/currency';
import { formatDuration } from '@/utils/realTimeUpdates';
import jsPDF from 'jspdf';

export default function SessionSummary() {
  const { sessionData, setCurrentView } = useParking();

  if (!sessionData?.booking || sessionData.isActive) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">No Session to Display</h2>
            <p className="text-muted-foreground mb-4">There's no completed session to show.</p>
            <Button onClick={() => setCurrentView('search')}>
              Find Parking Spots
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { booking, startTime, endTime } = sessionData;
  const duration = formatDuration(startTime, endTime);
  const hourlyRate = parseFloat(booking.spot.hourlyRate);
  
  // Calculate actual duration in hours for cost calculation
  const durationMs = (endTime?.getTime() || Date.now()) - startTime.getTime();
  const actualHours = durationMs / (1000 * 60 * 60);
  
  const parkingFee = hourlyRate * actualHours;
  const serviceFee = 5;
  const gst = calculateGST(parkingFee + serviceFee);
  const total = parkingFee + serviceFee + gst;

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDownloadReceipt = () => {
  if (!sessionData?.booking) return;

  const doc = new jsPDF();

  const { booking, startTime, endTime } = sessionData;

  const durationMs =
    (endTime?.getTime() || Date.now()) - startTime.getTime();
  const actualHours = durationMs / (1000 * 60 * 60);

  const hourlyRate = parseFloat(booking.spot.hourlyRate);
  const parkingFee = hourlyRate * actualHours;
  const serviceFee = 5;
  const gst = calculateGST(parkingFee + serviceFee);
  const total = parkingFee + serviceFee + gst;

  let y = 20;

  doc.setFontSize(18);
  doc.text("SPMOS - Parking Receipt", 20, y);

  y += 10;
  doc.setFontSize(12);
  doc.text(`Location: ${booking.spot.name}`, 20, y);

  y += 8;
  doc.text(`Vehicle: ${booking.vehicleNumber}`, 20, y);

  y += 8;
  doc.text(`Start Time: ${startTime.toLocaleString()}`, 20, y);

  y += 8;
  doc.text(
    `End Time: ${endTime ? endTime.toLocaleString() : "N/A"}`,
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

  const handleEmailReceipt = () => {
    // In a real app, this would send the receipt to user's email
    alert('Email receipt functionality would be implemented here');
  };

  const handleReturnToSearch = () => {
    // Clear session data and return to search
    localStorage.removeItem('spmos_session');
    localStorage.removeItem('spmos_booking');
    setCurrentView('search');
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="page-summary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Session Complete!</h1>
          <p className="text-muted-foreground">Thank you for using SPMOS. Here's your parking summary.</p>
        </div>

        {/* Session Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium" data-testid="text-summary-location">
                  {booking.spot.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium" data-testid="text-summary-vehicle">
                  {booking.vehicleNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-muted-foreground">Start Time:</span>
                <span className="font-medium" data-testid="text-summary-start-time">
                  {formatDateTime(startTime)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-muted-foreground">End Time:</span>
                <span className="font-medium" data-testid="text-summary-end-time">
                  {endTime ? formatDateTime(endTime) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Total Duration:</span>
                <span className="font-medium" data-testid="text-summary-duration">
                  {duration}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span data-testid="text-summary-hourly-rate">
                  {formatCurrencyDetailed(hourlyRate)}/hour
                </span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span data-testid="text-summary-actual-hours">
                  {actualHours.toFixed(2)} hours
                </span>
              </div>
              <div className="flex justify-between">
                <span>Parking Fee:</span>
                <span data-testid="text-summary-parking-fee">
                  {formatCurrencyDetailed(parkingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span data-testid="text-summary-service-fee">
                  {formatCurrencyDetailed(serviceFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span data-testid="text-summary-gst">
                  {formatCurrencyDetailed(gst)}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-primary" data-testid="text-summary-total">
                  {formatCurrencyDetailed(total)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center">
                <CreditCard className="text-primary mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">•••• •••• •••• 1234 (Visa)</p>
                </div>
                <Badge className="ml-auto status-available">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Paid
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Receipt & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="p-4 h-auto justify-start"
                onClick={handleDownloadReceipt}
                data-testid="button-download-receipt"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Download Receipt</h4>
                    <p className="text-sm text-muted-foreground">Get PDF receipt</p>
                  </div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto justify-start"
                onClick={handleEmailReceipt}
                data-testid="button-email-receipt"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Email Receipt</h4>
                    <p className="text-sm text-muted-foreground">Send to your email</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Make Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">

              <Button onClick={() => alert("UPI payment flow here")}>
                Pay via UPI
              </Button>

              <Button onClick={() => alert("Card payment flow here")}>
                Pay via Card
              </Button>

              <Button onClick={() => alert("Net Banking flow here")}>
                Net Banking
              </Button>

            </div>
          </CardContent>
        </Card>

        {/* Return to Search */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleReturnToSearch}
            data-testid="button-return-to-search"
          >
            <Search className="mr-2 h-5 w-5" />
            Find Another Spot
          </Button>
        </div>
      </div>
    </div>
  );
}
