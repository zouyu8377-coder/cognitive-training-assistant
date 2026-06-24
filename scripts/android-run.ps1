param(
  [string]$AvdName = "CognitiveTraining_API36",
  [switch]$NoBuild,
  [int]$WindowX = 80,
  [int]$WindowY = 80
)

$ErrorActionPreference = "Stop"

function Add-ToPathIfExists {
  param([string]$PathToAdd)
  if (Test-Path -LiteralPath $PathToAdd) {
    $env:Path = "$PathToAdd;$env:Path"
  }
}

function Move-EmulatorWindow {
  param([int]$X, [int]$Y)

  Add-Type @"
using System;
using System.Runtime.InteropServices;
public class AndroidRunWindowMove {
  [DllImport("user32.dll", SetLastError=true)]
  public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
}
"@ -ErrorAction SilentlyContinue

  $swpNoSize = 0x0001
  $swpNoZOrder = 0x0004
  Get-Process emulator,qemu-system-x86_64 -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowHandle -ne 0 } |
    ForEach-Object {
      [AndroidRunWindowMove]::SetWindowPos($_.MainWindowHandle, [IntPtr]::Zero, $X, $Y, 0, 0, $swpNoSize -bor $swpNoZOrder) | Out-Null
    }
}

function Get-BootedEmulator {
  $deviceLines = & adb devices 2>$null | Select-String -Pattern "emulator-\d+\s+device"
  if (-not $deviceLines) { return "" }
  return (($deviceLines[0].Line -split "\s+")[0])
}

function Get-EmulatorBootState {
  $device = Get-BootedEmulator
  if (-not $device) { return "" }
  return (& adb -s $device shell getprop sys.boot_completed 2>$null | Out-String).Trim()
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

$sdkRoot = $env:ANDROID_HOME
if (-not $sdkRoot) { $sdkRoot = $env:ANDROID_SDK_ROOT }
if (-not $sdkRoot -and (Test-Path -LiteralPath "D:\Android\Sdk")) { $sdkRoot = "D:\Android\Sdk" }
if (-not $sdkRoot) { throw "ANDROID_HOME is not set and D:\Android\Sdk was not found." }

$jdkRoot = $env:JAVA_HOME
if (-not $jdkRoot -and (Test-Path -LiteralPath "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot")) {
  $jdkRoot = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
}
if ($jdkRoot) {
  $env:JAVA_HOME = $jdkRoot
  Add-ToPathIfExists (Join-Path $jdkRoot "bin")
}

$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
Add-ToPathIfExists (Join-Path $sdkRoot "platform-tools")
Add-ToPathIfExists (Join-Path $sdkRoot "emulator")
Add-ToPathIfExists (Join-Path $sdkRoot "cmdline-tools\latest\bin")

$apkPath = Join-Path $projectRoot "android\app\build\outputs\apk\debug\app-debug.apk"

if (-not $NoBuild) {
  Write-Host "Building debug APK..."
  npm.cmd run android:apk
}

if (-not (Test-Path -LiteralPath $apkPath)) {
  throw "APK was not found at $apkPath. Run npm.cmd run android:apk first."
}

$bootedDevice = Get-BootedEmulator

if (-not $bootedDevice) {
  Write-Host "Starting Android emulator $AvdName..."
  Start-Process -FilePath (Join-Path $sdkRoot "emulator\emulator.exe") -ArgumentList @(
    "-avd", $AvdName,
    "-no-snapshot",
    "-gpu", "swiftshader_indirect",
    "-netdelay", "none",
    "-netspeed", "full"
  )
} else {
  Write-Host "Using running emulator $bootedDevice."
}

Write-Host "Waiting for emulator boot..."
for ($i = 0; $i -lt 120; $i++) {
  Move-EmulatorWindow -X $WindowX -Y $WindowY
  $boot = Get-EmulatorBootState
  if ($boot -eq "1") { break }
  Start-Sleep -Seconds 5
}

Move-EmulatorWindow -X $WindowX -Y $WindowY

$boot = Get-EmulatorBootState
if ($boot -ne "1") {
  throw "Emulator did not finish booting in time."
}

Write-Host "Installing APK..."
adb install -r $apkPath

Write-Host "Launching app..."
adb shell monkey -p com.zouyu.cognitivetraining -c android.intent.category.LAUNCHER 1 | Out-Host

Write-Host "Done. Emulator window moved to x=$WindowX y=$WindowY."
