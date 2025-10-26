<!--
 * @Author: Mr.Li
 * @Date: 2025-08-13 09:52
 * @Description: index
-->
<template>
  <div class="container">
    <div class="wrapper">
      <h1 style="text-align: center; margin-bottom: 30px; font-size: 30px; font-family: '黑体',serif">房屋租赁合同</h1>
      <p>
        <span style="margin-right: 8px">出租方（甲方）<input v-model="form.ownerName"/></span>
        <span>身份证号 <input style="width: 220px" v-model="form.ownerIdCard"/></span>
      </p>
      <p>
        <span style="margin-right: 8px">承租方（乙方）<input v-model="form.customerName"/></span>
        <span>身份证号 <input style="width: 220px" v-model="form.customerIdCard"/></span>
      </p>
      <p>
        根据《中华人民共和国合同法》及相关法律法规的规定，甲乙双方在平等自愿基础上就甲方将房屋出租给乙方使用，乙方承租甲方房屋事宜，为明确双方权利义务，经协商一致，订立本合同。
      </p>
      <p>
        一、房屋坐落 <input style="width: 600px" v-model="form.address"/>
      </p>
      <p>
        二、房屋租期为&nbsp;
        <div class="date">
          <el-date-picker
              style="width: 300px"
              type="daterange"
              v-model="form.rentDate"
              range-separator="至"
              format="YYYY年MM月DD日"
              value-format="YYYY年MM月DD日"
          />
        </div>&nbsp;
        。乙方租赁房屋作为居住使用。租赁期满，甲方有权利收回出租的房屋，乙方应如期归还。乙方要求续租，则必须在租赁期满日一个月前通知甲方，经甲方同意后，乙方在交清全年租金的同时，重新签订租赁合同。如果乙方不再租房，须提前3个月告知甲方。
      </p>
      <p>
        三、为保证本合同的执行，乙方须向甲方一次交付押金3000元整。
      </p>
      <p>
        四、本合同的租金按年支付，支付方式为现金，先付后用。乙方须一次向甲方交足全年租金叁仟元元整，租金交付日为2025年08月16日前。
      </p>
      <p>
        五、在租用期间所发生的水费、电费、物业费、取暖费、天然气费、有线电视收视费等费用，由乙方自行负担。
      </p>
      <p>
        六、甲乙双方的权利和责任：
      </p>
      <p>
        1、甲乙双方在合同存续期间均无权单方终止履行合同，如有异议应由双方协商解决。协商不成时，不影响本合同的执行（本条第四款情况除外）
      </p>
      <p>
        2、乙方在居住期间应维护好房屋结构、设备、物品和门窗的完整。如有损坏，需在合同期满日之前恢复原貌，由此所发生的费用由乙方负担；设备、物品如有损坏，须照价赔偿。
      </p>
      <p>
        3、乙方在租房期间，应保持屋内整洁，不得使用煤作燃料；应注意各方面的安全，如有不安全隐患或由此引发任何后果均由乙方一方承担。
      </p>
      <p>
        4、乙方在租住期间不得把此房屋转借、转租给他人使用，不得改变租赁用途或利用此房屋进行违法犯罪等性质的活动，不得改变房屋结构和损坏房屋。如有上述情况发生，甲方有权单方终止合同的执行，由此给甲方造成的损失由乙方承担赔偿。
      </p>
      <p>
        5、租赁的房屋如因不可抗拒的原因导致损毁或因市政建设需要拆除和改建造成损失的，甲乙双方互不承担责任。因此而终止合同时，租金按实际使用时间计算。
      </p>
      <p>
        6、双方电话号码变更应及时通知对方。
      </p>
      <p>
        七、本合同未尽事宜，由双方协商解决。
      </p>
      <p>
        八、本合同共两页，一式两份，由甲、乙双方各持壹份。
      </p>
      <div style="float: left">
        <p style="margin-top: 40px; padding: 8px 0">
          甲方（签章）：
        </p>
        <p>
          联系电话：
        </p>
        <p>
          日期： 日期：
        </p>
      </div>
      <div style="float: right; padding-right: 240px">
        <p style="margin-top: 40px; padding: 8px 0">
          乙方（签章）：
        </p>
        <p>
          联系电话：
        </p>
        <p>
          日期：
        </p>
      </div>
    </div>
    <div class="btn-wrapper">
      <el-button type="primary" :loading="saveLoading" @click="save">生成合同</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import {ElMessage} from 'element-plus'

const form = ref({
  ownerName: null,
  ownerIdCard: null,
  customerName: null,
  customerIdCard: null,
  address: null,
  rentDate: []
})
const saveLoading = ref(false)

async function save() {
  const {ownerName, ownerIdCard, customerName, address, customerIdCard, rentDate} = form.value
  const data = {
    ownerName,
    ownerIdCard,
    customerName,
    customerIdCard,
    address,
  }
  if (Array.isArray(rentDate) && rentDate.length) {
    data.rentStartDate = rentDate[0]
    data.rentEndDate = rentDate[1]
  }
  saveLoading.value = true
  const res = await axios({
    url: 'http://localhost:9002/api/word/generate',
    method: 'post',
    data
  })
  saveLoading.value = false
  ElMessage.success('生成成功')
  const fileData = localStorage.getItem("files")
  const fileList = JSON.parse(fileData)
  fileList.push({fileType: 'docx', fileUrl: res.data.data})
  localStorage.setItem("files", JSON.stringify(fileList))
}

const router = useRouter()
function handleCancel(){
  router.back()
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  padding: 30px 0 150px 0;
  background: #f5f5f5;
  color: #000;
}

.wrapper {
  width: 850px;
  margin: 0 auto;
  //border: 1px dashed black;
  padding: 50px;
  background: white;
  overflow: hidden;
}

p {
  //font-size: 18px;
  padding: 8px 0;
}

input {
  background: #e0e0e0;
  border: none;
  outline: none;
  height: 32px;
  line-height: 32px;
  text-indent: 5px;
  border-radius: 3px;
}

.date {
  //border: 1px solid red;
  display: inline-block;

  :deep(.el-date-editor) {
    background: #e0e0e0;
  }
}

.btn-wrapper {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--el-bg-color);
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
  //border: 1px dashed red;
  padding: 20px 0;
  text-align: center;
  z-index: 100;
}
</style>