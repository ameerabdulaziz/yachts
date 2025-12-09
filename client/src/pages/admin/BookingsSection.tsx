import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Calendar, Ship, User, MapPin } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface Booking {
  id: string;
  userId: string;
  yachtId: number;
  startDate: string;
  endDate: string;
  totalPrice: string;
  status: string;
  notes?: string;
  createdAt: string;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: -0.5 }}>{title}</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed": return { bg: "#dcfce7", color: "#16a34a" };
    case "pending": return { bg: "#fef9c3", color: "#ca8a04" };
    case "cancelled": return { bg: "#fee2e2", color: "#dc2626" };
    case "completed": return { bg: "#dbeafe", color: "#2563eb" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

export default function BookingsSection() {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/admin/bookings"]
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/bookings/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bookings"] });
      setDetailsOpen(false);
      setSelectedBooking(null);
      toast({ title: "Booking updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update booking", description: error.message, variant: "destructive" });
    },
  });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusNotes(booking.notes || "");
    setDetailsOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedBooking) return;
    updateMutation.mutate({
      id: selectedBooking.id,
      data: { status: newStatus, notes: statusNotes }
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} />
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Booking Management"
        subtitle="View and manage all charter and ownership bookings"
      />

      {bookings.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <Calendar style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>No Bookings Yet</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Bookings will appear here once customers make reservations</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Booking ID</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Dates</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <tr
                    key={booking.id}
                    style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }}
                    data-testid={`booking-row-${booking.id}`}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
                      #{booking.id.slice(0, 8)}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User style={{ width: 16, height: 16 }} />
                        User #{booking.userId.slice(0, 6)}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>
                      €{Number(booking.totalPrice).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge style={{ background: statusStyle.bg, color: statusStyle.color, border: 'none', textTransform: 'capitalize' }}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                        data-testid={`button-view-booking-${booking.id}`}
                      >
                        <Eye style={{ width: 16, height: 16 }} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View and update booking #{selectedBooking?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 pt-4">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Customer ID</p>
                  <p style={{ fontWeight: 600, color: '#0f172a' }}>{selectedBooking.userId.slice(0, 8)}</p>
                </div>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Price</p>
                  <p style={{ fontWeight: 600, color: '#0f172a' }}>€{Number(selectedBooking.totalPrice).toLocaleString()}</p>
                </div>
              </div>

              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Booking Period</p>
                <p style={{ fontWeight: 600, color: '#0f172a' }}>
                  {format(new Date(selectedBooking.startDate), 'MMMM d, yyyy')} - {format(new Date(selectedBooking.endDate), 'MMMM d, yyyy')}
                </p>
              </div>

              <div>
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="mt-2" data-testid="select-booking-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="mt-2"
                  placeholder="Add any notes about this booking..."
                  data-testid="textarea-booking-notes"
                />
              </div>

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleUpdateStatus}
                  style={{ background: '#0E2047' }}
                  disabled={updateMutation.isPending}
                  data-testid="button-update-booking"
                >
                  {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Booking
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
