import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Anchor, Users, Ship, Building2, MessageSquare, Calendar, LogOut, 
  Plus, Edit2, Eye, Trash2, Loader2, ChevronDown, DollarSign, MapPin
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

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

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    } else {
      setLocation("/admin");
    }
  }, [setLocation]);

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/auth/logout", {});
    localStorage.removeItem("adminUser");
    setLocation("/admin");
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const isDealer = currentUser.role === "dealer";
  const isAdmin = currentUser.role === "super_admin" || currentUser.role === "staff";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Anchor className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold" data-testid="text-dashboard-title">De Antonio Admin</h1>
              <p className="text-sm text-blue-200">{isDealer ? "Dealer Portal" : "Administration"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {currentUser.firstName} {currentUser.lastName}
              <Badge variant="secondary" className="ml-2">{currentUser.role}</Badge>
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={isDealer ? "boats" : "users"} className="space-y-6">
          <TabsList className="bg-white shadow rounded-lg p-1">
            {isAdmin && (
              <>
                <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
                  <Users className="w-4 h-4" /> Users
                </TabsTrigger>
                <TabsTrigger value="dealers" className="gap-2" data-testid="tab-dealers">
                  <Building2 className="w-4 h-4" /> Dealers
                </TabsTrigger>
                <TabsTrigger value="fleet" className="gap-2" data-testid="tab-fleet">
                  <Ship className="w-4 h-4" /> Fleet Models
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="boats" className="gap-2" data-testid="tab-boats">
              <Ship className="w-4 h-4" /> Boats
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2" data-testid="tab-calendar">
              <Calendar className="w-4 h-4" /> Calendar
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2" data-testid="tab-inquiries">
              <MessageSquare className="w-4 h-4" /> Inquiries
            </TabsTrigger>
          </TabsList>

          {isAdmin && (
            <>
              <TabsContent value="users">
                <UsersTab currentUser={currentUser} />
              </TabsContent>
              <TabsContent value="dealers">
                <DealersTab />
              </TabsContent>
              <TabsContent value="fleet">
                <FleetModelsTab />
              </TabsContent>
            </>
          )}
          <TabsContent value="boats">
            <BoatsTab currentUser={currentUser} />
          </TabsContent>
          <TabsContent value="calendar">
            <CalendarTab currentUser={currentUser} />
          </TabsContent>
          <TabsContent value="inquiries">
            <InquiriesTab currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function UsersTab({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: dealers = [] } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/users", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsOpen(false);
      toast({ title: "User created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create user", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setEditingUser(null);
      toast({ title: "User updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update user", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>Manage admin and dealer users</CardDescription>
        </div>
        {currentUser.role === "super_admin" && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-user">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <UserForm
                dealers={dealers}
                onSubmit={(data) => createMutation.mutate(data)}
                isPending={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
              data-testid={`user-row-${user.id}`}
            >
              <div>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">@{user.username} • {user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline">{user.role}</Badge>
                {currentUser.role === "super_admin" && user.id !== currentUser.id && (
                  <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)} data-testid={`button-edit-user-${user.id}`}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <UserForm
                        dealers={dealers}
                        initialData={editingUser}
                        onSubmit={(data) => updateMutation.mutate({ id: user.id, data })}
                        isPending={updateMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UserForm({ 
  dealers, 
  initialData, 
  onSubmit, 
  isPending 
}: { 
  dealers: Dealer[];
  initialData?: AdminUser | null; 
  onSubmit: (data: any) => void; 
  isPending: boolean;
}) {
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    email: initialData?.email || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    password: "",
    role: initialData?.role || "staff",
    dealerId: initialData?.dealerId || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData };
    if (!data.password && initialData) {
      delete (data as any).password;
    }
    if (data.role !== "dealer") {
      delete (data as any).dealerId;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            data-testid="input-first-name"
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            data-testid="input-last-name"
          />
        </div>
      </div>
      <div>
        <Label>Username</Label>
        <Input
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          disabled={!!initialData}
          data-testid="input-form-username"
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          data-testid="input-email"
        />
      </div>
      <div>
        <Label>{initialData ? "New Password (leave blank to keep current)" : "Password"}</Label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!initialData}
          data-testid="input-form-password"
        />
      </div>
      <div>
        <Label>Role</Label>
        <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
          <SelectTrigger data-testid="select-role">
            <SelectValue />
          </SelectTrigger>
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
            <SelectTrigger data-testid="select-dealer">
              <SelectValue placeholder="Select a dealer" />
            </SelectTrigger>
            <SelectContent>
              {dealers.map((dealer) => (
                <SelectItem key={dealer.id} value={dealer.id}>{dealer.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Label>Active</Label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          data-testid="switch-active"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending} data-testid="button-submit-user">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {initialData ? "Update User" : "Create User"}
      </Button>
    </form>
  );
}

function DealersTab() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);

  const { data: dealers = [], isLoading } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/dealers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dealers"] });
      setIsOpen(false);
      toast({ title: "Dealer created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create dealer", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/dealers/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dealers"] });
      setEditingDealer(null);
      toast({ title: "Dealer updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update dealer", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dealers</CardTitle>
          <CardDescription>Manage De Antonio dealers and distributors</CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-dealer">
              <Plus className="w-4 h-4 mr-2" /> Add Dealer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Dealer</DialogTitle>
            </DialogHeader>
            <DealerForm
              onSubmit={(data) => createMutation.mutate(data)}
              isPending={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {dealers.map((dealer) => (
            <Card key={dealer.id} data-testid={`dealer-card-${dealer.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{dealer.name}</CardTitle>
                  <Badge variant={dealer.isActive ? "default" : "secondary"}>
                    {dealer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1 text-gray-600">
                  <p><MapPin className="w-3 h-3 inline mr-1" /> {dealer.city}, {dealer.country}</p>
                  <p>{dealer.contactName}</p>
                  <p>{dealer.email}</p>
                  <p>{dealer.phone}</p>
                </div>
                <Dialog open={editingDealer?.id === dealer.id} onOpenChange={(open) => !open && setEditingDealer(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setEditingDealer(dealer)} data-testid={`button-edit-dealer-${dealer.id}`}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Dealer</DialogTitle>
                    </DialogHeader>
                    <DealerForm
                      initialData={editingDealer}
                      onSubmit={(data) => updateMutation.mutate({ id: dealer.id, data })}
                      isPending={updateMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
          {dealers.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No dealers yet. Click "Add Dealer" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DealerForm({ 
  initialData, 
  onSubmit, 
  isPending 
}: { 
  initialData?: Dealer | null; 
  onSubmit: (data: any) => void; 
  isPending: boolean;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    contactName: initialData?.contactName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    region: initialData?.region || "Europe",
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Dealer Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            data-testid="input-dealer-name"
          />
        </div>
        <div>
          <Label>Contact Person</Label>
          <Input
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            required
            data-testid="input-contact-name"
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
            required
            data-testid="input-dealer-email"
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            data-testid="input-dealer-phone"
          />
        </div>
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          data-testid="input-address"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>City</Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            data-testid="input-city"
          />
        </div>
        <div>
          <Label>Country</Label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
            data-testid="input-country"
          />
        </div>
        <div>
          <Label>Region</Label>
          <Select value={formData.region} onValueChange={(v) => setFormData({ ...formData, region: v })}>
            <SelectTrigger data-testid="select-region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Americas">Americas</SelectItem>
              <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
              <SelectItem value="Middle East">Middle East</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label>Active</Label>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          data-testid="switch-dealer-active"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending} data-testid="button-submit-dealer">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {initialData ? "Update Dealer" : "Create Dealer"}
      </Button>
    </form>
  );
}

function FleetModelsTab() {
  const { data: models = [], isLoading } = useQuery<FleetModel[]>({
    queryKey: ["/api/admin/fleet-models"],
  });

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>De Antonio Fleet Models</CardTitle>
        <CardDescription>Official yacht models available for dealers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <Card key={model.id} className="overflow-hidden" data-testid={`fleet-model-${model.id}`}>
              {model.images && model.images[0] && (
                <img 
                  src={model.images[0]} 
                  alt={model.displayName}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{model.displayName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1 text-gray-600">
                  <p>{model.lengthMeters}m • {model.maxCapacity} passengers</p>
                  <p>{model.cabins} cabin{model.cabins !== 1 ? "s" : ""} • {model.engines}</p>
                  <p className="font-semibold text-blue-600 text-lg mt-2">
                    €{Number(model.basePrice).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BoatsTab({ currentUser }: { currentUser: AdminUser }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingBoat, setEditingBoat] = useState<DealerBoat | null>(null);

  const { data: boats = [], isLoading } = useQuery<DealerBoat[]>({
    queryKey: ["/api/admin/boats"],
  });

  const { data: fleetModels = [] } = useQuery<FleetModel[]>({
    queryKey: ["/api/admin/fleet-models"],
  });

  const { data: dealers = [] } = useQuery<Dealer[]>({
    queryKey: ["/api/admin/dealers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/admin/boats", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/boats"] });
      setIsOpen(false);
      toast({ title: "Boat created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create boat", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/boats/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/boats"] });
      setEditingBoat(null);
      toast({ title: "Boat updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update boat", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const getModelName = (modelId: string) => {
    const model = fleetModels.find(m => m.id === modelId);
    return model?.displayName || "Unknown Model";
  };

  const getDealerName = (dealerId: string) => {
    const dealer = dealers.find(d => d.id === dealerId);
    return dealer?.name || "Unknown Dealer";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Boats</CardTitle>
          <CardDescription>
            {currentUser.role === "dealer" ? "Your boats for sale and charter" : "All dealer boats"}
          </CardDescription>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-boat">
              <Plus className="w-4 h-4 mr-2" /> Add Boat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Boat</DialogTitle>
            </DialogHeader>
            <BoatForm
              fleetModels={fleetModels}
              dealers={dealers}
              currentUser={currentUser}
              onSubmit={(data) => createMutation.mutate(data)}
              isPending={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {boats.map((boat) => {
            const model = fleetModels.find(m => m.id === boat.fleetModelId);
            return (
              <div
                key={boat.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`boat-row-${boat.id}`}
              >
                <div className="flex items-center gap-4">
                  {model?.images?.[0] && (
                    <img 
                      src={model.images[0]} 
                      alt={boat.name}
                      className="w-20 h-14 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{boat.name}</p>
                    <p className="text-sm text-gray-500">{getModelName(boat.fleetModelId)}</p>
                    {currentUser.role !== "dealer" && (
                      <p className="text-xs text-gray-400">Dealer: {getDealerName(boat.dealerId)}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {boat.location} • {boat.homePort}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">€{Number(boat.totalPrice).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {boat.numberOfFractions} fractions @ €{Number(boat.fractionPrice).toLocaleString()} each
                  </p>
                  <p className="text-xs text-gray-500">{boat.availableShares} shares available</p>
                  <div className="flex gap-1 mt-1 justify-end">
                    {boat.availableForSale && <Badge variant="default" className="text-xs">Sale</Badge>}
                    {boat.availableForCharter && <Badge variant="secondary" className="text-xs">Charter</Badge>}
                  </div>
                </div>
                <Dialog open={editingBoat?.id === boat.id} onOpenChange={(open) => !open && setEditingBoat(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setEditingBoat(boat)} data-testid={`button-edit-boat-${boat.id}`}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Boat</DialogTitle>
                    </DialogHeader>
                    <BoatForm
                      fleetModels={fleetModels}
                      dealers={dealers}
                      currentUser={currentUser}
                      initialData={editingBoat}
                      onSubmit={(data) => updateMutation.mutate({ id: boat.id, data })}
                      isPending={updateMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            );
          })}
          {boats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No boats yet. Click "Add Boat" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BoatForm({ 
  fleetModels,
  dealers,
  currentUser,
  initialData, 
  onSubmit, 
  isPending 
}: { 
  fleetModels: FleetModel[];
  dealers: Dealer[];
  currentUser: AdminUser;
  initialData?: DealerBoat | null; 
  onSubmit: (data: any) => void; 
  isPending: boolean;
}) {
  const [formData, setFormData] = useState({
    fleetModelId: initialData?.fleetModelId || "",
    dealerId: currentUser.dealerId || initialData?.dealerId || "",
    name: initialData?.name || "",
    totalPrice: initialData?.totalPrice || "",
    numberOfFractions: initialData?.numberOfFractions || 5,
    availableForSale: initialData?.availableForSale ?? true,
    availableForCharter: initialData?.availableForCharter ?? true,
    charterDailyRate: initialData?.charterDailyRate || "",
    location: initialData?.location || "",
    homePort: initialData?.homePort || "",
  });

  const selectedModel = fleetModels.find(m => m.id === formData.fleetModelId);
  const calculatedFractionPrice = formData.totalPrice && formData.numberOfFractions 
    ? (Number(formData.totalPrice) / formData.numberOfFractions).toFixed(2)
    : "0";

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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Fleet Model</Label>
          <Select value={formData.fleetModelId} onValueChange={handleModelChange}>
            <SelectTrigger data-testid="select-fleet-model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {fleetModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.displayName} (€{Number(model.basePrice).toLocaleString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {currentUser.role !== "dealer" && (
          <div>
            <Label>Dealer</Label>
            <Select value={formData.dealerId} onValueChange={(v) => setFormData({ ...formData, dealerId: v })}>
              <SelectTrigger data-testid="select-boat-dealer">
                <SelectValue placeholder="Select a dealer" />
              </SelectTrigger>
              <SelectContent>
                {dealers.map((dealer) => (
                  <SelectItem key={dealer.id} value={dealer.id}>{dealer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div>
        <Label>Boat Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., De Antonio D42 - 2024"
          required
          data-testid="input-boat-name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Total Price (€)</Label>
          <Input
            type="number"
            value={formData.totalPrice}
            onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
            required
            data-testid="input-total-price"
          />
        </div>
        <div>
          <Label>Number of Fractions</Label>
          <Select 
            value={formData.numberOfFractions.toString()} 
            onValueChange={(v) => setFormData({ ...formData, numberOfFractions: parseInt(v) })}
          >
            <SelectTrigger data-testid="select-fractions">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5, 6, 8, 10].map((n) => (
                <SelectItem key={n} value={n.toString()}>{n} fractions (1/{n} share)</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Calculated Fraction Price</p>
        <p className="text-2xl font-bold text-blue-600">
          €{Number(calculatedFractionPrice).toLocaleString()} per share
        </p>
        <p className="text-xs text-gray-500">
          Total €{Number(formData.totalPrice || 0).toLocaleString()} ÷ {formData.numberOfFractions} fractions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Mediterranean"
            data-testid="input-location"
          />
        </div>
        <div>
          <Label>Home Port</Label>
          <Input
            value={formData.homePort}
            onChange={(e) => setFormData({ ...formData, homePort: e.target.value })}
            placeholder="e.g., Barcelona"
            data-testid="input-home-port"
          />
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.availableForSale}
            onCheckedChange={(checked) => setFormData({ ...formData, availableForSale: checked })}
            data-testid="switch-for-sale"
          />
          <Label>Available for Sale</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.availableForCharter}
            onCheckedChange={(checked) => setFormData({ ...formData, availableForCharter: checked })}
            data-testid="switch-for-charter"
          />
          <Label>Available for Charter</Label>
        </div>
      </div>

      {formData.availableForCharter && (
        <div>
          <Label>Charter Daily Rate (€)</Label>
          <Input
            type="number"
            value={formData.charterDailyRate}
            onChange={(e) => setFormData({ ...formData, charterDailyRate: e.target.value })}
            placeholder="e.g., 2500"
            data-testid="input-charter-rate"
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending} data-testid="button-submit-boat">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {initialData ? "Update Boat" : "Add Boat"}
      </Button>
    </form>
  );
}

function CalendarTab({ currentUser }: { currentUser: AdminUser }) {
  const { data: boats = [] } = useQuery<DealerBoat[]>({
    queryKey: ["/api/admin/boats"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Charter Calendar</CardTitle>
        <CardDescription>Manage boat availability and charter rates</CardDescription>
      </CardHeader>
      <CardContent>
        {boats.filter(b => b.availableForCharter).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No boats available for charter. Enable charter on your boats to manage calendar.
          </div>
        ) : (
          <div className="space-y-4">
            {boats.filter(b => b.availableForCharter).map((boat) => (
              <div key={boat.id} className="p-4 border rounded-lg" data-testid={`calendar-boat-${boat.id}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">{boat.name}</p>
                    <p className="text-sm text-gray-500">Daily rate: €{boat.charterDailyRate || "Not set"}</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid={`button-manage-calendar-${boat.id}`}>
                    <Calendar className="w-4 h-4 mr-2" /> Manage Calendar
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Calendar management coming soon - set seasonal rates, block dates, and manage bookings.
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InquiriesTab({ currentUser }: { currentUser: AdminUser }) {
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
    return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive";
      case "contacted": return "default";
      case "qualified": return "secondary";
      case "closed": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inquiries</CardTitle>
        <CardDescription>Customer purchase and charter inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No inquiries yet.
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 border rounded-lg" data-testid={`inquiry-${inquiry.id}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                      <Badge variant="outline">{inquiry.inquiryType}</Badge>
                    </div>
                    <p className="font-medium">{inquiry.customerName}</p>
                    <p className="text-sm text-gray-500">{inquiry.customerEmail} • {inquiry.customerPhone}</p>
                    <p className="mt-2 text-sm">{inquiry.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Select 
                    value={inquiry.status} 
                    onValueChange={(status) => updateMutation.mutate({ id: inquiry.id, status })}
                  >
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
