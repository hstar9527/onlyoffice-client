<!--
 * @Author: Mr.Li
 * @Date: 6/9/2025 14:25
 * @Description: index
-->
<template>
  <div class="container">
    <el-button type="primary" :loading="uploadLoading" @click="handleUpload"
      >上传文档</el-button
    >
    <el-button type="primary" @click="handleCreateContract">创建合同</el-button>
    <el-table style="margin-top: 15px" ref="tableRef" :data="fileList" border>
      <el-table-column align="center" label="序号" width="70" fixed="left">
        <template #default="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="文件" prop="fileUrl">
        <template #default="{ row }">
          <div class="filename">
            <img class="icon" :src="iconMap[row.fileType]" alt="" />
            <div class="name">{{ row.fileUrl }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200px">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            link
            size="small"
            @click="handlePreview(row)"
            >预览</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <input
      type="file"
      ref="fileRef"
      accept=".pptx,.xlsx,.pdf,.docx"
      hidden
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import axios from "axios";
import IconDocx from "@/assets/icon_docx.svg";
import IconPdf from "@/assets/icon_pdf.svg";
import IconPptx from "@/assets/icon_pptx.svg";
import iconXlsx from "@/assets/icon_xlsx.svg";

const fileList = ref([]);
const fileRef = ref();
const uploadLoading = ref(false);
const iconMap = {
  docx: IconDocx,
  xlsx: iconXlsx,
  pptx: IconPptx,
  pdf: IconPdf,
};
// localStorage.setItem("files", JSON.stringify([
//   {fileType: 'docx', fileUrl: "http://10.10.18.54:10001/winter/0e2996cb-1eba-4595-80c6-9a183761aa72.docx"},
//   {fileType: 'xlsx', fileUrl: "http://10.10.18.54:10001/winter/1f9e7a04-6283-4df2-be66-ef838f6eefb9.xlsx"},
//   {fileType: 'pptx', fileUrl: "http://10.10.18.54:10001/winter/7d42ea4d-5362-4d3d-a95b-0e734bc37ad5.pptx"},
//   {fileType: 'pdf', fileUrl: "http://10.10.18.54:10001/winter/fa10ed40-13a7-4092-8ecd-7ee1c0b7c7f9.pdf"},
// ]))

function init() {
  const data = localStorage.getItem("files") || "[]";
  fileList.value = JSON.parse(data);
}

init();

function handleUpload() {
  fileRef.value.click();
}

const router = useRouter();
function handleCreateContract() {
  router.push("/contract/create");
}

function handleEdit(row) {
  // window.open(`/#/office?fileUrl=${encodeURIComponent(row.fileUrl)}&mode=EDIT`);
  window.open(`/#/office?fileUrl=${encodeURIComponent("hxx.docx")}&mode=EDIT`);
}

function handlePreview(row) {
  window.open(`/#/office?fileUrl=${encodeURIComponent(row.fileUrl)}&mode=VIEW`);
}

async function onFileChange(e) {
  try {
    uploadLoading.value = true;
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("file", file);
    fileRef.value.value = null;
    // 这里自行配置上传接口
    const res = await axios({
      url: "http://localhost:9002/api/upload",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      timeout: 1000 * 20,
    });
    uploadLoading.value = false;
    fileList.value.push({
      fileUrl: res.data.data,
      fileType: file.name.split(".").pop(),
    });
    localStorage.setItem("files", JSON.stringify(fileList.value));
  } catch (e) {
    uploadLoading.value = false;
    console.error(e);
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
}

.filename {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .name {
  }
}
</style>
