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
import { Loader2, Plus, Eye, Anchor, Star, Calendar, Phone, Mail, Award } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface Skipper {
  id: string;
  dealerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  licenseType?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  certifications?: string[];
  yearsExperience?: number;
  languages?: string[];
  boatTypesQualified?: string[];
  dailyRate?: string;
  halfDayRate?: string;
  overnightRate?: string;
  status: string;
  bio?: string;
  rating?: string;
  totalTrips?: number;
  createdAt: string;
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
    case "active": return { bg: "#dcfce7", color: "#16a34a" };
    case "on_trip": return { bg: "#dbeafe", color: "#2563eb" };
    case "on_leave": return { bg: "#fef3c7", color: "#d97706" };
    case "inactive": return { bg: "#f1f5f9", color: "#64748b" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

export default function SkippersSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSkipper, setSelectedSkipper] = useState<Skipper | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: skippers = [], isLoading } = useQuery<Skipper[]>({
    queryKey: ["/api/admin/skippers"]
  });

  const { data: dealers = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/dealers"],
    enabled: currentUser.role !== "dealer"
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseType: "",
    licenseNumber: "",
    yearsExperience: "",
    dailyRate: "",
    halfDayRate: "",
    overnightRate: "",
    bio: "",
    dealerId: currentUser.dealerId || "",
    status: "active"
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/skippers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skippers"] });
      setDialogOpen(false);
      setFormData({
        firstName: "", lastName: "", email: "", phone: "", licenseType: "", licenseNumber: "",
        yearsExperience: "", dailyRate: "", halfDayRate: "", overnightRate: "", bio: "",
        dealerId: currentUser.dealerId || "", status: "active"
      });
      toast({ title: "Skipper created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create skipper", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : null,
    };
    createMutation.mutate(data);
  };

  const handleViewDetails = (skipper: Skipper) => {
    setSelectedSkipper(skipper);
    setDetailsOpen(true);
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
        title="Skipper Management"
        subtitle="Manage professional skippers, certifications, and availability"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: '#0E2047' }} data-testid="button-add-skipper">
                <Plus style={{ width: 16, height: 16, marginRight: 8 }} /> Add Skipper
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: 600 }}>
              <DialogHeader>
                <DialogTitle>Add New Skipper</DialogTitle>
                <DialogDescription>Register a professional skipper to your fleet</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1"
                      required
                      data-testid="input-skipper-first-name"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1"
                      required
                      data-testid="input-skipper-last-name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                      data-testid="input-skipper-email"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                      data-testid="input-skipper-phone"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>License Type</Label>
                    <Select value={formData.licenseType} onValueChange={(v) => setFormData({ ...formData, licenseType: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-license-type">
                        <SelectValue placeholder="Select license" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RYA Yachtmaster">RYA Yachtmaster</SelectItem>
                        <SelectItem value="RYA Yachtmaster Offshore">RYA Yachtmaster Offshore</SelectItem>
                        <SelectItem value="RYA Yachtmaster Ocean">RYA Yachtmaster Ocean</SelectItem>
                        <SelectItem value="USCG Captain">USCG Captain</SelectItem>
                        <SelectItem value="MCA STCW">MCA STCW</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <Input
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="mt-1"
                      data-testid="input-license-number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      className="mt-1"
                      data-testid="input-years-experience"
                    />
                  </div>
                  {currentUser.role !== "dealer" && (
                    <div>
                      <Label>Dealer</Label>
                      <Select value={formData.dealerId} onValueChange={(v) => setFormData({ ...formData, dealerId: v })}>
                        <SelectTrigger className="mt-1" data-testid="select-skipper-dealer">
                          <SelectValue placeholder="Select dealer" />
                        </SelectTrigger>
                        <SelectContent>
                          {dealers.map((d: any) => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Daily Rate (€)</Label>
                    <Input
                      type="number"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                      className="mt-1"
                      placeholder="400"
                      data-testid="input-daily-rate"
                    />
                  </div>
                  <div>
                    <Label>Half-Day Rate (€)</Label>
                    <Input
                      type="number"
                      value={formData.halfDayRate}
                      onChange={(e) => setFormData({ ...formData, halfDayRate: e.target.value })}
                      className="mt-1"
                      placeholder="250"
                      data-testid="input-half-day-rate"
                    />
                  </div>
                  <div>
                    <Label>Overnight Rate (€)</Label>
                    <Input
                      type="number"
                      value={formData.overnightRate}
                      onChange={(e) => setFormData({ ...formData, overnightRate: e.target.value })}
                      className="mt-1"
                      placeholder="500"
                      data-testid="input-overnight-rate"
                    />
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="mt-1"
                    placeholder="Brief professional background..."
                    data-testid="textarea-bio"
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
                    data-testid="button-submit-skipper"
                  >
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Add Skipper
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
              <Anchor style={{ width: 20, height: 20, color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{skippers.length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Total Skippers</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: 20, height: 20, color: '#16a34a' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{skippers.filter(s => s.status === 'active').length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Available</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award style={{ width: 20, height: 20, color: '#d97706' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{skippers.filter(s => s.status === 'on_trip').length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>On Trip</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star style={{ width: 20, height: 20, color: '#dc2626' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {skippers.length > 0 
                  ? (skippers.reduce((sum, s) => sum + Number(s.rating || 0), 0) / skippers.length).toFixed(1)
                  : '-'}
              </p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {skippers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <Anchor style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>No Skippers Yet</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Add your first professional skipper to get started</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Skipper</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>License</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Experience</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Daily Rate</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Rating</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skippers.map((skipper, i) => {
                const statusStyle = getStatusColor(skipper.status);
                return (
                  <tr
                    key={skipper.id}
                    style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }}
                    data-testid={`skipper-row-${skipper.id}`}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 20, background: '#0E2047', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                          {skipper.firstName[0]}{skipper.lastName[0]}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{skipper.firstName} {skipper.lastName}</p>
                          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{skipper.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {skipper.licenseType || '-'}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {skipper.yearsExperience ? `${skipper.yearsExperience} years` : '-'}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>
                      {skipper.dailyRate ? `€${Number(skipper.dailyRate).toLocaleString()}` : '-'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star style={{ width: 14, height: 14, color: '#f59e0b', fill: '#f59e0b' }} />
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{skipper.rating || '-'}</span>
                        <span style={{ color: '#64748b', fontSize: 12 }}>({skipper.totalTrips || 0} trips)</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge style={{ background: statusStyle.bg, color: statusStyle.color, border: 'none', textTransform: 'capitalize' }}>
                        {skipper.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(skipper)}
                        data-testid={`button-view-skipper-${skipper.id}`}
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
            <DialogTitle>Skipper Profile</DialogTitle>
            <DialogDescription>
              View skipper details and certifications
            </DialogDescription>
          </DialogHeader>
          {selectedSkipper && (
            <div className="space-y-4 pt-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: '#0E2047', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  {selectedSkipper.firstName[0]}{selectedSkipper.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 20, color: '#0f172a', margin: 0 }}>{selectedSkipper.firstName} {selectedSkipper.lastName}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <Badge style={{ ...getStatusColor(selectedSkipper.status), border: 'none', textTransform: 'capitalize' }}>
                      {selectedSkipper.status.replace('_', ' ')}
                    </Badge>
                    {selectedSkipper.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star style={{ width: 14, height: 14, color: '#f59e0b', fill: '#f59e0b' }} />
                        <span style={{ fontWeight: 600 }}>{selectedSkipper.rating}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {selectedSkipper.phone && (
                  <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone style={{ width: 12, height: 12 }} /> Phone
                    </p>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedSkipper.phone}</p>
                  </div>
                )}
                {selectedSkipper.email && (
                  <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail style={{ width: 12, height: 12 }} /> Email
                    </p>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedSkipper.email}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>License</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedSkipper.licenseType || '-'}</p>
                  {selectedSkipper.licenseNumber && (
                    <p style={{ fontSize: 12, color: '#64748b' }}>#{selectedSkipper.licenseNumber}</p>
                  )}
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Experience</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>
                    {selectedSkipper.yearsExperience ? `${selectedSkipper.yearsExperience} years` : '-'}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{selectedSkipper.totalTrips || 0} trips completed</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#dbeafe', borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: '#2563eb', marginBottom: 2 }}>Daily</p>
                  <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 16 }}>
                    €{selectedSkipper.dailyRate ? Number(selectedSkipper.dailyRate).toLocaleString() : '-'}
                  </p>
                </div>
                <div style={{ padding: 12, background: '#dcfce7', borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: '#16a34a', marginBottom: 2 }}>Half-Day</p>
                  <p style={{ fontWeight: 700, color: '#15803d', fontSize: 16 }}>
                    €{selectedSkipper.halfDayRate ? Number(selectedSkipper.halfDayRate).toLocaleString() : '-'}
                  </p>
                </div>
                <div style={{ padding: 12, background: '#fef3c7', borderRadius: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: '#d97706', marginBottom: 2 }}>Overnight</p>
                  <p style={{ fontWeight: 700, color: '#b45309', fontSize: 16 }}>
                    €{selectedSkipper.overnightRate ? Number(selectedSkipper.overnightRate).toLocaleString() : '-'}
                  </p>
                </div>
              </div>

              {selectedSkipper.bio && (
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Bio</p>
                  <p style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.5 }}>{selectedSkipper.bio}</p>
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
