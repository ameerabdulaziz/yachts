from django.apps import AppConfig


class YachtsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'yachts'
    path = 'src/yachts'
    verbose_name = 'Yacht Fleet Management'
    
    def ready(self):
        """
        Perform initialization tasks for yacht management.
        """
        # Import signals for yacht-related operations
        pass