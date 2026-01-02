class UserLoginDto {
  final String userName;
  final String passWord;

  UserLoginDto({required this.userName, required this.passWord});

  Map<String, dynamic> toJson() {
    return {'username': userName, 'password': passWord};
  }
}

class LoginResponse {
  final int userId;
  final String name;
  final String token;
  final String mobile;
  final String role;
  final int roleId;
  final String? email; // Added email field as optional

  LoginResponse({
    required this.userId,
    required this.name,
    required this.token,
    required this.mobile,
    required this.role,
    required this.roleId,
    this.email, // Make it optional
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      userId: json['userId'] ?? 0,
      name: json['name'] ?? '',
      token: json['token'] ?? '',
      mobile: json['mobile'] ?? '',
      role: json['role'] ?? '',
      roleId: json['roleId'] ?? 0,
      email: json['email'], // Map email if it exists in response
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'name': name,
      'token': token,
      'mobile': mobile,
      'role': role,
      'roleId': roleId,
      'email': email,
    };
  }

  // Helper method to get display email
  // String get displayEmail {
  //   return email ?? '$userName@kirana.com'; // Fallback if email is null
  // }

  // Helper method to get display identifier (email or mobile)
  String get displayIdentifier {
    return email ?? mobile;
  }
}

class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;

  ApiResponse({required this.success, required this.message, this.data});

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJson,
  ) {
    return ApiResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null ? fromJson(json['data']) : null,
    );
  }

  // If your API wraps the response in a 'data' field
  factory ApiResponse.fromDataJson(
    Map<String, dynamic> json,
    T Function(dynamic) fromJson,
  ) {
    return ApiResponse(
      success: json['success'] ?? true,
      message: json['message'] ?? 'Success',
      data: fromJson(json),
    );
  }
}
