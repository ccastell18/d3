/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const btns = document.querySelectorAll('button');\nconst form = document.querySelector('form');\nconst formAct = document.querySelector('form span');\nconst input = document.querySelector('input');\nconst error = document.querySelector('.error');\n\nlet activity = 'cycling';\n\nbtns.forEach((btn) => {\n  btn.addEventListener('click', (e) => {\n    //get activity\n    activity = e.target.dataset.activity;\n\n    //remove and add active class\n    btns.forEach((btn) => btn.classList.remove('active'));\n    e.target.classList.add('active');\n\n    //set id of input field\n    input.setAttribute('id', activity);\n\n    //set text of form span\n    formAct.textContent = activity;\n  });\n});\n\n\n//# sourceURL=webpack://d3/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;