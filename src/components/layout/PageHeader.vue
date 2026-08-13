<template>
  <header :class="$style.header">
    <div :class="$style.content">
      <h1 :class="$style.title">
        <slot name="title" />
      </h1>

      <div :class="$style.details">
        <p :class="$style.detail">
          <span :class="$style.label">ТЗ:</span>
          <slot name="requirements" />
        </p>
        <p :class="$style.detail">
          <span :class="$style.label">Реализация:</span>
          <slot name="implementation" />
        </p>
      </div>
    </div>

    <div
      v-if="$slots.aside"
      :class="$style.aside"
    >
      <slot name="aside" />
    </div>
  </header>
</template>

<style module>
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
}

.content {
  min-width: 0;
}

.title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 32px;
  line-height: 40px;
}

.details {
  display: grid;
  gap: 4px;
  max-width: 880px;
  margin-top: 12px;
}

.detail {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 22px;
}

.label {
  color: var(--color-text-primary);
  font-weight: 700;
}

.aside {
  flex: 0 0 auto;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
}

@media (max-width: 760px) {
  .header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .aside {
    white-space: normal;
  }
}
</style>
