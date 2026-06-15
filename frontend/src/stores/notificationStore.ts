import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const visible = ref(false)
  const type = ref<'success' | 'error' | 'info' | 'warning'>('info')
  const title = ref('')
  const message = ref('')
  let timer: ReturnType<typeof setTimeout> | null = null

  function show(opts: { type?: string; title?: string; message: string; duration?: number }) {
    type.value = (opts.type as any) || 'info'
    title.value = opts.title || ''
    message.value = opts.message
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, opts.duration || 4000)
  }

  function hide() {
    visible.value = false
    if (timer) clearTimeout(timer)
  }

  return { visible, type, title, message, show, hide }
})
