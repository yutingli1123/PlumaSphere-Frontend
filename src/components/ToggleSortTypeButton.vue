<script lang="ts" setup>
import IEpSort from '~icons/ep/sort'
import { SortBy } from '@/constant'

defineProps<{
  toggleSortBy: () => void
  sortBy: SortBy
}>()
</script>

<template>
  <el-button class="switch-sort-type-button" @click="toggleSortBy">
    <span :class="['sort-icon', { rotated: sortBy === SortBy.LIKE }]">
      <IEpSort />
    </span>
    Sort by: <span class="sort-type">{{ sortBy }}</span>
  </el-button>
</template>

<style scoped>
.switch-sort-type-button {
  margin-left: auto;
  justify-content: start;
  padding: 0 12px 0 0;
}

.sort-type {
  margin-left: 4px;
  font-family: monospace;
}

.sort-icon {
  transition: transform 0.3s;
  display: inline-flex;
  margin-left: 12px;
  margin-right: 6px;
  max-width: 14px;
}

/*noinspection CssUnusedSymbol*/
.sort-icon.rotated {
  transform: rotate(180deg);
}
</style>
