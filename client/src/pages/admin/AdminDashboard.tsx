import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Anchor, Users, Ship, Building2, MessageSquare, LogOut, 
  Plus, Loader2, MapPin, Menu, X
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2" data-testid="button-menu">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <img src={deAntonioLogo} alt="De Antonio" className="h-6 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{getRoleLabel(currentUser.role)}</Badge>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <img src={deAntonioLogo} alt="De Antonio Yachts" className="h-8 w-auto" />
              <button onClick={() => setSidebarOpen(false)} className="p-1">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                        activeTab === item.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-sm">
                    {currentUser.firstName[0]}{currentUser.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{getRoleLabel(currentUser.role)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full" data-testid="button-logout-mobile">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed left-0 top-0 bottom-0">
          <div className="p-6 border-b border-gray-200">
            <img src={deAntonioLogo} alt="De Antonio Yachts" className="h-10 w-auto" />
            <p className="text-xs text-gray-500 mt-2">Admin Portal</p>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-semibold">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-gray-500">{getRoleLabel(currentUser.role)}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full" data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            {isAdmin && activeTab === "fleet" && <FleetSection />}
            {isAdmin && activeTab === "dealers" && <DealersSection />}
            {isAdmin && activeTab === "users" && <UsersSection currentUser={currentUser} />}
            {isDealer && activeTab === "boats" && <BoatsSection currentUser={currentUser} />}
            {isDealer && activeTab === "inquiries" && <InquiriesSection currentUser={currentUser} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function UsersSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: dealers = [] } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "staff",
    dealerId: "",
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/users", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setDialogOpen(false);
      setFormData({ username: "", email: "", firstName: "", lastName: "", password: "", role: "staff", dealerId: "", isActive: true });
      toast({ title: "User created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create user", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData };
    if (data.role !== "dealer") {
      delete (data as any).dealerId;
    }
    createMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-sm text-gray-500">Manage admin accounts</p>
        </div>
        {currentUser.role === "super_admin" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required data-testid="input-first-name" />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required data-testid="input-last-name" />
                  </div>
                </div>
                <div>
                  <Label>Username</Label>
                  <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required data-testid="input-form-username" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required data-testid="input-email" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required data-testid="input-form-password" />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger data-testid="select-role"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="dealer">Dealer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.role === "dealer" && (
                  <div>
                    <Label>Dealer</Label>
                    <Select value={formData.dealerId} onValueChange={(v) => setFormData({ ...formData, dealerId: v })}>
                      <SelectTrigger data-testid="select-dealer"><SelectValue placeholder="Select dealer" /></SelectTrigger>
                      <SelectContent>
                        {dealers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <DialogFooter className="gap-2">
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending} data-testid="button-submit-user">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600">Name</th>
              <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">Username</th>
              <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Email</th>
              <th className="text-left p-4 font-medium text-gray-600">Role</th>
              <th className="text-left p-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50" data-testid={`user-row-${user.id}`}>
                <td className="p-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                <td className="p-4 text-gray-500 hidden sm:table-cell">@{user.username}</td>
                <td className="p-4 text-gray-500 hidden md:table-cell">{user.email}</td>
                <td className="p-4"><Badge variant="outline">{getRoleLabel(user.role)}</Badge></td>
                <td className="p-4">
                  <Badge className={user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
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

  const { data: dealers = [], isLoading } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
  });

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    region: "Europe",
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/dealers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dealers"] });
      setDialogOpen(false);
      setFormData({ name: "", contactName: "", email: "", phone: "", address: "", city: "", country: "", region: "Europe", isActive: true });
      toast({ title: "Dealer created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create dealer", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Authorized Dealers</h1>
          <p className="text-sm text-gray-500">Manage dealer network</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-dealer">
              <Plus className="w-4 h-4 mr-2" /> Add Dealer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Dealer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dealer Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required data-testid="input-dealer-name" />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} required data-testid="input-contact-name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required data-testid="input-dealer-email" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required data-testid="input-dealer-phone" />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} data-testid="input-address" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required data-testid="input-city" />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required data-testid="input-country" />
                </div>
                <div>
                  <Label>Region</Label>
                  <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
                    <SelectTrigger data-testid="select-region"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Americas">Americas</SelectItem>
                      <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                      <SelectItem value="Middle East">Middle East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending} data-testid="button-submit-dealer">
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {dealers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No dealers yet. Click "Add Dealer" to create one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Dealer</th>
                <th className="text-left p-4 font-medium text-gray-600 hidden sm:table-cell">Contact</th>
                <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Location</th>
                <th className="text-left p-4 font-medium text-gray-600 hidden lg:table-cell">Region</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dealers.map((dealer) => (
                <tr key={dealer.id} className="hover:bg-gray-50" data-testid={`dealer-row-${dealer.id}`}>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{dealer.name}</p>
                    <p className="text-sm text-gray-500 sm:hidden">{dealer.contactName}</p>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <p className="text-gray-900">{dealer.contactName}</p>
                    <p className="text-sm text-gray-500">{dealer.email}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-gray-700">{dealer.city}, {dealer.country}</p>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-gray-600">{dealer.region}</td>
                  <td className="p-4">
                    <Badge className={dealer.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
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
  
  const { data: models = [], isLoading } = useQuery<FleetModel[]>({
    queryKey: ["/api/admin/fleet-models"],
  });

  const [formData, setFormData] = useState({
    modelName: "",
    displayName: "",
    description: "",
    lengthMeters: "",
    beamMeters: "",
    maxCapacity: 10,
    cabins: 1,
    engines: "",
    maxSpeed: "",
    basePrice: "",
    images: [""],
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/fleet-models", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fleet-models"] });
      setDialogOpen(false);
      setFormData({ modelName: "", displayName: "", description: "", lengthMeters: "", beamMeters: "", maxCapacity: 10, cabins: 1, engines: "", maxSpeed: "", basePrice: "", images: [""], isActive: true });
      toast({ title: "Yacht model added to fleet" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add yacht", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ""),
    };
    createMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">De Antonio Fleet</h1>
          <p className="text-sm text-gray-500">Official yacht models</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-fleet-model">
              <Plus className="w-4 h-4 mr-2" /> Add Yacht
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Yacht to Fleet</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Model Name</Label>
                  <Input value={formData.modelName} onChange={(e) => setFormData({ ...formData, modelName: e.target.value })} placeholder="D42" required data-testid="input-model-name" />
                </div>
                <div>
                  <Label>Display Name</Label>
                  <Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} placeholder="De Antonio D42" required data-testid="input-display-name" />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Luxury yacht with..." rows={2} data-testid="input-description" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Length (m)</Label>
                  <Input type="number" step="0.1" value={formData.lengthMeters} onChange={(e) => setFormData({ ...formData, lengthMeters: e.target.value })} placeholder="12.8" required data-testid="input-length" />
                </div>
                <div>
                  <Label>Beam (m)</Label>
                  <Input type="number" step="0.1" value={formData.beamMeters} onChange={(e) => setFormData({ ...formData, beamMeters: e.target.value })} placeholder="3.9" required data-testid="input-beam" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Passengers</Label>
                  <Input type="number" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })} required data-testid="input-capacity" />
                </div>
                <div>
                  <Label>Cabins</Label>
                  <Input type="number" value={formData.cabins} onChange={(e) => setFormData({ ...formData, cabins: parseInt(e.target.value) || 0 })} required data-testid="input-cabins" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Engines</Label>
                  <Input value={formData.engines} onChange={(e) => setFormData({ ...formData, engines: e.target.value })} placeholder="2x Mercury 450hp" data-testid="input-engines" />
                </div>
                <div>
                  <Label>Max Speed</Label>
                  <Input value={formData.maxSpeed} onChange={(e) => setFormData({ ...formData, maxSpeed: e.target.value })} placeholder="45 knots" data-testid="input-speed" />
                </div>
              </div>
              
              <div>
                <Label>Base Price (€)</Label>
                <Input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} placeholder="650000" required data-testid="input-base-price" />
              </div>
              
              <div>
                <Label>Image URL</Label>
                <Input value={formData.images[0]} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} placeholder="https://..." data-testid="input-image-url" />
              </div>
              
              <DialogFooter className="gap-2">
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending} data-testid="button-submit-fleet-model">
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add to Fleet
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-medium text-gray-600 w-24">Image</th>
              <th className="text-left p-4 font-medium text-gray-600">Model</th>
              <th className="text-left p-4 font-medium text-gray-600 hidden md:table-cell">Specs</th>
              <th className="text-left p-4 font-medium text-gray-600 hidden lg:table-cell">Engines</th>
              <th className="text-right p-4 font-medium text-gray-600">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50" data-testid={`fleet-model-${model.id}`}>
                <td className="p-4">
                  {model.images?.[0] ? (
                    <img src={model.images[0]} alt={model.displayName} className="w-20 h-14 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-14 bg-gray-100 rounded flex items-center justify-center">
                      <Ship className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <p className="font-semibold text-gray-900">{model.displayName}</p>
                  <p className="text-sm text-gray-500">{model.modelName}</p>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <p className="text-sm text-gray-700">{model.lengthMeters}m × {model.beamMeters}m</p>
                  <p className="text-sm text-gray-500">{model.maxCapacity} pax • {model.cabins} cabin{model.cabins !== 1 ? "s" : ""}</p>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <p className="text-sm text-gray-700">{model.engines}</p>
                  <p className="text-sm text-gray-500">{model.maxSpeed}</p>
                </td>
                <td className="p-4 text-right">
                  <p className="text-lg font-bold text-blue-600">€{Number(model.basePrice).toLocaleString()}</p>
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

  const { data: boats = [], isLoading } = useQuery<DealerBoat[]>({
    queryKey: ["/api/admin/boats"],
  });

  const { data: fleetModels = [] } = useQuery<FleetModel[]>({
    queryKey: ["/api/admin/fleet-models"],
  });

  const [formData, setFormData] = useState({
    fleetModelId: "",
    dealerId: currentUser.dealerId || "",
    name: "",
    totalPrice: "",
    numberOfFractions: 5,
    availableForSale: true,
    availableForCharter: true,
    charterDailyRate: "",
    location: "",
    homePort: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/boats", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/boats"] });
      setDialogOpen(false);
      setFormData({ fleetModelId: "", dealerId: currentUser.dealerId || "", name: "", totalPrice: "", numberOfFractions: 5, availableForSale: true, availableForCharter: true, charterDailyRate: "", location: "", homePort: "" });
      toast({ title: "Boat added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add boat", description: error.message, variant: "destructive" });
    },
  });

  const handleModelChange = (modelId: string) => {
    const model = fleetModels.find(m => m.id === modelId);
    setFormData({
      ...formData,
      fleetModelId: modelId,
      totalPrice: model?.basePrice || formData.totalPrice,
      name: formData.name || `${model?.displayName} - ${new Date().getFullYear()}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const calculatedFractionPrice = formData.totalPrice && formData.numberOfFractions
    ? (Number(formData.totalPrice) / formData.numberOfFractions)
    : 0;

  const getModelName = (modelId: string) => fleetModels.find(m => m.id === modelId)?.displayName || "Unknown";

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Boats</h1>
          <p className="text-sm text-gray-500">Manage inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-boat">
              <Plus className="w-4 h-4 mr-2" /> Add Boat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Boat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Fleet Model</Label>
                <Select value={formData.fleetModelId} onValueChange={handleModelChange}>
                  <SelectTrigger data-testid="select-fleet-model"><SelectValue placeholder="Select model" /></SelectTrigger>
                  <SelectContent>
                    {fleetModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.displayName} (€{Number(m.basePrice).toLocaleString()})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Boat Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. De Antonio D42 - 2024" required data-testid="input-boat-name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Price (€)</Label>
                  <Input type="number" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} required data-testid="input-total-price" />
                </div>
                <div>
                  <Label>Fractions</Label>
                  <Select value={formData.numberOfFractions.toString()} onValueChange={(v) => setFormData({ ...formData, numberOfFractions: parseInt(v) })}>
                    <SelectTrigger data-testid="select-fractions"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <SelectItem key={n} value={n.toString()}>1/{n} share</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">Fraction Price</p>
                <p className="text-xl font-bold text-blue-600">€{calculatedFractionPrice.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Mediterranean" data-testid="input-location" />
                </div>
                <div>
                  <Label>Home Port</Label>
                  <Input value={formData.homePort} onChange={(e) => setFormData({ ...formData, homePort: e.target.value })} placeholder="Barcelona" data-testid="input-home-port" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.availableForSale} onCheckedChange={(c) => setFormData({ ...formData, availableForSale: c })} data-testid="switch-for-sale" />
                  <Label className="text-sm">For Sale</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.availableForCharter} onCheckedChange={(c) => setFormData({ ...formData, availableForCharter: c })} data-testid="switch-for-charter" />
                  <Label className="text-sm">For Charter</Label>
                </div>
              </div>

              {formData.availableForCharter && (
                <div>
                  <Label>Charter Daily Rate (€)</Label>
                  <Input type="number" value={formData.charterDailyRate} onChange={(e) => setFormData({ ...formData, charterDailyRate: e.target.value })} placeholder="2500" data-testid="input-charter-rate" />
                </div>
              )}

              <DialogFooter className="gap-2">
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending} data-testid="button-submit-boat">
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Add Boat
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {boats.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="py-12 text-center text-gray-500">
            <Ship className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No boats yet. Click "Add Boat" to add one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {boats.map((boat) => {
            const model = fleetModels.find(m => m.id === boat.fleetModelId);
            return (
              <Card key={boat.id} className="bg-white" data-testid={`boat-row-${boat.id}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {model?.images?.[0] && (
                      <img src={model.images[0]} alt={boat.name} className="w-full sm:w-24 h-32 sm:h-16 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{boat.name}</h3>
                      <p className="text-sm text-gray-500">{getModelName(boat.fleetModelId)}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />{boat.location} • {boat.homePort}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-lg font-bold text-blue-600">€{Number(boat.totalPrice).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{boat.numberOfFractions}× €{Number(boat.fractionPrice).toLocaleString()}</p>
                      <div className="flex gap-1 mt-1 sm:justify-end">
                        {boat.availableForSale && <Badge className="bg-green-100 text-green-700 text-xs">Sale</Badge>}
                        {boat.availableForCharter && <Badge className="bg-blue-100 text-blue-700 text-xs">Charter</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InquiriesSection({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();

  const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/inquiries/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
      toast({ title: "Inquiry updated" });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-red-100 text-red-700";
      case "contacted": return "bg-yellow-100 text-yellow-700";
      case "qualified": return "bg-green-100 text-green-700";
      case "closed": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Customer Inquiries</h1>
        <p className="text-sm text-gray-500">Manage inquiries</p>
      </div>

      {inquiries.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="py-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No inquiries yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="bg-white" data-testid={`inquiry-${inquiry.id}`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                      <Badge variant="outline">{inquiry.inquiryType}</Badge>
                    </div>
                    <p className="font-medium text-gray-900">{inquiry.customerName}</p>
                    <p className="text-sm text-gray-500">{inquiry.customerEmail} • {inquiry.customerPhone}</p>
                    <p className="mt-2 text-sm text-gray-700">{inquiry.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Select value={inquiry.status} onValueChange={(s) => updateMutation.mutate({ id: inquiry.id, status: s })}>
                    <SelectTrigger className="w-32" data-testid={`select-inquiry-status-${inquiry.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
