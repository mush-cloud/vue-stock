<template>
  <div class="app-container">
    <aside>
      <a href="https://github.com/mush-cloud" target="_blank">~東京文艺青年.</a>
      {{ $t('guide.description') }}
      <br/>
      <a href="https://github.com/mush-cloud" target="_blank">begin`</a>
      <br/>
      {{ $t('guide.description2') }}
      <br/>
      {{ $t('guide.description3') }}
      <br/>
      {{ $t('guide.description4') }}
      <br/>
      {{ $t('guide.description5') }}
      <br/>
      {{ $t('guide.description6') }}
      <br/>
      {{ $t('guide.description7') }}
      <br/>
      {{ $t('guide.description8') }}
      <br/>
      <a href="https://github.com/mush-cloud" target="_blank">end`</a>
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
