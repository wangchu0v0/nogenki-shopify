@echo off
REM NoGenki Shopify 项目 - Yazi 快速启动批处理
REM 双击此文件即可在 Shopify 项目中启动 Yazi

echo 🚀 启动 Yazi 文件管理器...
echo 📂 切换到 Shopify 正式版目录...

cd /d "d:\shopify学习\正式版"

if exist "yazi.exe" (
    yazi.exe
) else (
    where yazi >nul 2>nul
    if errorlevel 1 (
        echo ❌ 错误: 未找到 Yazi。请确保 Yazi 已正确安装。
        echo 💡 提示: 运行 'winget install sxyazi.yazi' 来安装
        pause
    ) else (
        yazi
    )
)

pause
