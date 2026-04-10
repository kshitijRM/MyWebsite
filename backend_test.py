import requests
import sys
import json
from datetime import datetime

class PortfolioAPITester:
    def __init__(self, base_url="https://kinetic-space.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            
            result = {
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_size": len(response.text) if response.text else 0
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Try to parse JSON response
                try:
                    json_response = response.json()
                    if isinstance(json_response, list):
                        print(f"   Response: List with {len(json_response)} items")
                    elif isinstance(json_response, dict):
                        print(f"   Response: Dict with keys: {list(json_response.keys())}")
                    result["response_preview"] = str(json_response)[:200] + "..." if len(str(json_response)) > 200 else str(json_response)
                except:
                    print(f"   Response: {response.text[:100]}...")
                    result["response_preview"] = response.text[:200]
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                result["error_response"] = response.text[:500]

            self.results.append(result)
            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            result = {
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "TIMEOUT",
                "success": False,
                "error": "Request timeout"
            }
            self.results.append(result)
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            }
            self.results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test POST status
        test_data = {"client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"}
        success, response = self.run_test("Create Status Check", "POST", "status", 200, test_data)
        
        # Test GET status
        self.run_test("Get Status Checks", "GET", "status", 200)
        
        return success

    def test_github_repos(self):
        """Test GitHub repos endpoint"""
        return self.run_test("GitHub Repos", "GET", "github/repos", 200, timeout=60)

    def test_contact_form(self):
        """Test contact form submission"""
        test_contact = {
            "name": "Test User",
            "email": "test@example.com",
            "message": "This is a test message from the automated test suite."
        }
        return self.run_test("Contact Form", "POST", "contact", 200, test_contact)

    def test_get_contacts(self):
        """Test getting all contacts (admin endpoint)"""
        return self.run_test("Get Contacts", "GET", "contacts", 200)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Portfolio API Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 50)

        # Test all endpoints
        self.test_root_endpoint()
        self.test_status_endpoints()
        self.test_github_repos()
        self.test_contact_form()
        self.test_get_contacts()

        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed")
            
            # Print failed tests
            failed_tests = [r for r in self.results if not r["success"]]
            if failed_tests:
                print("\n❌ Failed Tests:")
                for test in failed_tests:
                    print(f"   - {test['test_name']}: {test.get('error', 'Status code mismatch')}")
            
            return 1

def main():
    tester = PortfolioAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())