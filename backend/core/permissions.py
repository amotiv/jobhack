from rest_framework.permissions import BasePermission

class IsPremium(BasePermission):
    message = "Premium membership required for this feature."
    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and user.is_premium)
