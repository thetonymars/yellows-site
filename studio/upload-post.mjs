import { createClient } from '@sanity/client';

if (!process.env.SANITY_TOKEN) {
    console.error("Error: SANITY_TOKEN environment variable is required.");
    console.error("Usage: SANITY_TOKEN=your_token node upload-post.mjs");
    process.exit(1);
}

const client = createClient({
    projectId: 'p0rtrgcn',
    dataset: 'production',
    useCdn: false, // We are writing, so no CDN
    apiVersion: '2023-05-03',
    token: process.env.SANITY_TOKEN
});

const post = {
    _type: 'post',
    title: "3 Простых Шага к Первым Продажам Онлайн",
    slug: {
        _type: 'slug',
        current: "3-prostykh-shaga-k-pervym-prodazham"
    },
    excerpt: "Начните продавать уже на этой неделе, даже если у вас нет аудитории",
    author: "Тони Марс",
    category: "Продажи",
    publishedAt: "2026-02-01T12:00:00Z",
    body: [
        {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Многие эксперты откладывают старт продаж, ожидая "идеального момента". Но правда в том, что первые продажи можно сделать уже на этой неделе, если знать три простых шага.' }]
        },
        {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Первый шаг — создайте минимальный оффер. Не нужен огромный курс на 50 часов. Достаточно одной консультации или мини-продукта, который решает конкретную проблему. Цена — от 3000 до 15000 рублей.' }]
        },
        {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Второй шаг — напишите пост о проблеме вашей аудитории в соцсетях. Не продавайте в лоб. Просто опишите боль, которую вы решаете, и предложите в комментариях обсудить детали лично.' }]
        },
        {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Третий шаг — проведите 5-10 бесплатных консультаций. На каждой в конце предлагайте ваш платный продукт. Даже с конверсией 20% вы получите 1-2 первых клиента.' }]
        },
        {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Не ждите. Действуйте сегодня.' }]
        }
    ]
};

const imageUrl = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80';

async function upload() {
    try {
        console.log('Fetching image...');
        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.statusText}`);
        const imageBuffer = Buffer.from(await imageRes.arrayBuffer());

        console.log('Uploading image asset...');
        const asset = await client.assets.upload('image', imageBuffer, {
            filename: 'laptop-coffee.jpg'
        });

        console.log(`Image uploaded. Asset ID: ${asset._id}`);

        const doc = {
            ...post,
            featuredImage: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            }
        };

        console.log('Creating post document...');
        const result = await client.create(doc);
        console.log(`Post created successfully! ID: ${result._id}`);
        console.log(`Title: ${result.title}`);
    } catch (err) {
        console.error('Upload failed:', err.message);
        process.exit(1);
    }
}

upload();
