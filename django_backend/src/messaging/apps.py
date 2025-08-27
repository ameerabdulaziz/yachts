from django.apps import AppConfig


class MessagingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'messaging'
    path = 'src/messaging'
    verbose_name = 'Messaging System'
    
    def ready(self):
        """
        Initialize messaging system components.
        """
        # Import messaging signals and real-time handlers
        pass