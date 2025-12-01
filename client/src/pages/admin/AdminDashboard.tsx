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
  Plus, Loader2, MapPin, Menu, X, Euro, Gauge, ChevronRight
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E2047]">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  const isDealer = currentUser.role === "dealer";
  const isAdmin = currentUser.role === "super_admin" || currentUser.role === "staff";

  const navItems = isAdmin
    ? [
        { id: "fleet", label: "Fleet Models", icon: Ship },
        { id: "dealers", label: "Dealers", icon: Building2 },
        { id: "users", label: "Users", icon: Users },
      ]
    : [
        { id: "boats", label: "My Boats", icon: Anchor },
        { id: "inquiries", label: "Inquiries", icon: MessageSquare },
      ];

  const currentNavItem = navItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile/Tablet Header */}
      <header className="sticky top-0 z-40 bg-[#0E2047] text-white px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
            data-testid="button-menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img src={deAntonioLogo} alt="De Antonio" className="h-6 brightness-0 invert" />
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1" />Online
          </Badge>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-14 left-0 z-30 w-64 h-[calc(100vh-3.5rem)] bg-[#0E2047] transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentUser.firstName} {currentUser.lastName}</p>
              <p className="text-white/50 text-sm">{getRoleLabel(currentUser.role)}</p>
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
      <main className="p-4">
        {isAdmin && activeTab === "fleet" && <FleetSection />}
        {isAdmin && activeTab === "dealers" && <DealersSection />}
        {isAdmin && activeTab === "users" && <UsersSection currentUser={currentUser} />}
        {isDealer && activeTab === "boats" && <BoatsSection currentUser={currentUser} />}
        {isDealer && activeTab === "inquiries" && <InquiriesSection currentUser={currentUser} />}
      </main>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

function DataCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 ${className}`}>
      {children}
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#0E2047]" /></div>;

  return (
    <div>
      <SectionHeader 
        title="Admin Users" 
        subtitle="Manage accounts"
        action={currentUser.role === "super_admin" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0E2047] hover:bg-[#1a365d]" data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>Add a new administrator</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">First Name</Label><Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="mt-1" required data-testid="input-first-name" /></div>
                  <div><Label className="text-xs text-gray-500">Last Name</Label><Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="mt-1" required data-testid="input-last-name" /></div>
                </div>
                <div><Label className="text-xs text-gray-500">Username</Label><Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="mt-1" required data-testid="input-form-username" /></div>
                <div><Label className="text-xs text-gray-500">Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" required data-testid="input-email" /></div>
                <div><Label className="text-xs text-gray-500">Password</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="mt-1" required data-testid="input-form-password" /></div>
                <div><Label className="text-xs text-gray-500">Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger className="mt-1" data-testid="select-role"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="super_admin">Super Admin</SelectItem><SelectItem value="staff">Staff</SelectItem><SelectItem value="dealer">Dealer</SelectItem></SelectContent>
                  </Select>
                </div>
                {formData.role === "dealer" && (
                  <div><Label className="text-xs text-gray-500">Dealer</Label>
                    <Select value={formData.dealerId} onValueChange={(v) => setFormData({ ...formData, dealerId: v })}>
                      <SelectTrigger className="mt-1" data-testid="select-dealer"><SelectValue placeholder="Select dealer" /></SelectTrigger>
                      <SelectContent>{dealers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <DialogFooter className="pt-2">
                  <Button type="submit" className="w-full bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-user">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      <div className="space-y-3">
        {users.map((user) => (
          <DataCard key={user.id}>
            <div className="flex items-center justify-between" data-testid={`user-row-${user.id}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#0E2047]/10 flex items-center justify-center font-bold text-[#0E2047] flex-shrink-0">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge className={user.isActive ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-600 border-0"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline" className="text-xs">{getRoleLabel(user.role)}</Badge>
              </div>
            </div>
          </DataCard>
        ))}
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#0E2047]" /></div>;

  return (
    <div>
      <SectionHeader 
        title="Dealers" 
        subtitle="Authorized network"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0E2047] hover:bg-[#1a365d]" data-testid="button-add-dealer">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle>Add Dealer</DialogTitle>
                <DialogDescription>Register authorized dealer</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-3 pt-2">
                <div><Label className="text-xs text-gray-500">Dealer Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" required data-testid="input-dealer-name" /></div>
                <div><Label className="text-xs text-gray-500">Contact Person</Label><Input value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="mt-1" required data-testid="input-contact-name" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1" required data-testid="input-dealer-email" /></div>
                  <div><Label className="text-xs text-gray-500">Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" required data-testid="input-dealer-phone" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">City</Label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="mt-1" required data-testid="input-city" /></div>
                  <div><Label className="text-xs text-gray-500">Country</Label><Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="mt-1" required data-testid="input-country" /></div>
                </div>
                <div><Label className="text-xs text-gray-500">Region</Label>
                  <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                    <SelectTrigger className="mt-1" data-testid="select-region"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Europe">Europe</SelectItem><SelectItem value="Americas">Americas</SelectItem><SelectItem value="Asia Pacific">Asia Pacific</SelectItem><SelectItem value="Middle East">Middle East</SelectItem></SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-2">
                  <Button type="submit" className="w-full bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-dealer">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Create Dealer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {dealers.length === 0 ? (
        <DataCard className="py-12 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-600">No dealers yet</p>
          <p className="text-sm text-gray-400">Click "Add" to register one</p>
        </DataCard>
      ) : (
        <div className="space-y-3">
          {dealers.map((dealer) => (
            <DataCard key={dealer.id}>
              <div className="flex items-start justify-between gap-3" data-testid={`dealer-row-${dealer.id}`}>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{dealer.name}</p>
                  <p className="text-sm text-gray-500">{dealer.contactName}</p>
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-400">
                    <MapPin className="w-3 h-3" />{dealer.city}, {dealer.country}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge className={dealer.isActive ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-600 border-0"}>
                    {dealer.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{dealer.region}</Badge>
                </div>
              </div>
            </DataCard>
          ))}
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#0E2047]" /></div>;

  return (
    <div>
      <SectionHeader 
        title="Fleet Models" 
        subtitle="Official De Antonio lineup"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0E2047] hover:bg-[#1a365d]" data-testid="button-add-fleet-model">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle>Add Yacht</DialogTitle>
                <DialogDescription>New fleet model</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...formData, images: formData.images.filter(img => img.trim()) }); }} className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">Model Code</Label><Input value={formData.modelName} onChange={(e) => setFormData({ ...formData, modelName: e.target.value })} placeholder="D42" className="mt-1" required data-testid="input-model-name" /></div>
                  <div><Label className="text-xs text-gray-500">Display Name</Label><Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} placeholder="De Antonio D42" className="mt-1" required data-testid="input-display-name" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">Length (m)</Label><Input type="number" step="0.1" value={formData.lengthMeters} onChange={(e) => setFormData({ ...formData, lengthMeters: e.target.value })} className="mt-1" required data-testid="input-length" /></div>
                  <div><Label className="text-xs text-gray-500">Beam (m)</Label><Input type="number" step="0.1" value={formData.beamMeters} onChange={(e) => setFormData({ ...formData, beamMeters: e.target.value })} className="mt-1" required data-testid="input-beam" /></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">Passengers</Label><Input type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })} className="mt-1" required data-testid="input-capacity" /></div>
                  <div><Label className="text-xs text-gray-500">Cabins</Label><Input type="number" value={formData.cabins} onChange={(e) => setFormData({ ...formData, cabins: parseInt(e.target.value) || 0 })} className="mt-1" required data-testid="input-cabins" /></div>
                </div>
                <div><Label className="text-xs text-gray-500">Engines</Label><Input value={formData.engines} onChange={(e) => setFormData({ ...formData, engines: e.target.value })} placeholder="2x Mercury 450hp" className="mt-1" data-testid="input-engines" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">Max Speed</Label><Input value={formData.maxSpeed} onChange={(e) => setFormData({ ...formData, maxSpeed: e.target.value })} placeholder="45 knots" className="mt-1" data-testid="input-speed" /></div>
                  <div><Label className="text-xs text-gray-500">Price (€)</Label><Input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} className="mt-1" required data-testid="input-base-price" /></div>
                </div>
                <DialogFooter className="pt-2">
                  <Button type="submit" className="w-full bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-fleet-model">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add to Fleet
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-3">
        {models.map((model) => (
          <DataCard key={model.id}>
            <div className="flex gap-3" data-testid={`fleet-model-${model.id}`}>
              {model.images?.[0] ? (
                <img src={model.images[0]} alt={model.displayName} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Ship className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{model.displayName}</p>
                    <p className="text-xs text-gray-500">{model.modelName}</p>
                  </div>
                  <p className="text-lg font-bold text-[#0E2047] flex-shrink-0">€{Number(model.basePrice).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                  <span>{model.lengthMeters}m</span>
                  <span>•</span>
                  <span>{model.maxCapacity} pax</span>
                  <span>•</span>
                  <span>{model.cabins} cabin{Number(model.cabins) !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </DataCard>
        ))}
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

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#0E2047]" /></div>;

  return (
    <div>
      <SectionHeader 
        title="My Boats" 
        subtitle="Inventory management"
        action={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0E2047] hover:bg-[#1a365d]" data-testid="button-add-boat">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle>Add Boat</DialogTitle>
                <DialogDescription>Add to your inventory</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-3 pt-2 max-h-[60vh] overflow-y-auto">
                <div><Label className="text-xs text-gray-500">Fleet Model</Label>
                  <Select value={formData.fleetModelId} onValueChange={handleModelChange}>
                    <SelectTrigger className="mt-1" data-testid="select-fleet-model"><SelectValue placeholder="Select model" /></SelectTrigger>
                    <SelectContent>{fleetModels.map((m) => <SelectItem key={m.id} value={m.id}>{m.displayName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs text-gray-500">Boat Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1" required data-testid="input-boat-name" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">Price (€)</Label><Input type="number" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} className="mt-1" required data-testid="input-total-price" /></div>
                  <div><Label className="text-xs text-gray-500">Fractions</Label>
                    <Select value={formData.numberOfFractions.toString()} onValueChange={(v) => setFormData({ ...formData, numberOfFractions: parseInt(v) })}>
                      <SelectTrigger className="mt-1" data-testid="select-fractions"><SelectValue /></SelectTrigger>
                      <SelectContent>{[2, 3, 4, 5, 6, 8, 10].map((n) => <SelectItem key={n} value={n.toString()}>1/{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-[#0E2047] rounded-lg p-3 text-white">
                  <p className="text-xs text-white/70">Fraction Price</p>
                  <p className="text-2xl font-bold">€{calculatedFractionPrice.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs text-gray-500">Location</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1" data-testid="input-location" /></div>
                  <div><Label className="text-xs text-gray-500">Home Port</Label><Input value={formData.homePort} onChange={(e) => setFormData({ ...formData, homePort: e.target.value })} className="mt-1" data-testid="input-home-port" /></div>
                </div>
                <div className="flex gap-4 py-1">
                  <label className="flex items-center gap-2"><Switch checked={formData.availableForSale} onCheckedChange={(c) => setFormData({ ...formData, availableForSale: c })} data-testid="switch-for-sale" /><span className="text-sm">Sale</span></label>
                  <label className="flex items-center gap-2"><Switch checked={formData.availableForCharter} onCheckedChange={(c) => setFormData({ ...formData, availableForCharter: c })} data-testid="switch-for-charter" /><span className="text-sm">Charter</span></label>
                </div>
                <DialogFooter className="pt-2">
                  <Button type="submit" className="w-full bg-[#0E2047] hover:bg-[#1a365d]" disabled={createMutation.isPending} data-testid="button-submit-boat">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Add Boat
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {boats.length === 0 ? (
        <DataCard className="py-12 text-center">
          <Anchor className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-600">No boats yet</p>
          <p className="text-sm text-gray-400">Click "Add" to add your first boat</p>
        </DataCard>
      ) : (
        <div className="space-y-3">
          {boats.map((boat) => {
            const model = fleetModels.find(m => m.id === boat.fleetModelId);
            return (
              <DataCard key={boat.id}>
                <div className="flex gap-3" data-testid={`boat-row-${boat.id}`}>
                  {model?.images?.[0] ? (
                    <img src={model.images[0]} alt={boat.name} className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Anchor className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{boat.name}</p>
                        <p className="text-xs text-gray-500">{getModelName(boat.fleetModelId)}</p>
                      </div>
                      <p className="text-lg font-bold text-[#0E2047] flex-shrink-0">€{Number(boat.totalPrice).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{boat.numberOfFractions} shares @ €{Number(boat.fractionPrice).toLocaleString()}</span>
                      <div className="flex gap-1 ml-auto">
                        {boat.availableForSale && <Badge className="bg-green-100 text-green-700 border-0 text-xs">Sale</Badge>}
                        {boat.availableForCharter && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">Charter</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              </DataCard>
            );
          })}
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
    switch (status) { case "new": return "bg-red-100 text-red-700"; case "contacted": return "bg-yellow-100 text-yellow-700"; case "qualified": return "bg-green-100 text-green-700"; default: return "bg-gray-100 text-gray-600"; }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#0E2047]" /></div>;

  return (
    <div>
      <SectionHeader title="Inquiries" subtitle="Customer requests" />

      {inquiries.length === 0 ? (
        <DataCard className="py-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-600">No inquiries yet</p>
          <p className="text-sm text-gray-400">Inquiries will appear here</p>
        </DataCard>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <DataCard key={inquiry.id}>
              <div data-testid={`inquiry-${inquiry.id}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{inquiry.customerName}</p>
                    <p className="text-sm text-gray-500 truncate">{inquiry.customerEmail}</p>
                  </div>
                  <Select value={inquiry.status} onValueChange={(s) => updateMutation.mutate({ id: inquiry.id, status: s })}>
                    <SelectTrigger className="w-28 h-8" data-testid={`select-inquiry-status-${inquiry.id}`}>
                      <Badge className={`${getStatusColor(inquiry.status)} border-0`}>{inquiry.status}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <Badge variant="outline">{inquiry.inquiryType}</Badge>
                  <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );
}
