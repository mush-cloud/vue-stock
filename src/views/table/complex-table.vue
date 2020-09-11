<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sName" :placeholder="$t('table.sName')" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sIndustry" :placeholder="$t('table.sIndustry')" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sFeature" :placeholder="$t('table.sFeature')" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sAbility" :placeholder="$t('table.sAbility')" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in sAbilityTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sStatus" :placeholder="$t('table.sStatus')" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in sStatusTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sBelong" :placeholder="$t('table.sBelong')" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in sBelongTypeOptions " :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
<!--      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-first-aid-kit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-picture-outline" @click="handlePictureDp">
        {{ $t('table.szzs') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-data-line" @click="updateStockDp">
        {{ $t('table.dpzs')}}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
      <el-button v-waves class="filter-item" type="success" icon="el-icon-paperclip" @click="linkTrack">
        {{ $t('table.linkTrack') }}
      </el-button>
<!--      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        {{ $t('table.reviewer') }}
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="id" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
    <!--  <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('table.sName')" max-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handlePicture(row)">{{ row.sName }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
          &nbsp;&nbsp;&nbsp;
          <el-tag >{{ row.sFeature}}</el-tag>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" size="mini" @click="sinaApi(row)">
            {{ $t('table.diagnosis') }}
          </el-button>
<!--          <el-tag >{{ $t('table.diagnosis') }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sCode')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sIndustry')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sIndustry }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sSupport')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sSupport }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sResistance')" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sResistance }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sBelong')" width="100px" align="center">
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.sBelong }}</span>-->
<!--        </template>-->
        <template slot-scope="{row}">
          <el-tag :type="row.sBelong | sBelongFilter">
            {{sBelongType[row.sBelong]}}
          </el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('table.sAbility')" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in +row.sAbility" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
