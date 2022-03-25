<template>
  <button @click="exportJson">导出</button>
  <button @click="clear">清空</button>
  <button @click="importScene">导入</button>
  <div class="three-canvas" ref="threeRef"></div>
</template>

<script setup lang="ts">
  import { Engine } from './ts/Engine'
  import { box, sphere, cyline, moreSphere } from './ts/AllObject';
  import { onMounted, ref } from 'vue'
  const threeRef = ref({} as HTMLElement)
  let ENG: Engine = {} as Engine

  onMounted(() => {
    ENG = new Engine(threeRef.value)
    console.log();
    
    ENG.addObject(box, sphere, cyline)
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        ENG.addObject(moreSphere(5 * i, 5 * j, 10 * i, ENG.scene))
      }
    }
  })
  let exportJson = () => {
    ENG.exportJson()
  }
  let clear = () => {
    ENG.clearScene()
  }
  let importScene = () => {
    ENG.importScene()
  }
</script>

<style>
body {
  height: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}


html {
  height: 100%;
  box-sizing: border-box;
}

#app {
  height: 100%;
  font-size: 16px;
}

.three-canvas {
  width: 100%;
  height: 100%;
}
</style>
