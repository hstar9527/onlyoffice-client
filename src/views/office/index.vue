<!--
 * @Author: Mr.Li
 * @Date: 6/9/2025 14:25
 * @Description: index
-->
<template>
  <div class="editor-wrapper">
    <div id="office-editor"></div>
  </div>
</template>

<script setup>
import axios from "axios";
import IconDocx from "@/assets/icon_docx.svg";
import IconPdf from "@/assets/icon_pdf.svg";
import IconPptx from "@/assets/icon_pptx.svg";
import iconXlsx from "@/assets/icon_xlsx.svg";

const route = useRoute();

const fileMap = {
  docx: {
    icon: IconDocx,
    title: "WORD",
  },
  pdf: {
    icon: IconPdf,
    title: "PDF",
  },
  pptx: {
    icon: IconPptx,
    title: "PDF",
  },
  xlsx: {
    icon: iconXlsx,
    title: "EXCEL",
  },
};
onMounted(() => {
  // 初始化浏览器icon和标题
  const { fileUrl = "" } = route.query;
  const suffix = fileUrl.substring(fileUrl.lastIndexOf(".") + 1);
  const fileType = suffix.split("\\?")[0];
  const { icon, title } = fileMap[fileType] || {
    icon: IconDocx,
    title: "DOCUMENT",
  };
  document.title = title;
  const link = document.querySelector('link[rel="icon"]');
  if (link) {
    link.href = icon;
  }
});

let docEditor;
let config;

function innerAlert(message, inEditor) {
  console.log(message);
  if (inEditor && docEditor) {
    docEditor.showMessage(message);
  }
}

// the application is loaded into the browser
function onAppReady() {
  innerAlert("Document editor ready");
}

// 修改文档时调用的函数。使用以下参数调用它：{"data": true} --适用于当前用户正在编辑文档时
var onDocumentStateChange = function (event) {
  var title = document.title.replace(/\*$/g, "");
  document.title = title + (event.data ? "*" : "");
};

// an error or some other specific event occurs
function onError(event) {
  if (event) innerAlert(event.data);
}

// 显示 错误 后调用的函数，当使用旧的 document.key 值打开文档进行编辑时，该值用于编辑以前的文档版本并成功保存。调用此事件时，必须使用新的 document.key 重新初始化编辑器
function onOutdatedVersion(event) {
  location.reload(true);
}

// 通过 meta 命令更改文档的元信息时调用的函数。
// 文档的名称在 data.title 参数中发送。收藏 图标高亮状态在 data.favorite 参数中发送。
// 当用户点击 收藏 图标时，调用 setFavorite 方法更新收藏图标高亮状态信息如果未声明该方法，则收藏图标不会更改。
function onMetaChange(event) {
  if (event.data.favorite !== undefined) {
    var favorite = !!event.data.favorite;
    var title = document.title.replace(/^\☆/g, "");
    document.title = (favorite ? "☆" : "") + title;
    docEditor.setFavorite(favorite);
  }
  innerAlert("onMetaChange: " + JSON.stringify(event.data));
}

function onRequestUsers(event) {
  const c = event.data.c;
  const id = event.data.id;
  console.log("onRequestUsers", event);
}

async function initEditor() {
  const { fileUrl, mode } = route.query;
  const res = await axios({
    url: "http://localhost:9002/api/config",
    method: "get",
    params: { fileUrl, mode },
  });
  config = res.data.data;
  // 配置事件
  config.events = {
    // 应用程序被加载到浏览器中
    onAppReady: onAppReady,
    // 文档被加载到文档编辑器中
    onDocumentReady: () => {},
    // 修改文档时调用的函数。使用以下参数调用它：{"data": true} --适用于当前用户正在编辑文档时
    onDocumentStateChange,
    // 发生错误或其他特定事件时调用的函数。错误消息在 data 参数中发送
    onError,
    // 显示 错误 后调用的函数，当使用旧的 document.key 值打开文档进行编辑时，该值用于编辑以前的文档版本并成功保存。调用此事件时，必须使用新的 document.key 重新初始化编辑器
    onOutdatedVersion,
    // 通过 meta 命令更改文档的元信息时调用的函数。
    onMetaChange,
    // onRequestUsers,
  };
  console.log(config);
  docEditor = new DocsAPI.DocEditor("office-editor", config);
}

initEditor();
</script>
<style scoped lang="scss">
.editor-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
