const fs = require('fs');
let content = fs.readFileSync('backend/models/Product.js', 'utf8');
content = content.replace("category: { type: String, default: 'Vegetables' }", "category: { type: String, default: '' }");
fs.writeFileSync('backend/models/Product.js', content, 'utf8');
console.log('Fixed Product model');
