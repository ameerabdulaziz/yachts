from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    path = 'src/accounts'
    verbose_name = 'Nauttec Accounts'
    
    def ready(self):
        """
        Perform initialization tasks when the app is ready.
        This is called after all models have been imported.
        """
        # Import signal handlers or perform other setup
        pass