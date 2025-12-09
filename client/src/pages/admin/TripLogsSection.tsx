import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, FileText, Fuel, Clock, AlertTriangle, MapPin, Wind, ThermometerSun } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface TripLog {
  id: string;
  assignmentId?: string;
  skipperId: string;
  dealerBoatId: string;
  dealerId: string;
  departureTime?: string;
  arrivalTime?: string;
  tripDurationHours?: string;
  departurePort?: string;
  arrivalPort?: string;
  routeDescription?: string;
  engineHoursStart?: string;
  engineHoursEnd?: string;
  fuelLevelStart?: number;
  fuelLevelEnd?: number;
  fuelUsedLiters?: string;
  fuelAddedLiters?: string;
  fuelCost?: string;
  weatherConditions?: string;
  seaState?: string;
  windSpeed?: string;
  visibility?: string;
  guestCount?: number;
  incidentOccurred?: boolean;
  incidentDescription?: string;
  maintenanceIssues?: string;
  skipperNotes?: string;
  guestFeedback?: string;
  guestRating?: number;
  preCheckCompleted?: boolean;
  postCheckCompleted?: boolean;
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
    case "submitted": return { bg: "#dcfce7", color: "#16a34a" };
    case "draft": return { bg: "#fef3c7", color: "#d97706" };
    case "reviewed": return { bg: "#dbeafe", color: "#2563eb" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

export default function TripLogsSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [selectedLog, setSelectedLog] = useState<TripLog | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: logs = [], isLoading } = useQuery<TripLog[]>({
    queryKey: ["/api/admin/trip-logs"]
  });

  const { data: skippers = [] } = useQuery<Skipper[]>({
    queryKey: ["/api/admin/skippers"]
  });

  const { data: boats = [] } = useQuery<DealerBoat[]>({
    queryKey: ["/api/admin/boats"]
  });

  const handleViewDetails = (log: TripLog) => {
    setSelectedLog(log);
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

  const getBoatName = (id: string) => {
    const boat = boats.find(b => b.id === id);
    return boat ? boat.name : 'Unknown';
  };

  const totalFuelUsed = logs.reduce((sum, l) => sum + Number(l.fuelUsedLiters || 0), 0);
  const totalFuelCost = logs.reduce((sum, l) => sum + Number(l.fuelCost || 0), 0);
  const incidentCount = logs.filter(l => l.incidentOccurred).length;

  return (
    <div>
      <SectionHeader
        title="Trip Logs"
        subtitle="View voyage records, fuel consumption, and incident reports"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText style={{ width: 20, height: 20, color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{logs.length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Total Logs</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Fuel style={{ width: 20, height: 20, color: '#d97706' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{totalFuelUsed.toLocaleString()}L</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Total Fuel Used</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock style={{ width: 20, height: 20, color: '#16a34a' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>€{totalFuelCost.toLocaleString()}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Fuel Costs</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: incidentCount > 0 ? '#fee2e2' : '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle style={{ width: 20, height: 20, color: incidentCount > 0 ? '#dc2626' : '#16a34a' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{incidentCount}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Incidents</p>
            </div>
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <FileText style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>No Trip Logs Yet</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Trip logs will appear here once skippers complete their voyages</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Trip</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Skipper</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Boat</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Fuel</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const statusStyle = getStatusColor(log.status);
                return (
                  <tr
                    key={log.id}
                    style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }}
                    data-testid={`triplog-row-${log.id}`}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div>
                        <p style={{ fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin style={{ width: 14, height: 14, color: '#64748b' }} />
                          {log.departurePort || 'Unknown'} → {log.arrivalPort || 'Unknown'}
                        </p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                          {log.departureTime ? format(new Date(log.departureTime), 'MMM d, yyyy') : '-'}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {getSkipperName(log.skipperId)}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {getBoatName(log.dealerBoatId)}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {log.tripDurationHours ? `${Number(log.tripDurationHours).toFixed(1)}h` : '-'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>
                          {log.fuelUsedLiters ? `${Number(log.fuelUsedLiters).toFixed(0)}L` : '-'}
                        </span>
                        {log.fuelCost && (
                          <span style={{ color: '#64748b', fontSize: 12, marginLeft: 4 }}>
                            (€{Number(log.fuelCost).toLocaleString()})
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Badge style={{ background: statusStyle.bg, color: statusStyle.color, border: 'none', textTransform: 'capitalize' }}>
                          {log.status}
                        </Badge>
                        {log.incidentOccurred && (
                          <AlertTriangle style={{ width: 16, height: 16, color: '#dc2626' }} />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(log)}
                        data-testid={`button-view-triplog-${log.id}`}
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
        <DialogContent style={{ maxWidth: 600 }}>
          <DialogHeader>
            <DialogTitle>Trip Log Details</DialogTitle>
            <DialogDescription>
              Complete voyage record and statistics
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 pt-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', margin: 0 }}>
                      {selectedLog.departurePort || 'Unknown'} → {selectedLog.arrivalPort || 'Unknown'}
                    </p>
                    <p style={{ fontSize: 13, color: '#64748b' }}>
                      {selectedLog.departureTime ? format(new Date(selectedLog.departureTime), 'MMMM d, yyyy') : '-'}
                    </p>
                  </div>
                  <Badge style={{ ...getStatusColor(selectedLog.status), border: 'none', textTransform: 'capitalize' }}>
                    {selectedLog.status}
                  </Badge>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Skipper</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{getSkipperName(selectedLog.skipperId)}</p>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Boat</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{getBoatName(selectedLog.dealerBoatId)}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock style={{ width: 12, height: 12 }} /> Duration
                  </p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>
                    {selectedLog.tripDurationHours ? `${Number(selectedLog.tripDurationHours).toFixed(1)} hours` : '-'}
                  </p>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Guests</p>
                  <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{selectedLog.guestCount || 0} passengers</p>
                </div>
              </div>

              <div style={{ padding: 16, background: '#fef3c7', borderRadius: 8 }}>
                <p style={{ fontWeight: 600, color: '#92400e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Fuel style={{ width: 16, height: 16 }} /> Fuel Report
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#92400e' }}>Used</p>
                    <p style={{ fontWeight: 700, color: '#78350f', fontSize: 16 }}>{selectedLog.fuelUsedLiters ? `${Number(selectedLog.fuelUsedLiters).toFixed(0)}L` : '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#92400e' }}>Added</p>
                    <p style={{ fontWeight: 700, color: '#78350f', fontSize: 16 }}>{selectedLog.fuelAddedLiters ? `${Number(selectedLog.fuelAddedLiters).toFixed(0)}L` : '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#92400e' }}>Cost</p>
                    <p style={{ fontWeight: 700, color: '#78350f', fontSize: 16 }}>{selectedLog.fuelCost ? `€${Number(selectedLog.fuelCost).toLocaleString()}` : '-'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <span style={{ fontSize: 12, color: '#92400e' }}>Level: {selectedLog.fuelLevelStart || 0}% → {selectedLog.fuelLevelEnd || 0}%</span>
                </div>
              </div>

              <div style={{ padding: 16, background: '#dbeafe', borderRadius: 8 }}>
                <p style={{ fontWeight: 600, color: '#1e40af', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ThermometerSun style={{ width: 16, height: 16 }} /> Weather Conditions
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#2563eb' }}>Weather</p>
                    <p style={{ fontWeight: 600, color: '#1e40af', fontSize: 14 }}>{selectedLog.weatherConditions || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#2563eb' }}>Sea State</p>
                    <p style={{ fontWeight: 600, color: '#1e40af', fontSize: 14 }}>{selectedLog.seaState || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Wind style={{ width: 12, height: 12 }} /> Wind
                    </p>
                    <p style={{ fontWeight: 600, color: '#1e40af', fontSize: 14 }}>{selectedLog.windSpeed || '-'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: '#2563eb' }}>Visibility</p>
                    <p style={{ fontWeight: 600, color: '#1e40af', fontSize: 14 }}>{selectedLog.visibility || '-'}</p>
                  </div>
                </div>
              </div>

              {selectedLog.incidentOccurred && (
                <div style={{ padding: 16, background: '#fee2e2', borderRadius: 8 }}>
                  <p style={{ fontWeight: 600, color: '#dc2626', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle style={{ width: 16, height: 16 }} /> Incident Report
                  </p>
                  <p style={{ color: '#991b1b', fontSize: 14, lineHeight: 1.5 }}>{selectedLog.incidentDescription || 'No description provided'}</p>
                </div>
              )}

              {selectedLog.skipperNotes && (
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Skipper Notes</p>
                  <p style={{ color: '#0f172a', fontSize: 14, lineHeight: 1.5 }}>{selectedLog.skipperNotes}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <Badge style={{ background: selectedLog.preCheckCompleted ? '#dcfce7' : '#fee2e2', color: selectedLog.preCheckCompleted ? '#16a34a' : '#dc2626', border: 'none' }}>
                  Pre-check {selectedLog.preCheckCompleted ? '✓' : '✗'}
                </Badge>
                <Badge style={{ background: selectedLog.postCheckCompleted ? '#dcfce7' : '#fee2e2', color: selectedLog.postCheckCompleted ? '#16a34a' : '#dc2626', border: 'none' }}>
                  Post-check {selectedLog.postCheckCompleted ? '✓' : '✗'}
                </Badge>
              </div>

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
