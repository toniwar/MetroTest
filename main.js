//Массив с файлами json, переменные.
let a1 = ["questions.json", "answers.json", "check.json"], ran, flag = 0, quest, answer = [], check = [], index, res = [], ball = 0, min = 0, max = 739, store = [], answered = 0, right, your;

// Переменные, определяющая нужное событие при нажатии кнопки
let btn_index = 0, btn_state = 1;

//Верхняя консоль
const panel = document.querySelector('#console');
//Всплывающая подсказка
const hint = document.querySelector('#hint');

//Кнопка "Завершить"
const end_btn = document.querySelector('#end-btn');

//Блок для вопросов
const questbox = document.querySelector('#questDiv');

//Блок для ответов
const answerbox = document.querySelector('#answerDiv');

//Кнопка
const btn = document.querySelector('#btn-1');

//Блок меню
const menu = document.querySelector('#menu');

//Блок для вывода результатов теста
const result_box = document.querySelector('#result');

//Чек-бокс "Открыть меню"
const open_box = document.querySelector('#set-box');

//Поиск
const search = document.querySelector('#search');

//Селектор с разделами
const s1 = document.querySelector('#s-1');

//Селектор с количеством вопросов
const s2 = document.querySelector('#s-2');

//Скрытый блок
const hide_block = document.querySelector('#hideBlock');

//Блок с отображением оценки тестирования
const ball_box = document.querySelector('#ball-box');

const search_btn = document.querySelector('#loupe');

//Массив с разделами
const partitions = ['Все вопросы', 'Пневматика', 'Механика', 'Электрика', 'Управление', 'ТРА', 'ПТЭ'];

//Массив с количеством вопросов
const count = [ 5, 10, 20, 40, 50, 'Все вопросы'];

//Функция создания options для select
function pull_select(x, y){
for (let i = 0; i < x.length; i++) {
let val = new Option(x[i]);
y.add(val);
s2.value = count[2];
}
}

//Заполнение разделов
pull_select(partitions,s1);

//Заполнение вариантов с количеством вопросов
pull_select(count, s2);

//Действие при изменении селекта 1
s1.oninput = get_s1_val;
function get_s1_val(){
switch(s1.value){
		
//Все вопросы
case partitions[0]: min = 0, max = 739;
break;
		
//Пневматика
case partitions[1]: min = 0, max = 50;
break;
		
//Механика
case partitions[2]: min = 51, max = 132;
break;
		
//Электрика
case partitions[3]: min = 133, max = 200;
break;
		
//Управление
case partitions[4]: min = 201, max = 350;
break;
		
//ТРА
case partitions[5]: min = 351, max = 554;
break;
		
//ПТЭ
case partitions[6]: 
min = 555,
max = 739;
break;
	
}
	
// Получение значения из селекта 2 при изменении селекта 1
get_s2_val();
	
// Обновить
refresh();
}


// Получение значения из селекта 2
get_s2_val();
s2.oninput = get_s2_val;
	
function get_s2_val(){

//Переменная s2_val используется в качестве параметра length. При достижении крайнего значения тест заканчивается.
	s2_val = +s2.value;
	
	//При установке селекта2 в режим "Все вопросы", s2_val будет равна разнице максимального и минимального номеров вопросов.
if(s2.value === count[5]) s2_val = max - min;
refresh();
}

//Показать/спрятать меню
open_box.oninput = ()=>{
let on = 'block', off = 'none';
if(open_box.checked) open_menu(on);
else open_menu(off); 

}

function open_menu(someitem){
menu.style.display = someitem;
}


//Рандомайзер
function randomizer(){
if(document.querySelector('#mix-box').checked == false){
flag = 0;
let x = new Set();
while(x.size < s2_val){
x.add(Math.floor(Math.random()*(max - min +1)) + min);
}
ran = Array.from(x);
}
else {
ran = [], flag = 0;
for(let i = min; i <= max; i++){
ran.push(i);
}
}
}
randomizer();

