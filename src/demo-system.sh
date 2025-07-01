#!/bin/bash

# Dog Breeds System - Complete Demo Script
# This script demonstrates the full functionality of both the API and Web App

echo "🐕 Dog Breeds System - Complete Demo"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if API is running
print_status "Checking API status..."
if curl -s http://localhost:3000/health > /dev/null; then
    print_success "API is running on http://localhost:3000"
else
    print_error "API is not running. Please start it with: npm run dev"
    exit 1
fi

# Check if Web App is running
print_status "Checking Web App status..."
if curl -s http://localhost:3001 > /dev/null; then
    print_success "Web App is running on http://localhost:3001"
else
    print_warning "Web App is not running. Start it with: cd web-app && npm run dev"
fi

echo ""
print_status "Starting API demonstration..."

# 1. Test API Health
echo "1. Testing API Health Check"
response=$(curl -s http://localhost:3000/health)
if echo "$response" | grep -q "success.*true"; then
    print_success "✓ Health check passed"
else
    print_error "✗ Health check failed"
fi

# 2. Get API Documentation
echo ""
echo "2. Getting API Documentation"
response=$(curl -s http://localhost:3000/)
if echo "$response" | grep -q "Dog Breeds API"; then
    print_success "✓ API documentation accessible"
else
    print_error "✗ API documentation not accessible"
fi

# 3. Get All Breeds
echo ""
echo "3. Getting All Breeds"
response=$(curl -s http://localhost:3000/api/breeds)
breed_count=$(echo "$response" | jq '.data | length' 2>/dev/null || echo "0")
if [ "$breed_count" -gt 0 ]; then
    print_success "✓ Found $breed_count breeds in database"
    echo "$response" | jq '.data[].name' | head -3
else
    print_warning "No breeds found in database"
fi

# 4. Search Breeds
echo ""
echo "4. Testing Search Functionality"
response=$(curl -s "http://localhost:3000/api/breeds/search?q=retriever")
search_count=$(echo "$response" | jq '.data | length' 2>/dev/null || echo "0")
if [ "$search_count" -gt 0 ]; then
    print_success "✓ Search found $search_count retriever breeds"
else
    print_warning "No retriever breeds found"
fi

# 5. Create New Breed
echo ""
echo "5. Creating New Breed"
new_breed_data='{
  "name": "Demo Breed",
  "breed_group": "Working",
  "temperament": "Loyal, Intelligent, Protective",
  "life_span": "10-14 years",
  "height_cm": {"min": 50, "max": 60},
  "weight_kg": {"min": 20, "max": 30},
  "description": "A demonstration breed created for testing purposes.",
  "image_url": "https://images.dog.ceo/breeds/retriever-golden/n02099601_1024.jpg"
}'

response=$(curl -s -X POST http://localhost:3000/api/breeds \
  -H "Content-Type: application/json" \
  -d "$new_breed_data")

if echo "$response" | grep -q "success.*true"; then
    print_success "✓ New breed created successfully"
    new_breed_id=$(echo "$response" | jq -r '.data.id // empty' 2>/dev/null)
    if [ ! -z "$new_breed_id" ]; then
        echo "   Breed ID: $new_breed_id"
    fi
else
    print_error "✗ Failed to create new breed"
    echo "$response" | jq '.error // .message' 2>/dev/null
fi

# 6. Update Breed (if we have an ID)
if [ ! -z "$new_breed_id" ]; then
    echo ""
    echo "6. Updating Breed"
    update_data='{"description": "Updated description for demo breed"}'
    response=$(curl -s -X PUT "http://localhost:3000/api/breeds/$new_breed_id" \
      -H "Content-Type: application/json" \
      -d "$update_data")
    
    if echo "$response" | grep -q "success.*true"; then
        print_success "✓ Breed updated successfully"
    else
        print_error "✗ Failed to update breed"
    fi
fi

# 7. Get Specific Breed
if [ ! -z "$new_breed_id" ]; then
    echo ""
    echo "7. Getting Specific Breed"
    response=$(curl -s "http://localhost:3000/api/breeds/$new_breed_id")
    if echo "$response" | grep -q "success.*true"; then
        breed_name=$(echo "$response" | jq -r '.data.name' 2>/dev/null)
        print_success "✓ Retrieved breed: $breed_name"
    else
        print_error "✗ Failed to retrieve breed"
    fi
fi

# 8. Delete Breed (if we have an ID)
if [ ! -z "$new_breed_id" ]; then
    echo ""
    echo "8. Deleting Breed"
    response=$(curl -s -X DELETE "http://localhost:3000/api/breeds/$new_breed_id")
    if echo "$response" | grep -q "success.*true"; then
        print_success "✓ Breed deleted successfully"
    else
        print_error "✗ Failed to delete breed"
    fi
fi

echo ""
echo "🎉 API Demonstration Complete!"
echo ""

# Web App Information
if curl -s http://localhost:3001 > /dev/null; then
    print_success "Web Application is running!"
    echo ""
    echo "🌐 Access Points:"
    echo "   • Web Application: http://localhost:3001"
    echo "   • API Documentation: http://localhost:3000"
    echo "   • API Health Check: http://localhost:3000/health"
    echo ""
    echo "📱 Features Available in Web App:"
    echo "   • Browse all dog breeds with pagination"
    echo "   • Search breeds by name, group, or temperament"
    echo "   • Add new breeds with comprehensive forms"
    echo "   • Edit existing breed information"
    echo "   • Delete breeds with confirmation"
    echo "   • Responsive design for all devices"
    echo ""
    print_success "Open http://localhost:3001 in your browser to explore the web application!"
else
    print_warning "Web Application is not running"
    echo ""
    echo "To start the web application:"
    echo "   cd web-app"
    echo "   npm run dev"
    echo ""
    echo "Then visit: http://localhost:3001"
fi

echo ""
echo "📚 Documentation:"
echo "   • API Documentation: http://localhost:3000"
echo "   • README.md - Complete setup instructions"
echo "   • API_SUMMARY.md - Backend API details"
echo "   • WEB_APP_SUMMARY.md - Frontend application details"
echo ""
print_success "Dog Breeds System Demo Complete! 🐕✨" 