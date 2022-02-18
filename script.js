"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
//experiment
const now = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  yead: "numeric",
  weekday: "long",
};
const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
const formatMovementDate = function (locale, date) {
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // const hour = date.getHours();
  // const min = date.getMinutes();
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return Intl.DateTimeFormat(locale).format(date);
};
const formatCur = function (value, locale, currency) {
  const formattedMov = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(val);
};
const displayMovements = function (account, sort = false) {
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  containerMovements.innerHTML = "";
  movs.forEach(function (mov, i) {
    const date = new Date(account.movementsDates[i]);
    const displaydate = formatMovementDate(account.locale, date);
    const type = mov > 0 ? "deposit" : "withdrawal";
    const formattedMov = formatCur(mov, account.locale, account.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displaydate}</div>
        <div class="movements__value">${formattedMov};</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const displaydata = function (user) {
  displayMovements(user);
  calcDisplaySumm(user);
  calcPrintBalance(user);
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hour = now.getHours();
  const min = now.getMinutes();
};
const startLogOutTime = function () {
  const tick = function () {
    const min = String(Math.floor(t / 60)).padStart(2, 0);
    const sec = t - min * 60;
    const seco = sec.toString().padStart(2, 0);

    labelTimer.textContent = `${min}:${seco}`;
    if (t === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    t--;
  };
  let t = 60 * 8;
  tick();
  const timer = setInterval(tick, 1000);
};
const calcPrintBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance.toFixed(2)} EUR`;
  account.balance = balance;
};
const calcDisplaySumm = function (accounts) {
  const incomes = accounts.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}$`;
  const outcome = accounts.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = Math.abs(outcome).toFixed(2);
  const interest = accounts.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * accounts.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest.toFixed(2);
};

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((val) => val[0])
      .join("");
  });
};
let currentAccount;

createUsernames(accounts);
btnLogin.addEventListener("click", function (E) {
  E.preventDefault();

  const user = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (user && +inputLoginPin.value === user.pin) {
    labelWelcome.textContent = `Welcome back, ${user.owner.split(" ")[0]}`;
    currentAccount = user;
    inputLoginUsername.value = "";
    inputLoginPin.value = " ";
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    const now = new Date();
    // const day = now.getDate();
    // const month = now.getMonth() + 1;
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      yead: "numeric",
    };
    const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );
    startLogOutTime();
    displaydata(user);
  } else {
    containerApp.style.opacity = 0;
  }
  const movementsui = Array.from(
    document.querySelectorAll(".movements__value")
  ).map((acc) => +acc.textContent.slice(0, -1));
});
btnTransfer.addEventListener("click", function (E) {
  E.preventDefault();
  const amount = +inputTransferAmount.value;
  const tranuser = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    tranuser &&
    currentAccount.balance >= amount &&
    tranuser.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    tranuser.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    tranuser.movementsDates.push(new Date());
    displaydata(currentAccount);
  }
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    displaydata(currentAccount);
  }
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    inputCloseUsername.value = inputClosePin.value = "";
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
let val = false;
btnSort.addEventListener("click", function (e) {
  val = !val;
  displayMovements(currentAccount, val);
});
const numDeposit = accounts
  .flatMap((acc) => acc.movements)
  .reduce((sum, curr) => (curr >= 1000 ? sum++ : sum), 0);
