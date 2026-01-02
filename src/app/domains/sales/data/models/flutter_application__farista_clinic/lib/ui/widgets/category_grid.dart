import 'package:flutter/material.dart';

class CategoryGrid extends StatelessWidget {
  const CategoryGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = [
      {'icon': Icons.phone_android, 'title': 'Mobiles'},
      {'icon': Icons.tv, 'title': 'Electronics'},
      {'icon': Icons.watch, 'title': 'Watches'},
      {'icon': Icons.kitchen, 'title': 'Appliances'},
      {'icon': Icons.shopping_bag, 'title': 'Fashion'},
      {'icon': Icons.directions_bike, 'title': 'Sports'},
      {'icon': Icons.laptop, 'title': 'Laptops'},
      {'icon': Icons.more_horiz, 'title': 'More'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      child: GridView.builder(
        itemCount: categories.length,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
        ),
        itemBuilder: (context, index) {
          final item = categories[index];
          return Column(
            children: [
              CircleAvatar(
                backgroundColor: Colors.white,
                radius: 25,
                child: Icon(item['icon'] as IconData,
                    color: Colors.orangeAccent, size: 26),
              ),
              const SizedBox(height: 6),
              Text(item['title'] as String, style: const TextStyle(fontSize: 12)),
            ],
          );
        },
      ),
    );
  }
}
