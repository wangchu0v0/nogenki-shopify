# 启动评论修复验证测试页面
# 此脚本用于启动测试页面，验证Judge.me评论显示修复效果

# 显示欢迎信息
Write-Host "正在启动Judge.me评论修复验证测试..." -ForegroundColor Green

# 验证文件路径
$testFile = "test-judgeme-robust.html"
$testPath = Join-Path -Path (Get-Location) -ChildPath $testFile
$jsFile = Join-Path -Path (Get-Location) -ChildPath "assets\judgeme-modifier-robust.js"

if (-not (Test-Path $testPath)) {
    Write-Host "错误: 找不到测试文件 $testPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $jsFile)) {
    Write-Host "错误: 找不到修复脚本 $jsFile" -ForegroundColor Red
    exit 1
}

# 打开浏览器测试页面
Write-Host "打开测试页面: $testFile" -ForegroundColor Cyan
Start-Process $testPath

Write-Host ""
Write-Host "测试说明:" -ForegroundColor Yellow
Write-Host "1. 测试页面将自动加载修复脚本"
Write-Host "2. 查看各个测试用例是否成功修复"
Write-Host "3. 可以点击语言切换按钮测试不同语言环境"
Write-Host "4. 可以点击[模拟其他脚本干扰]按钮测试抗干扰能力"
Write-Host "5. 如页面无法打开，请手动打开: $testFile"
