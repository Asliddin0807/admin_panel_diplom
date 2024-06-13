let app = '9,000';
// Удаляем запятые из строки
let numberString = app.replace(/,/g, '');
// Преобразуем строку в число
let number = parseFloat(numberString);

console.log(number); // Выведет 9000000