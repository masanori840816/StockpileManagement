export function hasAnyTexts(value: any): value is string {
    if(value == null) {
        return false;
    }
    if(typeof value === 'string' && value.trim() !== '') {
        return true;
    }
    return false;
}
export function isNumber(value: any): value is number {
    return value != null && typeof value === 'number' && !isNaN(value);
}