// Клик по чек-боксу "Вопросы по порядку"
document.querySelector('#mix-box').onclick = refresh;

// Функция обновления контента
function refresh(){
btn_state = 1;
ball = 0;
result_box.innerHTML = '';
ball_box.innerHTML = '';
questbox.innerHTML = '';
answerbox.innerHTML = '';
btn.innerHTML = 'Начать';
randomizer();
console.log(min);
console.log(max);
console.log(s2_val);
}

// Перенос данных из JSON в local storage.
senddata();
function senddata(){
a1.forEach((item, i )=>{
fetch(item)
.then(resp => resp.json())
.then(data =>{

localStorage.setItem(i, JSON.stringify(data));
})
})
getdata();
}
// Данные из local storage в массив store
function getdata(){
for(i = 0; i < 3; i++){
store.push(JSON.parse(localStorage.getItem(i)));
}

setTimeout(()=>console.log(store),300);
}
// Нажатие кнопки
btn.onclick = btn_clc;

function btn_clc(){
switch(btn_state){
case 1: current_q();
break;
case 2: answer_q();
break;
}
}

//Текущий вопрос
function current_q(){
btn_state = 2;
btn.innerHTML = 'Ответить';
create_question();
}


//Создание блоков с вопросами и ответами.
function create_question(){

answered = 0;
right = '';
your = '';
	
//Предварительная очистка блоков
questbox.innerHTML = '';
answerbox.innerHTML = '';

// Вопрос
quest = document.createElement('div');
quest.innerHTML = store[0][ran[flag]];
quest.style = `border: 2px solid; border-radius: 5px; background: lavender; margin-bottom: 10px`;
questbox.append(quest);
	
// Ответы
for(let i = 0; i < store[1][ran[flag]].length; i++){
if(store[1][ran[flag]][i] === 'n') break;
answer[i] = document.createElement('div');
answer[i].innerHTML = store[1][ran[flag]][i];
answer[i].classList.add('no_checked') 

// Присвоение аттрибута key к варианту ответа
answer[i].setAttribute('key', store[2][ran[flag]][i])
answerbox.append(answer[i]);

// Выделение выбранного варианта
answer[i].onclick = ()=>{
if(answered < 2){
answered = 1;
answer.forEach(item => item.classList.remove('checked'));
answer[i].classList.add('checked');
}
}
}
}

// Нажатие на кнопку ответить
function answer_q(){

// Если был выбран вариант ответа
if(answered == 1){
answered = 2;
answer.forEach(item =>{
if(item.getAttribute('key') === '1' && item.classList.contains('checked') == true) item.style.background = 'palegreen';
else if(item.getAttribute('key') === '0' && item.classList.contains('checked') == true){
item.style.background = 'tomato';
answer.forEach(item => {if(item.getAttribute('key') === '1') item.style.background = 'palegreen'})

}
})

result_box.innerHTML += quest.innerHTML+'<br>';
let block = document.createElement('div');
block.style = `width: 100%; display: flex`;
result_box.append(block);
let r,l;

l = document.createElement('div');
l.style = `width: 50%; background: white; border: 1px solid; text-align: center; padding: 1%`;

r = document.createElement('div');
r.style = `width: 50%; border: 1px solid; text-align: center; padding: 1%`;

block.append(l);
block.append(r);
r.innerHTML = '';
l.innerHTML = '';

answer.forEach(item =>{
if(item.getAttribute('key') == '1'){
right = item.innerHTML;
l.innerHTML = 'Правильный ответ:<br> <br>' + right;
}
})
answer.forEach(item =>{
if(item.classList.contains('checked') == true){
your = item.innerHTML;
r.innerHTML = 'Ваш ответ:<br> <br>' + your;
}
})

function comp(){
(your === right) ? r.style.background = 'palegreen' : r.style.background = 'tomato';

if(s2_val <= 50){
(your === right) ? ball += 100/s2_val : ball += 0;
ball_box.innerHTML = ball + '%';
}
}
comp();

if(flag < s2_val){
btn.innerHTML = 'Следующий вопрос';
flag++;
btn_state = 1;
}
if(flag == s2_val){
btn.innerHTML = 'показать результат';
btn.onclick = ()=>{
btn_state = 1;
btn.innerHTML = 'Завершить';
panel.style.display = 'none';
hide_block.style.display = 'block';
answerbox.innerHTML = '';
questbox.innerHTML = '';

btn.onclick = ()=>{
refresh();
panel.style.display = 'flex';
hide_block.style.display = 'none';
btn.onclick = btn_clc;
}
}
}
}
}

