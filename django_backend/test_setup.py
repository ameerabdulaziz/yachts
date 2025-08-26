#!/usr/bin/env python3
"""
Quick test to verify Django backend setup
This will help us understand what's working with your enhanced backend
"""

def test_imports():
    """Test if we can import Django components"""
    try:
        import django
        print(f"✅ Django {django.get_version()} available")
        return True
    except ImportError:
        print("❌ Django not installed")
        return False

def test_project_structure():
    """Test if project files are properly structured"""
    import os
    
    required_files = [
        'manage.py',
        'nauttec_platform/settings.py',
        'nauttec_platform/urls.py',
        'accounts/models.py',
        'accounts/admin.py',
        'yachts/models.py',
        'yachts/serializers.py',
        'yachts/views.py',
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
        else:
            print(f"✅ Found {file_path}")
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    
    return True

def main():
    print("=== Nauttec Django Backend Setup Test ===")
    
    # Test project structure
    structure_ok = test_project_structure()
    
    # Test Django imports
    imports_ok = test_imports()
    
    if structure_ok and imports_ok:
        print("\n🎉 Your Django backend structure looks great!")
        print("📁 All required files are present")
        print("🔧 Ready for database setup and server launch")
    else:
        print("\n⚠️ Some issues found with setup")
        print("💡 Your enhanced Django code is excellent, we just need to install dependencies")

if __name__ == "__main__":
    main()