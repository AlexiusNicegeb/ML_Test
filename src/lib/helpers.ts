export function averageHistoryPerEntry(entries: any[]) {
  return entries.map((entry) => {
    const history = entry.evaluation?.history;
    if (!Array.isArray(history) || history.length === 0) return entry;

    const count = history.length;

    const averaged = {
      sub: {},
      total: 0,
      breakdown: {},
    };

    for (const item of history) {
      averaged.total += item.total;

      for (const section in item.sub) {
        if (!averaged.sub[section]) averaged.sub[section] = {};
        for (const key in item.sub[section]) {
          if (!averaged.sub[section][key]) averaged.sub[section][key] = 0;
          averaged.sub[section][key] += item.sub[section][key];
        }
      }

      for (const key in item.breakdown) {
        if (!averaged.breakdown[key]) averaged.breakdown[key] = { points: 0 };
        averaged.breakdown[key].points += item.breakdown[key].points;
      }
    }

    averaged.total = Math.round(averaged.total / count);

    for (const section in averaged.sub) {
      for (const key in averaged.sub[section]) {
        averaged.sub[section][key] = Math.round(
          averaged.sub[section][key] / count
        );
      }
    }

    for (const key in averaged.breakdown) {
      averaged.breakdown[key].points = Math.round(
        averaged.breakdown[key].points / count
      );
    }

    return {
      ...entry,
      evaluation: {
        ...entry.evaluation,
        history: [averaged],
      },
    };
  });
}
