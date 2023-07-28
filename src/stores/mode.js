import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'

const useModeStore = defineStore('mode', () => {
  const mode = reactive({
    m: "mg",
  })

  const isModeMg = computed(() => mode.m == 'mg')

  function setModeMg() {
    mode.m = "mg"
  }

  function setModeMk() {
    mode.m = "mk"
  }

  return { isModeMg, setModeMg, setModeMk }
})

export { useModeStore }
