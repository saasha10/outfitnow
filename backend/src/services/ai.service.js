const openai = require('../config/openaiClient');

async function rankOutfits(candidates, occasion, season) {
  const candidatesStr = JSON.stringify(candidates, null, 2);

  const prompt = [
    'You are an expert fashion stylist.',
    '',
    'Rank these outfit combinations from best to worst.',
    '',
    'Evaluation criteria:',
    '- Color harmony between all pieces',
    '- Style consistency across the outfit',
    '- Occasion suitability: ' + (occasion || 'daily'),
    '- Season appropriateness: ' + (season || 'all'),
    '',
    'Candidates:',
    candidatesStr,
    '',
    'For each candidate, assign a score from 0 to 10 (float, e.g. 7.5).',
    '',
    'Return a JSON object with this exact format:',
    '{ "rankings": [ { "index": <number>, "score": <float 0-10>, "reason": "<short reason>" } ] }',
    '',
    'Sort by score descending. Return ALL candidates ranked.',
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
