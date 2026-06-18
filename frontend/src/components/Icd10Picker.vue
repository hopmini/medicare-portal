<template>
  <div class="icd10-picker">
    <div class="icd10-input-group">
      <input
        ref="inputRef"
        v-model="searchCode"
        type="text"
        class="icd10-search-input"
        :placeholder="placeholder"
        @input="onSearch"
        @focus="showDropdown = true"
        @blur="onBlur"
      />
      <button
        v-if="selectedCode"
        type="button"
        class="icd10-clear-btn"
        @click="clearSelection"
        title="Xóa mã ICD-10"
      >
        &times;
      </button>
      <span v-if="selectedCode" class="icd10-selected-name">{{ selectedName }}</span>
    </div>

    <div v-if="showDropdown && filtered.length > 0" class="icd10-dropdown">
      <div
        v-for="(item, idx) in filtered"
        :key="item.code"
        :class="['icd10-item', { 'icd10-item--active': idx === activeIndex }]"
        @mousedown.prevent="selectItem(item)"
        @mouseenter="activeIndex = idx"
      >
        <span class="icd10-code">{{ item.code }}</span>
        <span class="icd10-name">{{ item.name }}</span>
        <span class="icd10-category">{{ item.category }}</span>
      </div>
    </div>
    <div v-if="showDropdown && filtered.length === 0 && searchCode.length > 0" class="icd10-dropdown icd10-empty">
      Không tìm thấy mã ICD-10 phù hợp
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { medicalApi } from '@/services/api'

interface Icd10Item {
  code: string
  name: string
  category: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
}>(), {
  modelValue: '',
  placeholder: 'Tìm mã ICD-10...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', code: string): void
  (e: 'select', code: string, name: string): void
}>()

const inputRef = ref<HTMLInputElement>()
const searchCode = ref(props.modelValue || '')
const selectedCode = ref(props.modelValue || '')
const selectedName = ref('')
const showDropdown = ref(false)
const activeIndex = ref(0)
const items = ref<Icd10Item[]>([])
const filtered = ref<Icd10Item[]>([])

const loadAll = async () => {
  try {
    const res = await medicalApi.get('/Icd10')
    items.value = res.data || []
  } catch {
    items.value = []
  }
}

const onSearch = async () => {
  if (searchCode.value.length < 1) {
    filtered.value = []
    showDropdown.value = false
    return
  }
  try {
    const q = encodeURIComponent(searchCode.value.trim())
    const res = await medicalApi.get(`/Icd10?search=${q}`)
    filtered.value = res.data || []
    showDropdown.value = true
    activeIndex.value = 0
  } catch {
    filtered.value = items.value.filter(i =>
      i.code.toLowerCase().includes(searchCode.value.toLowerCase()) ||
      i.name.toLowerCase().includes(searchCode.value.toLowerCase())
    )
    showDropdown.value = true
    activeIndex.value = 0
  }
}

const selectItem = (item: Icd10Item) => {
  selectedCode.value = item.code
  selectedName.value = item.name
  searchCode.value = `${item.code} - ${item.name}`
  showDropdown.value = false
  emit('update:modelValue', item.code)
  emit('select', item.code, item.name)
}

const clearSelection = () => {
  selectedCode.value = ''
  selectedName.value = ''
  searchCode.value = ''
  showDropdown.value = false
  emit('update:modelValue', '')
  emit('select', '', '')
}

const onBlur = () => {
  setTimeout(() => { showDropdown.value = false }, 200)
}

defineExpose({ clearSelection })

onMounted(loadAll)
</script>

<style scoped>
.icd10-picker {
  position: relative;
}

.icd10-input-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.icd10-search-input {
  flex: 1;
  min-width: 100px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.icd10-search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

.icd10-clear-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}
.icd10-clear-btn:hover { color: #ef4444; }

.icd10-selected-name {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.icd10-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 260px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 2px;
}

.icd10-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}
.icd10-item:hover, .icd10-item--active {
  background: #eff6ff;
}

.icd10-code {
  font-weight: 700;
  color: #2563eb;
  font-family: monospace;
  min-width: 70px;
}

.icd10-name {
  flex: 1;
  color: #1f2937;
}

.icd10-category {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
}

.icd10-empty {
  padding: 12px;
  color: #9ca3af;
  text-align: center;
  font-size: 13px;
}
</style>
