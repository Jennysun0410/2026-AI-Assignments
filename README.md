# 2026-AI-Assignments

DITLDESIGN AI 訓練課程作業繳交平台。每位學生透過 Fork + PR 流程繳交作業，審核通過後自動發布至展示頁面。

→ **[作業展示頁面](https://drhhtang-pixel.github.io/2026-AI-Assignments/)**　　→ **[繳交說明與 Git 教學](git-guide.html)**

---

## 繳交步驟

### 第一步：Fork 這個 Repo

1. 點擊右上角 **Fork** 按鈕，將本 repo fork 到你的帳號下。
2. 到你自己的 fork 頁面，點 **Code → Clone** 複製網址。

### 第二步：Clone 到本機

```bash
git clone <你的 fork 網址>
cd 2026-AI-Assignments
```

### 第三步：建立繳交分支

分支名稱格式：`submission/<學號-姓名>`（例：`submission/M11234567-王小明`）

```bash
git checkout -b submission/M11234567-王小明
```

### 第四步：新增作業檔案

在 `submissions/` 下建立以**你的學號-姓名**命名的目錄。`thumbnail.png` 必填，作業主檔**擇一**放入：

**選項 A — 靜態 HTML 作業**（直接上傳網頁檔案）
```
submissions/
└── M11234567-王小明/
    ├── index.html       ← 作業網頁主檔（需包含 <title> 標籤）
    └── thumbnail.png    ← 作業截圖（≤ 500 KB）
```
> 其他輔助檔案（CSS、JS、圖片）可一併放在同一目錄下。

**選項 B — 外部部署連結**（Vercel / Netlify / GitHub Pages）
```
submissions/
└── M11234567-王小明/
    ├── url.txt          ← 第一行填入 https:// 開頭的部署網址
    └── thumbnail.png    ← 作業截圖（≤ 500 KB）
```
`url.txt` 內容範例：
```
https://my-ai-project.vercel.app
```

### 第五步：Commit 並 Push

```bash
git add submissions/M11234567-王小明/
git commit -m "add submission: M11234567-王小明"
git push origin submission/M11234567-王小明
```

### 第六步：開啟 Pull Request

1. 前往 GitHub 上**你的 fork**，點擊 **Compare & pull request**。
2. 確認目標 repo 是 `drhhtang-pixel/2026-AI-Assignments`，目標分支是 `main`。
3. 依照 PR 模板填寫確認清單，送出 PR。

### 第七步：等待 CI 檢查與老師審核

- 系統自動執行驗證檢查（目錄命名、必要檔案、縮圖大小）。
- 老師審核通過後 merge，作業即自動出現在展示頁面。

---

## 目錄命名規則

| 規則 | 範例 |
|------|------|
| 格式：`<學號>-<姓名>`，以連字號分隔，無空格 | `M11234567-王小明` |
| 英文姓名亦可 | `B10901234-AliceWang` |
| 不可使用底線或空格 | ❌ `M11234567_王小明`、`M11234567 王小明` |

---

詳細 Git 概念說明與常見錯誤，請參閱 **[繳交作業流程說明](git-guide.html)**。
