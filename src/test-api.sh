#!/bin/bash

# Test script for Dog Breeds API
BASE_URL="http://localhost:3000/api/breeds"

echo "🐕 Testing Dog Breeds API"
echo "=========================="

# Test 1: Get all breeds
echo -e "\n1. Getting all breeds..."
curl -s "$BASE_URL" | jq '.data | length' | xargs echo "Found breeds:"

# Test 2: Get breed by ID
echo -e "\n2. Getting breed by ID (1)..."
curl -s "$BASE_URL/1" | jq '.data.name'

# Test 3: Search breeds
echo -e "\n3. Searching for 'retriever'..."
curl -s "$BASE_URL/search?q=retriever" | jq '.data[].name'

# Test 4: Create new breed
echo -e "\n4. Creating new breed..."
NEW_BREED=$(curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Australian Shepherd",
    "breed_group": "Herding",
    "temperament": "Intelligent, Work-Oriented, Exuberant",
    "life_span": "12-15 years",
    "height_cm": {"min": 46, "max": 58},
    "weight_kg": {"min": 16, "max": 32},
    "description": "The Australian Shepherd is a breed of herding dog that was developed on ranches in the Western United States.",
    "image_url": "https://images.dog.ceo/breeds/sheepdog-australian/IMG_0750.jpg"
  }')

echo "$NEW_BREED" | jq '.success'
NEW_ID=$(echo "$NEW_BREED" | jq -r '.data.id // empty')
if [ ! -z "$NEW_ID" ]; then
  echo "Created breed with ID: $NEW_ID"
  
  # Test 5: Update breed
  echo -e "\n5. Updating breed..."
  curl -s -X PUT "$BASE_URL/$NEW_ID" \
    -H "Content-Type: application/json" \
    -d '{"description": "Updated description for Australian Shepherd"}' | jq '.message'
  
  # Test 6: Get updated breed
  echo -e "\n6. Getting updated breed..."
  curl -s "$BASE_URL/$NEW_ID" | jq '.data.description'
  
  # Test 7: Delete breed
  echo -e "\n7. Deleting breed..."
  curl -s -X DELETE "$BASE_URL/$NEW_ID" | jq '.message'
  
  # Test 8: Verify deletion
  echo -e "\n8. Verifying deletion..."
  curl -s "$BASE_URL/$NEW_ID" | jq '.error'
else
  echo "Failed to create breed"
fi

echo -e "\n✅ API testing completed!" 