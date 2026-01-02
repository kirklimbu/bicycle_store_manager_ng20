import 'package:dio/dio.dart';
import 'package:flutter_application__farista_clinic/models/home_model.dart';

import 'dio_interceptor.dart';

class DioHomeService {
  late final Dio _dio;

  DioHomeService._(this._dio);

  /// ✅ Factory constructor to properly await Dio creation
  static Future<DioHomeService> create() async {
    final dio = DioInterceptor.createDio();
    return DioHomeService._(dio);
  }

  /// 🏠 Fetch home content (similar to Angular getHomeContents)
  Future<HomeModel> getHomeContents({int page = 1, int pageSize = 24}) async {
    try {
      print('🌍fadfadsfsa Full URL: ${_dio.options.baseUrl}home/product');

      final response = await _dio.get(
        'home/product',
        queryParameters: {
          'page': page.toString(),
          'pageSize': pageSize.toString(),
        },
      );
      print('✅ API Response [home]: ${response.data}');
      return HomeModel.fromJson(response.data);
    } on DioException catch (e) {
      print('❌ Dio Error (home): ${e.message}');
      throw Exception('Failed to load home contents: ${e.message}');
    } catch (e) {
      print('❌ General Error (home): $e');
      throw Exception('Network error: $e');
    }
  }

  /// 📂 Fetch categories
  Future<List<Category>> getCategories({String? parentId}) async {
    try {
      final response = await _dio.get(
        'category/list',
        queryParameters: {'parentId': parentId ?? '0'},
      );

      print('✅ API Response [category/list]: ${response.data}');

      final List<dynamic> responseData = response.data;
      return responseData.map((item) => Category.fromJson(item)).toList();
    } on DioException catch (e) {
      print('❌ Dio Error (categories): ${e.message}');
      throw Exception('Failed to load categories: ${e.message}');
    } catch (e) {
      print('❌ General Error (categories): $e');
      throw Exception('Network error: $e');
    }
  }

  void dispose() {
    _dio.close();
  }
}
