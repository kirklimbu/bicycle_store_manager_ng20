class HomeModel {
  final List<BannerDto> bannerList;
  final List<Product> recommendationList;
  final List<Product> bestSellingList;
  final List<Product> newProductList;

  HomeModel({
    required this.bannerList,
    required this.recommendationList,
    required this.bestSellingList,
    required this.newProductList,
  });

  factory HomeModel.fromJson(Map<String, dynamic> json) {
    return HomeModel(
      bannerList: (json['bannerList'] as List<dynamic>? ?? [])
          .map((e) => BannerDto.fromJson(e))
          .toList(),
      recommendationList: (json['recommendationList'] as List<dynamic>? ?? [])
          .map((e) => Product.fromJson(e))
          .toList(),
      bestSellingList: (json['bestSellingList'] as List<dynamic>? ?? [])
          .map((e) => Product.fromJson(e))
          .toList(),
      newProductList: (json['newProductList'] as List<dynamic>? ?? [])
          .map((e) => Product.fromJson(e))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bannerList': bannerList.map((e) => e.toJson()).toList(),
      'recommendationList': recommendationList.map((e) => e.toJson()).toList(),
      'bestSellingList': bestSellingList.map((e) => e.toJson()).toList(),
      'newProductList': newProductList.map((e) => e.toJson()).toList(),
    };
  }
}

class BannerDto {
  final String id;
  final String docPath;
  final String? imageUrlMobile;
  final String? title;
  final String? subtitle;
  final String? actionUrl;

  BannerDto({
    required this.id,
    required this.docPath,
    this.imageUrlMobile,
    this.title,
    this.subtitle,
    this.actionUrl,
  });

  factory BannerDto.fromJson(Map<String, dynamic> json) {
    return BannerDto(
      id: json['bannerId']?.toString() ?? '',
      docPath: json['docPath'] ?? '',
      imageUrlMobile: json['docPathMobile'] ?? '',
      title: json['title'],
      subtitle: json['subtext'],
      actionUrl: json['ctaText'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bannerId': id,
      'docPath': docPath,
      'docPathMobile': imageUrlMobile,
      'title': title,
      'subtext': subtitle,
      'ctaText': actionUrl,
    };
  }
}

class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String? category;
  final String? brand;
  final int stock;
  final double rating;
  final int reviewCount;
  final bool isFeatured;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    this.category,
    this.brand,
    this.stock = 0,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.isFeatured = false,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? 'Unknown Product',
      description: json['description'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      imageUrl: json['imageUrl'] ?? json['image'] ?? '',
      category: json['category'],
      brand: json['brand'],
      stock: json['stock'] ?? json['quantity'] ?? 0,
      rating: (json['rating'] ?? 0).toDouble(),
      reviewCount: json['reviewCount'] ?? 0,
      isFeatured: json['isFeatured'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'imageUrl': imageUrl,
      'category': category,
      'brand': brand,
      'stock': stock,
      'rating': rating,
      'reviewCount': reviewCount,
      'isFeatured': isFeatured,
    };
  }
}

class Category {
  final int categoryId;
  final String category;
  final String docPath;
  final String level;
  final int parentId;

  Category({
    required this.categoryId,
    required this.category,
    required this.docPath,
    required this.level,
    required this.parentId,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      categoryId: json['categoryId'] ?? 0,
      category: json['category'] ?? '',
      docPath: json['docPath'] ?? '',
      level: json['level']?.toString() ?? '',
      parentId: json['parentId'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'categoryId': categoryId,
      'category': category,
      'docPath': docPath,
      'level': level,
      'parentId': parentId,
    };
  }
}
