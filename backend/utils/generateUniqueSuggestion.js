export const generateUniqueSuggestion = (baseName) =>{
    const randomNum = Math.floor(1000+Math.random()*9000);
    return `${baseName}${randomNum}`;
};