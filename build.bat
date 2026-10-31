@echo off
rem DEPLOY-001: build in Docker and export a fresh, verified artifact to .artifacts\out
setlocal
where node >nul 2>&1 || (echo ERROR Node.js is required on PATH. 1>&2 & exit /b 1)
node "%~dp0scripts\deploy\cli.mjs" build %*
exit /b %ERRORLEVEL%
