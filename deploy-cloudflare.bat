@echo off
rem DEPLOY-001: check config, build, verify, then upload that same artifact to Cloudflare Pages.
rem Default target is preview. Production: set DEPLOY_TARGET=production and pass --confirm-production.
setlocal
where node >nul 2>&1 || (echo ERROR Node.js is required on PATH. 1>&2 & exit /b 1)
node "%~dp0scripts\deploy\cli.mjs" deploy %*
exit /b %ERRORLEVEL%
