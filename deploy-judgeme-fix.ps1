# Judge.me 评论修复部署脚本
# 将修复后的脚本部署到Shopify主题

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   Judge.me 评论显示修复脚本 - 部署工具" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 设置文件路径
$sourceFile = "d:\shopify学习\正式版\assets\judgeme-modifier-robust-fixed.js"
$backupDir = "d:\shopify学习\正式版\backups\$(Get-Date -Format 'yyyy-MM-dd')"

# 检查修复文件是否存在
if (-not (Test-Path $sourceFile)) {
    Write-Host "错误: 修复文件 '$sourceFile' 不存在!" -ForegroundColor Red
    exit 1
}

# 创建备份目录
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "创建备份目录: $backupDir" -ForegroundColor Green
}

# 备份当前的主题文件
Write-Host "备份当前文件..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = "$backupDir\judgeme-modifier-backup-$timestamp.js"

# 检查Shopify目录
$shopifyAssetsDir = "d:\shopify学习\shopify\assets"
if (-not (Test-Path $shopifyAssetsDir)) {
    Write-Host "警告: Shopify资源目录不存在，将创建..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $shopifyAssetsDir -Force | Out-Null
}

# 检查是否有现有的脚本文件
$existingFiles = Get-ChildItem -Path $shopifyAssetsDir -Filter "*judgeme-modifier*.js"
if ($existingFiles.Count -gt 0) {
    Write-Host "找到以下现有的Judge.me修复文件:" -ForegroundColor Yellow
    $existingFiles | ForEach-Object { Write-Host "  - $($_.Name)" }
    
    # 备份现有文件
    $existingFiles | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination "$backupDir\$($_.Name)-backup-$timestamp.js" -Force
        Write-Host "已备份: $($_.Name) → $backupDir\$($_.Name)-backup-$timestamp.js" -ForegroundColor Green
    }
}

# 复制修复文件到Shopify资源目录
$destFile = "$shopifyAssetsDir\judgeme-modifier-robust.js"
Copy-Item -Path $sourceFile -Destination $destFile -Force
Write-Host "已部署: $sourceFile → $destFile" -ForegroundColor Green

# 显示确认信息
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   Judge.me 评论显示修复脚本部署完成!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "修复文件已成功部署到:" -ForegroundColor Green
Write-Host "  $destFile" -ForegroundColor Green
Write-Host ""
Write-Host "请确保您的主题包含以下代码片段以加载此脚本:" -ForegroundColor Yellow
Write-Host "  <script src='{{ 'judgeme-modifier-robust.js' | asset_url }}' defer></script>" -ForegroundColor White
Write-Host ""
Write-Host "建议将此代码添加到theme.liquid的</body>标签之前" -ForegroundColor Yellow
Write-Host ""

# 检查是否需要创建测试环境
$createTest = Read-Host "是否要打开测试文件进行验证? (y/n)"
if ($createTest -eq 'y' -or $createTest -eq 'Y') {
    $testFile = "d:\shopify学习\正式版\test-judgeme-robust-fixed.html"
    if (Test-Path $testFile) {
        Start-Process $testFile
        Write-Host "已打开测试文件: $testFile" -ForegroundColor Green
    } else {
        Write-Host "测试文件不存在: $testFile" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "感谢使用Judge.me评论修复工具!" -ForegroundColor Cyan
