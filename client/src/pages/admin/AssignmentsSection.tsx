import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Eye, Calendar, Anchor, Users, MapPin, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface Assignment {
  id: string;
  skipperId: string;
  dealerId: string;
  dealerBoatId?: string;
  bookingId?: string;
  assignmentType: string;
  title?: string;
  description?: string;
  startDate: string;
  endDate: string;
  departurePort?: string;
  arrivalPort?: string;
  guestCount?: number;
  guestNames?: string;
  guestPhone?: string;
  specialRequests?: string;
  paymentAmount?: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

interface Skipper {
  id: string;
  firstName: string;
  lastName: string;
}

interface DealerBoat {
  id: string;
  name: string;
}

interface AdminUser {
  id: string;
  role: string;
  dealerId?: string;
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: -0.5 }}>{title}</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "scheduled": return { bg: "#dbeafe", color: "#2563eb" };
    case "in_progress": return { bg: "#fef3c7", color: "#d97706" };
    case "completed": return { bg: "#dcfce7", color: "#16a34a" };
    case "cancelled": return { bg: "#fee2e2", color: "#dc2626" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case "paid": return { bg: "#dcfce7", color: "#16a34a" };
    case "pending": return { bg: "#fef3c7", color: "#d97706" };
    case "overdue": return { bg: "#fee2e2", color: "#dc2626" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

export default function AssignmentsSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
    queryKey: ["/api/admin/assignments"]
  });

  const { data: skippers = [] } = useQuery<Skipper[]>({
    queryKey: ["/api/admin/skippers"]
  });

  const { data: boats = [] } = useQuery<DealerBoat[]>({
    queryKey: ["/api/admin/boats"]
  });

  const [formData, setFormData] = useState({
    skipperId: "",
    dealerBoatId: "",
    assignmentType: "charter",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    departurePort: "",
    arrivalPort: "",
    guestCount: "",
    guestNames: "",
    guestPhone: "",
    specialRequests: "",
    paymentAmount: "",
    dealerId: currentUser.dealerId || ""
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/assignments", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/assignments"] });
      setDialogOpen(false);
      setFormData({
        skipperId: "", dealerBoatId: "", assignmentType: "charter", title: "", description: "",
        startDate: "", endDate: "", departurePort: "", arrivalPort: "", guestCount: "",
        guestNames: "", guestPhone: "", specialRequests: "", paymentAmount: "",
        dealerId: currentUser.dealerId || ""
      });
      toast({ title: "Assignment created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create assignment", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      guestCount: formData.guestCount ? parseInt(formData.guestCount) : null,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };
    createMutation.mutate(data);
  };

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} />
      </div>
    );
  }

  const getSkipperName = (id: string) => {
    const skipper = skippers.find(s => s.id === id);
    return skipper ? `${skipper.firstName} ${skipper.lastName}` : 'Unknown';
  };

  const getBoatName = (id?: string) => {
    if (!id) return '-';
    const boat = boats.find(b => b.id === id);
    return boat ? boat.name : 'Unknown';
  };

  return (
    <div>
      <SectionHeader
        title="Skipper Assignments"
        subtitle="Manage trip assignments and scheduling for skippers"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: '#0E2047' }} data-testid="button-add-assignment">
                <Plus style={{ width: 16, height: 16, marginRight: 8 }} /> New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: 600 }}>
              <DialogHeader>
                <DialogTitle>Create Assignment</DialogTitle>
                <DialogDescription>Assign a skipper to a trip or charter</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Skipper</Label>
                    <Select value={formData.skipperId} onValueChange={(v) => setFormData({ ...formData, skipperId: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-assignment-skipper">
                        <SelectValue placeholder="Select skipper" />
                      </SelectTrigger>
                      <SelectContent>
                        {skippers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.firstName} {s.lastName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Boat</Label>
                    <Select value={formData.dealerBoatId} onValueChange={(v) => setFormData({ ...formData, dealerBoatId: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-assignment-boat">
                        <SelectValue placeholder="Select boat" />
                      </SelectTrigger>
                      <SelectContent>
                        {boats.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Assignment Type</Label>
                    <Select value={formData.assignmentType} onValueChange={(v) => setFormData({ ...formData, assignmentType: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-assignment-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charter">Charter Trip</SelectItem>
                        <SelectItem value="delivery">Boat Delivery</SelectItem>
                        <SelectItem value="maintenance">Maintenance Run</SelectItem>
                        <SelectItem value="owner_trip">Owner Trip</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1"
                      placeholder="Trip to Ibiza"
                      data-testid="input-assignment-title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="mt-1"
                      required
                      data-testid="input-start-date"
                    />
                  </div>
                  <div>
                    <Label>End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="mt-1"
                      required
                      data-testid="input-end-date"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Departure Port</Label>
                    <Input
                      value={formData.departurePort}
                      onChange={(e) => setFormData({ ...formData, departurePort: e.target.value })}
                      className="mt-1"
                      placeholder="Port Vell, Barcelona"
                      data-testid="input-departure-port"
                    />
                  </div>
                  <div>
                    <Label>Arrival Port</Label>
                    <Input
                      value={formData.arrivalPort}
                      onChange={(e) => setFormData({ ...formData, arrivalPort: e.target.value })}
                      className="mt-1"
                      placeholder="Marina Ibiza"
                      data-testid="input-arrival-port"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Guest Count</Label>
                    <Input
                      type="number"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      className="mt-1"
                      data-testid="input-guest-count"
                    />
                  </div>
                  <div>
                    <Label>Guest Phone</Label>
                    <Input
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                      className="mt-1"
                      data-testid="input-guest-phone"
                    />
                  </div>
                  <div>
                    <Label>Payment (€)</Label>
                    <Input
                      type="number"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                      className="mt-1"
                      data-testid="input-payment-amount"
                    />
                  </div>
                </div>
                <div>
                  <Label>Special Requests</Label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="mt-1"
                    placeholder="Any special requirements..."
                    data-testid="textarea-special-requests"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    style={{ background: '#0E2047' }}
                    disabled={createMutation.isPending}
                    data-testid="button-submit-assignment"
                  >
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Assignment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: 20, height: 20, color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{assignments.filter(a => a.status === 'scheduled').length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Scheduled</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock style={{ width: 20, height: 20, color: '#d97706' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{assignments.filter(a => a.status === 'in_progress').length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>In Progress</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Anchor style={{ width: 20, height: 20, color: '#16a34a' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{assignments.filter(a => a.status === 'completed').length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Completed</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: 20, height: 20, color: '#dc2626' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                €{assignments.reduce((sum, a) => sum + Number(a.paymentAmount || 0), 0).toLocaleString()}
              </p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Total Value</p>
            </div>
          </div>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <Calendar style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>No Assignments Yet</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Create your first skipper assignment to get started</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Assignment</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Skipper</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Boat</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Dates</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Payment</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, i) => {
                const statusStyle = getStatusColor(assignment.status);
                const paymentStyle = getPaymentStatusColor(assignment.paymentStatus);
                return (
                  <tr
                    key={assignment.id}
                    style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }}
                    data-testid={`assignment-row-${assignment.id}`}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div>
                        <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{assignment.title || 'Untitled'}</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0, textTransform: 'capitalize' }}>{assignment.assignmentType.replace('_', ' ')}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {getSkipperName(assignment.skipperId)}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {getBoatName(assignment.dealerBoatId)}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b', fontSize: 13 }}>
                      <div>{format(new Date(assignment.startDate), 'MMM d, HH:mm')}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>to {format(new Date(assignment.endDate), 'MMM d, HH:mm')}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge style={{ background: statusStyle.bg, color: statusStyle.color, border: 'none', textTransform: 'capitalize' }}>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                          {assignment.paymentAmount ? `€${Number(assignment.paymentAmount).toLocaleString()}` : '-'}
                        </span>
                        <Badge style={{ background: paymentStyle.bg, color: paymentStyle.color, border: 'none', marginLeft: 8, textTransform: 'capitalize' }}>
                          {assignment.paymentStatus}
                        </Badge>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(assignment)}
                        data-testid={`button-view-assignment-${assignment.id}`}
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
        <DialogContent style={{ maxWidth: 550 }}>
          <DialogHeader>
            <DialogTitle>Assignment Details</DialogTitle>
            <DialogDescription>
              View assignment information
            </DialogDescription>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4 pt-4">
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', margin: 0 }}>{selectedAssignment.title || 'Untitled Assignment'}</p>
                    <p style={{ fontSize: 13, color: '#64748b', textTransform: 'capitalize' }}>{selectedAssignment.assignmentType.replace('_', ' ')}</p>
                  </div>
                  <Badge style={{ ...getStatusColor(selectedAssignment.status), border: 'none', textTransform: 'capitalize' }}>
                    {selectedAssignment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Skipper</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{getSkipperName(selectedAssignment.skipperId)}</p>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Boat</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{getBoatName(selectedAssignment.dealerBoatId)}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin style={{ width: 12, height: 12 }} /> Departure
                  </p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedAssignment.departurePort || '-'}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{format(new Date(selectedAssignment.startDate), 'MMM d, yyyy HH:mm')}</p>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin style={{ width: 12, height: 12 }} /> Arrival
                  </p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedAssignment.arrivalPort || '-'}</p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{format(new Date(selectedAssignment.endDate), 'MMM d, yyyy HH:mm')}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Guests</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedAssignment.guestCount || '-'} passengers</p>
                  {selectedAssignment.guestPhone && (
                    <p style={{ fontSize: 12, color: '#64748b' }}>{selectedAssignment.guestPhone}</p>
                  )}
                </div>
                <div style={{ padding: 12, background: '#dbeafe', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#2563eb', marginBottom: 2 }}>Payment</p>
                  <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 16 }}>
                    €{selectedAssignment.paymentAmount ? Number(selectedAssignment.paymentAmount).toLocaleString() : '-'}
                  </p>
                  <Badge style={{ ...getPaymentStatusColor(selectedAssignment.paymentStatus), border: 'none', textTransform: 'capitalize', marginTop: 4 }}>
                    {selectedAssignment.paymentStatus}
                  </Badge>
                </div>
              </div>

              {selectedAssignment.specialRequests && (
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Special Requests</p>
                  <p style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.5 }}>{selectedAssignment.specialRequests}</p>
                </div>
              )}

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
