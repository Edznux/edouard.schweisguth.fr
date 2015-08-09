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
	* Click to goto page => TODO smooth scroll ?
	*/
	this.el.addEventListener('click',function(){
		window.scrollTo(0,self.getMainEl.offsetTop);
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
		var scrollTop = window.scrollY;
		var smooth = (scrollTop * 1.2);
		if(smooth >= self.getMainEl.offsetTop &&
		   smooth <= self.getMainEl.getBoxQuads()[0].bounds.height + self.getMainEl.offsetTop){
		
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


//store into array all tabs available
var tabList = [];
var accueil = new Onglet('#accueil');
var informations = new Onglet('#informations');
var projets = new Onglet('#projets');
var cv = new Onglet('#cv');
var contacts = new Onglet('#contacts');