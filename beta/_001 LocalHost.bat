@echo off
echo Spoustim lokalni server a oteviram prohlizec...

:: Prikaz 'start' otevre vychozi prohlizec na dane adrese
start http://localhost:8000

:: Spusteni samotneho serveru
python -m http.server 8000
pause