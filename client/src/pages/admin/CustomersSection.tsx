import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Users, Phone, Mail, Wallet, Ship, Calendar } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface Customer {
  id: string;
  phone: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  fuelBalance?: string;
  createdAt: string;
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

function getRoleColor(role: string) {
  switch (role) {
    case "owner": return { bg: "#dbeafe", color: "#2563eb" };
    case "renter": return { bg: "#dcfce7", color: "#16a34a" };
    case "investor": return { bg: "#fef3c7", color: "#d97706" };
    default: return { bg: "#f1f5f9", color: "#64748b" };
  }
}

export default function CustomersSection() {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/admin/customers"]
  });

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
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
        title="Customer Management"
        subtitle="View all registered customers, their ownership status, and wallet balances"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users style={{ width: 20, height: 20, color: '#2563eb' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{customers.length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Total Customers</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ship style={{ width: 20, height: 20, color: '#16a34a' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{customers.filter(c => c.role === 'owner').length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Owners</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: 20, height: 20, color: '#d97706' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>{customers.filter(c => c.role === 'renter').length}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Renters</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet style={{ width: 20, height: 20, color: '#dc2626' }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                €{customers.reduce((sum, c) => sum + Number(c.fuelBalance || 0), 0).toLocaleString()}
              </p>
              <p style={{ fontSize: 13, color: '#64748b' }}>Total Fuel Wallet</p>
            </div>
          </div>
        </div>
      </div>

      {customers.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 80, textAlign: 'center' }}>
          <Users style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>No Customers Yet</h3>
          <p style={{ fontSize: 14, color: '#64748b' }}>Customers will appear here once they register</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Role</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Fuel Wallet</th>
                <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Joined</th>
                <th style={{ textAlign: 'right', padding: '14px 20px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, i) => {
                const roleStyle = getRoleColor(customer.role);
                return (
                  <tr
                    key={customer.id}
                    style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff', borderTop: '1px solid #f1f5f9' }}
                    data-testid={`customer-row-${customer.id}`}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 18, background: '#0E2047', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13 }}>
                          {customer.firstName?.[0] || customer.phone[0]}{customer.lastName?.[0] || customer.phone[1]}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            {customer.firstName && customer.lastName
                              ? `${customer.firstName} ${customer.lastName}`
                              : `User #${customer.id.slice(0, 6)}`}
                          </p>
                          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>ID: {customer.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Phone style={{ width: 14, height: 14 }} /> {customer.phone}
                        </span>
                        {customer.email && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                            <Mail style={{ width: 14, height: 14 }} /> {customer.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Badge style={{ background: roleStyle.bg, color: roleStyle.color, border: 'none', textTransform: 'capitalize' }}>
                        {customer.role}
                      </Badge>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0f172a' }}>
                      €{Number(customer.fuelBalance || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(customer)}
                        data-testid={`button-view-customer-${customer.id}`}
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
        <DialogContent style={{ maxWidth: 500 }}>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information and activity
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 pt-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: '#0E2047', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                  {selectedCustomer.firstName?.[0] || selectedCustomer.phone[0]}{selectedCustomer.lastName?.[0] || selectedCustomer.phone[1]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 18, color: '#0f172a', margin: 0 }}>
                    {selectedCustomer.firstName && selectedCustomer.lastName
                      ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                      : `User #${selectedCustomer.id.slice(0, 6)}`}
                  </p>
                  <Badge style={{ ...getRoleColor(selectedCustomer.role), border: 'none', textTransform: 'capitalize', marginTop: 4 }}>
                    {selectedCustomer.role}
                  </Badge>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone style={{ width: 14, height: 14 }} /> Phone
                  </p>
                  <p style={{ fontWeight: 600, color: '#0f172a' }}>{selectedCustomer.phone}</p>
                </div>
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wallet style={{ width: 14, height: 14 }} /> Fuel Wallet
                  </p>
                  <p style={{ fontWeight: 600, color: '#0f172a' }}>€{Number(selectedCustomer.fuelBalance || 0).toLocaleString()}</p>
                </div>
              </div>

              {selectedCustomer.email && (
                <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail style={{ width: 14, height: 14 }} /> Email
                  </p>
                  <p style={{ fontWeight: 600, color: '#0f172a' }}>{selectedCustomer.email}</p>
                </div>
              )}

              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Member Since</p>
                <p style={{ fontWeight: 600, color: '#0f172a' }}>{format(new Date(selectedCustomer.createdAt), 'MMMM d, yyyy')}</p>
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
