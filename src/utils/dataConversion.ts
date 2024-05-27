export const convertToBoolean = (value) => {
    if (typeof value === 'boolean') {
        return value;
    } else if (value === "true" || value === "1") {
        return true;
    } else if (value === "false" || value === "0") {
        return false;
    } else {
        return null;
    }
}