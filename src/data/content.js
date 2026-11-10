// Тексты главной страницы
export const hero = {
  title: ['Your', 'Endless', 'Summer'],
  image: 'images/hero.webp',
  alt: 'Девушка с доской для серфинга идёт по пляжу',
};

// Разделы главной: link — куда ведёт «Показать еще»
export const homeSections = {
  recent: { title: 'Недавно смотрели', link: '/catalog?only=recent' },
  recentEmpty: { link: '/catalog?sort=rating', note: 'Вы ещё ничего не смотрели. Вот что покупатели оценили выше всего:' },
  fresh: { title: 'Новинки', link: '/catalog?sort=new' },
  popular: { title: 'Популярные товары', link: '/catalog?sort=popular' },
};

export const HOME_LIMIT = 4;
