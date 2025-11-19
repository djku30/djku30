@echo off
title Chatbot Builder - Server
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║        CHATBOT BUILDER - Avvio Server                   ║
echo  ║                                                          ║
echo  ║  Il browser si aprirà automaticamente su:               ║
echo  ║  http://localhost:5000                                  ║
echo  ║                                                          ║
echo  ║  Per fermare il server: premi CTRL+C                    ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

REM Controlla se Python è installato
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRORE: Python non trovato!
    echo Esegui prima setup.bat
    pause
    exit /b 1
)

REM Aspetta 2 secondi e apri il browser
start /B cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5000"

REM Avvia il server Flask
python app.py

pause
