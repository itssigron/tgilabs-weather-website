@echo off
echo Installing dependencies for the client...
cd client
call npm install
cd ..

echo Installing dependencies for the server...
cd server
call npm install
cd ..

echo Installation complete for both client and server.
pause