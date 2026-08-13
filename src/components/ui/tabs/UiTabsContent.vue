<script setup lang="ts">
import type { TTabsDirection } from './types';

import { computed, useCssModule } from 'vue';

interface Props {
  activeValue: string;
  direction?: TTabsDirection;
  tabsId: string;
}

const { activeValue, direction = 'left', tabsId } = defineProps<Props>();

const styles = useCssModule();

const labelledBy = computed(() => `${tabsId}-tab-${activeValue}`);
const panelId = computed(() => `${tabsId}-panel-${activeValue}`);

const transitionClasses = computed(() => ({
  enterActiveClass: styles.enterActive,
  enterFromClass: direction === 'left' ? styles.enterFromRight : styles.enterFromLeft,
  leaveActiveClass: styles.leaveActive,
  leaveToClass: direction === 'left' ? styles.leaveToLeft : styles.leaveToRight,
}));
</script>

<template>
  <div :class="$style.viewport">
    <Transition
      :enter-active-class="transitionClasses.enterActiveClass"
      :enter-from-class="transitionClasses.enterFromClass"
      :leave-active-class="transitionClasses.leaveActiveClass"
      :leave-to-class="transitionClasses.leaveToClass"
      mode="out-in"
    >
      <section
        :id="panelId"
        :key="activeValue"
        :aria-labelledby="labelledBy"
        :class="$style.panel"
        role="tabpanel"
        tabindex="0"
      >
        <slot :active-value="activeValue" />
      </section>
    </Transition>
  </div>
</template>

<style module>
.viewport {
  overflow: hidden;
}

.panel {
  width: 100%;
}

.enterActive,
.leaveActive {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.enterFromRight,
.leaveToRight {
  opacity: 0;
  transform: translateX(48px);
}

.enterFromLeft,
.leaveToLeft {
  opacity: 0;
  transform: translateX(-48px);
}

@media (prefers-reduced-motion: reduce) {
  .enterActive,
  .leaveActive {
    transition: none;
  }
}
</style>
