const { generateKeyPairSync } = require('crypto');

// Tạo cặp Private Key và Public Key
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
	modulusLength: 2048, // Độ dài key
	publicKeyEncoding: { type: 'spki', format: 'pem' },
	privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
console.log('publicKey:', publicKey);
console.log('privateKey:', privateKey);
