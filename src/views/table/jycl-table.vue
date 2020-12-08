<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.sName" :placeholder="$t('table.sName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.sMarket" :placeholder="$t('table.sMarket')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button style="margin-left: 5px" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
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
      <el-table-column :label="$t('table.sName')" width="120px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.sName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sMarket')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sMarket }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sStatusA')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sDownBef')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sDownBef }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sDownAft')" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sDownAft }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sDownRange')" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sDownRange }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sDownszBef')" width="110px" align="center">
        <template slot-scope="{row}">
          <span class="down-type">{{ row.sDownszBef }}</span>
        </template>
      </el-table-column>
        <el-table-column :label="$t('table.sDownszAft')" width="110px" align="center">
          <template slot-scope="{row}">
            <span class="down-type">{{ row.sDownszAft }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.sUpBef')" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sUpBef }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.sUpAft')" width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sUpAft }}</span>
          </template>
      </el-table-column>
      <el-table-column :label="$t('table.sUpRange')" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sUpRange }}</span>
        </template>
      </el-table-column>
        <el-table-column :label="$t('table.sUpszBef')" width="110px" align="center">
          <template slot-scope="{row}">
            <span class="up-type">{{ row.sUpszBef }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.sUpszAft')" width="110px" align="center">
          <template slot-scope="{row}">
            <span class="up-type">{{ row.sUpszAft }}</span>
          </template>
        </el-table-column>


    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, createStock, updateStock, updateStockDp, formula, estimate, listQuantify } from '@/api/article'
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
  name: 'JyclTable',
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
      importanceOptions: ['金融板块', '医疗板块', '商业百货', '工程建设','交运物流', '科技板块', '消费板块', '农业板块', '金属板块', '军工板块', '安防设备', '旅游酒店', '酿酒行业', '汽车行业', '专用设备'],
      calendarTypeOptions,
      sBelongTypeOptions,
      sAbilityTypeOptions,
      sStatusTypeOptions,
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
      listQuantify(this.listQuery).then(response => {
        this.list = response.data.pageResult.list
        this.total = response.data.pageResult.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.1 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handlePicture(row) {
      const url = "http://image.sinajs.cn/newchart/daily/n/" + (row.sBelong = 1 ? 'sh':'sz') + row.sCode + ".gif"
      console.log(url)
      window.open(url, row.sName)
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
        const tHeader = ['股票名称', '大盘状态', '个股状态', '下跌点数-（%）', '下跌点数+（%）','下跌范围','买入-(元)','买入+(元)',
          '上行点数-（%）', '上行点数+（%）', '上行范围','卖出-(元)','卖出+(元)']
        const filterVal = ['sName', 'sMarket', 'sStatus', 'sDownBef', 'sDownAft', 'sDownRange', 'sDownszBef',
          'sDownszAft', 'sUpBef', 'sUpAft', 'sUpRange','sUpszBef', 'sUpszAft']
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
