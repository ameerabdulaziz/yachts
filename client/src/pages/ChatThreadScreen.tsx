import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Phone, Video, Info, Star, Paperclip, Smile } from "lucide-react";

export default function ChatThreadScreen() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  
  const conversation = {
    id: id || "chat-1",
    participant: {
      name: "Captain Jean-Pierre",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      role: "Captain",
      verified: true,
      online: true
    },
    yacht: {
      name: "De Antonio D42",
      booking: "October 15-18, 2025"
    }
  };

  const messages = [
    {
      id: "msg-1",
      sender: "Captain Jean-Pierre",
      content: "Hello! Thank you for booking the De Antonio D42. I'm Captain Jean-Pierre and I'll be taking care of your trip.",
      timestamp: "2:30 PM",
      isOwn: false,
      type: "text"
    },
    {
      id: "msg-2",
      sender: "You",
      content: "Hi Captain Jean-Pierre! We're really excited about our upcoming trip. Can you tell us more about the itinerary?",
      timestamp: "2:32 PM",
      isOwn: true,
      type: "text"
    },
    {
      id: "msg-3",
      sender: "Captain Jean-Pierre",
      content: "Absolutely! I've prepared a wonderful route along the Côte d'Azur. We'll visit Monaco, Cannes, and some beautiful secluded coves for swimming.",
      timestamp: "2:35 PM",
      isOwn: false,
      type: "text"
    },
    {
      id: "msg-4",
      sender: "Captain Jean-Pierre",
      content: "Here's the detailed itinerary for your 3-day trip. Please let me know if you have any special requests!",
      timestamp: "2:36 PM",
      isOwn: false,
      type: "document",
      documentName: "Itinerary_October_2025.pdf"
    },
    {
      id: "msg-5",
      sender: "You",
      content: "This looks perfect! We have dietary restrictions - is vegetarian catering available?",
      timestamp: "2:40 PM",
      isOwn: true,
      type: "text"
    },
    {
      id: "msg-6",
      sender: "Captain Jean-Pierre",
      content: "Of course! Our chef specializes in Mediterranean vegetarian cuisine. I'll make sure everything is prepared according to your preferences.",
      timestamp: "2:42 PM",
      isOwn: false,
      type: "text"
    },
    {
      id: "msg-7",
      sender: "Captain Jean-Pierre",
      content: "I'm typing...",
      timestamp: "now",
      isOwn: false,
      type: "typing"
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real app, this would send the message via API
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/messages">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                  <AvatarFallback>
                    {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.participant.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h1 className="text-lg font-bold text-gray-900">{conversation.participant.name}</h1>
                  {conversation.participant.verified && (
                    <Star className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{conversation.participant.role}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Info className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Booking Context */}
      <section className="bg-blue-50 px-4 py-3 border-b border-blue-200">
        <div className="text-center">
          <p className="text-sm text-blue-800">
            <strong>{conversation.yacht.name}</strong> • {conversation.yacht.booking}
          </p>
        </div>
      </section>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-2' : 'order-1'}`}>
              {msg.type === 'typing' ? (
                <div className="bg-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.isOwn
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  {msg.type === 'document' ? (
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm underline">{msg.documentName}</span>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              )}
              <p className={`text-xs text-gray-500 mt-1 ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
            
            {!msg.isOwn && (
              <Avatar className="w-8 h-8 order-1 mr-2">
                <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                <AvatarFallback>
                  {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </section>

      {/* Message Input */}
      <section className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1">
              <Smile className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-primary text-white p-3 rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gray-100 px-4 py-3">
        <div className="flex space-x-2 overflow-x-auto">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            📍 Share Location
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            📅 Check Availability
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            💰 Request Quote
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            ⭐ Leave Review
          </Button>
        </div>
      </section>
    </div>
  );
}
