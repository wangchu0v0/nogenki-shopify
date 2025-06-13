# NoGenki Shopify 项目 - Yazi 快速启动脚本
# 用法: 在 PowerShell 中运行此脚本快速跳转到项目目录

function Start-YaziShopify {
    param(
        [Parameter(Position=0)]
        [string]$Target = "main"
    )
    
    switch ($Target) {
        "main" { 
            Set-Location "d:\shopify学习\正式版"
            yazi
        }
        "assets" { 
            Set-Location "d:\shopify学习\正式版\assets"
            yazi
        }
        "snippets" { 
            Set-Location "d:\shopify学习\正式版\snippets"
            yazi
        }
        "layout" { 
            Set-Location "d:\shopify学习\正式版\layout"
            yazi
        }
        "templates" { 
            Set-Location "d:\shopify学习\正式版\templates"
            yazi
        }
        "sections" { 
            Set-Location "d:\shopify学习\正式版\sections"
            yazi
        }
        "config" { 
            Set-Location "d:\shopify学习\正式版\config"
            yazi
        }
        "docs" { 
            Set-Location "d:\shopify学习\文档"
            yazi
        }
        default {
            Write-Host "可用选项:"
            Write-Host "  main     - 正式版主目录"
            Write-Host "  assets   - 静态资源目录"
            Write-Host "  snippets - 代码片段目录"
            Write-Host "  layout   - 布局模板目录"
            Write-Host "  templates- 页面模板目录"
            Write-Host "  sections - 页面段落目录"
            Write-Host "  config   - 配置文件目录"
            Write-Host "  docs     - 文档目录"
            Write-Host ""
            Write-Host "使用方法: Start-YaziShopify <选项>"
            Write-Host "例如: Start-YaziShopify assets"
        }
    }
}

# 创建别名以便快速使用
Set-Alias -Name "yz" -Value "Start-YaziShopify" -Force
Set-Alias -Name "yazi-shopify" -Value "Start-YaziShopify" -Force

# 显示使用说明
Write-Host "🎉 Yazi Shopify 快速启动脚本已加载!" -ForegroundColor Green
Write-Host ""
Write-Host "快速命令:" -ForegroundColor Cyan
Write-Host "  yz        - 启动 Yazi 在主目录" -ForegroundColor Yellow
Write-Host "  yz assets - 启动 Yazi 在 assets 目录" -ForegroundColor Yellow
Write-Host "  yz snippets - 启动 Yazi 在 snippets 目录" -ForegroundColor Yellow
Write-Host ""
Write-Host "在 Yazi 中的快捷键:" -ForegroundColor Cyan
Write-Host "  gs - 跳转到正式版目录" -ForegroundColor Yellow
Write-Host "  ga - 跳转到 assets" -ForegroundColor Yellow
Write-Host "  gn - 跳转到 snippets" -ForegroundColor Yellow
Write-Host "  gl - 跳转到 layout" -ForegroundColor Yellow
Write-Host "  gt - 跳转到 templates" -ForegroundColor Yellow
Write-Host "  Ctrl+E - 用 VS Code 编辑文件" -ForegroundColor Yellow
Write-Host ""
