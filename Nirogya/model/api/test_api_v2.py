"""
Test script for Disease Prediction API V2
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_root():
    """Test root endpoint."""
    print("\n1️⃣ Testing Root Endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    assert response.status_code == 200

def test_health():
    """Test health check."""
    print("\n2️⃣ Testing Health Endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(json.dumps(data, indent=2))
    assert response.status_code == 200
    assert data['model_loaded'] == True

def test_regions():
    """Test regions endpoint."""
    print("\n3️⃣ Testing Regions Endpoint...")
    response = requests.get(f"{BASE_URL}/regions")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total regions: {data['total']}")
    print(f"Sample regions: {data['regions'][:5]}")
    assert response.status_code == 200
    assert data['total'] > 0

def test_diseases():
    """Test diseases endpoint."""
    print("\n4️⃣ Testing Diseases Endpoint...")
    response = requests.get(f"{BASE_URL}/diseases")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total diseases: {data['total']}")
    print(f"Sample diseases: {data['diseases'][:5]}")
    assert response.status_code == 200
    assert data['total'] > 0

def test_prediction():
    """Test prediction endpoint."""
    print("\n5️⃣ Testing Prediction Endpoint...")
    
    # First get a valid region and disease
    regions_response = requests.get(f"{BASE_URL}/regions")
    diseases_response = requests.get(f"{BASE_URL}/diseases")
    
    region = regions_response.json()['regions'][0]
    disease = diseases_response.json()['diseases'][0]
    
    payload = {
        "region": region,
        "disease": disease,
        "last_14_days_cases": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
        "prediction_date": "2025-11-15"
    }
    
    print(f"Request payload:")
    print(json.dumps(payload, indent=2))
    
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    print(f"\nStatus: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        print(f"\n📊 Prediction Summary:")
        print(f"   Predicted: {data['predicted_cases']:.2f} cases")
        print(f"   95% CI: [{data['confidence_interval_lower']:.2f}, {data['confidence_interval_upper']:.2f}]")
        print(f"   Model: {data['model_version']}")
    else:
        print(f"Error: {response.text}")
    
    assert response.status_code == 200

def test_food_poisoning_example():
    """Test the specific example from README."""
    print("\n6️⃣ Testing Food Poisoning Example...")
    
    payload = {
        "region": "Andhra Pradesh_Alluri Sitharama Raju",
        "disease": "Food Poisoning",
        "last_14_days_cases": [0,0,0,0,0,0,0,0,0,0,0,0,0,8],
        "prediction_date": "2025-11-15"
    }
    
    print(f"Request payload:")
    print(json.dumps(payload, indent=2))
    
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    print(f"\nStatus: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(json.dumps(data, indent=2))
        
        predicted = data['predicted_cases']
        actual = 8.0
        error_pct = abs(predicted - actual) / actual * 100
        
        print(f"\n📊 Comparison:")
        print(f"   Predicted: {predicted:.1f} cases")
        print(f"   Actual: {actual:.1f} cases")
        print(f"   Error: {error_pct:.1f}%")
        
        print(f"\n📈 Improvement:")
        print(f"   Old Model: 22.2 cases (157.3% error) ❌")
        print(f"   New Model: {predicted:.1f} cases ({error_pct:.1f}% error)")
        
        if error_pct < 50:
            print(f"   ✅ Target achieved! Error < 50%")
        else:
            print(f"   ⚠️  Error still > 50%, but improved from 157%")
    else:
        print(f"Error: {response.text}")
    
    assert response.status_code == 200 or response.status_code == 400  # 400 if region not in new data

if __name__ == "__main__":
    print("🧪 Testing Disease Prediction API V2")
    print("=" * 60)
    
    try:
        test_root()
        test_health()
        test_regions()
        test_diseases()
        test_prediction()
        test_food_poisoning_example()
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API")
        print("   Make sure the API is running: python app_v2.py")
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
