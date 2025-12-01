import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Anchor, Users, Ship, Building2, MessageSquare, LogOut, 
  Plus, Loader2, MapPin, ExternalLink, Gauge
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import deAntonioLogo from "@assets/DE-ANTONIO-YACHTS_LOGO-removebg-preview_1754331163197.png";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  dealerId?: string;
  isActive: boolean;
}

interface Dealer {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  region: string;
  isActive: boolean;
}

interface FleetModel {
  id: string;
  modelName: string;
  displayName: string;
  description: string;
  lengthMeters: string;
  beamMeters: string;
  maxCapacity: number;
  cabins: number;
  engines: string;
  maxSpeed: string;
  basePrice: string;
  images: string[];
  isActive: boolean;
}

interface DealerBoat {
  id: string;
  dealerId: string;
  fleetModelId: string;
  name: string;
  totalPrice: string;
  numberOfFractions: number;
  fractionPrice: string;
  availableShares: number;
  availableForSale: boolean;
  availableForCharter: boolean;
  charterDailyRate?: string;
  location: string;
  homePort: string;
  isActive: boolean;
}

interface Inquiry {
  id: string;
  dealerId?: string;
  dealerBoatId?: string;
  inquiryType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: string;
  createdAt: string;
}

function getRoleLabel(role: string): string {
  switch (role) {
    case "super_admin": return "Super Admin";
    case "staff": return "Staff";
    case "dealer": return "Dealer";
    default: return role;
  }
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState("fleet");

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      if (user.role === "dealer") {
        setActiveTab("boats");
      }
    } else {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/auth/logout", {});
    } catch (e) {}
    localStorage.removeItem("adminUser");
    setLocation("/admin");
  };

  if (!currentUser) {
    return (
      <div style={{ minWidth: 1280, minHeight: '100vh', background: '#0E2047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  const isDealer = currentUser.role === "dealer";
  const isAdmin = currentUser.role === "super_admin" || currentUser.role === "staff";

  const navItems = isAdmin
    ? [
        { id: "fleet", label: "Fleet Models", icon: Ship },
        { id: "dealers", label: "Dealer Network", icon: Building2 },
        { id: "users", label: "Admin Users", icon: Users },
      ]
    : [
        { id: "boats", label: "Boat Inventory", icon: Anchor },
        { id: "inquiries", label: "Inquiries", icon: MessageSquare },
      ];

  return (
    <div style={{ minWidth: 1280, minHeight: '100vh', display: 'flex', background: '#f1f5f9' }}>
      {/* Fixed Sidebar - Always Visible */}
      <aside style={{ width: 256, flexShrink: 0, background: 'linear-gradient(180deg, #0E2047 0%, #1e3a5f 100%)', display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ padding: 24, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={deAntonioLogo} alt="De Antonio Yachts" style={{ height: 32, filter: 'brightness(0) invert(1)' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 8, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: 16 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                data-testid={`nav-${item.id}`}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  marginBottom: 4,
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.15s',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                }}
              >
                <Icon style={{ width: 20, height: 20 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{getRoleLabel(currentUser.role)}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            data-testid="button-logout"
            style={{ width: '100%', justifyContent: 'flex-start', color: 'rgba(255,255,255,0.7)' }}
          >
            <LogOut style={{ width: 16, height: 16, marginRight: 8 }} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header style={{ height: 64, background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>Admin</span>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#1e293b', fontSize: 14, fontWeight: 600 }}>{navItems.find(n => n.id === activeTab)?.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: '#22c55e' }} />
              System Online
            </Badge>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
          {isAdmin && activeTab === "fleet" && <FleetSection />}
          {isAdmin && activeTab === "dealers" && <DealersSection />}
          {isAdmin && activeTab === "users" && <UsersSection currentUser={currentUser} />}
          {isDealer && activeTab === "boats" && <BoatsSection currentUser={currentUser} />}
          {isDealer && activeTab === "inquiries" && <InquiriesSection currentUser={currentUser} />}
        </div>
      </main>
    </div>
  );
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

function UsersSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({ queryKey: ["/api/admin/users"] });
  const { data: dealers = [] } = useQuery<Dealer[]>({ queryKey: ["/api/admin/dealers"] });

  const [formData, setFormData] = useState({
    username: "", email: "", firstName: "", lastName: "", password: "", role: "staff", dealerId: "", isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => { const res = await apiRequest("POST", "/api/admin/users", data); return res.json(); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setDialogOpen(false);
      setFormData({ username: "", email: "", firstName: "", lastName: "", password: "", role: "staff", dealerId: "", isActive: true });
      toast({ title: "User created successfully" });
    },
    onError: (error: Error) => { toast({ title: "Failed to create user", description: error.message, variant: "destructive" }); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData };
    if (data.role !== "dealer") delete (data as any).dealerId;
    createMutation.mutate(data);
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} /></div>;

  return (
    <div>
      <SectionHeader 
        title="Admin Users" 
        subtitle="Manage administrator accounts and access permissions"
        action={currentUser.role === "super_admin" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: '#0E2047' }} data-testid="button-add-user">
                <Plus style={{ width: 16, height: 16, marginRight: 8 }} /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>Add a new administrator to the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>First Name</Label><Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="mt-1" required data-testid="input-first-name" /></div>
                  <div><Label>Last Name</Label><Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="mt-1" required data-testid="input-last-name" /></div>
                </div>
                <div><Label>Username</Label><Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="mt-1" required data-testid="input-form-username" /></div>
                <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" required data-testid="input-email" /></div>
                <div><Label>Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mt-1" required data-testid="input-form-password" /></div>
                <div><Label>Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger className="mt-1" data-testid="select-role"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="staff">Staff</SelectItem><SelectItem value="dealer">Dealer</SelectItem></SelectContent>
                  </Select>
                </div>
                {formData.role === "dealer" && (
                  <div><Label>Dealer</Label>
                    <Select value={formData.dealerId} onValueChange={(v) => setFormData({ ...formData, dealerId: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-dealer"><SelectValue placeholder="Select dealer" /></SelectTrigger>
                      <SelectContent>{dealers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" style={{ background: '#0E2047' }} disabled={createMutation.isPending} data-testid="button-submit-user">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Name</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Username</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Role</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }} data-testid={`user-row-${user.id}`}>
                <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>{user.firstName} {user.lastName}</td>
                <td style={{ padding: '16px 20px', color: '#64748b' }}>@{user.username}</td>
                <td style={{ padding: '16px 20px', color: '#64748b' }}>{user.email}</td>
                <td style={{ padding: '16px 20px' }}><Badge variant="outline">{getRoleLabel(user.role)}</Badge></td>
                <td style={{ padding: '16px 20px' }}>
                  <Badge style={{ background: user.isActive ? '#dcfce7' : '#f1f5f9', color: user.isActive ? '#16a34a' : '#64748b', border: 'none' }}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DealersSection() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: dealers = [], isLoading } = useQuery<Dealer[]>({ queryKey: ["/api/admin/dealers"] });

  const [formData, setFormData] = useState({ name: "", contactName: "", email: "", phone: "", address: "", city: "", country: "", region: "Europe", isActive: true });

  const createMutation = useMutation({
    mutationFn: async (data: any) => { const res = await apiRequest("POST", "/api/admin/dealers", data); return res.json(); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dealers"] });
      setDialogOpen(false);
      setFormData({ name: "", contactName: "", email: "", phone: "", address: "", city: "", country: "", region: "Europe", isActive: true });
      toast({ title: "Dealer created successfully" });
    },
    onError: (error: Error) => { toast({ title: "Failed to create dealer", description: error.message, variant: "destructive" }); },
  });

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} /></div>;

  return (
    <div>
      <SectionHeader 
        title="Dealer Network" 
        subtitle="Manage authorized De Antonio yacht dealers worldwide"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: '#0E2047' }} data-testid="button-add-dealer">
                <Plus style={{ width: 16, height: 16, marginRight: 8 }} /> Add Dealer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Dealer</DialogTitle>
                <DialogDescription>Register an authorized De Antonio dealer</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Dealer Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" required data-testid="input-dealer-name" /></div>
                  <div><Label>Contact Person</Label><Input value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="mt-1" required data-testid="input-contact-name" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" required data-testid="input-dealer-email" /></div>
                  <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" required data-testid="input-dealer-phone" /></div>
                </div>
                <div><Label>Address</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1" data-testid="input-address" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>City</Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="mt-1" required data-testid="input-city" /></div>
                  <div><Label>Country</Label><Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="mt-1" required data-testid="input-country" /></div>
                  <div><Label>Region</Label>
                    <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-region"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Europe">Europe</SelectItem><SelectItem value="Americas">Americas</SelectItem><SelectItem value="Asia Pacific">Asia Pacific</SelectItem><SelectItem value="Middle East">Middle East</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" style={{ background: '#0E2047' }} disabled={createMutation.isPending} data-testid="button-submit-dealer">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Dealer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {dealers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <Building2 style={{ width: 48, height: 48, margin: '0 auto 16px', color: '#cbd5e1' }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>No dealers registered</p>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Click "Add Dealer" to register your first dealer</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Dealer</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Location</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Region</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((dealer, i) => (
                <tr key={dealer.id} style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }} data-testid={`dealer-row-${dealer.id}`}>
                  <td style={{ padding: '16px 20px' }}>
                    <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{dealer.name}</p>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <p style={{ color: '#0f172a', margin: 0 }}>{dealer.contactName}</p>
                    <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{dealer.email}</p>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569' }}>{dealer.city}, {dealer.country}</td>
                  <td style={{ padding: '16px 20px' }}><Badge variant="outline">{dealer.region}</Badge></td>
                  <td style={{ padding: '16px 20px' }}>
                    <Badge style={{ background: dealer.isActive ? '#dcfce7' : '#f1f5f9', color: dealer.isActive ? '#16a34a' : '#64748b', border: 'none' }}>
                      {dealer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FleetSection() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: models = [], isLoading } = useQuery<FleetModel[]>({ queryKey: ["/api/admin/fleet-models"] });

  const [formData, setFormData] = useState({ modelName: "", displayName: "", description: "", lengthMeters: "", beamMeters: "", maxCapacity: 10, cabins: 1, engines: "", maxSpeed: "", basePrice: "", images: [""], isActive: true });

  const createMutation = useMutation({
    mutationFn: async (data: any) => { const res = await apiRequest("POST", "/api/admin/fleet-models", data); return res.json(); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fleet-models"] });
      setDialogOpen(false);
      setFormData({ modelName: "", displayName: "", description: "", lengthMeters: "", beamMeters: "", maxCapacity: 10, cabins: 1, engines: "", maxSpeed: "", basePrice: "", images: [""], isActive: true });
      toast({ title: "Yacht added to fleet" });
    },
    onError: (error: Error) => { toast({ title: "Failed to add yacht", description: error.message, variant: "destructive" }); },
  });

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} /></div>;

  return (
    <div>
      <SectionHeader 
        title="Fleet Models" 
        subtitle="Official De Antonio yacht lineup with specifications and pricing"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: '#0E2047' }} data-testid="button-add-fleet-model">
                <Plus style={{ width: 16, height: 16, marginRight: 8 }} /> Add Yacht
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add New Yacht to Fleet</DialogTitle>
                <DialogDescription>Register a new De Antonio yacht model</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...formData, images: formData.images.filter(img => img.trim()) }); }} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Model Code</Label><Input value={formData.modelName} onChange={(e) => setFormData({ ...formData, modelName: e.target.value })} placeholder="D42" className="mt-1" required data-testid="input-model-name" /></div>
                  <div><Label>Display Name</Label><Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} placeholder="De Antonio D42" className="mt-1" required data-testid="input-display-name" /></div>
                </div>
                <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="mt-1" data-testid="input-description" /></div>
                <div className="grid grid-cols-4 gap-4">
                  <div><Label>Length (m)</Label><Input type="number" step="0.1" value={formData.lengthMeters} onChange={(e) => setFormData({ ...formData, lengthMeters: e.target.value })} className="mt-1" required data-testid="input-length" /></div>
                  <div><Label>Beam (m)</Label><Input type="number" step="0.1" value={formData.beamMeters} onChange={(e) => setFormData({ ...formData, beamMeters: e.target.value })} className="mt-1" required data-testid="input-beam" /></div>
                  <div><Label>Passengers</Label><Input type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })} className="mt-1" required data-testid="input-capacity" /></div>
                  <div><Label>Cabins</Label><Input type="number" value={formData.cabins} onChange={(e) => setFormData({ ...formData, cabins: parseInt(e.target.value) || 0 })} className="mt-1" required data-testid="input-cabins" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Engines</Label><Input value={formData.engines} onChange={(e) => setFormData({ ...formData, engines: e.target.value })} placeholder="2x Mercury 450hp" className="mt-1" data-testid="input-engines" /></div>
                  <div><Label>Max Speed</Label><Input value={formData.maxSpeed} onChange={(e) => setFormData({ ...formData, maxSpeed: e.target.value })} placeholder="45 knots" className="mt-1" data-testid="input-speed" /></div>
                  <div><Label>Base Price (€)</Label><Input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} className="mt-1" required data-testid="input-base-price" /></div>
                </div>
                <div><Label>Image URL</Label><Input value={formData.images[0]} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} placeholder="https://..." className="mt-1" data-testid="input-image-url" /></div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" style={{ background: '#0E2047' }} disabled={createMutation.isPending} data-testid="button-submit-fleet-model">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add to Fleet
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Image</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Model</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Specifications</th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Performance</th>
              <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 140 }}>Base Price</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model, i) => (
              <tr key={model.id} style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }} data-testid={`fleet-model-${model.id}`}>
                <td style={{ padding: '16px 20px' }}>
                  {model.images?.[0] ? (
                    <img src={model.images[0]} alt={model.displayName} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <div style={{ width: 80, height: 56, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Ship style={{ width: 24, height: 24, color: '#94a3b8' }} />
                    </div>
                  )}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 16, margin: 0 }}>{model.displayName}</p>
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{model.modelName}</p>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <p style={{ color: '#0f172a', margin: 0 }}>{model.lengthMeters}m × {model.beamMeters}m</p>
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{model.maxCapacity} passengers • {model.cabins} cabin{Number(model.cabins) !== 1 ? 's' : ''}</p>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <p style={{ color: '#0f172a', margin: 0 }}>{model.engines}</p>
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Gauge style={{ width: 12, height: 12 }} /> {model.maxSpeed}
                  </p>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#0E2047', fontSize: 18, margin: 0 }}>€{Number(model.basePrice).toLocaleString()}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BoatsSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: boats = [], isLoading } = useQuery<DealerBoat[]>({ queryKey: ["/api/admin/boats"] });
  const { data: fleetModels = [] } = useQuery<FleetModel[]>({ queryKey: ["/api/admin/fleet-models"] });

  const [formData, setFormData] = useState({ fleetModelId: "", dealerId: currentUser.dealerId || "", name: "", totalPrice: "", numberOfFractions: 5, availableForSale: true, availableForCharter: true, charterDailyRate: "", location: "", homePort: "" });

  const createMutation = useMutation({
    mutationFn: async (data: any) => { const res = await apiRequest("POST", "/api/admin/boats", data); return res.json(); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/boats"] });
      setDialogOpen(false);
      setFormData({ fleetModelId: "", dealerId: currentUser.dealerId || "", name: "", totalPrice: "", numberOfFractions: 5, availableForSale: true, availableForCharter: true, charterDailyRate: "", location: "", homePort: "" });
      toast({ title: "Boat added successfully" });
    },
    onError: (error: Error) => { toast({ title: "Failed to add boat", description: error.message, variant: "destructive" }); },
  });

  const handleModelChange = (modelId: string) => {
    const model = fleetModels.find(m => m.id === modelId);
    setFormData({ ...formData, fleetModelId: modelId, totalPrice: model?.basePrice || formData.totalPrice, name: formData.name || `${model?.displayName} - ${new Date().getFullYear()}` });
  };

  const calculatedFractionPrice = formData.totalPrice && formData.numberOfFractions ? (Number(formData.totalPrice) / formData.numberOfFractions) : 0;
  const getModelName = (modelId: string) => fleetModels.find(m => m.id === modelId)?.displayName || "Unknown";

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} /></div>;

  return (
    <div>
      <SectionHeader 
        title="Boat Inventory" 
        subtitle="Manage your boats available for sale and charter"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ background: '#0E2047' }} data-testid="button-add-boat">
                <Plus style={{ width: 16, height: 16, marginRight: 8 }} /> Add Boat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Boat</DialogTitle>
                <DialogDescription>Add a boat to your inventory</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4 pt-4">
                <div><Label>Fleet Model</Label>
                  <Select value={formData.fleetModelId} onValueChange={handleModelChange}>
                    <SelectTrigger className="mt-1" data-testid="select-fleet-model"><SelectValue placeholder="Select a model" /></SelectTrigger>
                    <SelectContent>{fleetModels.map((m) => <SelectItem key={m.id} value={m.id}>{m.displayName} — €{Number(m.basePrice).toLocaleString()}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Boat Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" required data-testid="input-boat-name" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Total Price (€)</Label><Input type="number" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} className="mt-1" required data-testid="input-total-price" /></div>
                  <div><Label>Number of Fractions</Label>
                    <Select value={formData.numberOfFractions.toString()} onValueChange={(v) => setFormData({ ...formData, numberOfFractions: parseInt(v) })}>
                      <SelectTrigger className="mt-1" data-testid="select-fractions"><SelectValue /></SelectTrigger>
                      <SelectContent>{[2, 3, 4, 5, 6, 8, 10].map((n) => <SelectItem key={n} value={n.toString()}>1/{n} share</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #0E2047 0%, #1e3a5f 100%)', borderRadius: 12, padding: 20 }}>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>Calculated Fraction Price</p>
                  <p style={{ color: '#fff', fontSize: 32, fontWeight: 700, margin: '8px 0 0' }}>€{calculatedFractionPrice.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Location</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1" data-testid="input-location" /></div>
                  <div><Label>Home Port</Label><Input value={formData.homePort} onChange={(e) => setFormData({ ...formData, homePort: e.target.value })} className="mt-1" data-testid="input-home-port" /></div>
                </div>
                <div className="flex items-center gap-8 py-2">
                  <label className="flex items-center gap-2 cursor-pointer"><Switch checked={formData.availableForSale} onCheckedChange={(c) => setFormData({ ...formData, availableForSale: c })} data-testid="switch-for-sale" /><span>For Sale</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><Switch checked={formData.availableForCharter} onCheckedChange={(c) => setFormData({ ...formData, availableForCharter: c })} data-testid="switch-for-charter" /><span>For Charter</span></label>
                </div>
                {formData.availableForCharter && <div><Label>Daily Charter Rate (€)</Label><Input type="number" value={formData.charterDailyRate} onChange={(e) => setFormData({ ...formData, charterDailyRate: e.target.value })} className="mt-1" data-testid="input-charter-rate" /></div>}
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" style={{ background: '#0E2047' }} disabled={createMutation.isPending} data-testid="button-submit-boat">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add Boat
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {boats.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <Anchor style={{ width: 48, height: 48, margin: '0 auto 16px', color: '#cbd5e1' }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>No boats in inventory</p>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Click "Add Boat" to add your first boat</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Image</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Boat</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Location</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Fractions</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Price</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {boats.map((boat, i) => {
                const model = fleetModels.find(m => m.id === boat.fleetModelId);
                return (
                  <tr key={boat.id} style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }} data-testid={`boat-row-${boat.id}`}>
                    <td style={{ padding: '16px 20px' }}>
                      {model?.images?.[0] ? (
                        <img src={model.images[0]} alt={boat.name} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                      ) : (
                        <div style={{ width: 80, height: 56, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Anchor style={{ width: 24, height: 24, color: '#94a3b8' }} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{boat.name}</p>
                      <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{getModelName(boat.fleetModelId)}</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin style={{ width: 14, height: 14, color: '#94a3b8' }} /> {boat.location || 'N/A'}</p>
                      <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{boat.homePort}</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{boat.numberOfFractions} shares</p>
                      <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>€{Number(boat.fractionPrice).toLocaleString()} each</p>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, color: '#0E2047', fontSize: 18, margin: 0 }}>€{Number(boat.totalPrice).toLocaleString()}</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {boat.availableForSale && <Badge style={{ background: '#dcfce7', color: '#16a34a', border: 'none' }}>Sale</Badge>}
                        {boat.availableForCharter && <Badge style={{ background: '#dbeafe', color: '#2563eb', border: 'none' }}>Charter</Badge>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InquiriesSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();

  const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({ queryKey: ["/api/admin/inquiries"] });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const res = await apiRequest("PATCH", `/api/admin/inquiries/${id}`, { status }); return res.json(); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] }); toast({ title: "Inquiry updated" }); },
  });

  const getStatusColor = (status: string) => {
    switch (status) { case "new": return { bg: '#fee2e2', color: '#dc2626' }; case "contacted": return { bg: '#fef3c7', color: '#d97706' }; case "qualified": return { bg: '#dcfce7', color: '#16a34a' }; default: return { bg: '#f1f5f9', color: '#64748b' }; }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0E2047' }} /></div>;

  return (
    <div>
      <SectionHeader title="Customer Inquiries" subtitle="Manage and respond to purchase and charter inquiries" />

      {inquiries.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <MessageSquare style={{ width: 48, height: 48, margin: '0 auto 16px', color: '#cbd5e1' }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: '#475569' }}>No inquiries yet</p>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Customer inquiries will appear here</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Message</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Date</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry, i) => {
                const statusColors = getStatusColor(inquiry.status);
                return (
                  <tr key={inquiry.id} style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }} data-testid={`inquiry-${inquiry.id}`}>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>{inquiry.customerName}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ color: '#0f172a', margin: 0 }}>{inquiry.customerEmail}</p>
                      <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{inquiry.customerPhone}</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}><Badge variant="outline">{inquiry.inquiryType}</Badge></td>
                    <td style={{ padding: '16px 20px', color: '#475569', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inquiry.message}</td>
                    <td style={{ padding: '16px 20px', color: '#64748b', fontSize: 13 }}>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <Select value={inquiry.status} onValueChange={(s) => updateMutation.mutate({ id: inquiry.id, status: s })}>
                        <SelectTrigger style={{ width: 120 }} data-testid={`select-inquiry-status-${inquiry.id}`}>
                          <Badge style={{ background: statusColors.bg, color: statusColors.color, border: 'none' }}>{inquiry.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
