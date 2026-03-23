const openai = require('../config/openaiClient');

async function rankOutfits(candidates, occasion, weather) {
  const candidatesStr = JSON.stringify(candidates, null, 2);

  const prompt = [
    'You are a fashion stylist.',
    '',
    'Your job is to rank outfit combinations based on:',
    '- Color harmony',
    '- Style compatibility',
    '- Occasion: ' + occasion,
    '- Weather: ' + weather,
    '',
    'Here are the candidate outfits (each identified by index):',
    '',
    candidatesStr,
    '',
    'Return the best 2 outfits as a JSON object with this exact format:',
    '{ "outfits": [ { "index": <number>, "reason": "<short reason>" }, { "index": <number>, "reason": "<short reason>" } ] }',
    '',
    'Return ONLY valid JSON, no markdown or extra text.',
  ].join('\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a fashion stylist that returns only valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content;
  return JSON.parse(content);
}

module.exports = { rankOutfits };