<!--      <el-table-column :label="$t('table.readings')" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('table.sStatus')" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.sStatus | statusFilter">
            {{ row.sStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleFormula(row)">
            {{ $t('table.formula') }}
          </el-button>
          <el-button type="success" size="mini" @click="handleEstimate(row)">
            {{ $t('table.estimate') }}
          </el-button>
       <!--   <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            {{ $t('table.publish') }}
          </el-button> -->
       <!--   <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            {{ $t('table.draft') }}
          </el-button> -->
       <!--   <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">

        <el-form-item :label="$t('table.sName')" prop="sName">
          <el-input v-model="temp.sName" />
        </el-form-item>
        <el-form-item :label="$t('table.sCode')" prop="sCode">
          <el-input v-model="temp.sCode" />
        </el-form-item>
        <el-form-item :label="$t('table.sIndustry')" prop="sIndustry">
          <el-select v-model="temp.sIndustry" class="filter-item" placeholder="Please select">
            <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sFeature')" prop="sFeature">
          <el-select v-model="temp.sFeature" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sResistance')" prop="sResistance">
          <el-input v-model="temp.sResistance" />
        </el-form-item>
        <el-form-item :label="$t('table.sSupport')" prop="sSupport">
          <el-input v-model="temp.sSupport" />
        </el-form-item>
        <el-form-item :label="$t('table.sBelong')" prop="sBelong">
          <el-select v-model="temp.sBelong" class="filter-item" placeholder="Please select">
            <el-option v-for="item in sBelongTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sStatus')" prop="sStatus">
          <el-select v-model="temp.sStatus" class="filter-item" placeholder="Please select">
            <el-option v-for="item in sStatusTypeOptions" :key="item.key" :label="item.key" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sAbility')">
          <el-rate v-model="temp.sAbility" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
<!--        <el-form-item :label="$t('table.remark')">-->
<!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="次日价格估算">
<!--      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">-->
<!--        <el-table-column prop="key" label="Channel" />-->
<!--        <el-table-column prop="pv" label="Pv" />-->
<!--      </el-table>-->
      <el-form ref="dataForm" :rules="rules" :model="tempEstimate" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
      <el-form-item :label="$t('table.spj')" prop="spj">
        <el-input v-model="tempEstimate.spj" />
      </el-form-item>
      <el-form-item :label="$t('table.minPrice')" prop="minPrice">
        <el-input v-model="tempEstimate.minPrice" />
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="executeEstimate()">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createStock, updateStock, updateStockDp, formula, estimate, linkTrackApi} from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'

const calendarTypeOptions = [
  { key: '大盘走势股', display_name: '大盘走势股' },
  { key: '大盘走势股L', display_name: '大盘走势股L' },
  { key: '大盘走势股R', display_name: '大盘走势股R' },
  { key: '低估值', display_name: '低估值' },
  { key: '个性股', display_name: '个性股' },
  { key: '个性股L', display_name: '个性股L' },
  { key: '个性股R', display_name: '个性股R' },
  { key: '抗跌股', display_name: '抗跌股' },
  { key: '抗跌股L', display_name: '抗跌股L' },
  { key: '抗跌股R', display_name: '抗跌股R' },
  { key: '热点概念', display_name: '热点概念' }
]

const sBelongTypeOptions = [
  { key: '1', display_name: '沪' },
  { key: '2', display_name: '深' }
]

const sBelongType = {
  1: "沪",
  2: "深"
}
const sAbilityTypeOptions = [
  { key: '1', display_name: '❤' },
  { key: '2', display_name: '❤❤' },
  { key: '3', display_name: '❤❤❤' },
]

const sStatusTypeOptions = [
  { key: '正常'},
  { key: '预警'},
  { key: '黑名单'},
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
        '正常': 'success',
        '预警': 'info',
        '黑名单': 'danger',
      }
      return statusMap[status]
    },
    sBelongFilter(sBelong) {
      const statusMap = {
        1: '沪',
        2: '深',
      }
      return statusMap[sBelong]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sName: undefined,
        sIndustry: undefined,
        sFeature: undefined,
        sStatus: undefined,
        sAbility: undefined,
        sort: '+id'
      },
      importanceOptions: ['金融板块', '医疗板块', '科技板块', '消费板块', '农业板块', '金属板块', '军工板块', '安防设备', '旅游酒店', '酿酒行业', '汽车行业', '专用设备'],
      calendarTypeOptions,
      sBelongTypeOptions,
      sAbilityTypeOptions,
      sStatusTypeOptions,
      sBelongType,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        sName: '',
        sCode: '',
        sIndustry: '',
        sFeature: '',
        sStatus: '',
        sAbility: '1',
        sSupport: '',
        sResistance: '',
        sBelong: '1'
      },
      tempEstimate: {
        stockName: '',
        spj: '',
        minPrice: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '添加'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        sName: [{ required: true, message: 'sName is required', trigger: 'change' }],
        sCode: [{ required: true, message: 'sCode is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        minPrice: [{ required: true, message: 'minPrice is required', trigger: 'blur' }],
        spj: [{ required: true, message: 'minPrice is required', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.info('返回数据',response.data.pageResult);
        this.list = response.data.pageResult.list
        this.total = response.data.pageResult.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.1 * 1000)
      })
    },
    updateStockDp() {
      updateStockDp().then(response => {
        Message({
          message: response.msg,
          type: 'success',
          duration: 1.5 * 1000
        })
    })
    },
    linkTrack() {
      linkTrackApi().then(response => {
        Message({
          message: response.msg,
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlePicture(row) {
      const url = "http://image.sinajs.cn/newchart/daily/n/" + (row.sBelong == 1 ? 'sh':'sz') + row.sCode + ".gif"
      console.log(url)
      window.open(url, row.sName)
    },
    handlePictureDp() {
      const url = "http://image.sinajs.cn/newchart/daily/n/sh000001.gif"
      console.log(url)
      window.open(url, '大盘指数')
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        sName: '',
        sCode: '',
        sIndustry: '',
        sFeature: '',
        sStatus: '',
        sAbility: '1',
        sSupport: '',
        sResistance: '',
        sBelong: '1'
      }
    },
    resTtempEstimate() {
      this.tempEstimate = {
        stockName: '',
        spj: '',
        minPrice: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        //  this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createStock(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    sinaApi(row) {
      const url = 'http://finance.sina.cn/finance_zt/financeapp/hqzg.shtml?stockcode='+(row.sBelong == 1?'sh':'sz')+row.sCode
      window.open(url, '智能诊股')
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateStock(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleFormula(row) { //量化公式
      formula(row.sName).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleEstimate(row) {
      this.resTtempEstimate()
      this.tempEstimate.stockName = row.sName
      this.dialogPvVisible = true
    },
    executeEstimate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempEstimate)
          estimate(tempData.stockName, tempData.spj, tempData.minPrice).then(() => {
            this.dialogPvVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['股票名称', '代码', '行业板块', '下行支撑位', '上行阻力位', '市场']
        const filterVal = ['sName', 'sCode', 'sIndustry', 'sFeature', 'sSupport', 'sBelong']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
