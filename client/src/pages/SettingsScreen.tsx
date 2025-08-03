import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Bell, Lock, Globe, CreditCard, Shield, HelpCircle, FileText, LogOut } from "lucide-react";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    priceAlerts: false,
    marketingEmails: true,
    pushNotifications: true,
    smsAlerts: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    shareBookingHistory: false,
    allowContactFromOwners: true
  });

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Notifications */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Bell className="w-5 h-5 inline mr-2" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="booking-updates" className="text-sm font-medium">Booking Updates</Label>
                  <p className="text-xs text-gray-600">Get notified about booking confirmations and changes</p>
                </div>
                <Switch
                  id="booking-updates"
                  checked={notifications.bookingUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('bookingUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="price-alerts" className="text-sm font-medium">Price Alerts</Label>
                  <p className="text-xs text-gray-600">Notify when yacht prices drop</p>
                </div>
                <Switch
                  id="price-alerts"
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('priceAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails" className="text-sm font-medium">Marketing Emails</Label>
                  <p className="text-xs text-gray-600">Receive promotional offers and updates</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={notifications.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-xs text-gray-600">Receive push notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-alerts" className="text-sm font-medium">SMS Alerts</Label>
                  <p className="text-xs text-gray-600">Get important updates via SMS</p>
                </div>
                <Switch
                  id="sms-alerts"
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Shield className="w-5 h-5 inline mr-2" />
              Privacy & Security
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium block mb-2">Profile Visibility</Label>
                <Select value={privacy.profileVisibility} onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can see</SelectItem>
                    <SelectItem value="owners-only">Yacht owners only</SelectItem>
                    <SelectItem value="private">Private - Hidden from search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-history" className="text-sm font-medium">Share Booking History</Label>
                  <p className="text-xs text-gray-600">Allow yacht owners to see your booking history</p>
                </div>
                <Switch
                  id="share-history"
                  checked={privacy.shareBookingHistory}
                  onCheckedChange={(checked) => handlePrivacyChange('shareBookingHistory', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="contact-owners" className="text-sm font-medium">Allow Contact from Owners</Label>
                  <p className="text-xs text-gray-600">Let yacht owners message you directly</p>
                </div>
                <Switch
                  id="contact-owners"
                  checked={privacy.allowContactFromOwners}
                  onCheckedChange={(checked) => handlePrivacyChange('allowContactFromOwners', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Lock className="w-5 h-5 inline mr-2" />
              Account Settings
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <Lock className="w-5 h-5 mr-3" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Shield className="w-5 h-5 mr-3" />
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <CreditCard className="w-5 h-5 mr-3" />
                Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Globe className="w-5 h-5 inline mr-2" />
              Preferences
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium block mb-2">Language</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="italian">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium block mb-2">Currency</Label>
                <Select defaultValue="eur">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium block mb-2">Time Zone</Label>
                <Select defaultValue="cet">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cet">Central European Time</SelectItem>
                    <SelectItem value="est">Eastern Standard Time</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time</SelectItem>
                    <SelectItem value="gmt">Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support & Legal */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support & Legal</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12">
                <HelpCircle className="w-5 h-5 mr-3" />
                Help Center
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <FileText className="w-5 h-5 mr-3" />
                Terms of Service
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Shield className="w-5 h-5 mr-3" />
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Globe className="w-5 h-5 mr-3" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">App Information</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Version</span>
                <span>1.2.3</span>
              </div>
              <div className="flex justify-between">
                <span>Build</span>
                <span>2024.06.01</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span>June 1, 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" className="w-full justify-center h-12 text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
