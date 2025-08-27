from django.apps import AppConfig


class FuelWalletConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'fuel_wallet'
    path = 'src/fuel_wallet'
    verbose_name = 'Fuel Wallet System'
    
    def ready(self):
        """
        Initialize fuel wallet system.
        """
        # Import fuel wallet signals and payment handlers
        pass