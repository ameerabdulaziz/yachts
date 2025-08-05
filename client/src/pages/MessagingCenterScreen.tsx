import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Search, MessageCircle, Plus, Star, Ship, TrendingUp } from "lucide-react";

const mockConversations = [
  {
    id: "chat-1",
    participant: {
      name: "Captain Laurent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "Captain",
      verified: true
    },
    lastMessage: "Thank you for booking Serenity Princess! Looking forward to hosting you.",
    timestamp: "2 min ago",
    unreadCount: 1,
    online: true,
    type: "booking"
  },
  {
    id: "chat-2",
    participant: {
      name: "Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "Yacht Owner",
      verified: true
    },
    lastMessage: "I'm interested in purchasing your Azure Legend share. Can we discuss?",
    timestamp: "1 hour ago",
    unreadCount: 3,
    online: false,
    type: "share_sale"
  },
  {
    id: "chat-3",
    participant: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "Guest",
      verified: false
    },
    lastMessage: "The yacht was amazing! Thank you for a perfect weekend.",
    timestamp: "3 hours ago",
    unreadCount: 0,
    online: false,
    type: "booking"
  },
  {
    id: "chat-4",
    participant: {
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "Investor",
      verified: true
    },
    lastMessage: "Is the Wind Dancer share still available for purchase?",
    timestamp: "1 day ago",
    unreadCount: 0,
    online: true,
    type: "ownership"
  },
  {
    id: "chat-5",
    participant: {
      name: "Nauttec Support",
      avatar: "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "Support Team",
      verified: true
    },
    lastMessage: "Your fuel wallet has been topped up successfully. €500 added.",
    timestamp: "2 days ago",
    unreadCount: 0,
    online: true,
    type: "support"
  }
];

export default function MessagingCenterScreen() {
  const totalUnreadCount = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Ship className="w-4 h-4 text-blue-600" />;
      case 'share_sale':
      case 'ownership':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'support':
        return <MessageCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              {totalUnreadCount > 0 && (
                <p className="text-sm text-gray-600">{totalUnreadCount} unread messages</p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
      </header>

      {/* Search */}
      <section className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
          />
        </div>
      </section>

      {/* Message Categories */}
      <section className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          <Button variant="default" size="sm" className="bg-primary text-white whitespace-nowrap">
            All Messages
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Bookings
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Ownership
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Support
          </Button>
        </div>
      </section>

      {/* Conversations List */}
      <section className="p-4">
        <div className="space-y-2">
          {mockConversations.map((conversation) => (
            <Link key={conversation.id} href={`/chat/${conversation.id}`}>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Avatar with Online Status */}
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                        <AvatarFallback>
                          {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.participant.verified && (
                            <Star className="w-4 h-4 text-blue-500" />
                          )}
                          {getMessageIcon(conversation.type)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          {conversation.unreadCount > 0 && (
                            <div className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">{conversation.participant.role}</p>
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Empty State (if no messages) */}
      {mockConversations.length === 0 && (
        <div className="text-center py-12 px-4">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-6">Start a conversation with yacht owners or guests</p>
          <Button className="bg-gradient-ocean text-white px-8 py-3 rounded-xl font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Start New Conversation
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      {mockConversations.length > 0 && (
        <section className="px-4 py-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <MessageCircle className="w-6 h-6 mb-1" />
                  <span className="text-sm">Contact Support</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Ship className="w-6 h-6 mb-1" />
                  <span className="text-sm">Message Captain</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <BottomNavigation />
    </div>
  );
}
