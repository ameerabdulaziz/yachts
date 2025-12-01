import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Anchor, Users, Ship, Building2, MessageSquare, Calendar, LogOut, 
  Plus, Edit2, Loader2, MapPin, Euro, ChevronRight
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isDealer = currentUser.role === "dealer";
  const isAdmin = currentUser.role === "super_admin" || currentUser.role === "staff";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching app style */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={deAntonioLogo} alt="De Antonio" className="h-8 w-auto" />
            <div>
              <span className="text-sm font-semibold text-gray-900">Admin Portal</span>
              <Badge variant="outline" className="ml-2 text-xs">{currentUser.role}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              data-testid="button-logout"
              className="text-gray-600"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {isAdmin && (
            <>
              <Button
                variant={activeTab === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("users")}
                className={activeTab === "users" ? "bg-blue-600 text-white" : ""}
                data-testid="tab-users"
              >
                <Users className="w-4 h-4 mr-2" /> Users
              </Button>
              <Button
                variant={activeTab === "dealers" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("dealers")}
                className={activeTab === "dealers" ? "bg-blue-600 text-white" : ""}
                data-testid="tab-dealers"
              >
                <Building2 className="w-4 h-4 mr-2" /> Dealers
              </Button>
            </>
          )}
          <Button
            variant={activeTab === "fleet" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("fleet")}
            className={activeTab === "fleet" ? "bg-blue-600 text-white" : ""}
            data-testid="tab-fleet"
          >
            <Ship className="w-4 h-4 mr-2" /> Fleet
          </Button>
          <Button
            variant={activeTab === "boats" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("boats")}
            className={activeTab === "boats" ? "bg-blue-600 text-white" : ""}
            data-testid="tab-boats"
          >
            <Anchor className="w-4 h-4 mr-2" /> Boats
          </Button>
          <Button
            variant={activeTab === "inquiries" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("inquiries")}
            className={activeTab === "inquiries" ? "bg-blue-600 text-white" : ""}
            data-testid="tab-inquiries"
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Inquiries
          </Button>
        </div>

        {/* Tab Content */}
        {isAdmin && activeTab === "users" && <UsersSection currentUser={currentUser} />}
        {isAdmin && activeTab === "dealers" && <DealersSection />}
        {activeTab === "fleet" && <FleetSection />}
        {activeTab === "boats" && <BoatsSection currentUser={currentUser} />}
        {activeTab === "inquiries" && <InquiriesSection currentUser={currentUser} />}
      </main>
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
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Admin Users</h2>
        {currentUser.role === "super_admin" && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
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
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending} data-testid="button-submit-user">
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="bg-white" data-testid={`user-row-${user.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">@{user.username} • {user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Authorized Dealers</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-dealer">
              <Plus className="w-4 h-4 mr-2" /> Add Dealer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Dealer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Dealer Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required data-testid="input-dealer-name" />
                </div>
                <div>
                  <Label>Contact Person</Label>
                  <Input value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} required data-testid="input-contact-name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
              <div className="grid grid-cols-3 gap-3">
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
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending} data-testid="button-submit-dealer">
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Dealer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {dealers.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="p-8 text-center text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No dealers yet. Click "Add Dealer" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {dealers.map((dealer) => (
            <Card key={dealer.id} className="bg-white" data-testid={`dealer-card-${dealer.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{dealer.name}</h3>
                  <Badge variant={dealer.isActive ? "default" : "secondary"}>{dealer.isActive ? "Active" : "Inactive"}</Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><MapPin className="w-3 h-3 inline mr-1" />{dealer.city}, {dealer.country}</p>
                  <p>{dealer.contactName}</p>
                  <p>{dealer.email}</p>
                  <p>{dealer.phone}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FleetSection() {
  const { data: models = [], isLoading } = useQuery<FleetModel[]>({
    queryKey: ["/api/admin/fleet-models"],
  });

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">De Antonio Fleet Models</h2>
      <p className="text-sm text-gray-600">Official yacht models with base pricing</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="bg-white overflow-hidden" data-testid={`fleet-model-${model.id}`}>
            {model.images?.[0] && (
              <img src={model.images[0]} alt={model.displayName} className="w-full h-40 object-cover" />
            )}
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{model.displayName}</h3>
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p>{model.lengthMeters}m • {model.maxCapacity} passengers</p>
                <p>{model.cabins} cabin{model.cabins !== 1 ? "s" : ""} • {model.engines}</p>
              </div>
              <p className="text-xl font-bold text-blue-600">€{Number(model.basePrice).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
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

  const { data: dealers = [] } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
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
  const getDealerName = (dealerId: string) => dealers.find(d => d.id === dealerId)?.name || "Unknown";

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Boats for Sale & Charter</h2>
          <p className="text-sm text-gray-600">Manage your inventory with automatic fraction pricing</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-boat">
              <Plus className="w-4 h-4 mr-2" /> Add Boat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Boat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
                {currentUser.role !== "dealer" && (
                  <div>
                    <Label>Dealer</Label>
                    <Select value={formData.dealerId} onValueChange={(v) => setFormData({ ...formData, dealerId: v })}>
                      <SelectTrigger data-testid="select-boat-dealer"><SelectValue placeholder="Select dealer" /></SelectTrigger>
                      <SelectContent>
                        {dealers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label>Boat Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. De Antonio D42 - 2024" required data-testid="input-boat-name" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Total Price (€)</Label>
                  <Input type="number" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} required data-testid="input-total-price" />
                </div>
                <div>
                  <Label>Number of Fractions</Label>
                  <Select value={formData.numberOfFractions.toString()} onValueChange={(v) => setFormData({ ...formData, numberOfFractions: parseInt(v) })}>
                    <SelectTrigger data-testid="select-fractions"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <SelectItem key={n} value={n.toString()}>{n} fractions (1/{n} share)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fraction Price Calculator */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Calculated Fraction Price</p>
                <p className="text-2xl font-bold text-blue-600">€{calculatedFractionPrice.toLocaleString()}</p>
                <p className="text-xs text-gray-500">€{Number(formData.totalPrice || 0).toLocaleString()} ÷ {formData.numberOfFractions} fractions</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <Label>For Sale</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.availableForCharter} onCheckedChange={(c) => setFormData({ ...formData, availableForCharter: c })} data-testid="switch-for-charter" />
                  <Label>For Charter</Label>
                </div>
              </div>

              {formData.availableForCharter && (
                <div>
                  <Label>Charter Daily Rate (€)</Label>
                  <Input type="number" value={formData.charterDailyRate} onChange={(e) => setFormData({ ...formData, charterDailyRate: e.target.value })} placeholder="2500" data-testid="input-charter-rate" />
                </div>
              )}

              <DialogFooter>
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
          <CardContent className="p-8 text-center text-gray-500">
            <Ship className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No boats yet. Click "Add Boat" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {boats.map((boat) => {
            const model = fleetModels.find(m => m.id === boat.fleetModelId);
            return (
              <Card key={boat.id} className="bg-white" data-testid={`boat-row-${boat.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {model?.images?.[0] && (
                      <img src={model.images[0]} alt={boat.name} className="w-24 h-16 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{boat.name}</h3>
                      <p className="text-sm text-gray-500">{getModelName(boat.fleetModelId)}</p>
                      {currentUser.role !== "dealer" && (
                        <p className="text-xs text-gray-400">Dealer: {getDealerName(boat.dealerId)}</p>
                      )}
                      <p className="text-xs text-gray-500"><MapPin className="w-3 h-3 inline mr-1" />{boat.location} • {boat.homePort}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">€{Number(boat.totalPrice).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{boat.numberOfFractions} fractions @ €{Number(boat.fractionPrice).toLocaleString()}</p>
                      <div className="flex gap-1 mt-1 justify-end">
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
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-red-100 text-red-700";
      case "contacted": return "bg-yellow-100 text-yellow-700";
      case "qualified": return "bg-green-100 text-green-700";
      case "closed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Customer Inquiries</h2>
      <p className="text-sm text-gray-600">Manage purchase and charter inquiries</p>

      {inquiries.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No inquiries yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="bg-white" data-testid={`inquiry-${inquiry.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                    <Badge variant="outline">{inquiry.inquiryType}</Badge>
                  </div>
                  <Select value={inquiry.status} onValueChange={(s) => updateMutation.mutate({ id: inquiry.id, status: s })}>
                    <SelectTrigger className="w-28" data-testid={`select-inquiry-status-${inquiry.id}`}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="font-medium text-gray-900">{inquiry.customerName}</p>
                <p className="text-sm text-gray-500">{inquiry.customerEmail} • {inquiry.customerPhone}</p>
                <p className="mt-2 text-sm text-gray-700">{inquiry.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
