@echo off
cd /d "%~dp0"
echo Ouvrez http://localhost:4173 dans votre navigateur.
echo Gardez cette fenetre ouverte. Ctrl+C pour arreter le serveur.
node tools/serve.mjs
pause
