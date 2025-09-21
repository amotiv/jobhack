from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Resume, JobListing, MatchScore

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")
    def create(self, data):
        user = User(username=data["username"], email=data.get("email",""))
        user.set_password(data["password"])
        user.save()
        return user

class JobListingSerializer(serializers.ModelSerializer):
    match_score = serializers.IntegerField(read_only=True, required=False)
    class Meta:
        model = JobListing
        fields = ("id","title","company","location","description","keywords","match_score","created_at")

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ("id","file","file_format","text","uploaded_at")
        read_only_fields = ("file_format","text","uploaded_at")
