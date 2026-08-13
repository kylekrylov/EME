const registrationDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatRegistrationDate(value: string) {
  return registrationDateFormatter.format(new Date(value));
}
