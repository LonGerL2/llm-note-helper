const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL_NAME = "qwen3.6-plus";

const apiKeyInput = document.getElementById("apiKey");
const toggleKeyBtn = document.getElementById("toggleKey");
const modeSelect = document.getElementById("mode");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const statusBox = document.getElementById("status");
const errorBox = document.getElementById("errorBox");
const chatList = document.getElementById("chatList");

let conversation = [
  {
    role: "system",
    content:
      "你是一个学习笔记整理助手。请使用清晰、准确、适合学生复习的中文回答。首次整理时优先输出：一、内容摘要；二、核心知识点；三、考试重点；四、复习问题。后续用户提出修改建议时，需要结合上一轮内容继续修改，不要把任务当成全新问题。"
  }
];
let latestAssistantReply = "";

function getModeInstruction() {
  const modeMap = {
    summary: "请整理为摘要、知识点、考试重点和复习问题。",
    exam: "请整理成考试复习版，突出易考点、概念辨析和记忆提示。",
    table: "请尽量整理成表格，便于对比和背诵。",
    brief: "请压缩成简短版，保留最重要的信息。"
  };
  return modeMap[modeSelect.value] || modeMap.summary;
}

function showStatus(message, isLoading = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("loading", isLoading);
}

function showError(message) {
  errorBox.hidden = false;
  errorBox.textContent = message;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
}

function renderMessage(role, content) {
  const empty = chatList.querySelector(".empty-state");
  if (empty) empty.remove();

  const article = document.createElement("article");
  article.className = `message ${role}`;

  const roleLabel = document.createElement("span");
  roleLabel.className = "role";
  roleLabel.textContent = role === "user" ? "我" : "学习笔记整理助手";

  const contentNode = document.createElement("div");
  contentNode.textContent = content;

  article.appendChild(roleLabel);
  article.appendChild(contentNode);
  chatList.appendChild(article);
  article.scrollIntoView({ behavior: "smooth", block: "end" });
}

function resetChat() {
  conversation = [conversation[0]];
  latestAssistantReply = "";
  userInput.value = "";
  chatList.innerHTML = `
    <div class="empty-state">
      <strong>还没有内容</strong>
      <span>请输入 API Key 和课程笔记，点击“生成 / 继续修改”。</span>
    </div>
  `;
  clearError();
  showStatus("已清空，可以重新开始。", false);
}

async function sendMessage() {
  const apiKey = apiKeyInput.value.trim();
  const text = userInput.value.trim();

  clearError();

  if (!apiKey) {
    showError("请先输入阿里云百炼 API Key。API Key 只保存在当前页面内存中，不会写入代码。");
    return;
  }

  if (!text) {
    showError("请输入课程笔记或后续修改建议。首次使用建议粘贴一段完整课程笔记。");
    return;
  }

  const userMessage = `${getModeInstruction()}\n\n用户输入：${text}`;
  conversation.push({ role: "user", content: userMessage });
  renderMessage("user", text);

  sendBtn.disabled = true;
  clearBtn.disabled = true;
  showStatus("模型正在生成，请稍候……", true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: conversation,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const detail = data?.error?.message || data?.message || `HTTP 状态码：${response.status}`;
      throw new Error(detail);
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error("接口已返回结果，但没有读取到模型回复内容。请检查模型名称和接口权限。");
    }

    conversation.push({ role: "assistant", content: reply });
    latestAssistantReply = reply;
    renderMessage("assistant", reply);
    userInput.value = "";
    showStatus("生成完成。可以继续输入修改建议进行多轮调整。", false);
  } catch (error) {
    conversation.pop();
    showError(
      `请求失败：${error.message}\n\n常见原因：API Key 填写错误、百炼平台未开通对应模型、账户余额不足、模型 ID 不可用，或浏览器跨域限制。`
    );
    showStatus("生成失败，请根据错误提示检查后重试。", false);
  } finally {
    sendBtn.disabled = false;
    clearBtn.disabled = false;
  }
}

toggleKeyBtn.addEventListener("click", () => {
  const visible = apiKeyInput.type === "text";
  apiKeyInput.type = visible ? "password" : "text";
  toggleKeyBtn.textContent = visible ? "显示" : "隐藏";
});

sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", resetChat);

copyBtn.addEventListener("click", async () => {
  clearError();
  if (!latestAssistantReply) {
    showError("当前还没有可复制的模型回复。请先生成一次内容。");
    return;
  }

  try {
    await navigator.clipboard.writeText(latestAssistantReply);
    showStatus("最新回复已复制到剪贴板。", false);
  } catch (error) {
    showError("复制失败，请手动选中回复内容复制。" );
  }
});

userInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    sendMessage();
  }
});
