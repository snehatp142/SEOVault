
from rest_framework import generics, status
from rest_framework.response import Response
from accounts.serializers import UserRegisterSerializer, UserLoginSerializer
from accounts.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    def post(self, request):
        serializer=self.get_serializer(data=request.data); serializer.is_valid(raise_exception=True)
        user=authenticate(username=serializer.validated_data['username'],password=serializer.validated_data['password'])
        if not user:
            return Response({"detail":"Invalid username or password."},status=status.HTTP_401_UNAUTHORIZED)
        refresh=RefreshToken.for_user(user)
        return Response({"refresh":str(refresh),"access":str(refresh.access_token),"username":user.username,"email":user.email,"role":user.role})
