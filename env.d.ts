/// <reference types="vite/client" />
/// <reference types="./auto-imports.d.ts" />
/// <reference types="./components.d.ts" />
/// <reference types="unplugin-icons/types/vue" />
declare module '*vue-cropper.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}
