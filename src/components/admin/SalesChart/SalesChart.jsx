import { useId } from 'react';
import useElementSize from '../../../hooks/useElementSize';
import styles from './SalesChart.module.css';

// График продаж из макета: оси со стрелками, деления по Y, подписи дней (месяцев) по X,
// линии «Количество заказов» (акцент) и «Количество возвратов» (ошибка).
// Рисуется SVG в пикселях контейнера, без библиотек. points — [{ label, orders, returns }]
const SERIES = [
  { key: 'orders', label: 'Количество заказов', className: 'sales-chart__line_orders', dot: 'sales-chart__dot_orders' },
  { key: 'returns', label: 'Количество возвратов', className: 'sales-chart__line_returns', dot: 'sales-chart__dot_returns' },
];

const PAD = { left: 48, right: 28, top: 28, bottom: 40 };
const NICE_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];
const LABEL_STEPS = [1, 2, 5, 10];

// Шаг делений по Y: не чаще, чем раз в 32 px
function yScale(max, plotH) {
  const maxTicks = Math.max(2, Math.floor(plotH / 32));
  const step = NICE_STEPS.find((s) => Math.ceil(max / s) <= maxTicks) || NICE_STEPS[NICE_STEPS.length - 1];
  return { step, top: Math.max(step, Math.ceil(max / step) * step) };
}

const arrow = (x, y, dir) =>
  dir === 'up' ? `${x - 9},${y + 10} ${x},${y} ${x + 9},${y + 10}` : `${x - 10},${y - 9} ${x},${y} ${x - 10},${y + 9}`;

export default function SalesChart({ points, unit = 'День', title }) {
  const [ref, { width, height }] = useElementSize();
  const titleId = useId();
  const count = points.length;

  const x0 = PAD.left;
  const y0 = height - PAD.bottom;
  const plotW = Math.max(width - PAD.left - PAD.right, 0);
  const plotH = Math.max(y0 - PAD.top - 12, 0);
  const max = Math.max(5, ...points.map((p) => Math.max(p.orders, p.returns)));
  const { step, top } = yScale(max, plotH);
  const spacing = count ? (plotW - 12) / count : 0;
  const xAt = (i) => x0 + spacing * (i + 0.75);
  const yAt = (v) => y0 - (v / top) * plotH;
  const labelEvery = LABEL_STEPS.find((s) => s * spacing >= (unit === 'День' ? 26 : 42)) || 10;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);

  return (
    <figure className={styles['sales-chart']}>
      <ul className={styles['sales-chart__legend']}>
        {SERIES.map((s) => (
          <li key={s.key} className={styles['sales-chart__legend-item']}>
            <span className={`${styles['sales-chart__dot']} ${styles[s.dot]}`} aria-hidden="true" />
            {s.label}
          </li>
        ))}
      </ul>

      <div ref={ref} className={styles['sales-chart__canvas']}>
        {count === 0 ? (
          <p className={styles['sales-chart__empty']}>За этот период данных пока нет</p>
        ) : (
          width > 0 && (
            <svg className={styles['sales-chart__svg']} width={width} height={height} role="img" aria-labelledby={titleId}>
              <title id={titleId}>{title}</title>
              {ticks.map((t) => (
                <g key={t}>
                  <line className={styles['sales-chart__tick']} x1={x0 - 8} x2={x0} y1={yAt(t)} y2={yAt(t)} />
                  <text className={styles['sales-chart__label']} x={x0 - 14} y={yAt(t)} textAnchor="end" dominantBaseline="central">
                    {t}
                  </text>
                </g>
              ))}
              {points.map((p, i) =>
                (i === 0 && labelEvery >= 4) || (i + 1) % labelEvery === 0 ? (
                  <text key={p.label} className={styles['sales-chart__label']} x={xAt(i)} y={y0 + 22} textAnchor="middle">
                    {p.label}
                  </text>
                ) : null,
              )}

              <line className={styles['sales-chart__axis']} x1={x0} y1={y0 + 1} x2={x0} y2={PAD.top - 12} />
              <polyline className={styles['sales-chart__axis']} points={arrow(x0, PAD.top - 12, 'up')} />
              <line className={styles['sales-chart__axis']} x1={x0 - 1} y1={y0} x2={width - 4} y2={y0} />
              <polyline className={styles['sales-chart__axis']} points={arrow(width - 4, y0, 'right')} />

              {SERIES.map((s) => (
                <polyline
                  key={s.key}
                  className={`${styles['sales-chart__line']} ${styles[s.className]}`}
                  points={points.map((p, i) => `${xAt(i)},${yAt(p[s.key])}`).join(' ')}
                />
              ))}


              {/* Подсказки при наведении: колонка на каждый день */}
              {points.map((p, i) => (
                <rect key={p.label} className={styles['sales-chart__hit']} x={xAt(i) - spacing / 2} y={PAD.top} width={spacing} height={y0 - PAD.top}>
                  <title>{`${unit} ${p.label}: заказов ${p.orders}, возвратов ${p.returns}`}</title>
                </rect>
              ))}
            </svg>
          )
        )}
      </div>

      {/* Те же данные таблицей — для экранных читалок */}
      <table className="visually-hidden">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">{unit}</th>
            <th scope="col">Заказов</th>
            <th scope="col">Возвратов</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              <td>{p.orders}</td>
              <td>{p.returns}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
