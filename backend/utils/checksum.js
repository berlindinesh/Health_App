const crypto = require('crypto');

// Generate checksum for the payment data
exports.generateChecksum = (data, key) => {
    const hash = crypto.createHmac('sha256', key);
    hash.update(JSON.stringify(data));
    return hash.digest('hex');
};

// Verify checksum for the payment data
exports.verifyChecksum = (data, key) => {
    const providedChecksum = data.checksum;
    delete data.checksum;
    const generatedChecksum = this.generateChecksum(data, key);
    return providedChecksum === generatedChecksum;
};
