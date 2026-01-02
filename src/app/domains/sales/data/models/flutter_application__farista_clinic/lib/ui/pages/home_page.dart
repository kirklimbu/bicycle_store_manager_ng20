import 'package:flutter/material.dart';
import 'package:flutter_application__farista_clinic/providers/home_provider.dart';
import 'package:provider/provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => Provider.of<HomeProvider>(context, listen: false).loadHomeData(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final homeProvider = context.watch<HomeProvider>();

    if (homeProvider.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (homeProvider.error.isNotEmpty) {
      return Center(child: Text(homeProvider.error));
    }

    return SingleChildScrollView(
      child: Column(
        children: [
          // 🔹 Banners
          SizedBox(
            height: 180,
            child: PageView.builder(
              itemCount: homeProvider.banners.length,
              itemBuilder: (context, index) {
                final banner = homeProvider.banners[index];
                return Image.network(banner.docPath, fit: BoxFit.cover);
              },
            ),
          ),

          const SizedBox(height: 10),

          // 🔹 Categories
          SizedBox(
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: homeProvider.categories.length,
              itemBuilder: (context, index) {
                final cat = homeProvider.categories[index];
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      CircleAvatar(
                        backgroundImage: NetworkImage(cat.docPath),
                        radius: 30,
                      ),
                      const SizedBox(height: 5),
                      Text(cat.category, style: const TextStyle(fontSize: 12)),
                    ],
                  ),
                );
              },
            ),
          ),

          const Divider(),

          // 🔹 Recommended Products
          _buildProductSection("Recommended", homeProvider.recommendations),

          // 🔹 Best Selling Products
          _buildProductSection("Best Selling", homeProvider.bestSelling),

          // 🔹 New Arrivals
          _buildProductSection("New Arrivals", homeProvider.newProducts),
        ],
      ),
    );
  }

  Widget _buildProductSection(String title, List products) {
    if (products.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            title,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: products.length,
            itemBuilder: (context, index) {
              final p = products[index];
              return Card(
                margin: const EdgeInsets.all(8),
                child: Column(
                  children: [
                    Image.network(
                      p.imageUrl ?? '',
                      height: 120,
                      width: 120,
                      fit: BoxFit.cover,
                    ),
                    Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Text(
                        p.name ?? '',
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                    Text(
                      'Rs. ${p.price}',
                      style: const TextStyle(fontSize: 12, color: Colors.green),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
