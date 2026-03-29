const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);

    const opts = { hostname: 'localhost', port: 3000, path, method, headers, timeout: 60000 };
    const req = http.request(opts, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(d) });
        } catch {
          resolve({ status: res.statusCode, body: d });
        }
      });
    });
    req.setTimeout(60000);
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const USER_ID = '00000000-0000-0000-0000-000000000001';

async function run() {
  const mode = process.argv[2] || 'basic';

  if (mode === 'basic') {
    console.log('=== HEALTH ===');
    const health = await request('GET', '/health');
    console.log(health.status, JSON.stringify(health.body));

    console.log('\n=== POST /clothing - validation ===');
    const r1 = await request('POST', '/clothing', {});
    console.log(r1.status, JSON.stringify(r1.body));

    console.log('\n=== POST /clothing - invalid category ===');
    const r2 = await request('POST', '/clothing', { user_id: USER_ID, category: 'hat' });
    console.log(r2.status, JSON.stringify(r2.body));

    console.log('\n=== POST /clothing (6 items) ===');
    const items = [
      {
        name: 'White T-Shirt',
        category: 'top',
        type: 'tshirt',
        color: 'white',
        style: 'casual',
        season: 'summer',
        occasion: 'daily',
        temperature_min: 20,
        temperature_max: 35,
      },
      {
        name: 'Black Hoodie',
        category: 'top',
        type: 'hoodie',
        color: 'black',
        style: 'streetwear',
        season: 'autumn',
        occasion: 'daily',
        temperature_min: 10,
        temperature_max: 20,
      },
      {
        name: 'Blue Jeans',
        category: 'bottom',
        type: 'jeans',
        color: 'blue',
        style: 'casual',
        season: 'all',
        occasion: 'daily',
        temperature_min: 10,
        temperature_max: 30,
      },
      {
        name: 'Beige Shorts',
        category: 'bottom',
        type: 'shorts',
        color: 'beige',
        style: 'casual',
        season: 'summer',
        occasion: 'daily',
        temperature_min: 25,
        temperature_max: 40,
      },
      {
        name: 'White Sneakers',
        category: 'shoes',
        type: 'sneakers',
        color: 'white',
        style: 'casual',
        season: 'all',
        occasion: 'daily',
        temperature_min: 5,
        temperature_max: 35,
      },
      {
        name: 'Beige Coat',
        category: 'outerwear',
        type: 'coat',
        color: 'beige',
        style: 'elegant',
        season: 'winter',
        occasion: 'office',
        temperature_min: -5,
        temperature_max: 10,
      },
    ];
    for (const item of items) {
      const r = await request('POST', '/clothing', { user_id: USER_ID, ...item });
      console.log(r.status, r.body.name, '|', r.body.category);
    }

    console.log('\n=== GET /clothing ===');
    const getAll = await request('GET', '/clothing?user_id=' + USER_ID);
    console.log(getAll.status, 'count:', getAll.body.length);

    console.log('\n=== PATCH /outfits/:id/like (404 test) ===');
    const likeFake = await request('PATCH', '/outfits/00000000-0000-0000-0000-000000000099/like', {
      liked: true,
    });
    console.log(likeFake.status, JSON.stringify(likeFake.body));

    console.log('\nBasic tests done!');
  }

  if (mode === 'generate') {
    console.log('=== POST /generate-outfits ===');
    console.log('(calling AI, may take 10-30s...)');
    const gen = await request('POST', '/generate-outfits', {
      user_id: USER_ID,
      occasion: 'daily',
      season: 'summer',
    });
    console.log('Status:', gen.status);
    if (gen.status === 200 && gen.body.outfits) {
      console.log('Outfits generated:', gen.body.outfits.length);
      gen.body.outfits.forEach((o, i) => {
        console.log(`\nOutfit ${i + 1} (score: ${o.ai_score}):`);
        console.log('  Top:', o.top?.name, '|', o.top?.color);
        console.log('  Bottom:', o.bottom?.name, '|', o.bottom?.color);
        console.log('  Shoes:', o.shoes?.name, '|', o.shoes?.color);
        if (o.outerwear) console.log('  Outerwear:', o.outerwear?.name);
        console.log('  Reason:', o.reason);
      });

      // Test like on first outfit
      if (gen.body.outfits.length > 0) {
        const outfitId = gen.body.outfits[0].id;
        console.log('\n=== PATCH /outfits/:id/like (real) ===');
        const like = await request('PATCH', '/outfits/' + outfitId + '/like', { liked: true });
        console.log(like.status, 'liked:', like.body.liked);
      }

      console.log('\n=== GET /outfits ===');
      const outfits = await request('GET', '/outfits?user_id=' + USER_ID);
      console.log(outfits.status, 'count:', outfits.body.length);
    } else {
      console.log('Error:', JSON.stringify(gen.body));
    }
    console.log('\nGenerate tests done!');
  }

  if (mode === 'delete') {
    console.log('=== DELETE test ===');
    // Add a temp item, then delete it
    const temp = await request('POST', '/clothing', {
      user_id: USER_ID,
      name: 'DELETE ME',
      category: 'accessory',
      type: 'scarf',
      color: 'red',
      style: 'casual',
      season: 'winter',
    });
    console.log('Created:', temp.status, temp.body.id);

    const del = await request('DELETE', '/clothing/' + temp.body.id);
    console.log('Deleted:', del.status, JSON.stringify(del.body));

    // Verify gone
    const getAll = await request('GET', '/clothing?user_id=' + USER_ID);
    const found = getAll.body.find((i) => i.id === temp.body.id);
    console.log('Still exists?', !!found);
    console.log('Delete test done!');
  }
}

run().catch(console.error);
