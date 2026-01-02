import 'package:flutter/foundation.dart';
import 'package:flutter_application__farista_clinic/services/auth_service.dart';
import '../models/user_model.dart';

class AuthProvider with ChangeNotifier {
  LoginResponse? _user;
  bool _isLoading = false;
  String _errorMessage = '';

  LoginResponse? get user => _user;
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;
  bool get isLoggedIn => _user != null;

  final AuthService _authService;

  AuthProvider({required AuthService authService}) : _authService = authService;

  Future<bool> login(String userName, String password) async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      final response = await _authService.login(
        UserLoginDto(userName: userName, passWord: password),
      );

      _isLoading = false;

      if (response.success && response.data != null) {
        _user = response.data;
        _errorMessage = '';
        notifyListeners();
        return true;
      } else {
        _errorMessage = response.message;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'An unexpected error occurred: $e';
      notifyListeners();
      return false;
    }
  }

  void logout() {
    _user = null;
    _errorMessage = '';
    notifyListeners();
  }

  void clearError() {
    _errorMessage = '';
    notifyListeners();
  }
}
