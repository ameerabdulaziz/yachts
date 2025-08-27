from django.apps import AppConfig


class BookingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bookings'
    path = 'bookings'
    verbose_name = 'Booking Management'
    
    def ready(self):
        """
        Initialize booking system components.
        """
        # Import booking-related signals or tasks
        pass