end_btn.onclick = ()=>{
btn_state = 1;
btn.innerHTML = 'Завершить';
panel.style.display = 'none';
hide_block.style.display = 'block';
answerbox.innerHTML = '';
questbox.innerHTML = '';
menu.style.display = 'none';
open_box.checked = false;

btn.onclick = () => {
refresh();
panel.style.display = 'flex';
hide_block.style.display = 'none';
btn.onclick = btn_clc;
}
}

search.onclick= gethint;
function gethint(){
	let i = store[0];
	
	search.oninput = showhint;
	function showhint(){
		let s = new Set();
		let afs = '';
		let elem = [];
		let a = [];
		let close = '';
		let cross = '';
		//console.log(i);
			console.log('+++')
			hint.innerHTML = '';
			a = [];
		for(let x = 0; x < i.length; x++){
			for(let y = 0; y < search.value.length; y ++){
				
				if(i[x].toLowerCase().indexOf(search.value.toLowerCase()) != -1) s.add(i[x]);
			}
	}

afs = Array.from(s);
		afs.forEach((item,i) =>{
			if(item != undefined && i < 5){
		
				elem = document.createElement('div');
				elem.innerHTML = item;
				elem.style = `width: 100%; border: 1px solid; background: seashell; padding: 2px`;
				hint.append(elem);
				elem.onclick = push_to_search;
			
				close = document.createElement('div');
		
				close.style = `position: absolute; top: 0; left: -18px; width: 15px; height: 15px; background: tomato; font-size: 20px; padding: 0 0 0 0`;
				
				cross = document.createElement('span');
				cross.innerHTML = '&#9746';
				cross.style = `position: absolute; top: -6px; left: -1px; font-size: 21px`;
				hint.append(close);
				close.append(cross);
				cross.onclick = ()=> hint.innerHTML = '';
			}
			})
	
}
}
function push_to_search(){
	search.value = this.innerHTML;
}
search_btn.onclick = ()=>{
panel.style.display = 'none';
btn.innerHTML = 'Закрыть';
hint.innerHTML = '';
let x = [];
btn.onclick = () => {
refresh();
panel.style.display = 'flex';
hide_block.style.display = 'none';
btn.onclick = btn_clc;
}

store[0].forEach((item, i) =>{
if(item.toLowerCase().indexOf(search.value.toLowerCase()) != -1) x.push(i);
})
search.value = '';
questbox.innerHTML = '';
answerbox.innerHTML = '';
quest = document.createElement('div');
quest.innerHTML = store[0][x[0]];
quest.style = `border: 2px solid; border-radius: 5px; background: lavender; margin-bottom: 10px`;
questbox.append(quest);


for (let i = 0; i < store[1][x[0]].length; i++) {
	if (store[1][x[0]][i] === 'n') break;
	answer[i] = document.createElement('div');
	answer[i].innerHTML = store[1][x[0]][i];
	answer[i].classList.add('no_checked')

	// Присвоение аттрибута key к варианту ответа
	answer[i].setAttribute('key', store[2][x[0]][i])
	answerbox.append(answer[i]);
if(answer[i].getAttribute('key') == '1') answer[i].style.background = 'lime';

}
}
