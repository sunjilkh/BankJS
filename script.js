'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Sunzil Khandaker',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1234,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2025-02-28T14:11:59.604Z',
    '2025-03-03T17:01:17.194Z',
    '2025-03-02T23:36:17.929Z',
    '2025-03-01T10:51:36.790Z',
  ],
  currency: 'BDT',
  locale: 'bn-IN', // de-DE
};

const account2 = {
  owner: 'Marufa Afrin',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const formatMovemateDate = function (movDates, locate) {
  const CalculatedayPassed = (date11, date2) =>
    Math.abs(date2 - date11) / (1000 * 60 * 60 * 24);

  const dayPassed = Math.round(CalculatedayPassed(new Date(), movDates));
  // console.log(dayPassed);
  if (dayPassed === 0) return 'আজ';
  if (dayPassed === 1) return 'গতকাল';
  if (dayPassed <= 7) return `${dayPassed} দিন আগে`;

  return new Intl.DateTimeFormat(locate).format(movDates);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combineMovDates = acc.movements.map((mov, i) => ({
    movements: mov,
    movDates: acc.movementsDates.at(i),
  }));

  if (sort) combineMovDates.sort((a, b) => a.movements - b.movements);

  combineMovDates.forEach(function (movDate, i) {
    const { movements, movDates } = movDate;
    const type = movements > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const moveDates = formatMovemateDate(date, acc.locale);

    // console.log(typeof (formattedMov));
    const formattedMov = formatCur(movements, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${moveDates}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const calcSummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const sumOut = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)
  );

  labelSumOut.textContent = formatCur(sumOut, acc.locale, acc.currency);
  const sumInterest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov);

  labelSumInterest.textContent = formatCur(
    sumInterest,
    acc.locale,
    acc.currency
  );
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  console.log(acc);
};

//Ui update code
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcSummary(acc);
};

//Event handler
let currentAccount;

//Fake login
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    ac => ac.username === inputLoginUsername.value.toLowerCase()
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Login successfull');

    // Show UI & Success mes
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Show Current dates

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      // month: 'long',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    // const locate = navigator.language;
    // console.log(locate);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2,0);
    // const month=`${now.getMonth() +1}`.padStart(2,0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Display UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmmount = inputTransferAmount.value;
  const receiverAcc = accounts.find(
    ac => ac.username === inputTransferTo.value
  );
  // console.log(transferAmmount, receiverAcc);
  if (
    currentAccount.balance > 0 &&
    transferAmmount > 0 &&
    currentAccount.balance >= transferAmmount &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Actually transfering money
    receiverAcc.movements.push(transferAmmount);
    currentAccount.movements.push(-transferAmmount);

    //Adding Date of transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
  } else {
    //Show an error message
    alert('Invalid Transfer');
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferTo.blur();
  }
  updateUI(currentAccount);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //delete account
    accounts.splice(index, 1);
    //Hide Ui
    containerApp.style.opacity = 0;
    //Clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

//Loaning
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const ammount = Number(inputLoanAmount.value);

  if (
    ammount > 0 &&
    currentAccount.movements.some(mov => mov >= ammount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(ammount);

      //Adding Date of transfer
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 3000);
  } else alert('Loan denied');
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Show Dates under Current Balance
// const now = new Date();
// const day = `${now.getDate()}`.padStart(2,0);
// const month=`${now.getMonth() +1}`.padStart(2,0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = now.getMinutes();
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//Date Operations
/*
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const CalculatedayPassed = (date11, date2) =>
  Math.abs(date2 - date11) / (1000 * 60 * 60 * 24);

const dayPassed = CalculatedayPassed(
  new Date(2022, 3, 20),
  new Date(2022, 3, 15)
);
console.log(dayPassed);

const option = {
  style: 'currency',
  unit: 'mile-per-hour',
  currency: 'EUR',
  // useGrouping: false,
};

const num = 24325673.2389;
console.log('Eng', new Intl.NumberFormat('en-US', option).format(num));
console.log('Ban', new Intl.NumberFormat('bn-BD', option).format(num));
console.log('Syrea', new Intl.NumberFormat('ar-SY', option).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, option).format(num)
);

const profile = ['Sunzil', 'Mirzapur, Tangail.'];

const profileTimer = setTimeout(
  (name, add2) => console.log(`${name} eat pizza 🍕, at ${add2}`),
  3000,
  ...profile
);

if (profile.includes('Sinthia')) clearTimeout(profileTimer);


//setTimeout
setInterval(()=>{
  const now = new Date();
  console.log(now);
}, 1000)
*/

//REMAINDER oPER
/*
const isEven = n => {
  if(n%2 === 0 ) 
    return true;
  else return false};

  console.log(isEven(4));

  // labelBalance.addEventListener('click', function () {
  //   [...document.querySelectorAll('.movements__row')].forEach((row, i) =>{
  //   row.style.backgroundColor = i % 3 === 0 ? 'orangered' : 'yellow';
  // })
  // })






// Seperator
const diameter = 287_460_000_000;
 console.log(diameter);

const transferFee = 15_00;
console.log(transferFee);

const transferFee2 = 1_500;
console.log(transferFee2);

const PI = 3.1415;  // Cant use in decimal
console.log(PI);

console.log(Number('12_000'));  //Error




//BigInt

console.log(2 ** 53 +1);
console.log(2 ** 53 +2);
console.log(2 ** 53 +3);
//not workinmg well

console.log(Number.MAX_SAFE_INTEGER);

console.log(445165418951515645465151n);
//or
console.log(BigInt(445165418951515645465151n));

console.log(445165418951515645465151n +        445165418951515645465151n+
  445165418951515645465151n
  * 445165418951515645465151n
);

const bigNum = 255252452442646463563636n;
const num  = 44;
console.log(bigNum * BigInt(num));

console.log(20n < 11);

console.log(20n === 20);
console.log(20n == 20);
*/

//Dates and time

/*
//create date
const noew = new Date();
console.log(noew);

const newD = new Date('3-01-2025')
console.log(newD);

const movDate = new Date(account1.movementsDates[0]);
console.log(movDate);

console.log(new Date(0));

console.log(new Date(3*24*60*60*1000));

//Using these

const future = new Date(2037, 10, 19, 15, 23, 5);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDay());
console.log(future.toISOString());

console.log(future.getTime());
console.log(new Date(2142235385000));

console.log(Date.now());

*/
