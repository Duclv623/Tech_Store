@REM Maven Wrapper for Windows
@REM
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM
@REM MAVEN_CMD_LINE_ARGS - Space separated list of maven command line args to pass to maven when running embedded
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM
@IF "%{env:MAVEN_BATCH_PAUSE}" == "on" pause

@echo off

setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@REM Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto error

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto error

:init
@REM Find the project basedir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current directory if .mvn not found.

set MAVEN_PROJECTBASEDIR=%DIRNAME%
IF NOT "%MAVEN_PROJECTBASEDIR%"=="" goto baseDirFound
cd /d %CD%
IF %ERRORLEVEL% NEQ 0 goto error
cd /d %~dp0
IF %ERRORLEVEL% NEQ 0 goto error

:baseDirFound
@REM Setup the command line
set CLASSPATH=%APP_HOME%\.mvn\wrapper\maven-wrapper.jar
if not exist "%CLASSPATH%" (
  echo Downloading from: https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar
  powershell -Command "(New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/0.5.6/maven-wrapper-0.5.6.jar', '.mvn\wrapper\maven-wrapper.jar')"
)

set MAVEN_JAVA_EXE="%JAVA_EXE%"

@REM Strip trailing backslash so the quoted -D arg doesn't end with \" (which becomes an escaped quote)
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

@REM Running this module requires Maven 3.1.1 or later
%MAVEN_JAVA_EXE% -classpath %CLASSPATH% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*

if %ERRORLEVEL% NEQ 0 goto error
goto end

:error
set ERROR_CODE=%ERRORLEVEL%

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

if not "%MAVEN_SKIP_RC%" == "" goto skipRcPost
@REM check for post script, ".bat" running in MAVEN_BATCH_MODE
if exist "%APP_HOME%\mavenrc_post.bat" call "%APP_HOME%\mavenrc_post.bat"
:skipRcPost

cmd /C exit /B %ERROR_CODE%
