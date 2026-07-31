export interface City {
  gcId: number
  name: string
}

/** Mock city dictionary backing the load_city/unload_city filters and route points. */
export const CITIES: City[] = [
  { gcId: 59, name: 'Пермь' },
  { gcId: 100, name: 'Москва' },
  { gcId: 11, name: 'Санкт-Петербург' },
  { gcId: 54, name: 'Екатеринбург' },
  { gcId: 65, name: 'Новосибирск' },
  { gcId: 43, name: 'Казань' },
  { gcId: 23, name: 'Краснодар' },
  { gcId: 61, name: 'Ростов-на-Дону' },
  { gcId: 2, name: 'Уфа' },
  { gcId: 74, name: 'Челябинск' },
  { gcId: 63, name: 'Самара' },
  { gcId: 52, name: 'Нижний Новгород' },
  { gcId: 25, name: 'Владивосток' },
]
