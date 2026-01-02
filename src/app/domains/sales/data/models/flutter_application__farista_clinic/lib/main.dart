import 'package:flutter/material.dart';
import 'package:flutter_application__farista_clinic/ui/pages/main_screen_page.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'providers/home_provider.dart';
import 'services/auth_service.dart';
import 'ui/pages/login_page.dart';
import 'ui/pages/home_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => HomeProvider())],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService: AuthService()),
        ),
        ChangeNotifierProvider(create: (_) => HomeProvider()),
      ],
      child: MaterialApp(
        title: 'eHatiya',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 209, 238, 217),
          ),
          useMaterial3: true,
          fontFamily: 'Inter',
        ),

        // ✅ First screen after login will be your main home (with bottom navigation)
        home: const MainScreen(),

        // ✅ Central route management for navigation
        routes: {
          '/login': (context) => const LoginScreen(),
          '/home': (context) => const HomePage(),
          '/main': (context) =>
              const MainScreen(), // 🧭 New bottom navigation entry
        },
      ),
    );
  }
}
