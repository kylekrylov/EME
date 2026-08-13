import antfu from '@antfu/eslint-config';

export default antfu()
  .override('antfu/stylistic/rules', {
    rules: {
      'antfu/top-level-function': 'off',
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/operator-linebreak': 'off',
      'style/semi': ['error', 'always'],
      'style/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],
    },
  })
  .override('antfu/perfectionist/setup', {
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type-import',
            ['type-parent', 'type-sibling', 'type-index', 'type-internal'],
            'value-builtin',
            'value-external',
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            'side-effect',
            'ts-equals-import',
            'unknown',
          ],
          internalPattern: ['^~/.*', '^@ui(?:/.*)?$', '^@/.*'],
          newlinesBetween: 'ignore',
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  })
  .override('antfu/javascript/rules', { rules: { 'no-console': 'off' } })
  .override('antfu/typescript/rules', { rules: { 'ts/ban-ts-comment': 'off' } })
  .override('antfu/vue/rules', {
    rules: {
      'vue/html-self-closing': [
        'error',
        {
          html: {
            component: 'always',
            normal: 'always',
            void: 'always',
          },
          math: 'always',
          svg: 'always',
        },
      ],
      'vue/valid-v-slot': 'off',
      'vue/max-attributes-per-line': 'error',
      'vue/singleline-html-element-content-newline': 'off',
    },
  });
