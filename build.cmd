call update-version
call npm run build
if errorlevel 1 (
    echo ***************************************
    echo *********** ERROR EN BUILD ************
    echo ***************************************
    exit /b %errorlevel%
)
