/**
* Gestion des onglets
* @name : tab id of current element
* the main element is auto-calculated by prefixing the @name with .pos-
* main element id will be for example : #pos-example
*/
var Onglet = function(name){
	/**
	* Public attribute
	*/
	// self is reference to the current state of "this"
	var self = this;
	this.self = self;

	this.name = name;
	this.purename = name.replace(/#/, "");
	this.el = document.querySelector(name);
	this.getMainEl = document.getElementById("pos-"+this.purename);

	/*
	* Click to goto page with smooth scroll
	*/
	$("#"+self.purename).on('click', function() {
		var speed = 650;
		$('html, body').animate( { scrollTop: $(self.getMainEl).offset().top }, speed );
	});

	/*
	* Listen for scroll or page load (init) 
	* slide by calling select or deselect method
	* only if page show > 1.2 * scroll
	*/
	window.addEventListener('scroll',scrollHandler);
	window.addEventListener('load',scrollHandler);


	/*
	* private function
	*/
	function scrollHandler(){
		var scrollTop = window.scrollY * 1.2; // more smooth
		
		if(scrollTop >= self.getMainEl.offsetTop &&
			scrollTop <= self.getMainEl.offsetHeight + self.getMainEl.offsetTop){
		
			self.select();
		}else{
			self.deselect();
		}
	}

	/*
	* public method
	*/
	this.animate = function(){
		console.log(self.el);
		self.el.addEventListener("click",function(){
			self.el.classList.toggle('onglet-deep');
		});
	};
	
	this.select = function(){
		self.el.classList.add('onglet-select');
	};
	
	this.deselect = function(){
		self.el.classList.remove('onglet-select');
	};

	this.setBounds = function(next_el){
		// self.el.offsetTop;
		// document.querySelector(next_el).offsetTop;
	};
};

//side menu animation !
var accueil = new Onglet('#accueil');
var informations = new Onglet('#informations');
var projets = new Onglet('#projets');
var cv = new Onglet('#cv');
var contacts = new Onglet('#contacts');

var hamburger = document.querySelector("#menu-top>.hamburger");
var ongletTop = document.querySelectorAll('#menu-top>.onglet');

// hide menu if link clicked (touched)
for(var i=0;i<ongletTop.length; i++){
	ongletTop[i].addEventListener("click", function(evt){
		console.log("link clicked");
		for(var i=0;i<ongletTop.length; i++){
			ongletTop[i].classList.toggle('hidden');
		}
	});
}

// show / hide menu on hamburger's click
hamburger.addEventListener("click",function(evt){
	for(var i=0;i<ongletTop.length; i++){
		ongletTop[i].classList.toggle('hidden');
	}
});


var cvAnim = function(){
	
	this.self = this;
	this.divFP;
	this.canvas = document.createElement('canvas');
	this.canvas.id = 'canvas-cv';

	this.clear = function(){
		divFP = document.getElementById('pos-cv');
		divFP.innerHTML="";
	};

	this.addScene = function(){
		divFP.appendChild(canvas); // adds the canvas to the body element
	};

	this.setup = function(){
		self.clear();
		self.addScene();
	};
}
