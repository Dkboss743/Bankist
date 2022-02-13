"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = "";
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date"></div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const displaydata = function (user) {
  displayMovements(user.movements);
  calcDisplaySumm(user);
  calcPrintBalance(user);
};
const calcPrintBalance = function (account) {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} EUR`;
  account.balance = balance;
};
const calcDisplaySumm = function (accounts) {
  const incomes = accounts.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;
  const outcome = accounts.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = outcome;
  const interest = accounts.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * accounts.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest.toPrecision(4);
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
  if (user && Number(inputLoginPin.value) === user.pin) {
    labelWelcome.textContent = `Welcome back, ${user.owner.split(" ")[0]}`;
    currentAccount = user;
    inputLoginUsername.value = "";
    inputLoginPin.value = " ";
    inputLoginPin.blur();
    containerApp.style.opacity = 100;
    displaydata(user);
  } else {
    containerApp.style.opacity = 0;
  }
});
btnTransfer.addEventListener("click", function (E) {
  E.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const tranuser = accounts.find((acc) => acc.owner === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";
  console.log(amount, tranuser);
  if (
    amount > 0 &&
    tranuser &&
    currentAccount.balance >= amount &&
    tranuser.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    tranuser.movements.push(amount);
    displaydata(currentAccount);
  }
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    displaydata(currentAccount);
  }
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
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
  displayMovements(currentAccount.movements, val);
});
