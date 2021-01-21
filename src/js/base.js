import Module1 from './module-1';

const module2 = require('./module-2');

window.onload = function () {

	// use window object to prevent uglifying module names
	// thereby modules are accessible in other modules/classes
	window.module1 = new Module1();

	window.module2 = module2;

	module1.hello();
	
}