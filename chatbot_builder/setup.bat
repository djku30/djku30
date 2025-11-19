@echo off
echo ========================================
echo  CHATBOT BUILDER - Setup Windows
echo ========================================
echo.

REM Controlla se Python è installato
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRORE: Python non trovato!
    echo.
    echo Installa Python da: https://www.python.org/downloads/
    echo Assicurati di selezionare "Add Python to PATH" durante l'installazione
    echo.
    pause
    exit /b 1
)

echo Python trovato!
python --version
echo.

REM Installa le dipendenze
echo Installazione dipendenze...
echo.
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  Setup completato con successo!
    echo ========================================
    echo.
    echo Ora puoi avviare l'applicazione con: start.bat
    echo.
) else (
    echo.
    echo ERRORE durante l'installazione!
    echo.
)

pause
