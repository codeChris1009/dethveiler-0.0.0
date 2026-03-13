# 文件標準規範

本規範定義 `docs/` 內所有功能文件的固定格式、用字、章節順序與風格。

## 1. Naming and Tone 命名與語氣

- 文件標題格式：`# <功能名稱> - <功能定位>`
- H2 標題格式：`## <img ... /> <English Title> <中文標題>`
- 語氣：技術教學、精準、避免口語化
- 用字統一：
  - 使用「文件」，不使用「文檔」
  - 使用「程式碼解析」，不使用「完整程式碼解析」
  - 使用「流程圖」，不使用「完整流程示意圖」
  - 使用「使用方式」，不使用「快速開始」

## 2. Fixed Section Order 固定章節順序

每份功能文件應維持以下章節順序：

1. Overview 功能概述
2. Core Concepts 核心概念
3. Code Walkthrough 程式碼解析
4. Usage 使用方式
5. Flow Diagram 流程圖
6. Key Points 重點總結
7. Advanced Topics 進階概念

## 3. Icon Rules 圖標使用規則

- 一律使用本地圖標：`docs/docIconImg/`
- 禁止再使用 CDN URL
- `docs/*.md` 使用路徑：`./docIconImg/<icon>.svg`
- `docs/apis/*.md` 使用路徑：`../docIconImg/<icon>.svg`
- 常用章節圖標對應：
  - 功能概述：`book-open-duotone.svg`
  - 核心概念：`target-duotone.svg`
  - 程式碼解析：`wrench-duotone.svg`
  - 使用方式：`note-pencil-duotone.svg`
  - 流程圖：`magnifying-glass-duotone.svg`
  - 重點總結：`lightbulb-duotone.svg`
  - 進階概念：`rocket-duotone.svg`

## 4. Markdown Rules 撰寫規範

- 程式碼區塊需標註語言（`tsx`、`typescript`、`bash`）
- 列表符號統一使用 `-`
- 章節間使用 `---` 分隔
- 文字與程式碼需對應專案實作，不寫過期流程

## 5. Maintenance Rules 維護原則

- 功能行為變更時，必須同步更新對應文件
- 新增文件時，先套用模板再填入內容
- 變更後檢查是否仍有 CDN icon 連結殘留
