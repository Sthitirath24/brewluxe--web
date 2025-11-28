(async () => {
  try {
    const base = 'http://localhost:3000/api';
    const menu = await (await fetch(base + '/menu')).json();
    const products = await (await fetch(base + '/products')).json();
    console.log(`menu_count=${Array.isArray(menu) ? menu.length : 0}`);
    console.log(`products_count=${Array.isArray(products) ? products.length : 0}`);
    console.log('menu sample:', menu[0] ? menu[0].name : 'none');
  } catch (err) {
    console.error('Endpoint check failed:', err.message || err);
    process.exit(1);
  }
})();
