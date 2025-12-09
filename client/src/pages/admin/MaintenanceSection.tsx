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
import { Loader2, Plus, Eye, Wrench, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface MaintenanceRecord {
  id: string;
  dealerBoatId: string;
  dealerId: string;
  maintenanceType: string;
  category?: string;
  title: string;
  description?: string;
  scheduledDate?: string;
  startedDate?: string;
  completedDate?: string;
  nextDueDate?: string;
  nextDueEngineHours?: string;
  engineHoursAtService?: string;
  vendorName?: string;
  vendorContact?: string;
  laborCost?: string;
  partsCost?: string;
  totalCost?: string;
  currency: string;
  invoiceNumber?: string;
  status: string;
  priority: string;
  notes?: string;
  createdAt: string;
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
    case "cancelled": return { bg: "#f1f5f9", color: "#64748b" };
    case "overdue": return { bg: "#fee2e2", color: "#dc2626" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "urgent": return { bg: "#fee2e2", color: "#dc2626" };
    case "high": return { bg: "#fef3c7", color: "#d97706" };
    case "normal": return { bg: "#dbeafe", color: "#2563eb" };
    case "low": return { bg: "#f1f5f9", color: "#64748b" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

export default function MaintenanceSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: records = [], isLoading } = useQuery<MaintenanceRecord[]>({
    queryKey: ["/api/admin/maintenance"]
  });

  const { data: boats = [] } = useQuery<DealerBoat[]>({
    queryKey: ["/api/admin/boats"]
  });

  const [formData, setFormData] = useState({
    dealerBoatId: "",
    maintenanceType: "scheduled",
    category: "",
    title: "",
    description: "",
    scheduledDate: "",
    vendorName: "",
    laborCost: "",
    partsCost: "",
    priority: "normal",
    notes: "",
    dealerId: currentUser.dealerId || ""
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/maintenance", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/maintenance"] });
      setDialogOpen(false);
      setFormData({
        dealerBoatId: "", maintenanceType: "scheduled", category: "", title: "",
        description: "", scheduledDate: "", vendorName: "", laborCost: "",
        partsCost: "", priority: "normal", notes: "", dealerId: currentUser.dealerId || ""
      });
      toast({ title: "Maintenance record created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create maintenance record", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const laborCost = formData.laborCost ? parseFloat(formData.laborCost) : 0;
    const partsCost = formData.partsCost ? parseFloat(formData.partsCost) : 0;
    const data = {
      ...formData,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : null,
      laborCost: formData.laborCost || null,
      partsCost: formData.partsCost || null,
      totalCost: (laborCost + partsCost).toString(),
    };
    createMutation.mutate(data);
  };

  const handleViewDetails = (record: MaintenanceRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} />
      </div>
    );
  }

  const getBoatName = (id: string) => {
    const boat = boats.find(b => b.id === id);
    return boat ? boat.name : 'Unknown';
  };

  const scheduledCount = records.filter(r => r.status === 'scheduled').length;
  const inProgressCount = records.filter(r => r.status === 'in_progress').length;
  const completedCount = records.filter(r => r.status === 'completed').length;
  const totalCost = records.reduce((sum, r) => sum + Number(r.totalCost || 0), 0);

  return (
    <div>
      <SectionHeader
        title="Maintenance Records"
        subtitle="Schedule and track boat maintenance, repairs, and service history"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: '#0E2047' }} data-testid="button-add-maintenance">
                <Plus style={{ width: 16, height: 16, marginRight: 8 }} /> Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: 600 }}>
              <DialogHeader>
                <DialogTitle>Schedule Maintenance</DialogTitle>
                <DialogDescription>Create a new maintenance record for a boat</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Boat</Label>
                    <Select value={formData.dealerBoatId} onValueChange={(v) => setFormData({ ...formData, dealerBoatId: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-maintenance-boat">
                        <SelectValue placeholder="Select boat" />
                      </SelectTrigger>
                      <SelectContent>
                        {boats.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Maintenance Type</Label>
                    <Select value={formData.maintenanceType} onValueChange={(v) => setFormData({ ...formData, maintenanceType: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-maintenance-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="unscheduled">Unscheduled</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1"
                      placeholder="Engine oil change"
                      required
                      data-testid="input-maintenance-title"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engine">Engine</SelectItem>
                        <SelectItem value="Hull">Hull</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Navigation">Navigation</SelectItem>
                        <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                        <SelectItem value="Interior">Interior</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Scheduled Date</Label>
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="mt-1"
                      data-testid="input-scheduled-date"
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Vendor Name</Label>
                  <Input
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="mt-1"
                    placeholder="Marina Service Center"
                    data-testid="input-vendor-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Labor Cost (€)</Label>
                    <Input
                      type="number"
                      value={formData.laborCost}
                      onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
                      className="mt-1"
                      placeholder="500"
                      data-testid="input-labor-cost"
                    />
                  </div>
                  <div>
                    <Label>Parts Cost (€)</Label>
                    <Input
                      type="number"
                      value={formData.partsCost}
                      onChange={(e) => setFormData({ ...formData, partsCost: e.target.value })}
                      className="mt-1"
                      placeholder="200"
                      data-testid="input-parts-cost"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1"
                    placeholder="Detailed description of the maintenance work..."
                    data-testid="textarea-maintenance-description"
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
                    data-testid="button-submit-maintenance"
                  >
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Schedule Maintenance
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
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{scheduledCount}</p>
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
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{inProgressCount}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>In Progress</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle style={{ width: 20, height: 20, color: '#16a34a' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{completedCount}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Completed</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench style={{ width: 20, height: 20, color: '#dc2626' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>€{totalCost.toLocaleString()}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Total Costs</p>
            </div>
          </div>
        </div>
      </div>

      {records.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <Wrench style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>No Maintenance Records</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Schedule your first maintenance to keep your fleet in top condition</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Task</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Boat</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Scheduled</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cost</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, i) => {
                const statusStyle = getStatusColor(record.status);
                const priorityStyle = getPriorityColor(record.priority);
                return (
                  <tr
                    key={record.id}
                    style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }}
                    data-testid={`maintenance-row-${record.id}`}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div>
                        <p style={{ fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {record.title}
                          <Badge style={{ background: priorityStyle.bg, color: priorityStyle.color, border: 'none', textTransform: 'capitalize', fontSize: 10 }}>
                            {record.priority}
                          </Badge>
                        </p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{record.category || 'General'}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {getBoatName(record.dealerBoatId)}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b', textTransform: 'capitalize' }}>
                      {record.maintenanceType}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {record.scheduledDate ? format(new Date(record.scheduledDate), 'MMM d, yyyy') : '-'}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>
                      {record.totalCost ? `€${Number(record.totalCost).toLocaleString()}` : '-'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge style={{ background: statusStyle.bg, color: statusStyle.color, border: 'none', textTransform: 'capitalize' }}>
                        {record.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                        data-testid={`button-view-maintenance-${record.id}`}
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
            <DialogTitle>Maintenance Details</DialogTitle>
            <DialogDescription>
              View maintenance record information
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 pt-4">
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', margin: 0 }}>{selectedRecord.title}</p>
                    <p style={{ fontSize: 13, color: '#64748b' }}>{selectedRecord.category || 'General'} • {selectedRecord.maintenanceType}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Badge style={{ ...getPriorityColor(selectedRecord.priority), border: 'none', textTransform: 'capitalize' }}>
                      {selectedRecord.priority}
                    </Badge>
                    <Badge style={{ ...getStatusColor(selectedRecord.status), border: 'none', textTransform: 'capitalize' }}>
                      {selectedRecord.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Boat</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{getBoatName(selectedRecord.dealerBoatId)}</p>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Scheduled Date</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>
                    {selectedRecord.scheduledDate ? format(new Date(selectedRecord.scheduledDate), 'MMMM d, yyyy') : '-'}
                  </p>
                </div>
              </div>

              {selectedRecord.vendorName && (
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Vendor</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedRecord.vendorName}</p>
                  {selectedRecord.vendorContact && (
                    <p style={{ fontSize: 12, color: '#64748b' }}>{selectedRecord.vendorContact}</p>
                  )}
                </div>
              )}

              <div style={{ padding: 16, background: '#dbeafe', borderRadius: 8 }}>
                <p style={{ fontWeight: 600, color: '#1e40af', marginBottom: 12 }}>Cost Breakdown</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#2563eb' }}>Labor</p>
                    <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 16 }}>
                      €{selectedRecord.laborCost ? Number(selectedRecord.laborCost).toLocaleString() : '0'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#2563eb' }}>Parts</p>
                    <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 16 }}>
                      €{selectedRecord.partsCost ? Number(selectedRecord.partsCost).toLocaleString() : '0'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#2563eb' }}>Total</p>
                    <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 16 }}>
                      €{selectedRecord.totalCost ? Number(selectedRecord.totalCost).toLocaleString() : '0'}
                    </p>
                  </div>
                </div>
                {selectedRecord.invoiceNumber && (
                  <p style={{ fontSize: 12, color: '#2563eb', marginTop: 8 }}>Invoice: {selectedRecord.invoiceNumber}</p>
                )}
              </div>

              {selectedRecord.description && (
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Description</p>
                  <p style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.5 }}>{selectedRecord.description}</p>
                </div>
              )}

              {selectedRecord.notes && (
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Notes</p>
                  <p style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.5 }}>{selectedRecord.notes}</p>
                </div>
              )}

              {selectedRecord.nextDueDate && (
                <div style={{ padding: 12, background: '#fef3c7', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#92400e', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar style={{ width: 12, height: 12 }} /> Next Service Due
                  </p>
                  <p style={{ fontWeight: 600, color: '#78350f', fontSize: 14 }}>
                    {format(new Date(selectedRecord.nextDueDate), 'MMMM d, yyyy')}
                  </p>
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
