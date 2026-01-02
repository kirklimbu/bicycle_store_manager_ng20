import 'package:dio/dio.dart';
import 'package:flutter_application__farista_clinic/config/environment.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DioInterceptor {
  static Dio createDio() {
    final baseUrl = Environment.apiBaseUrl.isNotEmpty
        ? Environment.apiBaseUrl
        : 'https://www.ehatiya.com/ecommerce/api/'; // ✅ fallback

    print('🌍 Using Base URL: $baseUrl');

    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        sendTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'webAgent',
        },
      ),
    );

    // ✅ Add custom interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Fetch token from SharedPreferences
          final token = await _getAuthToken();

          if (token != null && token.isNotEmpty) {
            options.headers['token'] = token;
          }

          // Debug log
          print('🌐 ${options.method.toUpperCase()} → ${options.uri}');
          print('🧩 Headers: ${options.headers}');
          if (options.data != null) print('📦 Body: ${options.data}');

          handler.next(options);
        },
        onResponse: (response, handler) {
          print(
            '✅ Response [${response.statusCode}] from ${response.requestOptions.uri}',
          );
          handler.next(response);
        },
        onError: (DioException e, handler) {
          print('❌ Dio Error: ${e.type} → ${e.message}');
          if (e.response != null) {
            print('❌ Status: ${e.response?.statusCode}');
            print('❌ Data: ${e.response?.data}');
          }

          if (e.response?.statusCode == 401) {
            _handleUnauthorized();
          }

          handler.next(e);
        },
      ),
    );

    return dio;
  }

  static Future<String?> _getAuthToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString('auth_token');
    } catch (e) {
      print('⚠️ Failed to read token: $e');
      return null;
    }
  }

  static void _handleUnauthorized() {
    print('🚨 Unauthorized! Clearing token and redirecting to login...');
    // Optionally: clear token and navigate to login
  }
}
