@echo off
echo Testing Register:
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"user2@test.com\",\"password\":\"TestPass123!\",\"name\":\"User Two\"}"
echo.
echo Testing Logout:
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/logout
echo.
echo Testing Login:
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"user2@test.com\",\"password\":\"TestPass123!\"}"
echo.
echo Testing Me:
curl -i -c cookies.txt -b cookies.txt http://localhost:4000/auth/me
echo.
echo Testing Refresh:
curl -i -c cookies.txt -b cookies.txt -X POST http://localhost:4000/auth/refresh
echo.
