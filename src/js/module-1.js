class module1 {

	constructor() {
		console.log('Hello from module 1 constructor.');
		this.init();
	}

	init() {
		var h1 = document.querySelector('h1');
		h1.classList.remove('warning');
		h1.classList.add('success');
		
		var result = document.querySelector('.result');
		result.classList.remove('warning');
		result.classList.add('success');
		result.innerHTML = 'Yes!';
	}

	hello() {
		window.module2('module 1');
	}

}

module.exports = module1;