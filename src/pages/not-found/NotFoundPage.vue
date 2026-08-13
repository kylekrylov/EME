<template>
  <main :class="$style.page">
    <p :class="$style.code">404</p>
    <h1 :class="$style.title">Страница не найдена</h1>
    <RouterLink
      :class="$style.link"
      to="/users"
    >
      К таблице пользователей
    </RouterLink>
  </main>
</template>

<style lang="scss" module>
.page {
  display: grid;
  place-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;
}

.code {
  margin: 0;
  color: #2563eb;
  font-size: 20px;
  font-weight: 700;
}

.title {
  margin: 8px 0 24px;
  color: #111827;
  font-size: 32px;
}

.link {
  color: #1d4ed8;
}
</style>
