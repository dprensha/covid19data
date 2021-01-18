const addThousandSeparators = (value, formatMagnitude, useK) => {
    if (!value) { value = 0 }
    if (formatMagnitude && Math.abs(Number(value)) >= 1.0e+9) {
        return `${((Math.round(value / 1000)) / 1000000).toFixed(2)} B`;
    }
    else if (formatMagnitude && Math.abs(Number(value)) >= 1.0e+6) {
        return `${((Math.round(value / 1000)) / 1000).toFixed(2)} M`;
    }
    else if(formatMagnitude && useK && Math.abs(Number(value)) >= 1.0e+3) {
        return `${(Math.round(value / 1.0e+3))} K`;
    }
    else if (Math.abs(Number(value)) < 1000) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    else {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

const formatPercentage = (value) => {
    const percentage = Math.round((isNaN(value) ? 0 : value + Number.EPSILON) * 100) / 100;
    return `${addThousandSeparators(percentage)}%`;
};

export default {
    addThousandSeparators,
    formatPercentage
}