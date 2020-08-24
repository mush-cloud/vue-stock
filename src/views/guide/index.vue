<template>
  <div class="app-container">
    <aside>
      {{ $t('guide.description') }}
      <br/>
      {{ $t('guide.description2') }}
      <a href="https://github.com/mush-cloud" target="_blank">~東京文艺青年.</a>
      <br/>
      {{ $t('guide.description3') }}
    </aside>
<!--    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">-->
<!--      {{ $t('guide.button') }}-->
<!--    </el-button>-->
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
