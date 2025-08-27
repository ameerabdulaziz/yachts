from django.apps import AppConfig


class OwnershipConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ownership'
    path = 'ownership'
    verbose_name = 'Fractional Ownership'
    
    def ready(self):
        """
        Initialize fractional ownership system.
        """
        # Import ownership-related signals and handlers
        pass