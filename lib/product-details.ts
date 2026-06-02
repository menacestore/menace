export const productComposition = {
  fit: {
    label: 'Fit',
    value: 'Relaxed',
    description:
      'Comfortably loose fit with drop shoulders that does not hug the body. Stands in the middle of an oversized and regular fit, making movement easy.',
  },
  composition: '100% Cotton',
  care: [
    'Machine wash up to 30°C / 86°F, gentle cycle',
    'Do not bleach',
    'Iron up to 110°C / 230°F',
    'Do not iron directly on prints, embroidery or embellishments',
    'Do not dry clean',
    'Do not tumble dry',
  ],
};

export const sizeChart = {
  unit: 'Inches',
  columns: ['Size', 'Length', 'Chest', 'Sleeve'],
  rows: [
    { size: 'S',  length: 23.5, chest: 18,   sleeve: 6.5 },
    { size: 'M',  length: 26,   chest: 19,   sleeve: 7   },
    { size: 'L',  length: 26,   chest: 19.5, sleeve: 8   },
    { size: 'XL', length: 26.5, chest: 20,   sleeve: 8.5 },
  ],
};

export const deliveriesAndReturns = {
  delivery: {
    label: 'Deliveries',
    lines: [
      'Flat shipping of PKR 300 on all orders within Pakistan.',
      'Regular orders: delivered within 5–7 working days.',
      'During sales: delivered within 7–10 working days.',
    ],
  },
  returns: {
    label: 'Returns & Exchanges',
    intro:
      'All products purchased from menacepk.com can be exchanged within 14 days of purchase only if:',
    conditions: [
      'The item is faulty, damaged or defective at the time of delivery.',
      'The item does not match the original specifications of the product.',
      'The item received is not what was actually purchased.',
    ],
  },
};
