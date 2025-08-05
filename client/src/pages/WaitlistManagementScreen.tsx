import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Users, Calendar, Search, Filter, Mail, Phone, MessageCircle, Clock, Star } from "lucide-react";

const mockWaitlistEntries = [
  {
    id: "wait-1",
    guestName: "Michael Thompson",
    email: "michael@example.com",
    phone: "+33 6 12 34 56 78",
    yacht: "Serenity Princess",
    preferredDates: "June 20-23, 2024",
    guestCount: 8,
    priority: "high",
    joinedDate: "May 15, 2024",
    maxBudget: 10000,
    notes: "Celebrating anniversary",
    previousGuest: true,
    rating: 4.9
  },
  {
    id: "wait-2",
    guestName: "Emma Rodriguez",
    email: "emma@example.com",
    phone: "+34 6 98 76 54 32",
    yacht: "Ocean's Dream",
    preferredDates: "July 1-5, 2024",
    guestCount: 6,
    priority: "medium",
    joinedDate: "May 20, 2024",
    maxBudget: 8000,
    notes: "Family vacation",
    previousGuest: false,
    rating: null
  },
  {
    id: "wait-3",
    guestName: "James Wilson",
    email: "james@example.com",
    phone: "+1 555 123 4567",
    yacht: "Serenity Princess",
    preferredDates: "August 10-14, 2024",
    guestCount: 4,
    priority: "low",
    joinedDate: "May 25, 2024",
    maxBudget: 12000,
    notes: "Business retreat",
    previousGuest: true,
    rating: 4.7
  }
];

export default function WaitlistManagementScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterYacht, setFilterYacht] = useState("all");

  const filteredEntries = mockWaitlistEntries.filter(entry => {
    const matchesSearch = entry.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || entry.priority === filterPriority;
    const matchesYacht = filterYacht === "all" || entry.yacht === filterYacht;
    
    return matchesSearch && matchesPriority && matchesYacht;
  });

  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/owner-dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Waitlist Management</h1>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="bg-gradient-ocean px-4 py-6 text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{mockWaitlistEntries.length}</p>
            <p className="text-blue-100 text-sm">Total Entries</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {mockWaitlistEntries.filter(e => e.priority === 'high').length}
            </p>
            <p className="text-blue-100 text-sm">High Priority</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              €{mockWaitlistEntries.reduce((sum, e) => sum + e.maxBudget, 0).toLocaleString()}
            </p>
            <p className="text-blue-100 text-sm">Potential Revenue</p>
          </div>
        </div>
      </section>

      <div className="p-4 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterYacht} onValueChange={setFilterYacht}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yacht" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Yachts</SelectItem>
                    <SelectItem value="Serenity Princess">Serenity Princess</SelectItem>
                    <SelectItem value="Ocean's Dream">Ocean's Dream</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waitlist Entries */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Waitlist Entries</h3>
            <Button variant="ghost" className="text-primary font-semibold">
              <Filter className="w-4 h-4 mr-1" />
              Sort
            </Button>
          </div>
          
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-900">{entry.guestName}</h4>
                        {entry.previousGuest && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Returning Guest
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{entry.yacht}</p>
                      <p className="text-sm text-gray-600">{entry.preferredDates}</p>
                    </div>
                    <Badge className={priorityColors[entry.priority]}>
                      {entry.priority} priority
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-gray-600">Guest Count</p>
                      <p className="font-medium">{entry.guestCount} guests</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Max Budget</p>
                      <p className="font-medium text-green-600">€{entry.maxBudget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Joined Waitlist</p>
                      <p className="font-medium">{entry.joinedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rating</p>
                      {entry.rating ? (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{entry.rating}</span>
                        </div>
                      ) : (
                        <p className="font-medium text-gray-500">New Guest</p>
                      )}
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Notes: {entry.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                    <Button className="bg-primary text-white" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>

                  {/* Quick Actions for this entry */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Move to Booking
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Update Priority
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No waitlist entries found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Mail className="w-6 h-6 mb-1" />
                <span className="text-sm">Email All</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                <Calendar className="w-6 h-6 mb-1" />
                <span className="text-sm">Schedule Calls</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Waitlist Insights */}
        <Card>
          <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Waitlist Insights</h4>
                <p className="text-sm text-blue-700">Average wait time: 12 days</p>
                <p className="text-xs text-blue-600">Peak demand: June-August</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
