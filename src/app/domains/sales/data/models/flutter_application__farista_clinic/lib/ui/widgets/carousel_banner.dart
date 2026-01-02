import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

class CarouselBanner extends StatelessWidget {
  const CarouselBanner({super.key});

  @override
  Widget build(BuildContext context) {
    final banners = [
      'assets/banners/banner1.jpg',
      'assets/banners/banner2.jpg',
      'assets/banners/banner3.jpg',
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: CarouselSlider.builder(
        itemCount: banners.length,
        itemBuilder: (context, index, realIndex) {
          final img = banners[index];
          return ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.asset(img, fit: BoxFit.cover, width: double.infinity),
          );
        },
        options: CarouselOptions(
          height: 180,
          autoPlay: true,
          enlargeCenterPage: true,
          viewportFraction: 0.92,
          enableInfiniteScroll: true,
          autoPlayInterval: const Duration(seconds: 4),
          autoPlayAnimationDuration: const Duration(milliseconds: 800),
        ),
      ),
    );
  }
}
