'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
const displayMovement = function (acc, sorted = false) {
  const movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = ''; //the movements container has to be empty before we would commit whether a deposit or withdrawal
  movs.forEach(function (mov, i) {
    const date = new Date(acc.mo);
    const year = date.getFullYear();
    const moth = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>

        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int > 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

// When there is no need to return anithing from funciton we shood use forEach method to change data wether array or object. Here we add new property username for each of accounts

const createUsername = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
  console.log(accounts);
};
createUsername(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovement(acc);
  //Display blance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

let currentAccaout;

//FAKE CONSTANTLY LOGIN

currentAccaout = account1;
console.log(currentAccaout);
updateUI(currentAccaout);
containerApp.style.opacity = 100;

const date = new Date();
const year = date.getFullYear();
const moth = `${date.getMonth() + 1}`.padStart(2, '0');
const day = `${date.getDate()}`.padStart(2, '0');
const hour = `${date.getHours()}`.padStart(2, '0');
const minutes = `${date.getMinutes()}`.padStart(2, '0');

labelDate.textContent = `${day}/${moth}/${year} ${hour}:${minutes}`;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccaout = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccaout);

  if (currentAccaout?.pin === +inputLoginPin.value) {
    //Display UI message
    labelWelcome.textContent = `Welcom again ${
      currentAccaout.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;
    //cleare input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputClosePin.blur();

    updateUI(currentAccaout);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receicerAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receicerAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receicerAcc &&
    currentAccaout.balance >= amount &&
    receicerAcc.username !== currentAccaout.username
  ) {
    currentAccaout.movements.push(-amount);
    receicerAcc.movements.push(amount);
  }
  //update UI after transfer
  updateUI(currentAccaout);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccaout.username === inputCloseUsername.value &&
    currentAccaout.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccaout.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = +inputLoanAmount.value;

  if (
    loanAmount > 0 &&
    currentAccaout.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    //add  movment
    currentAccaout.movements.push(loanAmount);

    //update UI
    updateUI(currentAccaout);

    //cleare loan field
    inputLoanAmount.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccaout, !sorted);
  sorted = !sorted;
});

// array.from to convert a  nodlist element(collection) into an array
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    mov => +mov.textContent.replace('€', '')
  ); //the second argument here is the  arrow function exactly the same as map method
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  //alternitev way is spred operator for converting nodLIst to array

  console.log(movementsUI, movementsUI2);
});
