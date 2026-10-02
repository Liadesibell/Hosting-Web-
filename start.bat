@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 goto missing_node

if not exist "node_modules\express" (
    echo Installing project dependencies...
    call npm.cmd install
    if errorlevel 1 goto install_failed
)

powershell.exe -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing 'http://localhost:3000/api/plans' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch { }; exit 1" >nul 2>nul
if not errorlevel 1 goto already_running

echo.
echo KOKHost is starting at http://localhost:3000
echo Keep this window open while using the site.
echo Press Ctrl+C to stop the server.
echo.
call npm.cmd start
echo.
echo The server has stopped. Press any key to close this window.
pause >nul
exit /b

:already_running
echo KOKHost is already running at http://localhost:3000
start "" "http://localhost:3000"
echo This window will stay open. Press any key to close it.
pause >nul
exit /b 0

:missing_node
echo Node.js was not found. Install Node.js 22.5 or newer, then run this file again.
pause
exit /b 1

:install_failed
echo Dependency installation failed. Check your internet connection and try again.
pause
exit /b 1