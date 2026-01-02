import 'dart:convert';
import 'package:flutter_application__farista_clinic/config/config.dart';
import 'package:http/http.dart' as http;

import '../models/user_model.dart';

class AuthService {
  static const String baseUrl = AppConfig.apiBaseUrl;

  // Create http client instance
  http.Client get client => http.Client();

  Future<ApiResponse<LoginResponse>> login(UserLoginDto request) async {
    try {
      print('🔐 Attempting login to: $baseUrl/user/login');
      print('📧 Username: ${request.userName}');

      final response = await client.post(
        Uri.parse('$baseUrl/user/login'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode(request.toJson()),
      );

      print('📡 Response Status: ${response.statusCode}');
      print('📡 Response Headers: ${response.headers}');
      print('📡 Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        // Handle different response structures
        if (responseData.containsKey('data')) {
          return ApiResponse<LoginResponse>.fromJson(
            responseData,
            (data) => LoginResponse.fromJson(data),
          );
        } else {
          return ApiResponse<LoginResponse>(
            success: true,
            message: 'Login successful',
            data: LoginResponse.fromJson(responseData),
          );
        }
      } else if (response.statusCode == 401) {
        return ApiResponse<LoginResponse>(
          success: false,
          message: 'Invalid username or password',
        );
      } else if (response.statusCode == 400) {
        final Map<String, dynamic> errorData = json.decode(response.body);
        return ApiResponse<LoginResponse>(
          success: false,
          message: errorData['message'] ?? 'Invalid request',
        );
      } else {
        return ApiResponse<LoginResponse>(
          success: false,
          message: 'Server error (${response.statusCode}). Please try again.',
        );
      }
    } catch (e) {
      print('Login error: $e');
      return ApiResponse<LoginResponse>(
        success: false,
        message: 'Network error. Please check your connection.',
      );
    }
  }

  // For testing - mock successful login
  Future<ApiResponse<LoginResponse>> mockLogin(UserLoginDto request) async {
    await Future.delayed(const Duration(seconds: 2));

    if (request.userName == 'admin' && request.passWord == 'password') {
      return ApiResponse<LoginResponse>(
        success: true,
        message: 'Login successful',
        data: LoginResponse(
          userId: 1,
          name: 'Store Owner',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          mobile: '+91 9876543210',
          role: 'Admin',
          roleId: 1,
          email: 'admin@kirana.com', // Added email for mock data
        ),
      );
    } else {
      return ApiResponse<LoginResponse>(
        success: false,
        message: 'Invalid username or password',
      );
    }
  }
}
