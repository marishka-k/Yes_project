// Статусы оплаты и заказа: витрина (личный кабинет) и админка
export const paymentStatuses = {
  paid: 'Оплачено',
  unpaid: 'Не оплачено',
};

// Путь заказа — шкала «Детали доставки» в карточке заказа (макет order info)
export const deliverySteps = ['created', 'shipped', 'transit', 'pickup', 'done'];

export const orderStatuses = {
  created: 'Оформлен',
  shipped: 'Передано в доставку',
  transit: 'В пути',
  pickup: 'Ожидает в пункте выдачи',
  done: 'Получено',
  returned: 'Возврат',
  cancelled: 'Отменён',
};

// Разделы «Заказы» в админке: какие статусы в каком списке
export const orderGroups = {
  active: { title: 'Заказы в работе', crumb: 'В работе', statuses: ['created', 'shipped', 'transit', 'pickup'] },
  done: { title: 'Выполненные заказы', crumb: 'Выполненные', statuses: ['done'] },
  returns: { title: 'Возвраты и отмены', crumb: 'Возвраты', statuses: ['returned', 'cancelled'] },
};

export const groupOfStatus = (status) => Object.keys(orderGroups).find((key) => orderGroups[key].statuses.includes(status)) || 'active';
