import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DeviceUtils {
  static const _deviceIdKey = 'device_id';

  /// Get or generate a consistent device ID for the current user
  static Future<String> generateDeviceId() async {
    final prefs = await SharedPreferences.getInstance();

    // If device ID is already saved, return it
    final savedId = prefs.getString(_deviceIdKey);
    if (savedId != null && savedId.isNotEmpty) {
      return savedId;
    }

    // Otherwise generate based on device info
    final DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    String deviceId = 'unknown_device';

    try {
      if (Platform.isAndroid) {
        final androidInfo = await deviceInfo.androidInfo;
        deviceId = androidInfo.id; // Unique Android ID
      } else if (Platform.isIOS) {
        final iosInfo = await deviceInfo.iosInfo;
        deviceId = iosInfo.identifierForVendor ?? 'unknown_ios_device';
      }
    } catch (e) {
      print('⚠️ Failed to get device info: $e');
    }

    // Save for later use
    await prefs.setString(_deviceIdKey, deviceId);
    return deviceId;
  }
}
