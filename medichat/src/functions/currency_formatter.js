function formatPriceAsINR(price) {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    });
    return formatter.format(price);
}
export default formatPriceAsINR;