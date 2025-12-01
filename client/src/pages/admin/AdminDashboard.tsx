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
  Plus, Loader2, MapPin, ChevronRight, Euro, Gauge
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

function getPageTitle(tab: string): string {
  switch (tab) {
    case "fleet": return "Fleet Models";
    case "dealers": return "Dealer Network";
    case "users": return "Admin Users";
    case "boats": return "Boat Inventory";
    case "inquiries": return "Customer Inquiries";
    default: return "Dashboard";
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0E2047 0%, #1a365d 100%)' }}>
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  const isDealer = currentUser.role === "dealer";
  const isAdmin = currentUser.role === "super_admin" || currentUser.role === "staff";

  const navItems = isAdmin
    ? [
        { id: "fleet", label: "Fleet Models", icon: Ship, count: 6 },
        { id: "dealers", label: "Dealers", icon: Building2 },
        { id: "users", label: "Users", icon: Users },
      ]
    : [
        { id: "boats", label: "My Boats", icon: Anchor },
        { id: "inquiries", label: "Inquiries", icon: MessageSquare },
      ];

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #0E2047 0%, #1a365d 100%)' }}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <img src={deAntonioLogo} alt="De Antonio Yachts" className="h-8 w-auto brightness-0 invert" />
          <p className="text-white/50 text-xs mt-1.5 font-medium tracking-wide uppercase">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-white/15 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-white/50 text-xs">{getRoleLabel(currentUser.role)}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="w-full text-white/70 hover:text-white hover:bg-white/10 justify-start"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="font-semibold text-gray-800">{getPageTitle(activeTab)}</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/10 text-green-700 border-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
              System Online
            </Badge>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl">
            {isAdmin && activeTab === "fleet" && <FleetSection />}
            {isAdmin && activeTab === "dealers" && <DealersSection />}
            {isAdmin && activeTab === "users" && <UsersSection currentUser={currentUser} />}
            {isDealer && activeTab === "boats" && <BoatsSection currentUser={currentUser} />}
            {isDealer && activeTab === "inquiries" && <InquiriesSection currentUser={currentUser} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <p className="text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function DataTable({ columns, children }: { columns: { key: string; label: string; className?: string }[]; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/80">
            {columns.map((col) => (
              <th key={col.key} className={`text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {children}
        </tbody>
      </table>
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

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div>
      <SectionHeader 
        title="Admin Users" 
        subtitle="Manage administrator accounts and permissions"
        action={currentUser.role === "super_admin" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0E2047] hover:bg-[#1a365d] shadow-lg" data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New User</DialogTitle>
                <DialogDescription>Add a new administrator to the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">First Name</Label><Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="mt-1" required data-testid="input-first-name" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Last Name</Label><Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="mt-1" required data-testid="input-last-name" /></div>
                </div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Username</Label><Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="mt-1" required data-testid="input-form-username" /></div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" required data-testid="input-email" /></div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mt-1" required data-testid="input-form-password" /></div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger className="mt-1" data-testid="select-role"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="staff">Staff</SelectItem><SelectItem value="dealer">Dealer</SelectItem></SelectContent>
                  </Select>
                </div>
                {formData.role === "dealer" && (
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Dealer</Label>
                    <Select value={formData.dealerId} onValueChange={(v) => setFormData({ ...formData, dealerId: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-dealer"><SelectValue placeholder="Select dealer" /></SelectTrigger>
                      <SelectContent>{dealers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" className="bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-user">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      <DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'username', label: 'Username' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status', className: 'w-24' }]}>
        {users.map((user, i) => (
          <tr key={user.id} className={`${i % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50/50 transition-colors`} data-testid={`user-row-${user.id}`}>
            <td className="px-5 py-4"><p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p></td>
            <td className="px-5 py-4 text-gray-600">@{user.username}</td>
            <td className="px-5 py-4 text-gray-600">{user.email}</td>
            <td className="px-5 py-4"><Badge variant="outline" className="font-medium">{getRoleLabel(user.role)}</Badge></td>
            <td className="px-5 py-4"><Badge className={user.isActive ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-600 border-0"}>{user.isActive ? "Active" : "Inactive"}</Badge></td>
          </tr>
        ))}
      </DataTable>
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

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div>
      <SectionHeader 
        title="Dealer Network" 
        subtitle="Manage authorized De Antonio yacht dealers worldwide"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0E2047] hover:bg-[#1a365d] shadow-lg" data-testid="button-add-dealer">
                <Plus className="w-4 h-4 mr-2" /> Add Dealer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Dealer</DialogTitle>
                <DialogDescription>Register an authorized De Antonio dealer</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Dealer Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" required data-testid="input-dealer-name" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Contact Person</Label><Input value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="mt-1" required data-testid="input-contact-name" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" required data-testid="input-dealer-email" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" required data-testid="input-dealer-phone" /></div>
                </div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Address</Label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1" data-testid="input-address" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">City</Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="mt-1" required data-testid="input-city" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Country</Label><Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="mt-1" required data-testid="input-country" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Region</Label>
                    <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-region"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Europe">Europe</SelectItem><SelectItem value="Americas">Americas</SelectItem><SelectItem value="Asia Pacific">Asia Pacific</SelectItem><SelectItem value="Middle East">Middle East</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" className="bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-dealer">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Dealer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {dealers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">No dealers registered</p>
          <p className="text-gray-400 mt-1">Click "Add Dealer" to register your first dealer</p>
        </div>
      ) : (
        <DataTable columns={[{ key: 'dealer', label: 'Dealer' }, { key: 'contact', label: 'Contact' }, { key: 'location', label: 'Location' }, { key: 'region', label: 'Region' }, { key: 'status', label: 'Status', className: 'w-24' }]}>
          {dealers.map((dealer, i) => (
            <tr key={dealer.id} className={`${i % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50/50 transition-colors`} data-testid={`dealer-row-${dealer.id}`}>
              <td className="px-5 py-4"><p className="font-semibold text-gray-900">{dealer.name}</p></td>
              <td className="px-5 py-4"><p className="text-gray-900">{dealer.contactName}</p><p className="text-sm text-gray-500">{dealer.email}</p></td>
              <td className="px-5 py-4 text-gray-600">{dealer.city}, {dealer.country}</td>
              <td className="px-5 py-4"><Badge variant="outline">{dealer.region}</Badge></td>
              <td className="px-5 py-4"><Badge className={dealer.isActive ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-600 border-0"}>{dealer.isActive ? "Active" : "Inactive"}</Badge></td>
            </tr>
          ))}
        </DataTable>
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

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div>
      <SectionHeader 
        title="Fleet Models" 
        subtitle="Official De Antonio yacht lineup with specifications and pricing"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0E2047] hover:bg-[#1a365d] shadow-lg" data-testid="button-add-fleet-model">
                <Plus className="w-4 h-4 mr-2" /> Add Yacht
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Yacht to Fleet</DialogTitle>
                <DialogDescription>Register a new De Antonio yacht model</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...formData, images: formData.images.filter(img => img.trim()) }); }} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Model Code</Label><Input value={formData.modelName} onChange={(e) => setFormData({ ...formData, modelName: e.target.value })} placeholder="D42" className="mt-1" required data-testid="input-model-name" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Display Name</Label><Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} placeholder="De Antonio D42" className="mt-1" required data-testid="input-display-name" /></div>
                </div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="mt-1" data-testid="input-description" /></div>
                <div className="grid grid-cols-4 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Length (m)</Label><Input type="number" step="0.1" value={formData.lengthMeters} onChange={(e) => setFormData({ ...formData, lengthMeters: e.target.value })} className="mt-1" required data-testid="input-length" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Beam (m)</Label><Input type="number" step="0.1" value={formData.beamMeters} onChange={(e) => setFormData({ ...formData, beamMeters: e.target.value })} className="mt-1" required data-testid="input-beam" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Passengers</Label><Input type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })} className="mt-1" required data-testid="input-capacity" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Cabins</Label><Input type="number" value={formData.cabins} onChange={(e) => setFormData({ ...formData, cabins: parseInt(e.target.value) || 0 })} className="mt-1" required data-testid="input-cabins" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Engines</Label><Input value={formData.engines} onChange={(e) => setFormData({ ...formData, engines: e.target.value })} placeholder="2x Mercury 450hp" className="mt-1" data-testid="input-engines" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Max Speed</Label><Input value={formData.maxSpeed} onChange={(e) => setFormData({ ...formData, maxSpeed: e.target.value })} placeholder="45 knots" className="mt-1" data-testid="input-speed" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Base Price (€)</Label><Input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} className="mt-1" required data-testid="input-base-price" /></div>
                </div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Image URL</Label><Input value={formData.images[0]} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} placeholder="https://..." className="mt-1" data-testid="input-image-url" /></div>
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" className="bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-fleet-model">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add to Fleet
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable columns={[{ key: 'image', label: '', className: 'w-24' }, { key: 'model', label: 'Model' }, { key: 'specs', label: 'Specifications' }, { key: 'engines', label: 'Performance' }, { key: 'price', label: 'Base Price', className: 'text-right' }]}>
        {models.map((model, i) => (
          <tr key={model.id} className={`${i % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50/50 transition-colors`} data-testid={`fleet-model-${model.id}`}>
            <td className="px-5 py-4">
              {model.images?.[0] ? (
                <img src={model.images[0]} alt={model.displayName} className="w-20 h-14 object-cover rounded-lg shadow-sm" />
              ) : (
                <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center"><Ship className="w-6 h-6 text-gray-400" /></div>
              )}
            </td>
            <td className="px-5 py-4">
              <p className="font-bold text-gray-900 text-lg">{model.displayName}</p>
              <p className="text-gray-500 text-sm">{model.modelName}</p>
            </td>
            <td className="px-5 py-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-700"><strong>{model.lengthMeters}</strong>m length</span>
                <span className="text-gray-700"><strong>{model.maxCapacity}</strong> passengers</span>
                <span className="text-gray-700"><strong>{model.cabins}</strong> cabin{model.cabins !== 1 ? 's' : ''}</span>
              </div>
            </td>
            <td className="px-5 py-4">
              <p className="text-gray-900 font-medium">{model.engines}</p>
              <p className="text-gray-500 text-sm flex items-center gap-1"><Gauge className="w-3 h-3" />{model.maxSpeed}</p>
            </td>
            <td className="px-5 py-4 text-right">
              <p className="text-xl font-bold text-[#0E2047]">€{Number(model.basePrice).toLocaleString()}</p>
            </td>
          </tr>
        ))}
      </DataTable>
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

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div>
      <SectionHeader 
        title="Boat Inventory" 
        subtitle="Manage your boats available for sale and charter"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0E2047] hover:bg-[#1a365d] shadow-lg" data-testid="button-add-boat">
                <Plus className="w-4 h-4 mr-2" /> Add Boat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Boat</DialogTitle>
                <DialogDescription>Add a boat to your inventory</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4 pt-2">
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Fleet Model</Label>
                  <Select value={formData.fleetModelId} onValueChange={handleModelChange}>
                    <SelectTrigger className="mt-1" data-testid="select-fleet-model"><SelectValue placeholder="Select a model" /></SelectTrigger>
                    <SelectContent>{fleetModels.map((m) => <SelectItem key={m.id} value={m.id}>{m.displayName} — €{Number(m.basePrice).toLocaleString()}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs font-semibold text-gray-600 uppercase">Boat Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" required data-testid="input-boat-name" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Total Price (€)</Label><Input type="number" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} className="mt-1" required data-testid="input-total-price" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Fractions</Label>
                    <Select value={formData.numberOfFractions.toString()} onValueChange={(v) => setFormData({ ...formData, numberOfFractions: parseInt(v) })}>
                      <SelectTrigger className="mt-1" data-testid="select-fractions"><SelectValue /></SelectTrigger>
                      <SelectContent>{[2, 3, 4, 5, 6, 8, 10].map((n) => <SelectItem key={n} value={n.toString()}>1/{n} share</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#0E2047] to-[#1a365d] rounded-xl p-4 text-white">
                  <p className="text-white/70 text-xs font-semibold uppercase">Calculated Fraction Price</p>
                  <p className="text-3xl font-bold mt-1">€{calculatedFractionPrice.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Location</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1" data-testid="input-location" /></div>
                  <div><Label className="text-xs font-semibold text-gray-600 uppercase">Home Port</Label><Input value={formData.homePort} onChange={(e) => setFormData({ ...formData, homePort: e.target.value })} className="mt-1" data-testid="input-home-port" /></div>
                </div>
                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer"><Switch checked={formData.availableForSale} onCheckedChange={(c) => setFormData({ ...formData, availableForSale: c })} data-testid="switch-for-sale" /><span className="text-sm font-medium">For Sale</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><Switch checked={formData.availableForCharter} onCheckedChange={(c) => setFormData({ ...formData, availableForCharter: c })} data-testid="switch-for-charter" /><span className="text-sm font-medium">For Charter</span></label>
                </div>
                {formData.availableForCharter && <div><Label className="text-xs font-semibold text-gray-600 uppercase">Daily Charter Rate (€)</Label><Input type="number" value={formData.charterDailyRate} onChange={(e) => setFormData({ ...formData, charterDailyRate: e.target.value })} className="mt-1" data-testid="input-charter-rate" /></div>}
                <DialogFooter className="pt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" className="bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-boat">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add Boat
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {boats.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <Anchor className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">No boats in inventory</p>
          <p className="text-gray-400 mt-1">Click "Add Boat" to add your first boat</p>
        </div>
      ) : (
        <DataTable columns={[{ key: 'image', label: '', className: 'w-28' }, { key: 'boat', label: 'Boat' }, { key: 'location', label: 'Location' }, { key: 'fractions', label: 'Fractions' }, { key: 'price', label: 'Price', className: 'text-right' }, { key: 'status', label: 'Status' }]}>
          {boats.map((boat, i) => {
            const model = fleetModels.find(m => m.id === boat.fleetModelId);
            return (
              <tr key={boat.id} className={`${i % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50/50 transition-colors`} data-testid={`boat-row-${boat.id}`}>
                <td className="px-5 py-4">
                  {model?.images?.[0] ? <img src={model.images[0]} alt={boat.name} className="w-24 h-16 object-cover rounded-lg shadow-sm" /> : <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><Anchor className="w-6 h-6 text-gray-400" /></div>}
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-gray-900">{boat.name}</p>
                  <p className="text-gray-500 text-sm">{getModelName(boat.fleetModelId)}</p>
                </td>
                <td className="px-5 py-4"><div className="flex items-center gap-1 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" />{boat.location || 'N/A'}</div><p className="text-gray-500 text-sm">{boat.homePort}</p></td>
                <td className="px-5 py-4"><p className="font-semibold text-gray-900">{boat.numberOfFractions} shares</p><p className="text-gray-500 text-sm">€{Number(boat.fractionPrice).toLocaleString()} each</p></td>
                <td className="px-5 py-4 text-right"><p className="text-xl font-bold text-[#0E2047]">€{Number(boat.totalPrice).toLocaleString()}</p></td>
                <td className="px-5 py-4"><div className="flex gap-1">{boat.availableForSale && <Badge className="bg-green-100 text-green-700 border-0">Sale</Badge>}{boat.availableForCharter && <Badge className="bg-blue-100 text-blue-700 border-0">Charter</Badge>}</div></td>
              </tr>
            );
          })}
        </DataTable>
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
    switch (status) { case "new": return "bg-red-100 text-red-700"; case "contacted": return "bg-yellow-100 text-yellow-700"; case "qualified": return "bg-green-100 text-green-700"; default: return "bg-gray-100 text-gray-600"; }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div>
      <SectionHeader title="Customer Inquiries" subtitle="Manage and respond to purchase and charter inquiries" />

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">No inquiries yet</p>
          <p className="text-gray-400 mt-1">Customer inquiries will appear here</p>
        </div>
      ) : (
        <DataTable columns={[{ key: 'customer', label: 'Customer' }, { key: 'contact', label: 'Contact' }, { key: 'type', label: 'Type' }, { key: 'message', label: 'Message' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' }]}>
          {inquiries.map((inquiry, i) => (
            <tr key={inquiry.id} className={`${i % 2 === 1 ? 'bg-gray-50/50' : ''} hover:bg-blue-50/50 transition-colors`} data-testid={`inquiry-${inquiry.id}`}>
              <td className="px-5 py-4 font-semibold text-gray-900">{inquiry.customerName}</td>
              <td className="px-5 py-4"><p className="text-gray-900">{inquiry.customerEmail}</p><p className="text-gray-500 text-sm">{inquiry.customerPhone}</p></td>
              <td className="px-5 py-4"><Badge variant="outline">{inquiry.inquiryType}</Badge></td>
              <td className="px-5 py-4 max-w-xs"><p className="text-gray-600 text-sm truncate">{inquiry.message}</p></td>
              <td className="px-5 py-4 text-gray-500 text-sm">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-4">
                <Select value={inquiry.status} onValueChange={(s) => updateMutation.mutate({ id: inquiry.id, status: s })}>
                  <SelectTrigger className="w-28" data-testid={`select-inquiry-status-${inquiry.id}`}><Badge className={`${getStatusColor(inquiry.status)} border-0`}>{inquiry.status}</Badge></SelectTrigger>
                  <SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="contacted">Contacted</SelectItem><SelectItem value="qualified">Qualified</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
