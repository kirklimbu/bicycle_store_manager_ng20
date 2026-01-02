import 'package:flutter/foundation.dart' hide Category;
import 'package:flutter_application__farista_clinic/models/home_model.dart';
import 'package:flutter_application__farista_clinic/services/home_service.dart';

class HomeProvider with ChangeNotifier {
  DioHomeService? _homeService;

  bool _isLoading = false;
  String _error = '';

  List<BannerDto> _banners = [];
  List<Product> _recommendations = [];
  List<Product> _bestSelling = [];
  List<Product> _newProducts = [];
  List<Category> _categories = [];

  HomeProvider();

  bool get isLoading => _isLoading;
  String get error => _error;

  List<BannerDto> get banners => _banners;
  List<Product> get recommendations => _recommendations;
  List<Product> get bestSelling => _bestSelling;
  List<Product> get newProducts => _newProducts;
  List<Category> get categories => _categories;

  /// ✅ Initialize HomeService before use
  Future<void> init() async {
    _homeService ??= await DioHomeService.create();
  }

  /// 🔹 Load home + category data
  Future<void> loadHomeData() async {
    _isLoading = true;
    _error = '';
    notifyListeners();
    // START FROM HERE==> STATUS CODE 400 ON HOME API

    try {
      // Ensure DioHomeService is ready
      await init();

      // final deviceId = await DeviceUtils.generateDeviceId();
      final deviceId = '0';
      print('📱 Device ID: $deviceId');

      // 🏠 Load home content
      final homeData = await _homeService!.getHomeContents();
      print('✅ Home data received');

      // 📂 Load categories
      final catData = await _homeService!.getCategories();

      // ✅ Update state
      _banners = homeData.bannerList;
      _recommendations = homeData.recommendationList;
      _bestSelling = homeData.bestSellingList;
      _newProducts = homeData.newProductList;
      _categories = catData;

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      print('❌ Error loading home data: $e');
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  /// 🔄 Refresh home data
  Future<void> refresh() async {
    await loadHomeData();
  }
}
