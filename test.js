const fetch = require('node-fetch');

async function testAddon() {
    try {
        const response = await fetch('http://localhost:3000/meta/movie/tt155.json');
        const data = await response.json();
        console.log('Response from addon:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error testing addon:', error);
    }
}

testAddon();