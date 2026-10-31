@echo off
rem DEPLOY-001: build the preview image and serve it on http://127.0.0.1:%PREVIEW_PORT% (default 4173)
setlocal
where node >nul 2>&1 || (echo ERROR Node.js is required on PATH. 1>&2 & exit /b 1)
node "%~dp0scripts\deploy\cli.mjs" preview %*
exit /b %ERRORLEVEL%
