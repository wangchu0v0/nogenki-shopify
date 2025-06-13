# Judge.me 评论显示修复部署脚本
# 此脚本将全面修复版脚本复制为正式部署文件

# 显示欢迎信息
Write-Host "Judge.me 评论显示修复部署脚本" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host "此脚本将部署全面修复版脚本并备份原脚本" -ForegroundColor Yellow

# 验证目录
$baseDir = "d:\shopify学习\正式版"
$assetsDir = "$baseDir\assets" 

if (-not (Test-Path $assetsDir)) {
    Write-Host "错误: 找不到资产目录 $assetsDir" -ForegroundColor Red
    exit 1
}

# 验证文件
$sourceFile = "$assetsDir\judgeme-modifier-robust-fixed.js"
$targetFile = "$assetsDir\judgeme-modifier-robust.js"
$backupFile = "$assetsDir\judgeme-modifier-robust.js.bak"

if (-not (Test-Path $sourceFile)) {
    Write-Host "错误: 找不到源文件 $sourceFile" -ForegroundColor Red
    exit 1
}

# 创建备份
if (Test-Path $targetFile) {
    Write-Host "创建备份: $backupFile" -ForegroundColor Cyan
    Copy-Item -Path $targetFile -Destination $backupFile -Force
}

# 复制修复文件
Write-Host "部署修复文件..." -ForegroundColor Cyan
Copy-Item -Path $sourceFile -Destination $targetFile -Force

Write-Host "检查部署结果..." -ForegroundColor Cyan
if (Test-Path $targetFile) {
    $sourceContent = Get-Content -Path $sourceFile -Raw
    $targetContent = Get-Content -Path $targetFile -Raw

    if ($sourceContent -eq $targetContent) {
        Write-Host "✅ 部署成功！全面修复版脚本已准备好上传到Shopify。" -ForegroundColor Green
    } else {
        Write-Host "❌ 部署失败！文件内容不一致。" -ForegroundColor Red
    }
} else {
    Write-Host "❌ 部署失败！无法找到目标文件。" -ForegroundColor Red
}

Write-Host "`n部署说明:" -ForegroundColor Yellow
Write-Host "1. 将 'judgeme-modifier-robust.js' 上传到Shopify主题的assets目录"
Write-Host "2. 在theme.liquid文件中添加或修改以下代码:"
Write-Host "   <script src=\"{{ 'judgeme-modifier-robust.js' | asset_url }}\" async></script>" -ForegroundColor Cyan
Write-Host "3. 发布主题更改"
Write-Host "4. 验证英文和日文界面下的评论显示是否正确"
Write-Host "`n如需恢复原始文件，请运行:" -ForegroundColor Yellow
Write-Host "Copy-Item -Path \"$backupFile\" -Destination \"$targetFile\" -Force" -ForegroundColor DarkCyan
