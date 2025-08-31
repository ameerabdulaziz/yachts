"""
Task 12 - Inquiries (Lead Capture) Models
Lead management system for potential yacht buyers and renters
"""
from django.db import models
from django.contrib.auth import get_user_model
from boats.models import Boat
from decimal import Decimal

User = get_user_model()

class Inquiry(models.Model):
    """
    Lead capture for potential customers - Task 12
    Tracks interest in yacht purchases, rentals, and fractional ownership
    """
    
    INQUIRY_TYPE_CHOICES = [
        ('rental', 'Yacht Rental Interest'),
        ('purchase', 'Yacht Purchase Interest'),
        ('fractional', 'Fractional Ownership Interest'),
        ('charter', 'Private Charter Interest'),
        ('general', 'General Information Request'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New Lead'),
        ('contacted', 'Initial Contact Made'),
        ('qualified', 'Qualified Lead'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiating', 'In Negotiations'),
        ('closed_won', 'Closed - Won'),
        ('closed_lost', 'Closed - Lost'),
        ('nurturing', 'Long-term Nurturing'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low Priority'),
        ('medium', 'Medium Priority'),
        ('high', 'High Priority'),
        ('urgent', 'Urgent'),
    ]
    
    SOURCE_CHOICES = [
        ('website', 'Website Form'),
        ('phone', 'Phone Call'),
        ('email', 'Direct Email'),
        ('referral', 'Customer Referral'),
        ('social_media', 'Social Media'),
        ('boat_show', 'Boat Show'),
        ('advertisement', 'Advertisement'),
        ('walk_in', 'Walk-in'),
        ('other', 'Other'),
    ]
    
    # Lead identification
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    
    # Inquiry details
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPE_CHOICES)
    boat = models.ForeignKey(Boat, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='website')
    
    # Lead qualification
    budget_range_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Minimum budget in USD")
    budget_range_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Maximum budget in USD")
    timeline = models.CharField(max_length=100, blank=True, help_text="Purchase/rental timeline")
    preferred_location = models.CharField(max_length=200, blank=True)
    
    # Message and notes
    message = models.TextField(help_text="Initial inquiry message")
    internal_notes = models.TextField(blank=True, help_text="Internal sales notes")
    
    # Assignment and follow-up
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_inquiries')
    next_follow_up_date = models.DateTimeField(null=True, blank=True)
    last_contact_date = models.DateTimeField(null=True, blank=True)
    
    # Lead scoring
    lead_score = models.PositiveIntegerField(default=0, help_text="Lead score (0-100)")
    is_qualified = models.BooleanField(default=False)
    
    # GDPR and privacy
    consent_marketing = models.BooleanField(default=False, help_text="Consented to marketing communications")
    consent_data_processing = models.BooleanField(default=True, help_text="Consented to data processing")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'inquiries_inquiry'
        ordering = ['-created_at']
        verbose_name = 'Inquiry'
        verbose_name_plural = 'Inquiries'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.inquiry_type} ({self.status})"
    
    @property
    def full_name(self):
        """Get full name of inquirer"""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def budget_display(self):
        """Display budget range in readable format"""
        if self.budget_range_min and self.budget_range_max:
            return f"${self.budget_range_min:,.0f} - ${self.budget_range_max:,.0f}"
        elif self.budget_range_min:
            return f"${self.budget_range_min:,.0f}+"
        elif self.budget_range_max:
            return f"Up to ${self.budget_range_max:,.0f}"
        return "Not specified"

class InquiryFollowUp(models.Model):
    """
    Follow-up activities and communication history - Task 12
    Tracks all interactions with leads
    """
    
    ACTIVITY_TYPE_CHOICES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'In-Person Meeting'),
        ('video_call', 'Video Call'),
        ('proposal', 'Proposal Sent'),
        ('brochure', 'Brochure Sent'),
        ('boat_viewing', 'Boat Viewing'),
        ('sea_trial', 'Sea Trial'),
        ('negotiation', 'Contract Negotiation'),
        ('other', 'Other Activity'),
    ]
    
    OUTCOME_CHOICES = [
        ('successful', 'Successful Contact'),
        ('no_answer', 'No Answer'),
        ('voicemail', 'Left Voicemail'),
        ('email_sent', 'Email Sent'),
        ('meeting_scheduled', 'Meeting Scheduled'),
        ('interested', 'Showed Interest'),
        ('not_interested', 'Not Interested'),
        ('needs_time', 'Needs Time to Decide'),
        ('request_info', 'Requested More Information'),
    ]
    
    inquiry = models.ForeignKey(Inquiry, on_delete=models.CASCADE, related_name='follow_ups')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    outcome = models.CharField(max_length=20, choices=OUTCOME_CHOICES)
    
    # Activity details
    subject = models.CharField(max_length=200)
    description = models.TextField()
    duration_minutes = models.PositiveIntegerField(null=True, blank=True, help_text="Activity duration in minutes")
    
    # Contact information
    contact_method = models.CharField(max_length=100, blank=True)
    contacted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Scheduling
    scheduled_date = models.DateTimeField(null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    next_action_date = models.DateTimeField(null=True, blank=True)
    next_action_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'inquiries_inquiry_follow_up'
        ordering = ['-created_at']
        verbose_name = 'Inquiry Follow-up'
        verbose_name_plural = 'Inquiry Follow-ups'
    
    def __str__(self):
        return f"{self.inquiry.full_name} - {self.activity_type} ({self.outcome})"

class LeadSource(models.Model):
    """
    Track lead sources for marketing attribution - Task 12
    """
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    cost_per_lead = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # UTM tracking
    utm_source = models.CharField(max_length=100, blank=True)
    utm_medium = models.CharField(max_length=100, blank=True)
    utm_campaign = models.CharField(max_length=100, blank=True)
    
    # Performance tracking
    total_leads = models.PositiveIntegerField(default=0)
    qualified_leads = models.PositiveIntegerField(default=0)
    closed_deals = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'inquiries_lead_source'
        verbose_name = 'Lead Source'
        verbose_name_plural = 'Lead Sources'
    
    def __str__(self):
        return self.name
    
    @property
    def conversion_rate(self):
        """Calculate lead to qualified conversion rate"""
        if self.total_leads > 0:
            return (self.qualified_leads / self.total_leads) * 100
        return 0
    
    @property
    def close_rate(self):
        """Calculate qualified lead to close conversion rate"""
        if self.qualified_leads > 0:
            return (self.closed_deals / self.qualified_leads) * 100
        return 0