#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "Testing API endpoints..."
echo ""

# Test signup
echo "1. Testing signup..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"apitest","password":"test1234"}')
echo "Response: $SIGNUP_RESPONSE"
USER_ID=$(echo $SIGNUP_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "User ID: $USER_ID"
echo ""

# Test login
echo "2. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"apitest","password":"test1234"}')
echo "Response: $LOGIN_RESPONSE"
echo ""

# Test get user
echo "3. Testing get user..."
USER_RESPONSE=$(curl -s "$BASE_URL/auth/me?userId=$USER_ID")
echo "Response: $USER_RESPONSE"
echo ""

# Test add game
echo "4. Testing add game..."
GAME_RESPONSE=$(curl -s -X POST "$BASE_URL/games?userId=$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Game",
    "platform": "PC",
    "status": "playing",
    "genres": ["Action", "Adventure"]
  }')
echo "Response: $GAME_RESPONSE"
GAME_ID=$(echo $GAME_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | tail -1)
echo "Game ID: $GAME_ID"
echo ""

# Test get games
echo "5. Testing get games..."
GAMES_RESPONSE=$(curl -s "$BASE_URL/games?userId=$USER_ID")
echo "Response: $GAMES_RESPONSE"
echo ""

# Test Steam search
echo "6. Testing Steam search..."
STEAM_RESPONSE=$(curl -s "$BASE_URL/steam/search?query=minecraft")
echo "Response: $STEAM_RESPONSE" | head -c 200
echo "..."
echo ""

echo "All tests completed!"
