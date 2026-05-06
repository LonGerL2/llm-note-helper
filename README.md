# 多轮学习笔记整理助手

这是一个纯前端 Web LLM 应用，使用 HTML、CSS、JavaScript 编写，不包含自建后端、数据库、登录系统或服务器转发。

## 功能说明

- 页面标题和使用说明
- 阿里云百炼 API Key 输入框
- 用户课程笔记输入区
- 生成 / 继续修改按钮
- 模型回复显示区
- 加载中提示
- 错误提示
- 清空对话按钮
- 支持多轮上下文修改
- API Key 不写入代码、不提交仓库、不展示在页面公开区域，仅保存在当前页面内存中

## 模型与接口

- 模型 ID：`qwen3.6-plus`
- 接口：`https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

## 本地运行

直接双击 `index.html` 即可打开页面。也可以使用 VS Code / Cursor / Trae 的 Live Server 插件预览。

## 使用方法

1. 打开网页。
2. 在 API Key 输入框中填写自己的阿里云百炼 API Key。
3. 在输入区粘贴课程笔记。
4. 点击“生成 / 继续修改”。
5. 等待模型生成摘要、知识点、考试重点和复习问题。
6. 后续继续输入“更简短”“改成表格”“增加复习题”等建议，再点击按钮即可多轮修改。

## GitHub Pages 部署步骤

1. 新建 GitHub 仓库，例如：`llm-note-helper`。
2. 上传 `index.html`、`style.css`、`script.js`、`README.md`。
3. 进入仓库 `Settings`。
4. 点击左侧 `Pages`。
5. 在 `Build and deployment` 中选择 `Deploy from a branch`。
6. Branch 选择 `main`，目录选择 `/root`，点击保存。
7. 等待 1 到 3 分钟，GitHub Pages 会生成 HTTPS 链接。
8. 打开链接测试网页是否能正常访问和调用模型。

## 课程群表格填写参考

| 字段 | 内容 |
| --- | --- |
| 姓名 | 填写本人姓名 |
| 学号 | 填写本人学号 |
| 项目名称 | 多轮学习笔记整理助手 |
| 项目链接 | 填写 GitHub Pages 生成的 HTTPS 链接 |

## 注意事项

不要把 API Key 写入任何文件，也不要上传包含密钥的截图。提交前请确认网页可访问、模型可回复、页面没有账号密码或个人隐私信息。
